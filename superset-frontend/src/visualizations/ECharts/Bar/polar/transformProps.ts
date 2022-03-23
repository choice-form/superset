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
  BarChartTransformedProps,
  EchartsBarChartProps,
  EchartsBarFormData,
} from '../types';
import { DEFAULT_FORM_DATA as DEFAULT_PIE_FORM_DATA } from '../constants';
import { DEFAULT_LEGEND_FORM_DATA, LegendOrientation } from '../../types';
import { getFontSize } from '../../utils/chart';
import { toRGBA } from '../../utils/colors';

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
  } = chartProps;

  // console.log('chartProps:', chartProps);

  const {
    titleText,
    titleFontSize,
    titleFontColor,
    titleFontWeight,
    subTitleText,
    subTitleFontSize,
    subTitleFontColor,
    subTitleFontWeight,

    groupby,
    showLabel,
    labelFormat,

    outAxisLine, // 轴线
    outAxisTick, // 刻度线
    outAxisLabel, // 标签
    outSplitLine, // 分割线
    outLabelFontSize, // 标签字体大小
    outLabelFontColor, // 标签字体颜色

    inAxisLine, // 轴线
    inAxisFormat, // 格式化
    inAxisTick, // 刻度线
    inAxisLabel, // 标签
    inSplitLine, // 分割线

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

  const { setDataMask = () => {} } = hooks;

  const { data } = queriesData[0];

  const labelFormatter = getNumberFormatter(labelFormat);

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
      show: showLabel,
      formatter: (params: any) => labelFormatter(params.value),
    },
    // 花瓣图必须要堆叠的
    stack: 'total', // 这个值相同的柱子，会堆叠起来。值是什么都行，但最好是有意义的值。
    // 花瓣图
    coordinateSystem: 'polar',
  };

  // 指标分类标题
  const angleAxisData: string[] = [];

  // 图例数据
  const legendData: string[] = [];
  const series: any[] = [];

  // 数据集合
  const dataSet: { [key: string]: any[] } = {};

  // 处理维度分组和对应的值
  data.forEach(row => {
    // 指标列表
    const keys: any[] = [];

    Object.entries(row).forEach(([k, v]) => {
      // 判断是否为分组维度
      if (groupby.includes(k)) {
        // @ts-ignore
        if ([undefined, null].includes(v)) {
          keys.push('null');
        } else {
          keys.push(v);
        }
      } else {
        // 避免值不是数值，造成图表渲染出现异常
        // @ts-ignore
        const value = [undefined, null].includes(v) ? 0 : v;
        if (Object.keys(dataSet).includes(k)) {
          dataSet[k].push(value);
        } else {
          dataSet[k] = [value];
        }
      }
    });
    // 指标名称
    angleAxisData.push(keys.join(','));
  });

  Object.entries(dataSet).forEach(([k, v]) => {
    // 添加图例
    legendData.push(k);
    // 添加系列
    series.push({
      ...barSeries,
      name: k,
      data: v,
    });
  });

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
    legendPosition = { ...legendPosition, padding: [5, legendPadding] };
  }

  const inFormatter = getNumberFormatter(inAxisFormat);

  const echartOptions: EChartsCoreOption = {
    title: {
      text: titleText,
      textStyle: {
        fontSize: getFontSize(titleFontSize, width),
        fontWeight: titleFontWeight,
        color: toRGBA(titleFontColor),
      },
      subtext: subTitleText,
      subtextStyle: {
        fontSize: getFontSize(subTitleFontSize, width),
        fontWeight: subTitleFontWeight,
        color: toRGBA(subTitleFontColor),
      },
    },
    legend: {
      show: showLegend,
      type: legendType === 'scroll' ? 'scroll' : 'plain',
      selectedMode: legendMode,
      ...legendPosition,
      data: legendData,
    },
    // 外部轴
    angleAxis: {
      type: 'category',
      axisLine: {
        // 是否显示数值轴的轴线
        show: outAxisLine,
      },
      // 内部分割线
      splitLine: {
        show: outSplitLine,
      },
      // 轴线上的刻度
      axisTick: {
        show: outAxisTick,
      },
      // 轴线上的标签
      axisLabel: {
        show: outAxisLabel,
        fontSize: outLabelFontSize,
        fontWeight: 'bold',
        color: toRGBA(outLabelFontColor),
        hideOverlap: true, // 是否隐藏重叠的标签
      },
      data: angleAxisData,
    },
    // 内部轴
    radiusAxis: {
      axisLine: {
        // 是否显示数值轴的轴线
        show: inAxisLine,
      },
      // 内部分割线
      splitLine: {
        show: inSplitLine,
      },
      // 轴线上的刻度
      axisTick: {
        show: inAxisTick,
      },
      // 轴线上的标签
      axisLabel: {
        show: inAxisLabel,
        hideOverlap: true, // 是否隐藏重叠的标签
        formatter: inFormatter,
      },
    },
    polar: {},
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
