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
  getDistance,
  getFontSize,
} from 'src/visualizations/ECharts/utils/chart';

import {
  DEFAULT_FORM_DATA as DEFAULT_GAUGE_FORM_DATA,
  EchartsGaugeFormData,
  GaugeChartTransformedProps,
  EchartsGaugeChartProps,
} from './types';

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
    titleText,
    titleFontSize,
    titleFontColor,
    titleFontWeight,
    subTitleText,
    subTitleFontSize,
    subTitleFontColor,
    subTitleFontWeight,

    // metric,
    axisLineWidth, // 仪表轴线宽度
    valueFontSize,
    fontAnimation,

    numberDistance,
    startRange,
    startRangeColor,
    middleRange,
    middleRangeColor,
    endRangeColor,
    showLabel,
    showAxisTick,
    showSplitLine,
    showPointer,
    yAxisFormat,
    yAxisName,
    yAxisNameSize,
    labelFormat,
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
  const labelFormatter = getNumberFormatter(labelFormat);

  const series = {
    type: 'gauge',
    // 开始角度, 这个角度是固定的，很少需要配置，所以不提供自定义了。
    startAngle: 180,
    // 结束角度
    endAngle: 0,
    min: 0,
    max: 100,
    center: ['50%', '65%'],
    // 仪表盘边缘线
    axisLine: {
      lineStyle: {
        width: axisLineWidth,
        color: [
          [
            startRange / 100,
            rgbToHex(
              startRangeColor?.r,
              startRangeColor?.g,
              startRangeColor?.b,
            ),
          ],
          [
            middleRange / 100,
            rgbToHex(
              middleRangeColor?.r,
              middleRangeColor?.g,
              middleRangeColor?.b,
            ),
          ],
          [1, rgbToHex(endRangeColor?.r, endRangeColor?.g, endRangeColor?.b)],
        ],
      },
    },
    // 指针
    pointer: {
      show: showPointer,
      icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
      length: '12%',
      width: 12,
      offsetCenter: [0, '-55%'],
      itemStyle: {
        color: 'auto',
      },
    },
    // 短刻度
    axisTick: {
      show: showAxisTick,
      length: 8,
      lineStyle: {
        color: 'auto',
        width: 2,
      },
    },
    // 长刻度
    splitLine: {
      show: showSplitLine,
      length: 20,
      lineStyle: {
        color: 'auto',
        width: 5,
      },
    },
    // 文字标签
    axisLabel: {
      show: showLabel,
      distance: -70,
      fontSize: 14,
      formatter: labelFormatter,
    },
    title: {
      offsetCenter: [0, '-20%'],
      fontSize: yAxisNameSize,
      // color: 'auto',
    },
    // 中间文字
    detail: {
      // 字体动画
      valueAnimation: fontAnimation,
      offsetCenter: [0, `${getDistance(numberDistance ?? 0, height)}%`],
      fontSize: getFontSize(valueFontSize, width, 50), // 文字大小：50 - 500
      formatter: numberFormatter,
      color: 'auto',
    },
    // 中间数据
    data: [
      {
        value,
        name: yAxisName,
      },
    ],
  };

  const echartOptions: EChartsCoreOption = {
    title: {
      text: titleText,
      textStyle: {
        fontSize: getFontSize(titleFontSize, width),
        fontWeight: titleFontWeight,
        color: rgbToHex(
          titleFontColor?.r,
          titleFontColor?.g,
          titleFontColor?.b,
        ),
      },
      subtext: subTitleText,
      subtextStyle: {
        fontSize: getFontSize(subTitleFontSize, width),
        fontWeight: subTitleFontWeight,
        color: rgbToHex(
          subTitleFontColor?.r,
          subTitleFontColor?.g,
          subTitleFontColor?.b,
        ),
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
