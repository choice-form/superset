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
import React from 'react';
import { t } from 'src/core';
import {
  ControlPanelConfig,
  D3_FORMAT_OPTIONS,
  emitFilterControl,
} from 'src/chartConntrols';
import { DEFAULT_FORM_DATA } from './types';
import { legendSection, themeType } from '../controls';

const { numberFormat, showLabels, isCircle } = DEFAULT_FORM_DATA;

// const radarMetricMaxValue: { name: string; config: ControlFormItemSpec } = {
//   name: 'radarMetricMaxValue',
//   config: {
//     controlType: 'InputNumber',
//     label: t('Max'),
//     description: t(
//       'The maximum value of metrics. It is an optional configuration',
//     ),
//     width: 120,
//     placeholder: 'auto',
//     debounceDelay: 400,
//     validators: [validateNumber],
//   },
// };

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['groupby'],
        ['metrics'],
        ['timeseries_limit_metric'],
        ['adhoc_filters'],
        emitFilterControl,
        ['row_limit'],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        [themeType],
        ['titleText'],
        ['titleFontSize'],
        ['titleFontColor'],
        ['titleFontWeight'],
        ['subTitleText'],
        ['subTitleFontSize'],
        ['subTitleFontColor'],
        ['subTitleFontWeight'],

        ...legendSection,
        [
          {
            name: 'number_format',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Number format'),
              renderTrigger: true,
              default: numberFormat,
              choices: D3_FORMAT_OPTIONS,
              description: `${t(
                'D3 format syntax: https://github.com/d3/d3-format. ',
              )} ${t('Only applies when "Label Type" is set to show values.')}`,
            },
          },
        ],
        [<h1 className="section-header">{t('Radar')}</h1>],
        [
          {
            name: 'show_labels',
            config: {
              type: 'CheckboxControl',
              label: t('Show Labels'),
              renderTrigger: true,
              default: showLabels,
              description: t('Whether to display the labels.'),
            },
          },
        ],
        [
          {
            name: 'is_circle',
            config: {
              type: 'CheckboxControl',
              label: t('Circle radar shape'),
              renderTrigger: true,
              default: isCircle,
              description: t(
                "Radar render type, whether to display 'circle' shape.",
              ),
            },
          },
        ],
        [
          {
            name: 'percentData',
            config: {
              type: 'CheckboxControl',
              label: t('precent Data'),
              renderTrigger: true,
              default: false,
              description: t('Percentage type data is used.'),
            },
          },
        ],
      ],
    },
  ],
};

export default config;
