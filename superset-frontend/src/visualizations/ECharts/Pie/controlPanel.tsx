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
import { t, validateNonEmpty } from 'src/core';
import {
  ControlPanelConfig,
  ControlPanelsContainerProps,
  D3_FORMAT_OPTIONS,
  emitFilterControl,
} from 'src/chartConntrols';
import { DEFAULT_FORM_DATA } from './types';
import { legendSection, drilldown } from '../controls';

const {
  labelsOutside,
  labelType,
  labelLine,
  numberFormat,
  showLabels,
} = DEFAULT_FORM_DATA;

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['groupby'],
        [drilldown],
        ['metric'],
        ['adhoc_filters'],
        emitFilterControl,
        ['row_limit'],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        // ['color_scheme'],
        [
          {
            name: 'show_labels_threshold',
            config: {
              type: 'SliderControl',
              label: t('Percentage threshold'),
              renderTrigger: true,
              min: 0,
              max: 100,
              step: 1,
              default: 5,
              description: t(
                'Minimum threshold in percentage points for showing labels.',
              ),
              // 5.3.0 存在BUG，标签不显示的时候，标签线仍然会显示，所以暂时不开启该功能。
              visibility: () => false,
            },
          },
        ],
        ...legendSection,
        [<h1 className="section-header">{t('Labels')}</h1>],
        [
          {
            name: 'label_type',
            config: {
              type: 'SelectControl',
              label: t('Label Type'),
              default: labelType,
              renderTrigger: true,
              choices: [
                ['key', t('Category Name')], // 类型
                ['value', t('Value')], // 值
                ['key_value', t('Category and Value')], // 类型 和 值
              ],
              description: t('What should be shown on the label?'),
            },
          },
        ],
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
              description: t(
                'Format the displayed value in the selected format',
              ),
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
            name: 'labels_outside',
            config: {
              type: 'CheckboxControl',
              label: t('Put labels outside'),
              default: labelsOutside,
              renderTrigger: true,
              description: t('Put the labels outside of the pie?'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.show_labels?.value),
            },
          },
        ],
        [
          {
            name: 'label_line',
            config: {
              type: 'CheckboxControl',
              label: t('Label Line'),
              default: labelLine,
              renderTrigger: true,
              description: t(
                'Draw line from Pie to label when labels outside?',
              ),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(
                  controls?.show_labels?.value &&
                    controls?.labels_outside?.value,
                ),
            },
          },
        ],
        [<h1 className="section-header">{t('Pie shape')}</h1>],
        [
          {
            name: 'outerRadius',
            config: {
              type: 'SliderControl',
              label: t('Outer Radius'),
              renderTrigger: true,
              min: 10,
              max: 100,
              step: 1,
              default: 70, // 外环70%
              description: t('Outer edge of Pie chart'),
            },
          },
        ],
        [
          {
            name: 'donut', // 圆环图
            config: {
              type: 'CheckboxControl',
              label: t('Donut'),
              default: false,
              renderTrigger: true,
              description: t('Do you want a donut or a pie?'),
            },
          },
        ],
        [
          {
            name: 'innerRadius',
            config: {
              type: 'SliderControl',
              label: t('Inner Radius'),
              renderTrigger: true,
              min: 0,
              max: 100,
              step: 1,
              default: 40, // 内环40%
              description: t('Inner radius of donut hole'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.donut?.value),
            },
          },
        ],
      ],
    },
  ],
  controlOverrides: {
    groupby: {
      validators: [validateNonEmpty], // 非空校验
    },
    series: {
      validators: [validateNonEmpty],
      clearable: false,
    },
    row_limit: {
      default: 100,
    },
  },
};

export default config;
