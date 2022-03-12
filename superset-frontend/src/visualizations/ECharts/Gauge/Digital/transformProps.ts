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
  DEFAULT_FORM_DATA as DEFAULT_GAUGE_FORM_DATA,
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
    valueFontSize,
    fontAnimation,
    titleText,
    titleFontSize,
    titleFontColor,
    yAxisFormat,
    valueFontColor,
    emitFilter,
  }: EchartsGaugeFormData = { ...DEFAULT_GAUGE_FORM_DATA, ...formData };

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
    // 基于仪表图做的改进，所以这里的图表类型还是仪表图的类型
    type: 'gauge',
    // 仪表盘边缘线
    axisLine: { show: false },
    // 进度条
    progress: { show: false },
    // 指针
    pointer: { show: false },
    // 短刻度
    axisTick: { show: false },
    // 长刻度
    splitLine: { show: false },
    // 文字标签
    axisLabel: { show: false },
    // 中间数据
    data: [
      {
        value,
        detail: {
          offsetCenter: ['0%', '0%'],
        },
      },
    ],
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
