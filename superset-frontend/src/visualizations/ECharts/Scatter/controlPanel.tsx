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
import {
  ControlPanelConfig,
  ControlPanelsContainerProps,
  D3_FORMAT_OPTIONS,
  emitFilterControl,
  sharedControls,
} from 'src/chartConntrols';
import { DEFAULT_FORM_DATA } from './types';

const { numberFormat, showLabels } = DEFAULT_FORM_DATA;

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
        ['adhoc_filters'],
        emitFilterControl,
        ['row_limit'],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['titleText'],
        ['TitleFontSize'],
        ['TitleFontColor'],
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
            name: 'averageLine',
            config: {
              ...sharedControls.stacked,
              label: t('Show average line'),
              description: t('Show average line'),
            },
          },
        ],
        [
          {
            name: 'yAverageLineTitle',
            config: {
              ...sharedControls.yAxisLabel,
              label: t('Y-Axis average line label'),
              description: t('Y-Axis average line label'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.averageLine?.value),
            },
          },
        ],
        [
          {
            name: 'yValueSuffix',
            config: {
              ...sharedControls.yAxisLabel,
              label: t('Value suffix for Y-axis'),
              description: t('Value suffix for Y-axis'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.averageLine?.value),
            },
          },
        ],
        [
          {
            name: 'xAverageLineTitle',
            config: {
              ...sharedControls.yAxisLabel,
              label: t('X-Axis average line label'),
              description: t('X-Axis average line label'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.averageLine?.value),
            },
          },
        ],
        [
          {
            name: 'xValueSuffix',
            config: {
              ...sharedControls.yAxisLabel,
              label: t('Value suffix for X-axis'),
              description: t('Value suffix for X-axis'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.averageLine?.value),
            },
          },
        ],
      ],
    },
    {
      label: t('Y Axis'),
      expanded: false,
      controlSetRows: [
        ['yAxisLine'],
        ['yAxisFormat'],
        ['yAxisLabel'],
        [
          {
            name: 'yLabelFontColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('y axis label font color'),
              description: t('Font color of Y-axis labels'),
            },
          },
        ],
      ],
    },
    {
      label: t('X Axis'),
      expanded: false,
      controlSetRows: [
        ['xAxisFormat'],
        ['xAxisLabel'],
        [
          {
            name: 'xDistance',
            config: {
              ...sharedControls.distance,
              label: t('x axis label distance'),
              description: t('Distance between X-axis label and boundary'),
              min: 0,
              max: 1000,
              default: 0,
            },
          },
        ],
        [
          {
            name: 'xLabelFontColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('x axis label font color'),
              description: t('Font color of X-axis labels'),
            },
          },
        ],
      ],
    },
  ],
  controlOverrides: {
    groupby: {
      multi: false,
      validators: [validateNonEmpty], // 非空校验
    },
  },
};

export default config;
