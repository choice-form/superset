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

import {
  showLegendControl,
  legendModeControl,
  legendTypeControl,
  legendPaddingControl,
} from '../../controls';

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
        name: `adhocFilters${controlSuffix}`,
        config: sharedControls.adhoc_filters,
      },
    ],
    emitFilterControl.length > 0
      ? [
          {
            ...emitFilterControl[0],
            name: `emitFilter${controlSuffix}`,
          },
        ]
      : [],
    [
      {
        name: `orderDesc${controlSuffix}`,
        config: {
          type: 'CheckboxControl',
          label: t('Sort Descending'),
          default: false,
          description: t('Whether to sort descending or ascending'),
        },
      },
    ],
    [
      {
        name: `rowLimit${controlSuffix}`,
        config: {
          ...sharedControls.row_limit,
        },
      },
    ],
  ];
}

function createCustomizeSection(controlSuffix: string): ControlSetRow[] {
  return [
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
        ...createQuerySection('B'),
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        [<h1 className="section-header">{t('Legend')}</h1>],
        [showLegendControl],
        [legendModeControl],
        [legendTypeControl],
        [legendPaddingControl],
        [
          {
            name: 'tooltipFormat',
            config: {
              ...sharedControls.yAxisFormat,
              label: t('Tooltip Format'),
            },
          },
        ],
        ['showAxisPointer'],
        [<h1 className="section-header">{t('Bar Chart')}</h1>],
        ['barBackground'],
        ...createCustomizeSection(''),
        [<h1 className="section-header">{t('Line Chart')}</h1>],
        ['smooth'],
        ['symbol'],
        ['symbolSize'],
        ['symbolRotate'],
        ...createCustomizeSection('B'),
      ],
    },
    {
      label: t('X Axis'),
      expanded: true,
      controlSetRows: [['xAxisLabel'], ['xLabelLayout']],
    },
  ],
  controlOverrides: {},
};

export default config;
