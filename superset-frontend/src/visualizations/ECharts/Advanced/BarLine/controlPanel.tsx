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
import { t, validateNonEmpty } from 'src/core';
import { ControlPanelConfig } from 'src/chartConntrols';
import {
  bottomMargin,
  showBarValue,
  showAxisPointer,
  showLegendControl,
  xAxisLabel,
  xLabelLayout,
  yAxisBounds,
  yAxisLabel,
  yAxis2Label,
  yAxisShowMinmax,
  yAxis2ShowMinmax,
  yAxis2Bounds,
} from '../../controls';

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [['metrics'], ['adhoc_filters'], ['row_limit'], ['groupby']],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [['color_scheme'], [showLegendControl], [showBarValue], [showAxisPointer]],
    },
    {
      label: t('Y Axis 1'),
      expanded: true,
      controlSetRows: [['y_axis_format'], [yAxisLabel], [yAxisShowMinmax], [yAxisBounds]],
    },
    {
      label: t('Y Axis 2'),
      expanded: true,
      controlSetRows: [['y_axis_2_format'], [yAxis2Label], [yAxis2ShowMinmax], [yAxis2Bounds]],
    },
    {
      label: t('X Axis'),
      expanded: true,
      controlSetRows: [[xAxisLabel], [bottomMargin], [xLabelLayout]],
    },
  ],
  controlOverrides: {
    metrics: {
      multi: true,
      max: 2,
      description: '',
      validators: [
        (v: any) => {
          if (v === null || typeof v === 'undefined' || v === '') {
            return t('cannot be empty');
          }
          if (Array.isArray(v) && v.length !== 2) {
            return t('2 values must be selected');
          }
          return false;
        },
      ],
    },
    groupby: {
      validators: [validateNonEmpty], // 非空校验
    },
    color_scheme: {
      default: 'echarts5Colors', // 默认使用echarts5配色
    },
  },
};

export default config;
