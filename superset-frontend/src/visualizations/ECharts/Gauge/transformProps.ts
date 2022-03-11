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
import { DataRecordValue } from 'src/core';
import { EChartsCoreOption } from 'echarts';
import { rgbToHex } from 'src/utils/colorUtils';

import {
  DEFAULT_FORM_DATA as DEFAULT_GAUGE_FORM_DATA,
  EchartsGaugeFormData,
  GaugeChartTransformedProps,
  EchartsGaugeChartProps,
} from './types';
import { defaultGrid } from '../defaults';

export default function transformProps(
  chartProps: EchartsGaugeChartProps,
): GaugeChartTransformedProps {
  const {
    width,
    height,
    formData,
    queriesData,
    hooks,
    filterState,
  } = chartProps;
  const {
    // metric,
    ringPercent,
    ringWidth,
    valueFontSize,
    labelFontSize,
    fontAnimation,
    showProgress,
    titleText,
    titleFontSize,
    titleFontColor,
    roundCap,
    showAxisTick,
    showSplitLine,
    showPointer,
    valueFormatter,
    emitFilter,
  }: EchartsGaugeFormData = { ...DEFAULT_GAUGE_FORM_DATA, ...formData };

  // console.log('chartProps:', chartProps);

  // 目前只提供一个数的展示
  const obj = queriesData[0].data[0];
  // 显示的值
  const value = Object.values(obj)[0];

  const columnsLabelMap = new Map<string, DataRecordValue[]>();

  const { setDataMask = () => {} } = hooks;

  const axisLineColor = ringPercent ? { color: '#111' } : {};

  const echartOptions: EChartsCoreOption = {
    title: {
      text: titleText,
      textStyle: {
        fontSize: titleFontSize,
        color:
          titleFontColor &&
          rgbToHex(titleFontColor?.r, titleFontColor?.g, titleFontColor?.b),
      },
    },
    grid: {
      ...defaultGrid,
    },
    series: {
      type: 'gauge',
      // 开始角度, 这个角度是固定的，很少需要配置，所以不提供自定义了。
      startAngle: ringPercent ? 90 : 225,
      // 结束角度
      endAngle: ringPercent ? -270 : -45,
      min: 0,
      max: 100,
      // 仪表盘边缘线
      axisLine: {
        lineStyle: {
          // 仪表盘的边线宽度，必须和进度条的宽度一致
          width: 15,
          ...axisLineColor,
        },
      },
      progress: {
        // 进度条两边是否显示小圆盖
        roundCap,
        // 超出上限是否截断图形
        clip: true,
        // 是否显示
        show: showProgress,
        // 进度条的宽度，必须和线的宽度保持一致
        width: ringPercent ? ringWidth : 15,
      },
      // 指针
      pointer: {
        show: ringPercent ? false : showPointer,
        showAbove: false,
      },
      // 短刻度
      axisTick: {
        show: ringPercent ? false : showAxisTick,
        distance: 0,
        length: 8,
      },
      // 长刻度
      splitLine: {
        show: ringPercent ? false : showSplitLine,
        distance: 0,
        length: 20,
      },
      // 文字标签
      axisLabel: {
        show: ringPercent ? false : true,
        distance: 20,
        fontSize: labelFontSize,
        formatter: `{value}${valueFormatter}`,
      },
      // 中间文字
      detail: {
        // 字体动画
        valueAnimation: fontAnimation,
        fontSize: valueFontSize, // 文字大小：50 - 120
        formatter: `{value}${valueFormatter}`,
      },
      // 中间数据
      data: [
        {
          value,
          // name: 'SCORE',
          itemStyle: {
            // color: '#ccc'
          },
          title: {
            offsetCenter: ['0%', ringPercent ? '0%' : '20%'],
          },
          detail: {
            offsetCenter: ['0%', ringPercent ? '0%' : '30%'],
          },
        },
      ],
    },
  };

  // console.log('echartOptions:', echartOptions);

  return {
    formData,
    width,
    height,
    echartOptions,
    setDataMask,
    emitFilter,
    labelMap: Object.fromEntries(columnsLabelMap),
    groupby: [], // 仪表盘只有一个值，不存在分组条件
    selectedValues: filterState.selectedValues || [],
  };
}
