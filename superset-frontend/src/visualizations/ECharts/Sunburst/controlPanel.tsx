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
import { hexToRgba } from '../../../utils/colorUtils';
import { themeType } from '../controls';

const showLabelOf = (type: string) => ({
  name: `${type}ShowLabel`,
  config: { ...sharedControls.showLabel, default: true },
});

const labelColorOf = (type: string) => ({
  name: `${type}LabelColor`,
  config: {
    ...sharedControls.valueFontColor,
    default: hexToRgba('#666666'),
    description: t('Set the text color of displaying label.'),
    label: t('Label Color'),
  },
});

const measureLabelFormat = {
  name: 'measureLabelFormat',
  config: {
    ...sharedControls.yAxisFormat,
    default: 'Not Decimal Precent',
    label: t('Label Format'),
  },
};

const titleOf = (type: string) => ({
  name: `${type}Title`,
  config: {
    ...sharedControls.titleText,
    label: type === 'main' ? t('Main Title') : t('Sub Title'),
  },
});

const titleSizeOf = (type: string, size?: number) => ({
  name: `${type}TitleSize`,
  config: {
    type: 'SliderControl',
    label: t('Title Size'),
    description: t('Set the text size for displaying title.'),
    renderTrigger: true,
    min: 16,
    max: 32,
    default: size ?? 20,
  },
});

const showTooltip = {
  name: 'showTooltip',
  config: {
    ...sharedControls.showLabel,
    description: t('Show a floating tooltip for displaying label and value.'),
    label: t('Show Tooltip'),
  },
};

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
        [titleOf('main')],
        [titleSizeOf('main')],
        [titleOf('sub')],
        [titleSizeOf('sub', 18)],
        [showTooltip],
      ],
    },
    {
      label: t('Dimension Options'),
      expanded: true,
      controlSetRows: [[showLabelOf('dimension'), labelColorOf('dimension')]],
    },
    {
      label: t('Measure Options'),
      expanded: true,
      controlSetRows: [
        [showLabelOf('measure'), labelColorOf('measure')],
        [measureLabelFormat],
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
