import React from 'react';
import { t } from 'src/core';

import {
  ControlPanelsContainerProps,
  ControlSetRow,
  sharedControls,
} from 'src/chartConntrols';
import { DEFAULT_LEGEND_FORM_DATA } from './types';

const { legendMargin, legendOrientation, legendType, showLegend } =
  DEFAULT_LEGEND_FORM_DATA;

const showLegendControl = {
  name: 'show_legend',
  config: {
    type: 'CheckboxControl',
    label: t('Show legend'),
    renderTrigger: true,
    default: showLegend,
    description: t('Whether to display a legend for the chart'),
  },
};

const legendTypeControl = {
  name: 'legendType',
  config: {
    type: 'SelectControl',
    freeForm: false,
    label: 'Type',
    choices: [
      ['scroll', 'Scroll'],
      ['plain', 'Plain'],
    ],
    default: legendType,
    renderTrigger: true,
    description: t('Legend type'),
    visibility: ({ controls }: ControlPanelsContainerProps) =>
      Boolean(controls?.show_legend?.value),
  },
};

const legendOrientationControl = {
  name: 'legendOrientation',
  config: {
    type: 'SelectControl',
    freeForm: false,
    label: 'Orientation',
    choices: [
      ['top', 'Top'],
      ['bottom', 'Bottom'],
      ['left', 'Left'],
      ['right', 'Right'],
    ],
    default: legendOrientation,
    renderTrigger: true,
    description: t('Legend type'),
    visibility: ({ controls }: ControlPanelsContainerProps) =>
      Boolean(controls?.show_legend?.value),
  },
};

const legendMarginControl = {
  name: 'legendMargin',
  config: {
    type: 'TextControl',
    label: t('Margin'),
    renderTrigger: true,
    isInt: true,
    default: legendMargin,
    description: t('Additional padding for legend.'),
    visibility: ({ controls }: ControlPanelsContainerProps) =>
      Boolean(controls?.show_legend?.value),
  },
};

export const legendSection = [
  [<h1 className="section-header">{t('Legend')}</h1>],
  [showLegendControl],
  [legendTypeControl],
  [legendOrientationControl],
  [legendMarginControl],
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
