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
} from 'src/chartConntrols';
import { DEFAULT_FORM_DATA } from '../types';

const config: ControlPanelConfig = {
  controlPanelSections: [
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
        ['yAxisFormat'],
        ['valueFontColor'],
        [
          {
            name: 'value_font_size',
            config: {
              type: 'SliderControl',
              label: t('Value Font size'),
              description: t('Font size for detail value'),
              renderTrigger: true,
              min: 50,
              max: 500,
              default: 50,
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
