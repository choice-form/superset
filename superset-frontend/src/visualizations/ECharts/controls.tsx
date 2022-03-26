import React from 'react';
import { t } from 'src/core';

import {
  ControlPanelsContainerProps,
  ControlSetRow,
  CustomControlItem,
  formatSelectOptions,
  sharedControls,
} from 'src/chartConntrols';
import { DEFAULT_LEGEND_FORM_DATA } from './types';

const { legendOrientation, legendType, showLegend } = DEFAULT_LEGEND_FORM_DATA;

export const themeType = {
  name: 'themeType',
  config: {
    type: 'SelectControl',
    label: t('Theme Type'),
    choices: [
      ['choiceForm', t('Primary')],
      ['ringPie', t('ringPie')],
      ['customBar', t('customBar')],
    ],
    default: 'choiceForm',
    clearable: false,
    renderTrigger: true,
    description: '',
  },
};

export const showLegendControl = {
  name: 'show_legend',
  config: {
    type: 'CheckboxControl',
    label: t('Show legend'),
    renderTrigger: true,
    default: showLegend,
    description: t('Whether to display a legend for the chart'),
  },
};

export const drilldown = {
  name: 'drilldown',
  config: {
    type: 'DrillDownControl',
    label: t('drill-down'),
    default: false,
    description: t('Enable drill-down query.'),
    mapStateToProps: ({ form_data }: any) => ({
      chartId: form_data?.slice_id || 0,
      columns: form_data.groupby,
      drilldown: form_data.drilldown,
    }),
    visibility: ({ form_data }: ControlPanelsContainerProps) =>
      !!form_data?.slice_id,
  },
};

export const chartOrientControl = {
  name: 'chartOrient',
  config: {
    type: 'SelectControl',
    label: t('Layout direction'),
    choices: [
      ['horizontal', t('horizontal')],
      ['vertical', t('vertical')],
    ],
    default: 'horizontal',
    renderTrigger: true,
    description: t('Select the layout direction of the chart.'),
  },
};

export const legendModeControl = {
  name: 'legendMode',
  config: {
    type: 'SelectControl',
    label: t('Select mode of legend'),
    choices: [
      ['multiple', t('Multiple')],
      ['single', t('Single')],
    ],
    default: 'multiple',
    renderTrigger: true,
    description: t(
      'Selected mode of legend, which controls whether series can be toggled displaying by clicking legends.',
    ),
    visibility: ({ controls }: ControlPanelsContainerProps) =>
      Boolean(controls?.show_legend?.value),
  },
};

export const legendTypeControl = {
  name: 'legendType',
  config: {
    type: 'SelectControl',
    label: t('Legend Type'),
    choices: [
      ['scroll', t('Scroll')],
      ['plain', t('Plain')],
    ],
    default: legendType,
    renderTrigger: true,
    description: t('Show Legend type'),
    visibility: ({ controls }: ControlPanelsContainerProps) =>
      Boolean(controls?.show_legend?.value),
  },
};

export const legendOrientationControl = {
  name: 'legendOrientation',
  config: {
    type: 'SelectControl',
    label: t('Legend Orientation'),
    choices: [
      ['top', t('Top')],
      ['bottom', t('Bottom')],
      ['left', t('Left')],
      ['right', t('Right')],
    ],
    default: legendOrientation,
    renderTrigger: true,
    description: t('Choose the orientation of the legend'),
    visibility: ({ controls }: ControlPanelsContainerProps) =>
      Boolean(controls?.show_legend?.value),
  },
};

export const legendPaddingControl = {
  name: 'legendPadding',
  config: {
    type: 'SliderControl',
    label: t('Legend Padding'),
    renderTrigger: true,
    min: 0,
    max: 100,
    step: 1,
    default: 5,
    description: t('Additional padding for legend.'),
    visibility: ({ controls }: ControlPanelsContainerProps) =>
      Boolean(controls?.show_legend?.value),
  },
};

export const legendSection = [
  [<h1 className="section-header">{t('Legend')}</h1>],
  [showLegendControl],
  [legendModeControl],
  [legendTypeControl],
  [legendOrientationControl],
  [legendPaddingControl],
];

const richTooltipControl = {
  name: 'rich_tooltip',
  config: {
    type: 'CheckboxControl',
    label: t('Rich tooltip'),
    renderTrigger: true,
    default: true,
    description: t(
      'Shows a list of all series available at that point in time',
    ),
  },
};

