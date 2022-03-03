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
import { CategoricalColorNamespace, getNumberFormatter } from 'src/core';
import { EChartsCoreOption } from 'echarts';
import {
  BarChartTransformedProps,
  EchartsBarChartProps,
  EchartsBarFormData,
} from './types';
import { DEFAULT_FORM_DATA as DEFAULT_PIE_FORM_DATA } from './constants';
import { DEFAULT_LEGEND_FORM_DATA, LegendOrientation } from '../types';
import { defaultGrid, defaultTooltip } from '../defaults';
import { OpacityEnum } from '../constants';
// import { OpacityEnum } from '../constants';

export default function transformProps(
  chartProps: EchartsBarChartProps,
): BarChartTransformedProps {
  const {
    formData,
    height,
    hooks,
    // filterState,
    queriesData,
    width,
    datasource,
  } = chartProps;

  console.log('chartProps:', chartProps);

  const {
    colorScheme,
    groupby,
    showAxisPointer, // 是否显示坐标轴指示器
    xAxisLabel, // X轴名称
    yAxisLabel, // Y轴名称
    yAxisFormat, // Y轴的格式化类
    orderBars, // 是否按柱子的标签名称排序
    showBarValue, // 是否将值显示在柱子上
    barStacked, // 堆叠
    yAxisShowminmax, // 是否显示Y轴的最大值最小值限制
    yAxisBounds, // Y轴的最小值和最大值数组
    bottomMargin, // X轴距离下方的距离
    xLabelLayout, // X轴布局：标签旋转角度
    showLegend,
    legendPadding,
    legendOrientation,
    legendType,
    legendMode,
  }: EchartsBarFormData = {
    ...DEFAULT_LEGEND_FORM_DATA,
    ...DEFAULT_PIE_FORM_DATA,
    ...formData,
  };

  const rawData = queriesData[0].data;

  const { setDataMask = () => {} } = hooks;

  // 柱状图的通用配置
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
      // 堆叠的时候，显示在内部，组显示的时候，显示在头部. 如果只有一组数据，就不切换了
      position: barStacked && datasource.metrics.length > 1 ? 'inside' : 'top',
      // 格式化值(标准数据集的取值格式化，非数据集才可以直接格式化)
      formatter({ value, encode }: any) {
        const idx = encode.y[0];
        const row = value[idx];
        return typeof row === 'number' ? `${row.toFixed(2)}` : row;
      },
    },
    stack: barStacked && 'total', // 这个值相同的柱子，会堆叠起来。值是什么都行，但最好是有意义的值。
  };

  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  // 这里只是生成相应数据的系列值
  const series = Array.from({ length: rawData[0].length - 1 }).map(
    (_, idx) => ({
      ...barSeries,
      itemStyle: {
        color: colorFn(idx),
        opacity: OpacityEnum.NonTransparent,
      },
    }),
  );

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

  // Y轴的最大值和最小值
  const yMinMax =
    yAxisShowminmax && yAxisBounds.length === 2
      ? {
          min: yAxisBounds[0],
          max: yAxisBounds[1],
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

  // 图例的位置布局方式
  let legendPosition = {};
  // eslint-disable-next-line default-case
  switch (legendOrientation) {
    case LegendOrientation.Right:
      legendPosition = { orient: 'vertical', top: 'center', right: 'right' };
      break;
    case LegendOrientation.Top:
      legendPosition = { top: 'top' };
      break;
    case LegendOrientation.Left:
      legendPosition = { orient: 'vertical', left: 'left', top: 'center' };
      break;
    case LegendOrientation.Bottom:
      legendPosition = { bottom: 'bottom' };
  }
  // 图例的内边距
  if (typeof legendPadding === 'number') {
    legendPosition = { ...legendPosition, padding: legendPadding };
  }

  // 计算数据集的数据（排序）
  let sourceData = rawData;
  if (orderBars) {
    const dataArr = rawData.slice(1, rawData.length);
    // 第一个元素是x轴的标签，肯定是字符串，所以使用字符串的比较方法来处理
    const arr: any[] = dataArr.sort((a, b) => a[0].localeCompare(b[0]));
    sourceData = [rawData[0], ...arr];
  }

  // Y轴的格式化方法
  const numberFormatter = getNumberFormatter(yAxisFormat);

  const echartOptions: EChartsCoreOption = {
    grid: {
      ...defaultGrid,
      ...gridBottom,
    },
    tooltip: {
      ...defaultTooltip,
      ...axisPointer,
      // 提示的值格式化
      valueFormatter: (value: any) =>
        typeof value === 'number' ? `${value.toFixed(2)}` : value,
    },
    legend: {
      show: showLegend,
      type: legendType === 'scroll' ? 'scroll' : 'plain',
      selectedMode: legendMode,
      ...legendPosition,
    },
    dataset: {
      source: sourceData,
    },
    xAxis: {
      type: 'category',
      name: xAxisLabel,
      axisLabel: {
        // hideOverlap: true, // 是否隐藏重叠的标签
        rotate: getRotate(xLabelLayout), // 标签旋转角度
      },
    },
    yAxis: {
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
    series,
  };

  console.log('echartOptions', echartOptions);

  return {
    formData,
    width,
    height,
    echartOptions,
    setDataMask,
    groupby,
    selectedValues: [],
  };
}
