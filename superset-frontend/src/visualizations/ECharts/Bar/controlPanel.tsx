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
import { ControlPanelConfig } from 'src/chartConntrols';
import { bottomMargin, chartOrientControl, legendSection } from '../controls';

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
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['barBackground'],
        [chartOrientControl],
        ...legendSection,
        ['showLabel'],
        ['stacked'],
        ['stackedPrecent'],
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
        ['showAxisPointer'],
        [bottomMargin],
      ],
    },
    {
      label: t('Value Axis'),
      expanded: true,
      controlSetRows: [
        ['yAxisLine'],
        ['yAxisFormat'],
        ['yAxisLabel'],
        ['yAxisShowMinmax'],
        ['yAxisBounds'],
      ],
    },
    {
      label: t('Category Axis'),
      expanded: true,
      controlSetRows: [['xAxisLabel'], ['xLabelLayout']],
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
    xAxisLabel: {
      label: t('Category Axis Label'),
    },
    xLabelLayout: {
      label: t('Category Axis Label Rotate'),
    },
    groupby: {
      validators: [validateNonEmpty], // 非空校验
    },
    color_scheme: {
      default: 'echarts5Colors', // 默认使用echarts5配色
    },
  },
};

export default config;