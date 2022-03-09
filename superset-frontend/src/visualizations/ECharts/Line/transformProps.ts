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
import { EChartsCoreOption, graphic } from 'echarts';
import {
  LineChartTransformedProps,
  EchartsLineChartProps,
  EchartsLineFormData,
} from './types';
import { DEFAULT_FORM_DATA as DEFAULT_PIE_FORM_DATA } from './constants';
import { DEFAULT_LEGEND_FORM_DATA, LegendOrientation } from '../types';
import { defaultGrid, defaultTooltip } from '../defaults';

export default function transformProps(
  chartProps: EchartsLineChartProps,
): LineChartTransformedProps {
  const {
    formData,
    height,
    hooks,
    // filterState,
    queriesData,
    width,
  } = chartProps;

  console.log('chartProps:', chartProps);

  const {
    chartOrient, // 图表布局方向
    groupby,
    metrics, // 查询指标
    showAxisPointer, // 是否显示坐标轴指示器
    xAxisLabel, // X轴名称
    yAxisLabel, // Y轴名称
    yAxisLine, // 是否显示Y轴的轴线
    yAxisFormat, // Y轴的格式化类
    orderLines, // 是否按标签名称排序
    showLabel, // 是否显示图形上的文本标签
    stacked, // 堆叠
    smooth, // 平滑曲线
    showAreaChart, // 显示区域面积图
    areaLinearGradient, // 面积图的线性渐变
    yAxisShowMinmax, // 是否显示Y轴的最大值最小值限制
    yAxisBounds, // Y轴的最小值和最大值数组
    bottomMargin, // X轴距离下方的距离
    xLabelLayout, // X轴布局：标签旋转角度
    showLegend,
    legendPadding,
    legendOrientation,
    legendType,
    legendMode,
  }: EchartsLineFormData = {
    ...DEFAULT_LEGEND_FORM_DATA,
    ...DEFAULT_PIE_FORM_DATA,
    ...formData,
  };

  const rawData = queriesData[0].data;

  const { setDataMask = () => {} } = hooks;

  // 标签位置，默认顶部
  let labelPosition = { position: 'top' };
  // 旋转角度
  const labelRotate = { rotate: 0 };
  if (metrics.length > 1 && chartOrient !== 'horizontal') {
    // 纵向布局的时候，显示在右侧
    labelPosition = { position: 'right' };
  }

  // Y轴的格式化方法
  const numberFormatter = getNumberFormatter(yAxisFormat);

  // 折线图的通用配置
  const lineSeries = {
    type: 'line', // 折线图
    smooth, // 平滑曲线
    animation: true, // 开启动画
    // 标签的统一布局配置。
    labelLayout: {
      // 是否隐藏重叠的标签
      hideOverlap: true,
    },
    label: {
      // 在柱子上显示值
      show: showLabel,
      // 标签的位置
      ...labelPosition,
      // 旋转
      ...labelRotate,
      // 格式化值(标准数据集的取值格式化，非数据集才可以直接格式化)
      formatter({ value, encode }: any) {
        const idx = chartOrient === 'horizontal' ? encode.y[0] : encode.x[0];
        const row = value[idx];
        return typeof row === 'number' ? `${row.toFixed(2)}` : row;
      },
    },
    stack: stacked && 'total', // 这个值相同的柱子，会堆叠起来。值是什么都行，但最好是有意义的值。
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

  // Y轴的最大值和最小值
  let yMinMax = {};
  if (yAxisShowMinmax && yAxisBounds.length === 2) {
    yMinMax = {
      min: yAxisBounds[0],
      max: yAxisBounds[1],
    };
  }

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
        return chartOrient === 'horizontal' ? -45 : 0;
    }
  };

  const axisPointer = showAxisPointer
    ? {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
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
  if (orderLines) {
    const dataArr = rawData.slice(1, rawData.length);
    // 第一个元素是x轴的标签，肯定是字符串，所以使用字符串的比较方法来处理
    const arr: any[] = dataArr.sort((a, b) => a[0].localeCompare(b[0]));
    sourceData = [rawData[0], ...arr];
  }

  // 默认：一般横向，数组直接用就行，第一个分类是X，第二个值就是Y。如果是纵向的布局，就倒过来。
  const axisData = [
    {
      type: 'category', // 类目轴
      name: xAxisLabel, // X 表示类目轴
      nameLocation: 'center',
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 16,
      },
      axisLabel: {
        hideOverlap: true, // 是否隐藏重叠的标签
        rotate: getRotate(xLabelLayout), // 标签旋转角度
      },
    },
    {
      type: 'value', // 数值轴
      name: yAxisLabel, // Y表示数值轴
      nameLocation: 'center',
      nameGap: 32,
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 16,
      },
      ...yMinMax,
      axisLine: {
        // 是否显示数值轴的轴线
        show: yAxisLine,
      },
      axisLabel: {
        formatter(val: number) {
          return numberFormatter(val);
        },
      },
    },
  ];
  const xAxis = chartOrient === 'horizontal' ? axisData[0] : axisData[1];
  const yAxis = chartOrient === 'horizontal' ? axisData[1] : axisData[0];

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
    xAxis,
    yAxis,
    series: rawData[0].slice(1, rawData[0].length).map(() => {
      if (showAreaChart) {
        return {
          ...lineSeries,
          areaStyle: areaLinearGradient
            ? {
                opacity: 0.8,
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(255, 191, 0)',
                  },
                  {
                    offset: 1,
                    color: 'rgb(224, 62, 76)',
                  },
                ]),
              }
            : {},
        };
      }
      return lineSeries;
    }),
  };

  // console.log('echartOptions', echartOptions);

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
