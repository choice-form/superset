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
  emitFilterControl,
  sharedControls,
} from 'src/chartConntrols';
import React from 'react';
import { DEFAULT_FORM_DATA } from './types';
import { hexToRgba } from '../../../utils/colorUtils';

const { showLabels } = DEFAULT_FORM_DATA;

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
        [<h1 className="section-header">{t('Labels')}</h1>],
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
            name: 'label_type',
            config: {
              type: 'SelectControl',
              label: t('Label Type'),
              default: 'value',
              renderTrigger: true,
              choices: [
                ['key', t('Category Name')], // 类型
                ['value', t('Value')], // 值
                ['key_value', t('Category and Value')], // 类型 和 值
              ],
              description: t('What should be shown on the label?'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.show_labels?.value),
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
            name: 'averageLineColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('Average Line Color'),
              description: t('Average Line Color'),
              default: hexToRgba('#FF7F44'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.averageLine?.value),
            },
          },
        ],
        [
          {
            name: 'yAverageLineTitle',
            config: {
              ...sharedControls.yAxisLabel,
              label: t('Y-Axis average line title'),
              description: t('Y-Axis average line title'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.averageLine?.value),
            },
          },
        ],
        [
          {
            name: 'yAverageLineLabel',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Y-Axis average line label'),
              description: t('Y-Axis average line label'),
              default: true,
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
              label: t('X-Axis average line title'),
              description: t('X-Axis average line title'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.averageLine?.value),
            },
          },
        ],
        [
          {
            name: 'xAverageLineLabel',
            config: {
              ...sharedControls.yAxisLine,
              label: t('X-Axis average line label'),
              description: t('X-Axis average line label'),
              default: true,
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
        [
          {
            name: 'yAxisArrow',
            config: {
              type: 'CheckboxControl',
              label: t('Show Y Axis Arrow'),
              renderTrigger: true,
              default: false,
              description: '',
            },
          },
        ],
        ['yAxisFormat'],
        ['yAxisName'],
        [
          {
            name: 'yNameFontColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('y axis name font color'),
              description: t('Font color of Y-axis name.'),
            },
          },
        ],
        [
          {
            name: 'yAxisTick',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Y Axis Tick'),
              description: t('Y Axis Tick'),
              default: false,
            },
          },
        ],
        [
          {
            name: 'yAxisLabel',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Show Y Axis Label'),
              description: t('Show Y Axis Label'),
              default: true,
            },
          },
        ],
        [
          {
            name: 'ySplitLine',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Show Y Axis Split Line'),
              description: t('Show Y Axis Split Line'),
              default: false,
            },
          },
        ],
      ],
    },
    {
      label: t('X Axis'),
      expanded: false,
      controlSetRows: [
        ['xAxisLine'],
        [
          {
            name: 'xAxisArrow',
            config: {
              type: 'CheckboxControl',
              label: t('Show X Axis Arrow'),
              renderTrigger: true,
              default: false,
              description: '',
            },
          },
        ],
        ['xAxisFormat'],
        ['xAxisName'],
        [
          {
            name: 'xAxisTick',
            config: {
              ...sharedControls.yAxisLine,
              label: t('X Axis Tick'),
              description: t('X Axis Tick'),
              default: false,
            },
          },
        ],
        [
          {
            name: 'xAxisLabel',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Show X Axis Label'),
              description: t('Show X Axis Label'),
              default: true,
            },
          },
        ],
        [
          {
            name: 'xSplitLine',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Show X Axis Split Line'),
              description: t('Show X Axis Split Line'),
              default: false,
            },
          },
        ],
        [
          {
            name: 'xDistance',
            config: {
              ...sharedControls.distance,
              label: t('x axis name distance'),
              description: t('Distance between X-axis name and boundary'),
              min: 0,
              max: 1000,
              default: 0,
            },
          },
        ],
        [
          {
            name: 'xNameFontColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('x axis name font color'),
              description: t('Font color of X-axis name.'),
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
