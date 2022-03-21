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
        name: `yAxisName${controlSuffix}`,
        config: {
          ...sharedControls.yAxisName,
        },
      },
    ],
    [
      {
        name: `yNameFontColor${controlSuffix}`,
        config: {
          ...sharedControls.valueFontColor,
        },
      },
    ],
    [
      {
        name: `yAxisTick${controlSuffix}`,
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
        name: `yAxisLabel${controlSuffix}`,
        config: {
          ...sharedControls.yAxisLine,
          label: t('Y Axis Label'),
          description: t('Y Axis Label'),
          default: true,
        },
      },
    ],
    [
      {
        name: `ySplitLine${controlSuffix}`,
        config: {
          ...sharedControls.yAxisLine,
          label: t('Show Y Axis Split Line'),
          description: t('Show Y Axis Split Line'),
          default: false,
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
        [<h1 className="section-header">{t('Bar Chart')}</h1>],
        ...createQuerySection(''),
        [
          {
            name: 'noSort',
            config: {
              type: 'CheckboxControl',
              label: t('No Sort'),
              default: true,
              description: t('Not using sorting operations'), // 不使用排序操作
            },
          },
        ],
        [
          {
            name: 'legacy_order_by',
            config: {
              ...sharedControls.legacy_order_by,
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                !Boolean(controls?.noSort?.value),
            },
          },
        ],
        [
          {
            name: 'order_desc',
            config: {
              type: 'CheckboxControl',
              label: t('Sort descending'),
              default: true,
              description: t(
                'Whether to sort descending or ascending. Takes effect only when "Sort by" is set',
              ),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                !Boolean(controls?.noSort?.value),
            },
          },
        ],
        [<h1 className="section-header">{t('Line Chart')}</h1>],
        ...createQuerySection('B'),
        // [
        //   {
        //     name: 'noSortB',
        //     config: {
        //       type: 'CheckboxControl',
        //       label: t('No Sort'),
        //       default: true,
        //       description: t('Not using sorting operations'), // 不使用排序操作
        //     },
        //   },
        // ],
        // [
        //   {
        //     name: 'legacy_order_by_b',
        //     config: {
        //       ...sharedControls.legacy_order_by,
        //       visibility: ({ controls }: ControlPanelsContainerProps) =>
        //         !Boolean(controls?.noSortB?.value),
        //     },
        //   },
        // ],
        // [
        //   {
        //     name: 'order_desc_b',
        //     config: {
        //       type: 'CheckboxControl',
        //       label: t('Sort descending'),
        //       default: true,
        //       description: t(
        //         'Whether to sort descending or ascending. Takes effect only when "Sort by" is set',
        //       ),
        //       visibility: ({ controls }: ControlPanelsContainerProps) =>
        //         !Boolean(controls?.noSortB?.value),
        //     },
        //   },
        // ],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [['showAxisPointer']],
    },
    {
      label: t('Legend'),
      expanded: false,
      controlSetRows: [
        [showLegendControl],
        [legendModeControl],
        [legendTypeControl],
        [legendPaddingControl],
      ],
    },
    {
      label: t('Bar Chart'),
      expanded: false,
      controlSetRows: [
        ['barBackground'],
        [
          {
            name: 'barWidth',
            config: {
              ...sharedControls.distance,
              label: t('Bar Width'),
              description: '',
              renderTrigger: true,
              min: 0,
              max: 500,
              default: 0, // 0就是自动宽度
            },
          },
        ],
        ...createCustomizeSection(''),
      ],
    },
    {
      label: t('Line Chart'),
      expanded: false,
      controlSetRows: [
        ['smooth'],
        ['symbol'],
        ['symbolSize'],
        ['symbolRotate'],
        ...createCustomizeSection('B'),
      ],
    },
    {
      label: t('X Axis'),
      expanded: false,
      controlSetRows: [
        ['xLabelLayout'],
        ['xAxisLine'],
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
              label: t('X axis name distance'),
              description: t('Distance between X-axis name and boundary'),
              min: 0,
              max: 100,
              default: 0,
            },
          },
        ],
        [
          {
            name: 'xNameFontColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('X axis name font color'),
              description: t('Font color of X-axis name.'),
            },
          },
        ],
      ],
    },
  ],
  controlOverrides: {
    groupby: {
      validators: [validateNonEmpty],
    },
  },
};

export default config;
