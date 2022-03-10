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
  ControlSetRow,
  emitFilterControl,
  sharedControls,
} from 'src/chartConntrols';
import { DEFAULT_FORM_DATA } from '../../MixedTimeseries/types';
import {
  bottomMargin,
  chartOrientControl,
  legendSection,
} from '../../controls';

const { orderDesc, rowLimit } = DEFAULT_FORM_DATA;

function createQuerySection(controlSuffix: string) {
  return [
    [
      {
        name: `metrics${controlSuffix}`,
        config: sharedControls.metrics,
      },
    ],
    [
      {
        name: `adhoc_filters${controlSuffix}`,
        config: sharedControls.adhoc_filters,
      },
    ],
    emitFilterControl.length > 0
      ? [
          {
            ...emitFilterControl[0],
            name: `emit_filter${controlSuffix}`,
          },
        ]
      : [],
    [
      {
        name: `order_desc${controlSuffix}`,
        config: {
          type: 'CheckboxControl',
          label: t('Sort Descending'),
          default: orderDesc,
          description: t('Whether to sort descending or ascending'),
        },
      },
    ],
    [
      {
        name: `row_limit${controlSuffix}`,
        config: {
          ...sharedControls.row_limit,
          default: rowLimit,
        },
      },
    ],
  ];
}

function createCustomizeSection(
  label: string,
  controlSuffix: string,
): ControlSetRow[] {
  return [
    [<h1 className="section-header">{label}</h1>],
    [
      {
        name: `showLabel${controlSuffix}`,
        config: {
          ...sharedControls.showLabel,
        },
      },
    ],
    [
      {
        name: `stacked${controlSuffix}`,
        config: {
          ...sharedControls.stacked,
        },
      },
    ],
    [
      {
        name: `yAxisLine${controlSuffix}`,
        config: {
          ...sharedControls.yAxisLine,
        },
      },
    ],
    [
      {
        name: `yAxisFormat${controlSuffix}`,
        config: {
          ...sharedControls.yAxisFormat,
        },
      },
    ],
    [
      {
        name: `yAxisLabel${controlSuffix}`,
        config: {
          ...sharedControls.yAxisLabel,
        },
      },
    ],
    [
      {
        name: `yAxisShowMinmax${controlSuffix}`,
        config: {
          ...sharedControls.yAxisShowMinmax,
        },
      },
    ],
    [
      {
        name: `yAxisBounds${controlSuffix}`,
        config: {
          ...sharedControls.yAxisBounds,
        },
      },
    ],
  ];
}

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['groupby'],
        [<p className="section-header">{t('Bar Chart')}</p>],
        ...createQuerySection(''),
        [<p className="section-header">{t('Line Chart')}</p>],
        ...createQuerySection('_b'),
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        [chartOrientControl],
        ...legendSection,
        ['showAxisPointer'],

        [<p className="section-header">{t('Bar')}</p>],
        ['barBackground'],
        ['stackedPrecent'],
        ...createCustomizeSection(t('Query Bar'), ''),

        [<p className="section-header">{t('Line')}</p>],
        ['showAreaChart'],
        ['areaLinearGradient'],
        ['smooth'],
        ...createCustomizeSection(t('Query Line'), 'B'),
      ],
    },
    {
      label: t('Category Axis'),
      expanded: true,
      controlSetRows: [['xAxisLabel'], ['xLabelLayout'], [bottomMargin]],
    },
  ],
  controlOverrides: {},
};

export default config;
