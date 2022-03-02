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
    visibility: ({ form_data }: ControlPanelsContainerProps) => !!form_data?.slice_id,
  },
};

const legendTypeControl = {
  name: 'legendType',
  config: {
    type: 'SelectControl',
    freeForm: false,
    label: t('Legend Type'),
    choices: [
      ['scroll', t('Scroll')],
      ['plain', t('Plain')],
    ],
    default: legendType,
    renderTrigger: true,
    description: t('Show Legend type'),
    visibility: ({ controls }: ControlPanelsContainerProps) => Boolean(controls?.show_legend?.value),
  },
};

const legendOrientationControl = {
  name: 'legendOrientation',
  config: {
    type: 'SelectControl',
    freeForm: false,
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
    visibility: ({ controls }: ControlPanelsContainerProps) => Boolean(controls?.show_legend?.value),
  },
};

const legendPaddingControl = {
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
    visibility: ({ controls }: ControlPanelsContainerProps) => Boolean(controls?.show_legend?.value),
  },
};

export const legendSection = [
  [<h1 className="section-header">{t('Legend')}</h1>],
  [showLegendControl],
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
    choices: formatSelectOptions(['auto', 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 125, 150, 200]),
    default: 'auto',
    renderTrigger: true,
    description: t('Bottom margin, in pixels, allowing for more room for axis labels'),
  },
};

export const showBarValue: CustomControlItem = {
  name: 'show_bar_value',
  config: {
    type: 'CheckboxControl',
    label: t('Show Bar Values'),
    default: false,
    renderTrigger: true,
    description: t('Show the value on top of the bar'),
  },
};

export const showAxisPointer: CustomControlItem = {
  name: 'show_axis_pointer',
  config: {
    type: 'CheckboxControl',
    label: t('Axis Pointer'), // 坐标轴指示器
    default: true,
    renderTrigger: true,
    description: t('Show Axis Pointer'),
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

export const xLabelLayout: CustomControlItem = {
  name: 'x_label_layout',
  config: {
    type: 'SelectControl',
    label: t('X Axis Label Rotate'),
    choices: formatSelectOptions(['auto', '-90°', '-45°', '0°', '45°', '90°']),
    default: 'auto',
    clearable: false,
    renderTrigger: true,
    description: t(
      'Rotation degree of axis label, which is especially useful when there is no enough space for category axis.',
    ),
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

export const yAxis2Bounds: CustomControlItem = {
  name: 'y_axis_2_bounds',
  config: {
    type: 'BoundsControl',
    label: t('Y Axis 2 Bounds'),
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

export const yAxis2Label: CustomControlItem = {
  name: 'y_axis_2_label',
  config: {
    type: 'TextControl',
    label: t('Y Axis 2 Label'),
    renderTrigger: true,
    default: '',
  },
};

export const yAxisShowMinmax: CustomControlItem = {
  name: 'y_axis_showminmax',
  config: {
    type: 'CheckboxControl',
    label: t('Maximum and minimum values for the Y axis'),
    renderTrigger: true,
    default: false,
    description: t('Whether to display the min and max values of the Y-axis'),
  },
};

export const yAxis2ShowMinmax: CustomControlItem = {
  name: 'y_axis_2_showminmax',
  config: {
    type: 'CheckboxControl',
    label: t('Maximum and minimum values for the Y axis 2'),
    renderTrigger: true,
    default: false,
    description: t('Whether to display the min and max values of the Y-axis'),
  },
};
