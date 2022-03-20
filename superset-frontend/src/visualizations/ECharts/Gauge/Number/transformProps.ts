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
    emitFilter,
    // metric,
    description,
    titleText,
    titleFontSize,
    titleFontColor,
    yAxisFormat,
    numberFontSize,
    numberFontColor,
    numberDistance,
    horizontalDistance,
    descriptionFontColor,
    descriptionFontSize,
    descriptionDistance,
    descriptionHorizontalDistance,
  }: EchartsGaugeFormData = { ...DEFAULT_GAUGE_FORM_DATA, ...formData };

  console.log('chartProps:', chartProps);

  // 目前只提供一个数的展示
  const obj = queriesData[0].data[0];
  // 显示的值
  const value = Object.values(obj)[0];

  const columnsLabelMap = new Map<string, DataRecordValue[]>();

  const { setDataMask = () => {} } = hooks;

  // Y轴的格式化方法
  const numberFormatter = getNumberFormatter(yAxisFormat);

  const echartOptions: EChartsCoreOption = {
    title: {
      text: titleText,
      textStyle: {
        fontSize: getFontSize(titleFontSize, width),
        color:
          titleFontColor &&
          rgbToHex(titleFontColor?.r, titleFontColor?.g, titleFontColor?.b),
      },
    },
    graphic: {
      elements: [
        {
          type: 'text',
          left: `${getDistance(horizontalDistance ?? 0, width)}%`,
          top: `${getDistance(numberDistance ?? 0, height) + 20}%`,
          cursor: 'default',
          style: {
            text: numberFormatter(value as number),
            fontSize: getFontSize(numberFontSize, width),
            fontWeight: 'bold',
            fill:
              numberFontColor &&
              rgbToHex(
                numberFontColor?.r,
                numberFontColor?.g,
                numberFontColor?.b,
              ),
          },
        },
        {
          type: 'text',
          left: `${getDistance(descriptionHorizontalDistance ?? 0, width)}%`,
          top: `${getDistance(descriptionDistance ?? 0, height) + 55}%`,
          cursor: 'default',
          style: {
            text: description,
            fontSize: getFontSize(descriptionFontSize, width),
            fill:
              descriptionFontColor &&
              rgbToHex(
                descriptionFontColor?.r,
                descriptionFontColor?.g,
                descriptionFontColor?.b,
              ),
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
