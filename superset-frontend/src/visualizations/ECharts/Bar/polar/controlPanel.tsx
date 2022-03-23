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
  legacySortBy,
  sharedControls,
} from 'src/chartConntrols';
import {
  showLegendControl,
  legendModeControl,
  legendTypeControl,
  legendOrientationControl,
  legendPaddingControl,
  themeType,
} from '../../controls';
import { hexToRgba } from '../../../../utils/colorUtils';

// @ts-ignore
const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['groupby'],
        ['metrics'],
        ['adhoc_filters'],
        ['row_limit'],
        ...legacySortBy,
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
        [showLegendControl],
        [legendModeControl],
        [legendTypeControl],
        [legendOrientationControl],
        [legendPaddingControl],
        ['showLabel'],
        [
          {
            name: 'labelFormat',
            config: {
              ...sharedControls.yAxisFormat,
              label: t('Label Format'),
              description: '',
            },
          },
        ],
      ],
    },
    {
      label: t('Out Axis'),
      expanded: false,
      controlSetRows: [
        [
          {
            name: 'outAxisLine',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Out Axis Line'),
              description: '',
              default: true,
            },
          },
        ],
        [
          {
            name: 'outAxisTick',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Out Axis Tick'),
              description: '',
              default: false,
            },
          },
        ],
        [
          {
            name: 'outAxisLabel',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Out Axis Label'),
              description: '',
              default: true,
            },
          },
        ],
        [
          {
            name: 'outSplitLine',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Out Axis Split Line'),
              description: '',
              default: false,
            },
          },
        ],
        [
          {
            name: 'outLabelFontSize',
            config: {
              ...sharedControls.distance,
              label: t('Out Axis Label Font Size'),
              description: '',
              min: 14,
              max: 50,
              default: 16,
            },
          },
        ],
        [
          {
            name: 'outLabelFontColor',
            config: {
              ...sharedControls.color_picker,
              label: t('Out Axis Label Font Color'),
              description: '',
              default: hexToRgba('#666666'),
            },
          },
        ],
      ],
    },
    {
      label: t('In Axis'),
      expanded: false,
      controlSetRows: [
        [
          {
            name: 'inAxisLine',
            config: {
              ...sharedControls.yAxisLine,
              label: t('In Axis Line'),
              description: '',
              default: false,
            },
          },
        ],
        [
          {
            name: 'inAxisFormat',
            config: {
              ...sharedControls.yAxisFormat,
              label: t('In Axis Format'),
              description: '',
            },
          },
        ],
        [
          {
            name: 'inAxisTick',
            config: {
              ...sharedControls.yAxisLine,
              label: t('In Axis Tick'),
              description: '',
              default: false,
            },
          },
        ],
        [
          {
            name: 'inAxisLabel',
            config: {
              ...sharedControls.yAxisLine,
              label: t('In Axis Label'),
              description: '',
              default: false,
            },
          },
        ],
        [
          {
            name: 'inSplitLine',
            config: {
              ...sharedControls.yAxisLine,
              label: t('In Axis Split Line'),
              description: '',
              default: true,
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
  },
};

export default config;
