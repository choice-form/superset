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

const { legendMargin, legendOrientation, legendType, showLegend } = DEFAULT_LEGEND_FORM_DATA;

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
    visibility: ({ controls }: ControlPanelsContainerProps) => Boolean(controls?.show_legend?.value),
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
    visibility: ({ controls }: ControlPanelsContainerProps) => Boolean(controls?.show_legend?.value),
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
    visibility: ({ controls }: ControlPanelsContainerProps) => Boolean(controls?.show_legend?.value),
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
    description: t('Shows a list of all series available at that point in time'),
  },
};

const tooltipSortByMetricControl = {
  name: 'tooltipSortByMetric',
  config: {
    type: 'CheckboxControl',
    label: t('Tooltip sort by metric'),
    renderTrigger: true,
    default: false,
    description: t('Whether to sort tooltip by the selected metric in descending order.'),
    visibility: ({ controls }: ControlPanelsContainerProps) => Boolean(controls?.rich_tooltip?.value),
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
    description: t('Only show the total value on the stacked chart, and not show on the selected category'),
    visibility: ({ controls }: ControlPanelsContainerProps) =>
      Boolean(controls?.show_value?.value) && Boolean(controls?.stack?.value),
  },
};

export const showValueSection = [[showValueControl], [stackControl], [onlyTotalControl]];

export const barStacked: CustomControlItem = {
  name: 'bar_stacked',
  config: {
    type: 'CheckboxControl',
    label: t('Stacked Bars'),
    renderTrigger: true,
    default: false,
    description: null,
  },
};

export const bottomMargin: CustomControlItem = {
  name: 'bottom_margin',
  config: {
    type: 'SelectControl',
    clearable: false,
    freeForm: true,
    label: t('Bottom Margin'),
    choices: formatSelectOptions(['auto', 0, 10, 20,  30, 40, 50, 60, 70, 80, 90, 100, 125, 150, 200]),
    default: 'auto',
    renderTrigger: true,
    description: t('Bottom margin, in pixels, allowing for more room for axis labels'),
  },
};

export const showBarValue: CustomControlItem = {
  name: 'show_bar_value',
  config: {
    type: 'CheckboxControl',
    label: t('Bar Values'),
    default: false,
    renderTrigger: true,
    description: t('Show the value on top of the bar'),
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

export const xAxisLabel: CustomControlItem = {
  name: 'x_axis_label',
  config: {
    type: 'TextControl',
    label: t('X Axis Label'),
    renderTrigger: true,
    default: '',
  },
};

export const xTicksLayout: CustomControlItem = {
  name: 'x_ticks_layout',
  config: {
    type: 'SelectControl',
    label: t('X Tick Layout'),
    choices: formatSelectOptions(['auto', 'flat', '45°', 'staggered']),
    default: 'auto',
    clearable: false,
    renderTrigger: true,
    description: t('The way the ticks are laid out on the X-axis'),
  },
};

export const yAxisBounds: CustomControlItem = {
  name: 'y_axis_bounds',
  config: {
    type: 'BoundsControl',
    label: t('Y Axis Bounds'),
    renderTrigger: true,
    default: [null, null],
    description: t(
      'Bounds for the Y-axis. When left empty, the bounds are ' +
        'dynamically defined based on the min/max of the data. Note that ' +
        "this feature will only expand the axis range. It won't " +
        "narrow the data's extent.",
    ),
  },
};

export const yAxisLabel: CustomControlItem = {
  name: 'y_axis_label',
  config: {
    type: 'TextControl',
    label: t('Y Axis Label'),
    renderTrigger: true,
    default: '',
  },
};

export const yAxisShowMinmax: CustomControlItem = {
  name: 'y_axis_showminmax',
  config: {
    type: 'CheckboxControl',
    label: t('Y bounds'),
    renderTrigger: true,
    default: false,
    description: t('Whether to display the min and max values of the Y-axis'),
  },
};
