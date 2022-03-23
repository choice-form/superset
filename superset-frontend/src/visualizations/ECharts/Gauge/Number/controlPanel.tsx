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
  ControlPanelConfig,
  emitFilterControl,
  sharedControls,
} from 'src/chartConntrols';
import { hexToRgba } from 'src/utils/colorUtils';

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
        [
          {
            name: 'description',
            config: {
              type: 'TextControl',
              label: t('Description'),
              renderTrigger: true,
              // 对显示的数字进行补充说明
              description: t('Additional explanation of the displayed number.'),
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
        ['titleFontSize'],
        ['titleFontColor'],
        ['titleFontWeight'],
        ['subTitleText'],
        ['subTitleFontSize'],
        ['subTitleFontColor'],
        ['subTitleFontWeight'],
        ['yAxisFormat'],
        [
          {
            name: 'numberFontColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('Number Font Color'),
              description: t('Set the text color for displaying number.'),
              default: hexToRgba('#1FA8C9'),
            },
          },
        ],
        [
          {
            name: 'numberFontSize',
            config: {
              type: 'SliderControl',
              label: t('Number Font size'),
              // 设置显示数字的文字大小
              description: t('Set the text size for displaying number.'),
              renderTrigger: true,
              min: 12,
              max: 500,
              default: 220,
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
            },
          },
        ],
        [
          {
            name: 'horizontalDistance',
            config: {
              ...sharedControls.distance,
              label: t('Horizontal Distance'),
              // 设置显示数字的横向距离
              description: t(
                'Set the horizontal distance of the displayed number.',
              ),
              min: 0,
              max: 100, // 百分比
              default: 0,
            },
          },
        ],
        [
          {
            name: 'descriptionFontColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('Description Font Color'),
              description: t('Font color for description.'),
              default: hexToRgba('#666'),
            },
          },
        ],
        [
          {
            name: 'descriptionFontSize',
            config: {
              type: 'SliderControl',
              label: t('Description Font size'),
              description: t('Font size for description.'),
              renderTrigger: true,
              min: 12,
              max: 100,
              default: 40,
            },
          },
        ],
        [
          {
            name: 'descriptionDistance',
            config: {
              ...sharedControls.distance,
              label: t('Description Distance'),
              min: -100,
              max: 100,
            },
          },
        ],
        [
          {
            name: 'descriptionHorizontalDistance',
            config: {
              ...sharedControls.distance,
              label: t('Description Horizontal Distance'),
              min: 0,
              max: 100, // 百分比
              default: 0,
            },
          },
        ],
      ],
    },
  ],
  controlOverrides: {
    yAxisFormat: {
      label: t('Number format'),
      default: 'PRECENT',
      description: t(
        'Additional text to add before or after the value, e.g. unit',
      ),
    },
  },
};

export default config;
