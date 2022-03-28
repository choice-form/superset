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
  ControlPanelsContainerProps,
  legacySortBy,
  sharedControls,
} from 'src/chartConntrols';
import {
  chartOrientControl,
  legendModeControl,
  legendOrientationControl,
  legendPaddingControl,
  legendTypeControl,
  showLegendControl,
  themeType,
} from '../controls';
import { hexToRgba } from '../../../utils/colorUtils';

// @ts-ignore
const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metrics'],
        ['adhoc_filters'],
        ['row_limit'],
        ['groupby'],
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
        [chartOrientControl],
        ['showLabel'],
        [
          {
            name: 'showDataZoomY',
            config: {
              ...sharedControls.stacked,
              label: t('Data Zoom Y'),
              description: '',
              default: false,
            },
          },
        ],
        [
          {
            name: 'zoomStartY',
            config: {
              ...sharedControls.symbolSize,
              label: t('Start Value'),
              description: t('Default Value'),
              default: 0,
              min: 0,
              max: 100,
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.showDataZoomY?.value),
            },
          },
          {
            name: 'zoomEndY',
            config: {
              ...sharedControls.symbolSize,
              label: t('End Value'),
              description: t('Default Value'),
              default: 100,
              min: 0,
              max: 100,
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.showDataZoomY?.value),
            },
          },
        ],
        [
          {
            name: 'showDataZoomX',
            config: {
              ...sharedControls.stacked,
              label: t('Data Zoom X'),
              description: '',
              default: false,
            },
          },
        ],
        [
          {
            name: 'zoomStartX',
            config: {
              ...sharedControls.symbolSize,
              label: t('Start Value'),
              description: t('Default Value'),
              default: 0,
              min: 0,
              max: 100,
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.showDataZoomX?.value),
            },
          },
          {
            name: 'zoomEndX',
            config: {
              ...sharedControls.symbolSize,
              label: t('End Value'),
              description: t('Default Value'),
              default: 50,
              min: 0,
              max: 100,
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.showDataZoomX?.value),
            },
          },
        ],
        ['stacked'],
        ['showAreaChart'],
        ['areaLinearGradient'],
        [
          {
            name: 'startColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('Start Color'),
              description: '',
              default: hexToRgba('#1FA8C9'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.showAreaChart?.value) &&
                Boolean(controls?.areaLinearGradient?.value),
            },
          },
          {
            name: 'endColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('End Color'),
              description: '',
              default: hexToRgba('#1FA8C9'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.showAreaChart?.value) &&
                Boolean(controls?.areaLinearGradient?.value),
            },
          },
        ],
        ['smooth'],
        ['symbol'],
        ['symbolSize'],
        ['symbolRotate'],
        [
          {
            name: 'order_lines',
            config: {
              type: 'CheckboxControl',
              label: t('Sort Lines'),
              default: false,
              renderTrigger: true,
              description: t('Sort lines by category axis for label names.'),
            },
          },
        ],
        ['showAxisPointer'],
        [
          {
            name: 'showAverageLine',
            config: {
              type: 'CheckboxControl',
              label: t('Show Average Line'),
              renderTrigger: true,
              default: false,
            },
          },
        ],
        [
          {
            name: 'averageLineColor',
            config: {
              type: 'ColorPickerControl',
              label: t('Average Line Color'),
              renderTrigger: true,
              default: hexToRgba('0055FF'),
            },
          },
        ],
        [
          {
            name: 'averageLineType',
            config: {
              type: 'SelectControl',
              label: t('Average Line Type'),
              renderTrigger: true,
              choices: [
                ['solid', t('Solid')],
                ['dashed', t('Dashed')],
                ['dotted', t('Dotted')],
              ],
              default: 'dashed',
            },
          },
        ],
      ],
    },
    {
      label: t('Auto Padding'),
      expanded: false,
      controlSetRows: [
        ['useAutoPadding'],
        ['paddingTop'],
        ['paddingLeft'],
        ['paddingRight'],
        ['paddingBottom'],
      ],
    },
    {
      label: t('Legend'),
      expanded: false,
      controlSetRows: [
        [showLegendControl],
        [legendModeControl],
        [legendTypeControl],
        [legendOrientationControl],
        [legendPaddingControl],
      ],
    },
    {
      label: t('Value Axis'),
      expanded: false,
      controlSetRows: [
        ['yAxisLine'],
        ['yAxisFormat'],
        ['yAxisName'],
        [
          {
            name: 'yNameFontColor',
            config: {
              ...sharedControls.valueFontColor,
              label: t('Value axis name font color'),
              description: t('Font color of Value axis name.'),
            },
          },
        ],
        [
          {
            name: 'yAxisTick',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Value Axis Tick'),
              description: t('Value Axis Tick'),
              default: false,
            },
          },
        ],
        [
          {
            name: 'yAxisLabel',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Value Axis Label'),
              description: t('Value Axis Label'),
              default: true,
            },
          },
        ],
        [
          {
            name: 'ySplitLine',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Show Value Axis Split Line'),
              description: t('Show Value Axis Split Line'),
              default: false,
            },
          },
        ],
        ['yAxisShowMinmax'],
        ['yAxisBounds'],
      ],
    },
    {
      label: t('Category Axis'),
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
              label: t('Category Axis Tick'),
              description: t('Category Axis Tick'),
              default: false,
            },
          },
        ],
        [
          {
            name: 'xAxisLabel',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Show Category Axis Label'),
              description: t('Show Category Axis Label'),
              default: true,
            },
          },
        ],
        [
          {
            name: 'xSplitLine',
            config: {
              ...sharedControls.yAxisLine,
              label: t('Show Category Axis Split Line'),
              description: t('Show Category Axis Split Line'),
              default: false,
            },
          },
        ],
        [
          {
            name: 'xDistance',
            config: {
              ...sharedControls.distance,
              label: t('Category axis name distance'),
              description: t(
                'Distance between Category-axis name and boundary',
              ),
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
              label: t('Category axis name font color'),
              description: t('Font color of Category-axis name.'),
            },
          },
        ],
      ],
    },
  ],
  controlOverrides: {
    yAxisFormat: {
      label: t('Value Axis Format'),
    },
    yAxisLine: {
      label: t('Value Axis Line'),
      description: t('Show or hide the axis of Value-axis.'),
    },
    yAxisLabel: {
      label: t('Value Axis Label'),
      description: t('Value Axis Label'),
    },
    yAxisShowMinmax: {
      label: t('Maximum and minimum values for the Value axis'),
      description: t(
        'Whether to display the min and max values of the Value-axis',
      ),
    },
    yAxisBounds: {
      label: t('Value Axis Bounds'),
      description: t(
        'Bounds for the Value-axis. When left empty, the bounds are ' +
          'dynamically defined based on the min/max of the data. Note that ' +
          "this feature will only expand the axis range. It won't " +
          "narrow the data's extent.",
      ),
    },
    xLabelLayout: {
      label: t('Category Axis Label Rotate'),
    },
    groupby: {
      validators: [validateNonEmpty], // 非空校验
    },
    showAxisPointer: {
      default: true,
    },
  },
};

export default config;
