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

import type { ControlPanelConfig, CustomControlItem } from 'src/chartConntrols';
import { D3_FORMAT_OPTIONS } from 'src/chartConntrols';
import { t } from 'src/core';
import { hexToRgba } from 'src/utils/colorUtils';

const showTitle: CustomControlItem = {
  name: 'showTitle',
  config: {
    type: 'CheckboxControl',
    label: t('Show Title'),
    default: true,
    renderTrigger: true,
  },
};

const mainTitle: CustomControlItem = {
  name: 'mainTitle',
  config: {
    type: 'TextControl',
    label: t('Main Title'),
    default: '',
    renderTrigger: true,
    visibility: ({ controls }) => !!controls.showTitle.value,
  },
};

const mainTitleTextColor: CustomControlItem = {
  name: 'mainTitleTextColor',
  config: {
    type: 'ColorPickerControl',
    label: t('Main Title Text Color'),
    default: hexToRgba('#333333'),
    renderTrigger: true,
    visibility: ({ controls }) => !!controls.showTitle.value,
  },
};

const mainTitleFontWeight: CustomControlItem = {
  name: 'mainTitleFontWeight',
  config: {
    type: 'SelectControl',
    label: t('Main Title Font Weight'),
    choices: [
      ['lighter', t('Lighter')],
      ['normal', t('Normal')],
      ['bold', t('Bold')],
    ],
    default: 'bold',
    renderTrigger: true,
    visibility: ({ controls }) => !!controls.showTitle.value,
  },
};

const mainTitleFontSize: CustomControlItem = {
  name: 'mainTitleFontSize',
  config: {
    type: 'SliderControl',
    label: t('Main Title Font Size'),
    min: 16,
    max: 48,
    default: 18,
    renderTrigger: true,
    visibility: ({ controls }) => !!controls.showTitle.value,
  },
};

const subTitle: CustomControlItem = {
  name: 'subTitle',
  config: {
    type: 'TextControl',
    label: t('Sub Title'),
    default: '',
    renderTrigger: true,
    visibility: ({ controls }) => !!controls.showTitle.value,
  },
};

const subTitleTextColor: CustomControlItem = {
  name: 'subTitleTextColor',
  config: {
    type: 'ColorPickerControl',
    label: t('Sub Title Text Color'),
    default: hexToRgba('#aaaaaa'),
    renderTrigger: true,
    visibility: ({ controls }) => !!controls.showTitle.value,
  },
};

const subTitleFontWeight: CustomControlItem = {
  name: 'subTitleFontWeight',
  config: {
    type: 'SelectControl',
    label: t('Sub Title Font Weight'),
    choices: [
      ['lighter', t('Lighter')],
      ['normal', t('Normal')],
      ['bold', t('Bold')],
    ],
    default: 'normal',
    renderTrigger: true,
    visibility: ({ controls }) => !!controls.showTitle.value,
  },
};

const subTitleFontSize: CustomControlItem = {
  name: 'subTitleFontSize',
  config: {
    type: 'SliderControl',
    label: t('Sub Title Font Size'),
    min: 12,
    max: 36,
    default: 12,
    renderTrigger: true,
    visibility: ({ controls }) => !!controls.showTitle.value,
  },
};

const radius: CustomControlItem = {
  name: 'radius',
  config: {
    type: 'SliderControl',
    label: t('Radius'),
    min: 1,
    max: 100,
    default: 50,
    renderTrigger: true,
  },
};

const liquidShape: CustomControlItem = {
  name: 'liquidShape',
  config: {
    type: 'SelectControl',
    label: t('Liquid Shape'),
    choices: [
      ['arrow', t('Arrow')],
      ['circle', t('Circle')],
      ['container', t('Fit')],
      ['diamond', t('Diamond')],
      ['pin', t('Liquid Pin')],
      ['rect', t('Rect')],
      ['roundRect', t('Round Rect')],
      ['triangle', t('Triangle')],
    ],
    default: 'circle',
    clearable: false,
    freeForm: false,
    renderTrigger: true,
  },
};

const showOutline: CustomControlItem = {
  name: 'showOutline',
  config: {
    type: 'CheckboxControl',
    label: t('Show Outline'),
    default: true,
    renderTrigger: true,
  },
};

