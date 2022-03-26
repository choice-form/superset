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
  emitFilterControl,
  ControlPanelsContainerProps,
} from 'src/chartConntrols';
import { hexToRgba } from '../../../utils/colorUtils';

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
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
        ['titleText'],
        ['titleFontSize'],
        ['titleFontColor'],
        ['titleFontWeight'],
        ['subTitleText'],
        ['subTitleFontSize'],
        ['subTitleFontColor'],
        ['subTitleFontWeight'],
        ['radius'],

        // eslint-disable-next-line react/react-in-jsx-scope
        [<h1 className="section-header">{t('Color Range')}</h1>],
        [
          {
            name: 'startRangeColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('Start Range Color'),
              description: '',
              default: hexToRgba('#DF2020'),
            },
          },
          {
            name: 'startRange',
            config: {
              type: 'SliderControl',
              label: t('Start Range'),
              description: '',
              renderTrigger: true,
              min: 0,
              max: 100,
              default: 75,
            },
          },
        ],
        [
          {
            name: 'secondRangeColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('Second Range Color'),
              description: '',
              default: hexToRgba('#FFBF00'),
            },
          },
          {
            name: 'secondRange',
            config: {
              type: 'SliderControl',
              label: t('Second Range'),
              description: '',
              renderTrigger: true,
              min: 0,
              max: 100,
              default: 80,
            },
          },
        ],
        [
          {
            name: 'thirdRangeColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('Third Range Color'),
              description: '',
              default: hexToRgba('#33CC59'),
            },
          },
          {
            name: 'thirdRange',
            config: {
              type: 'SliderControl',
              label: t('Third Range'),
              description: '',
              renderTrigger: true,
              min: 0,
              max: 100,
              default: 85,
            },
          },
        ],
        [
          {
            name: 'endRangeColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('End Range Color'),
              description: '',
              default: hexToRgba('#0055FF'),
            },
          },
        ],
        [
          {
            name: 'axisLineWidth',
            config: {
              type: 'SliderControl',
              label: t('Axis Line Width'),
              description: '',
              renderTrigger: true,
              min: 1,
              max: 100,
              default: 20,
            },
          },
        ],
        [
          {
            name: 'showLegend',
            config: {
              type: 'CheckboxControl',
              label: t('Show legend'),
              renderTrigger: true,
              default: true,
            },
          },
        ],
        ['showLabel'],
        [
          {
            name: 'labelFormat',
            config: {
              ...sharedControls.yAxisFormat,
              label: t('Label Format'),
              default: 'PRECENT',
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.showLabel?.value),
            },
          },
        ],
        [
          {
            name: 'yAxisName',
            config: {
              ...sharedControls.yAxisName,
              label: t('Value Title'),
              description: '',
            },
          },
        ],
        [
          {
            name: 'yAxisNameSize',
            config: {
              ...sharedControls.titleFontSize,
              label: t('Value Title Size'),
              description: '',
              default: 30,
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.yAxisName?.value),
            },
          },
        ],
        [
          {
            name: 'valueTitleFontWeight',
            config: {
              ...sharedControls.titleFontWeight,
              label: t('Value Title Font Weight'),
              description: '',
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.yAxisName?.value),
            },
          },
        ],

        ['yAxisFormat'],
        [
          {
            name: 'value_font_size',
            config: {
              type: 'SliderControl',
              label: t('Value Font size'),
              description: t('Font size for detail value'),
              renderTrigger: true,
              min: 12,
              max: 300,
              default: 50,
            },
          },
        ],
        [
          {
            name: 'valueFontWeight',
            config: {
              ...sharedControls.titleFontWeight,
              label: t('Value Font Weight'),
              description: '',
              visibility: () => true,
            },
          },
        ],
        [
          {
            name: 'numberDistance',
            config: {
              ...sharedControls.distance,
              label: t('Number Distance'),
              // 设置显示数字的垂直距离
              description: t(
                'Set the vertical distance of the displayed number.',
              ),
              min: -100,
              max: 100,
              default: 0,
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
            name: 'show_pointer',
            config: {
              type: 'CheckboxControl',
              label: t('Show pointer'),
              description: t('Whether to show the pointer'),
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
                !Boolean(
                  ['circle', 'digital'].includes(
                    controls?.chartType?.value as string,
                  ),
                ),
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
                !Boolean(
                  ['circle', 'digital'].includes(
                    controls?.chartType?.value as string,
                  ),
                ),
            },
          },
        ],
      ],
    },
  ],
  controlOverrides: {
    yAxisFormat: {
      label: t('Value format'),
      default: 'PRECENT',
      description: t(
        'Additional text to add before or after the value, e.g. unit',
      ),
    },
  },
};

export default config;
