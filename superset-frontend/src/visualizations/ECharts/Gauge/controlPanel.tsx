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
import { t } from 'src/core';
import {
  sharedControls,
  ControlPanelConfig,
  sections,
  emitFilterControl,
  ControlPanelsContainerProps,
} from 'src/chartConntrols';
import { DEFAULT_FORM_DATA } from './types';

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metric'],
        ['adhoc_filters'],
        emitFilterControl,
        [
          {
            name: 'row_limit',
            config: {
              ...sharedControls.row_limit,
              choices: [...Array(10).keys()].map(n => n + 1),
              default: DEFAULT_FORM_DATA.rowLimit,
            },
          },
        ],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['titleText'],
        ['TitleFontSize'],
        ['TitleFontColor'],
        ['ringPercent'],
        ['ringWidth'],
        [
          {
            name: 'value_font_size',
            config: {
              type: 'SliderControl',
              label: t('Value Font size'),
              description: t('Font size for detail value'),
              renderTrigger: true,
              min: 50,
              max: 120,
              default: 50,
            },
          },
        ],
        [
          {
            name: 'label_font_size',
            config: {
              type: 'SliderControl',
              label: t('Label Font size'),
              description: t('Font size for axis labels'),
              renderTrigger: true,
              min: 12,
              max: 20,
              default: 16,
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                !Boolean(controls?.ringPercent?.value),
            },
          },
        ],
        [
          {
            name: 'value_formatter',
            config: {
              type: 'TextControl',
              label: t('Value format'),
              description: t(
                'Additional text to add before or after the value, e.g. unit',
              ),
              renderTrigger: true,
              default: '%',
            },
          },
        ],
        [
          {
            name: 'show_pointer',
            config: {
              type: 'CheckboxControl',
              label: t('Show pointer'),
              description: t('Whether to show the pointer'),
              renderTrigger: true,
              default: true,
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                !Boolean(controls?.ringPercent?.value),
            },
          },
        ],
        [
          {
            name: 'valueAnimation',
            config: {
              type: 'CheckboxControl',
              label: t('Value Animation'),
              description: t(
                'Whether to animate the value or just display it.',
              ),
              renderTrigger: true,
              default: true,
            },
          },
        ],
        [
          {
            name: 'show_axis_tick',
            config: {
              type: 'CheckboxControl',
              label: t('Show axis line ticks'),
              description: t('Whether to show minor ticks on the axis'),
              renderTrigger: true,
              default: true,
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                !Boolean(controls?.ringPercent?.value),
            },
          },
        ],
        [
          {
            name: 'show_split_line',
            config: {
              type: 'CheckboxControl',
              label: t('Show split lines'),
              description: t('Whether to show the split lines on the axis'),
              renderTrigger: true,
              default: true,
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                !Boolean(controls?.ringPercent?.value),
            },
          },
        ],
        [
          {
            name: 'show_progress',
            config: {
              type: 'CheckboxControl',
              label: t('Show progress'),
              description: t('Whether to show the progress of gauge chart'),
              renderTrigger: true,
              default: true,
            },
          },
        ],
        [
          {
            name: 'round_cap',
            config: {
              type: 'CheckboxControl',
              label: t('Round cap'),
              description: t(
                'Style the ends of the progress bar with a round cap',
              ),
              renderTrigger: true,
              default: DEFAULT_FORM_DATA.roundCap,
            },
          },
        ],
      ],
    },
  ],
};

export default config;
