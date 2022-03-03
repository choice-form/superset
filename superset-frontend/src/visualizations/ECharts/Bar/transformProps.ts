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
import { sum } from 'lodash';
import {
  BarChartTransformedProps,
  EchartsBarChartProps,
  EchartsBarFormData,
} from './types';
import { DEFAULT_FORM_DATA as DEFAULT_PIE_FORM_DATA } from './constants';
import { DEFAULT_LEGEND_FORM_DATA, LegendOrientation } from '../types';
import { defaultGrid, defaultTooltip } from '../defaults';
import { OpacityEnum } from '../constants';

// 将值切换为百分比数据
// @ts-ignore
const switchPrecent: number[] = (arr: (string | number)[]) => {
  if (arr.length < 2) return arr;
  const name: string = arr[0] as string;
  const tmpArr = arr.slice(1, arr.length) as number[];
  const total = sum(tmpArr);
  const newArr = tmpArr.map(o => Number((o / total).toFixed(2)));
  return [name, ...newArr];
};

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

  // console.log('chartProps:', chartProps);

  const {
    colorScheme,
    barBackground, // 柱形的背景控制
    chartOrient, // 图表布局方向
    groupby,
    showAxisPointer, // 是否显示坐标轴指示器
    xAxisLabel, // X轴名称
    yAxisLabel, // Y轴名称
    yAxisLine, // 是否显示Y轴的轴线
    yAxisFormat, // Y轴的格式化类
    orderBars, // 是否按柱子的标签名称排序
    showBarValue, // 是否将值显示在柱子上
    barStacked, // 堆叠
    stackedPrecent, // 堆叠显示成百分比
    yAxisShowMinmax, // 是否显示Y轴的最大值最小值限制
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

  let rawData = queriesData[0].data;
  // 如果堆叠百分比
  if (barStacked && stackedPrecent) {
    const tmpArr = rawData.slice(1, rawData.length);
    // @ts-ignore
    rawData = [rawData[0], ...tmpArr.map(switchPrecent)];
  }

  const { setDataMask = () => {} } = hooks;

  // 标签位置，默认顶部
  let labelPosition = { position: 'top' };
  // 横向布局的时候，显示
  if (chartOrient === 'horizontal') {
    if (barStacked && datasource.metrics.length > 1) {
      labelPosition = { position: 'inside' };
    }
  } else {
    // 纵向布局的时候，也就是类目轴是竖着的时候
    labelPosition = { position: 'right' };
    if (barStacked && datasource.metrics.length > 1) {
      labelPosition = { position: 'inside' };
    }
  }

  // 旋转角度
  let labelRotate = { rotate: 0 };
  if (
    chartOrient !== 'horizontal' &&
    barStacked &&
    datasource.metrics.length > 1
  ) {
    labelRotate = {
      rotate: -90,
    };
  }

  // Y轴的格式化方法, 堆叠百分比的时候，自动显示百分比格式化类型
  const numberFormatter = getNumberFormatter(
    barStacked && stackedPrecent ? '.0%' : yAxisFormat,
  );

  // 柱状图的通用配置
  const barSeries = {
    type: 'bar', // 柱状图
    animation: true, // 开启动画
    // 标签的统一布局配置。
    labelLayout: {
      // 是否隐藏重叠的标签
      hideOverlap: true,
    },
    scaleSize: 12,
    itemStyle: {
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowColor: 'rgba(0, 0, 0, 0.5)',
    },
    label: {
      // 在柱子上显示值
      show: showBarValue,
      // 标签的位置
      ...labelPosition,
      // 旋转
      ...labelRotate,
      // 格式化值(标准数据集的取值格式化，非数据集才可以直接格式化)
      formatter({ value, encode }: any) {
        const idx = chartOrient === 'horizontal' ? encode.y[0] : encode.x[0];
        const row = value[idx];
        if (barStacked && stackedPrecent) {
          return numberFormatter(row);
        }
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
      showBackground: barBackground,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
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
  let yMinMax = {};
  if (barStacked && stackedPrecent) {
    yMinMax = {
      min: 0,
      max: 1,
    };
  } else if (yAxisShowMinmax && yAxisBounds.length === 2) {
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
      valueFormatter: (value: any) => {
        if (barStacked && stackedPrecent) {
          return numberFormatter(value);
        }
        return typeof value === 'number' ? `${value.toFixed(2)}` : value;
      },
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
    series,
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
