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
import { EChartsCoreOption, BarSeriesOption } from 'echarts';
import { EchartsBarChartProps, EchartsBarFormData, BarChartTransformedProps } from './types';
import { DEFAULT_FORM_DATA as DEFAULT_PIE_FORM_DATA } from './constants';
import { DEFAULT_LEGEND_FORM_DATA } from '../types';
import { formatLabel } from '../utils/series';
import { defaultGrid, defaultTooltip } from '../defaults';
import { OpacityEnum } from '../constants';

export default function transformProps(chartProps: EchartsBarChartProps): BarChartTransformedProps {
  const { formData, height, hooks, filterState, queriesData, width, datasource } = chartProps;
  console.log('chartProps:', chartProps);
  console.log('formData:', formData);

  const {
    colorScheme,
    groupby,
    metrics,
    // sliceId,
    // vizType,
    xAxisLabel, // X轴名称
    yAxisLabel, // Y轴名称
    yAxisFormat, // Y轴的格式化类
    orderBars, // 是否按柱子的标签名称排序
    showBarValue, // 是否将值显示在柱子上
    barStacked, // 柱子是否堆叠
    showLegend, // 是否显示图例
    yAxisShowminmax,  // 是否显示Y轴的最大值最小值限制
    yAxisBounds, // Y轴的最小值和最大值数组
    bottomMargin, // X轴距离下方的距离
  }: EchartsBarFormData = {
    ...DEFAULT_LEGEND_FORM_DATA,
    ...DEFAULT_PIE_FORM_DATA,
    ...formData,
  };

  const rawData = queriesData[0].data || [];
  const data = Array.isArray(rawData)
    ? rawData.map(row => ({
        ...row,
        key: formatLabel(row.key, datasource.verboseMap),
      }))
    : rawData;

  const { setDataMask = () => {} } = hooks;

  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);

  // 图例数组
  const xLabels = metrics?.map(metric => metric.label);

  // 柱子数据
  const barData: { name: string; data: any[] }[] = [];
  // 图例数据
  const legendData: string[] = [];
  data.forEach(row => {
    row.values.forEach(row2 => {
      const idx = barData.map(o => o.name).indexOf(row2.x);
      // 表示存在
      if (idx > -1) {
        barData[idx].data.push(row2.y);
      } else {
        // 添加新的图例
        legendData.push(row2.x);
        // 添加新的柱子数据
        barData.push({
          name: row2.x,
          data: [row2.y],
        });
      }
    });
  });
  console.log('barData:', barData);
  console.log('legendData:', legendData);

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
      // 格式化值
      formatter({ value }: any) {
        if (typeof value === 'number') {
          return `${value.toFixed(2)}`;
        }
        return value;
      },
    },
    stack: barStacked && 'total', // 这个值相同的柱子，会堆叠起来。值是什么都行，但最好是有意义的值。
  };

  // @ts-ignore
  const series: BarSeriesOption[] = barData.map(row => {
    const isFiltered = filterState.selectedValues && !filterState.selectedValues.includes(row.name);
    return {
      ...barSeries,
      ...row,
      itemStyle: {
        color: colorFn(row.name),
        opacity: isFiltered ? OpacityEnum.SemiTransparent : OpacityEnum.NonTransparent,
      },
    };
  });

  const selectedValues = (filterState.selectedValues || []).reduce(
    (acc: Record<string, number>, selectedValue: string) => {
      const index = series.findIndex(({ name }) => name === selectedValue);
      return {
        ...acc,
        [index]: selectedValue,
      };
    },
    {},
  );

  // Y轴的格式化方法
  const numberFormatter = getNumberFormatter(yAxisFormat);
  // Y轴的最大值和最小值
  const yMinMax = yAxisShowminmax && yAxisBounds.length === 2 ? {
    min: yAxisBounds[0],
    max: yAxisBounds[1]
  } : {}

  // 位置计算
  const gridBottom = bottomMargin !== 'auto' ? {
    bottom: parseInt(bottomMargin, 10)
  } : {}

  const echartOptions: EChartsCoreOption = {
    grid: {
      ...defaultGrid,
      ...gridBottom
    },
    tooltip: {
      ...defaultTooltip,
      // 提示的值格式化
      valueFormatter: (value: any) => (typeof value === 'number' ? `${value.toFixed(2)}` : value),
    },
    // 图表的标题
    // title: {
    //   text: 'Weather Statistics',
    // },
    legend: {
      show: showLegend,
      data: legendData,
    },
    xAxis: {
      type: 'category',
      name: xAxisLabel,
      axisLabel: {
        hideOverlap: true, // 是否隐藏重叠的标签
      },
      data: orderBars ? xLabels.sort((x, y) => x.localeCompare(y)) : xLabels,
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

  return {
    formData,
    width,
    height,
    echartOptions,
    setDataMask,
    groupby,
    selectedValues,
  };
}