const borderColor: CustomControlItem = {
  name: 'borderColor',
  config: {
    type: 'ColorPickerControl',
    label: t('Border Color'),
    default: hexToRgba('#294D99'),
    renderTrigger: true,
    visibility: ({ controls }) => !!controls.showOutline.value,
  },
};

const borderDistance: CustomControlItem = {
  name: 'borderDistance',
  config: {
    type: 'SliderControl',
    label: t('Border Distance'),
    min: 0,
    max: 64,
    default: 8,
    renderTrigger: true,
    visibility: ({ controls }) => !!controls.showOutline.value,
  },
};

const backgroundColor: CustomControlItem = {
  name: 'backgroundColor',
  config: {
    type: 'ColorPickerControl',
    label: t('Background Color'),
    default: hexToRgba('#E3F7FF'),
    renderTrigger: true,
  },
};

const waveColor: CustomControlItem = {
  name: 'waveColor',
  config: {
    type: 'ColorPickerControl',
    label: t('Wave Color'),
    default: hexToRgba('#294D99'),
    renderTrigger: true,
  },
};

const waveOpacity: CustomControlItem = {
  name: 'waveOpacity',
  config: {
    type: 'SliderControl',
    label: t('Wave Opacity'),
    min: 0,
    max: 1,
    step: 0.05,
    default: 0.95,
    renderTrigger: true,
  },
};

const waveAnimation: CustomControlItem = {
  name: 'waveAnimation',
  config: {
    type: 'CheckboxControl',
    label: t('Wave Animation'),
    default: true,
    renderTrigger: true,
  },
};

const waveDirection: CustomControlItem = {
  name: 'waveDirection',
  config: {
    type: 'SelectControl',
    label: t('Wave Direction'),
    choices: [
      ['left', t('Left')],
      ['right', t('Right')],
    ],
    default: 'right',
    renderTrigger: true,
    visibility: ({ controls }) => !!controls.waveAnimation.value,
  },
};

const valueFormat: CustomControlItem = {
  name: 'valueFormat',
  config: {
    type: 'SelectControl',
    label: t('Value Format'),
    choices: D3_FORMAT_OPTIONS,
    default: 'Not Decimal Precent',
    renderTrigger: true,
  },
};

const prefixText: CustomControlItem = {
  name: 'prefixText',
  config: {
    type: 'TextControl',
    label: t('Prefix Text'),
    default: '',
    renderTrigger: true,
  },
};

const suffixText: CustomControlItem = {
  name: 'suffixText',
  config: {
    type: 'TextControl',
    label: t('Suffix Text'),
    default: '',
    renderTrigger: true,
  },
};

const textFontColor: CustomControlItem = {
  name: 'textFontColor',
  config: {
    type: 'ColorPickerControl',
    label: t('Font Color'),
    default: hexToRgba('#FFFFFF'),
    renderTrigger: true,
  },
};

const textFontWeight: CustomControlItem = {
  name: 'textFontWeight',
  config: {
    type: 'SelectControl',
    label: t('Font Weight'),
    choices: [
      ['lighter', t('Lighter')],
      ['normal', t('Normal')],
      ['bold', t('Bold')],
    ],
    default: 'normal',
    renderTrigger: true,
  },
};

const textFontSize: CustomControlItem = {
  name: 'textFontSize',
  config: {
    type: 'SliderControl',
    label: t('Font Size'),
    min: 16,
    max: 96,
    default: 48,
    renderTrigger: true,
  },
};

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [['metrics']],
    },
    {
      label: t('Chart Options'),
      expanded: false,
      controlSetRows: [
        [showTitle],
        [mainTitle, mainTitleTextColor],
        [mainTitleFontSize, mainTitleFontWeight],
        [subTitle, subTitleTextColor],
        [subTitleFontSize, subTitleFontWeight],
      ],
    },
    {
      label: t('Liquid Fill Options'),
      expanded: true,
      controlSetRows: [
        [radius],
        [liquidShape],
        [backgroundColor, showOutline],
        [borderColor, borderDistance],
      ],
    },
    {
      label: t('Wave Options'),
      expanded: true,
      controlSetRows: [
        [waveColor, waveOpacity],
        [waveAnimation, waveDirection],
      ],
    },
    {
      label: t('Text Options'),
      expanded: true,
      controlSetRows: [
        [prefixText],
        [valueFormat],
        [suffixText],
        [textFontColor, textFontWeight],
        [textFontSize],
      ],
    },
  ],
};

export default config;
