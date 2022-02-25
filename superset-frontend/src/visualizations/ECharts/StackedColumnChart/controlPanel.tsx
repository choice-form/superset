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
import { ControlPanelConfig, sections } from 'src/chartConntrols';

import {
  barStacked,
  bottomMargin,
  showBarValue,
  showLegendControl,
  xAxisLabel,
  xLabelLayout,
  yAxisBounds,
  yAxisLabel,
  yAxisShowMinmax,
} from '../controls';

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metrics'],
        ['adhoc_filters'],
        ['groupby'],
        ['row_limit'],
        ['timeseries_limit_metric'],
        [
          {
            name: 'order_desc',
            config: {
              type: 'CheckboxControl',
              label: t('Sort Descending'),
              default: true,
              description: t('Whether to sort descending or ascending'),
            },
          },
        ],
        [
          {
            name: 'contribution',
            config: {
              type: 'CheckboxControl',
              label: t('Contribution'),
              default: false,
              description: t('Compute the contribution to the total'),
            },
          },
        ],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme'],
        [showLegendControl],
        [showBarValue],
        [barStacked],
        [
          {
            name: 'order_bars',
            config: {
              type: 'CheckboxControl',
              label: t('Sort Bars'),
              default: false,
              renderTrigger: true,
              description: t('Sort bars by x labels.'),
            },
          },
        ],
      ],
    },
    {
      label: t('Y Axis'),
      expanded: true,
      controlSetRows: [['y_axis_format'], [yAxisLabel], [yAxisShowMinmax], [yAxisBounds]],
    },
    {
      label: t('X Axis'),
      expanded: true,
      controlSetRows: [[xAxisLabel], [bottomMargin], [xLabelLayout]],
    },
  ],
  controlOverrides: {
    groupby: {
      label: t('Series'),
      multi: false,
      description: '',
      validators: [validateNonEmpty],
    },
  },
};

export default config;
