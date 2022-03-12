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
import { DataRecordValue, getNumberFormatter } from 'src/core';
import { EChartsCoreOption } from 'echarts';
import { rgbToHex } from 'src/utils/colorUtils';

import {
  EchartsGaugeFormData,
  GaugeChartTransformedProps,
  EchartsGaugeChartProps,
} from '../types';

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
    ringWidth,
    valueFontSize,
    fontAnimation,
    titleText,
    titleFontSize,
    titleFontColor,
    roundCap,
    yAxisFormat,
    valueFontColor,
    emitFilter,
  }: EchartsGaugeFormData = formData;

  // console.log('chartProps:', chartProps);

  // 目前只提供一个数的展示
  const obj = queriesData[0].data[0];
  // 显示的值
  const value = Object.values(obj)[0];

  const columnsLabelMap = new Map<string, DataRecordValue[]>();

  const { setDataMask = () => {} } = hooks;

  // Y轴的格式化方法
  const numberFormatter = getNumberFormatter(yAxisFormat);

  const series = {
    type: 'gauge',
    // 开始角度, 这个角度是固定的，很少需要配置，所以不提供自定义了。
    startAngle: 90,
    // 结束角度
    endAngle: -270,
    // 仪表盘边缘线
    axisLine: {
      lineStyle: {
        // 仪表盘的边线宽度，必须和进度条的宽度一致
        width: 15,
        color: '#111',
      },
    },
    progress: {
      // 进度条两边是否显示小圆盖
      roundCap,
      // 超出上限是否截断图形
      clip: true,
      // 是否显示, 圆环图必须显示圆环啊。。。
      show: true,
      // 进度条的宽度，必须和线的宽度保持一致
      width: ringWidth,
    },
    // 指针
    pointer: { show: false },
    // 短刻度
    axisTick: { show: false },
    // 长刻度
    splitLine: { show: false },
    // 文字标签
    axisLabel: { show: false },
    // 中间文字
    detail: {
      // 字体动画
      valueAnimation: fontAnimation,
      fontSize: valueFontSize, // 文字大小：50 - 500
      formatter: numberFormatter,
      color:
        valueFontColor &&
        rgbToHex(valueFontColor?.r, valueFontColor?.g, valueFontColor?.b),
    },
    // 中间数据
    data: [
      {
        value,
        detail: {
          offsetCenter: ['0%', '0%'],
        },
      },
    ],
  };

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
    series,
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
