/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { getNumberFormatter } from 'src/core';
import { EChartsCoreOption } from 'echarts';
import {
  EchartsMixedLineBarChartTransformedProps,
  EchartsMixedLineBarProps,
  EchartsMixedLineBarFormData,
} from './types';
import { DEFAULT_FORM_DATA as DEFAULT_PIE_FORM_DATA } from './constants';
import { DEFAULT_LEGEND_FORM_DATA } from '../../types';
import { defaultGrid, defaultTooltip } from '../../defaults';

export default function transformProps(
  chartProps: EchartsMixedLineBarProps,
): EchartsMixedLineBarChartTransformedProps {
  const { formData, height, hooks, queriesData, width } = chartProps;

  console.log('chartProps:', chartProps);

  const {
    groupby,
    groupbyB,
    emitFilter,

    xAxisLabel, // X轴名称
    showBarValue, // 是否将值显示在柱子上
    showLegend, // 是否显示图例
    showAxisPointer, // 是否显示坐标轴指示器

    yAxisLabel, // Y轴名称
    yAxisFormat, // Y轴的格式化类
    yAxisShowminmax, // 是否显示Y轴的最大值最小值限制
    yAxisBounds, // Y轴的最小值和最大值数组

    yAxis2Bounds,
    yAxis2Format,
    yAxis2Label,
    yAxis2Showminmax,

    bottomMargin, // X轴距离下方的距离
    xLabelLayout, // X轴布局：标签旋转角度
  }: EchartsMixedLineBarFormData = {
    ...DEFAULT_LEGEND_FORM_DATA,
    ...DEFAULT_PIE_FORM_DATA,
    ...formData,
  };

  const rawData = queriesData[0].data;

  const legendData = Object.keys(rawData);
  const x1 = Object.values(rawData)[0];
  const x2 = Object.values(rawData)[1];
  const xLabels = Object.keys(x1);
  const x1Data = Object.values(x1);
  const x2Data = Object.values(x2);

  const { setDataMask = () => {} } = hooks;

  // 基础柱状图的通用配置
  const barSeries = {
    type: 'bar', // 柱状图
    animation: true, // 开启动画
    // 标签的统一布局配置。
    labelLayout: {
      // 是否隐藏重叠的标签
      hideOverlap: true,
    },
    label: {
      // 在柱子上显示值
      show: showBarValue,
      // 文字显示在头部
      position: 'top',
      // 格式化值
      formatter({ value }: any) {
        if (typeof value === 'number') {
          return `${value.toFixed(2)}`;
        }
        return value;
      },
    },
  };

  // 暂时还用不到这个，保留做参考
  // const selectedValues = (filterState.selectedValues || []).reduce(
  //   (acc: Record<string, number>, selectedValue: string) => {
  //     const index = series.findIndex(({ name }) => name === selectedValue);
  //     return {
  //       ...acc,
  //       [index]: selectedValue,
  //     };
  //   },
  //   {},
  // );

  // Y轴的格式化方法
  const numberFormatter = getNumberFormatter(yAxisFormat);
  const numberFormatter2 = getNumberFormatter(yAxis2Format);

  // Y轴的最大值和最小值
  const yMinMax =
    yAxisShowminmax && yAxisBounds.length === 2
      ? {
          min: yAxisBounds[0],
          max: yAxisBounds[1],
        }
      : {};
  // Y轴2
  const y2MinMax =
    yAxis2Showminmax && yAxis2Bounds.length === 2
      ? {
          min: yAxis2Bounds[0],
          max: yAxis2Bounds[1],
        }
      : {};

  // 位置计算
  const gridBottom =
    bottomMargin !== 'auto'
      ? {
          bottom: parseInt(bottomMargin, 10),
        }
      : {};

  // X轴标签布局: 旋转角度
  const getRotate = (rotate: string): number => {
    switch (rotate) {
      case '0°':
        return 0;
      case '-45°':
        return -45;
      case '-90°':
        return -90;
      case '45°':
        return 45;
      case '90°':
        return 90;
      default:
        return -45;
    }
  };

  const axisPointer = showAxisPointer
    ? {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#283b56',
          },
        },
      }
    : {};

  const echartOptions: EChartsCoreOption = {
    grid: {
      ...defaultGrid,
      ...gridBottom,
    },
    legend: {
      show: showLegend,
    },
    tooltip: {
      ...defaultTooltip,
      ...axisPointer,
      // 提示的值格式化
      valueFormatter: (value: any) =>
        typeof value === 'number' ? `${value.toFixed(2)}` : value,
    },
    xAxis: {
      type: 'category',
      name: xAxisLabel,
      axisLabel: {
        hideOverlap: true, // 是否隐藏重叠的标签
        rotate: getRotate(xLabelLayout), // 标签旋转角度
      },
      data: xLabels,
    },
    yAxis: [
      {
        type: 'value',
        name: yAxisLabel,
        axisLine: {
          // 显示边线
          show: true,
        },
        ...yMinMax,
        axisLabel: {
          formatter(val: number) {
            return numberFormatter(val);
          },
        },
      },
      {
        type: 'value',
        name: yAxis2Label,
        axisLine: {
          // 显示边线
          show: true,
        },
        ...y2MinMax,
        axisLabel: {
          formatter(val: number) {
            return numberFormatter2(val);
          },
        },
      },
    ],
    series: [
      {
        ...barSeries,
        name: legendData[0],
        yAxisIndex: 0,
        data: x1Data,
      },
      {
        ...barSeries,
        name: legendData[1],
        yAxisIndex: 1,
        type: 'line',
        data: x2Data,
      },
    ],
  };

  return {
    formData,
    width,
    height,
    echartOptions,
    setDataMask,
    groupby,
    groupbyB,
    selectedValues: [],
    emitFilter,
    emitFilterB: false,
    labelMap: {},
    labelMapB: {},
  };
}