const tooltipSortByMetricControl = {
  name: 'tooltipSortByMetric',
  config: {
    type: 'CheckboxControl',
    label: t('Tooltip sort by metric'),
    renderTrigger: true,
    default: false,
    description: t(
      'Whether to sort tooltip by the selected metric in descending order.',
    ),
    visibility: ({ controls }: ControlPanelsContainerProps) =>
      Boolean(controls?.rich_tooltip?.value),
  },
};

const tooltipTimeFormatControl = {
  name: 'tooltipTimeFormat',
  config: {
    ...sharedControls.x_axis_time_format,
    label: t('Tooltip time format'),
    default: 'smart_date',
    clearable: false,
  },
};

export const richTooltipSection: ControlSetRow[] = [
  [<h1 className="section-header">{t('Tooltip')}</h1>],
  [richTooltipControl],
  [tooltipSortByMetricControl],
  [tooltipTimeFormatControl],
];

const showValueControl = {
  name: 'show_value',
  config: {
    type: 'CheckboxControl',
    label: t('Show Value'),
    default: false,
    renderTrigger: true,
    description: t('Show series values on the chart'),
  },
};

const stackControl = {
  name: 'stack',
  config: {
    type: 'CheckboxControl',
    label: t('Stack series'),
    renderTrigger: true,
    default: false,
    description: t('Stack series on top of each other'),
  },
};

const onlyTotalControl = {
  name: 'only_total',
  config: {
    type: 'CheckboxControl',
    label: t('Only Total'),
    default: true,
    renderTrigger: true,
    description: t(
      'Only show the total value on the stacked chart, and not show on the selected category',
    ),
    visibility: ({ controls }: ControlPanelsContainerProps) =>
      Boolean(controls?.show_value?.value) && Boolean(controls?.stack?.value),
  },
};

export const showValueSection = [
  [showValueControl],
  [stackControl],
  [onlyTotalControl],
];

export const bottomMargin: CustomControlItem = {
  name: 'bottom_margin',
  config: {
    type: 'SelectControl',
    clearable: false,
    freeForm: true,
    label: t('Bottom Margin'),
    choices: formatSelectOptions([
      'auto',
      0,
      10,
      20,
      30,
      40,
      50,
      60,
      70,
      80,
      90,
      100,
      125,
      150,
      200,
    ]),
    default: 'auto',
    renderTrigger: true,
    description: t(
      'Bottom margin, in pixels, allowing for more room for axis labels',
    ),
  },
};

export const showControls: CustomControlItem = {
  name: 'show_controls',
  config: {
    type: 'CheckboxControl',
    label: t('Extra Controls'),
    renderTrigger: true,
    default: false,
    description: t(
      'Whether to show extra controls or not. Extra controls ' +
        'include things like making mulitBar charts stacked ' +
        'or side by side.',
    ),
  },
};

export const labelRotateControl = {
  name: 'labelRotate',
  config: {
    type: 'SliderControl',
    label: t('Rotate Label'),
    description: t("Set the label's rotation angle."),
    renderTrigger: true,
    min: -90,
    max: 90,
    default: 0,
    visibility: ({ controls }: ControlPanelsContainerProps) =>
      Boolean(controls?.showLabel.value),
  },
};

export const hAlignLabelControl = {
  name: 'hAlignLabel',
  config: {
    type: 'SelectControl',
    clearable: false,
    freeForm: true,
    renderTrigger: true,
    label: t('Horizontal Align'),
    description: t('Horizontal label alignment'),
    choices: [
      ['left', t('Left')],
      ['center', t('Center')],
      ['right', t('Right')],
    ],
    default: 'center',
    visibility: ({ controls }: ControlPanelsContainerProps) =>
      Boolean(controls?.showLabel.value),
  },
};

export const vAlignLabelControl = {
  name: 'vAlignLabel',
  config: {
    type: 'SelectControl',
    clearable: false,
    freeForm: false,
    renderTrigger: true,
    label: t('Vertical Align'),
    description: t('Vertical label alignment'),
    choices: [
      ['top', t('Top')],
      ['middle', t('Middle')],
      ['bottom', t('Bottom')],
    ],
    default: 'middle',
    visibility: ({ controls }: ControlPanelsContainerProps) =>
      Boolean(controls?.showLabel.value),
  },
};

export const labelDistanceControl = {
  name: 'labelDistance',
  config: {
    type: 'SliderControl',
    renderTrigger: true,
    label: t('Label Distance'),
    description: t('Set the distance between label and shape.'),
    min: 0,
    max: 100,
    default: 10,
    visibility: ({ controls }: ControlPanelsContainerProps) =>
      Boolean(controls?.showLabel.value),
  },
};
