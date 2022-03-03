import { t } from 'src/core';
import { SharedControlConfig } from '../types';
import {
  D3_FORMAT_DOCS,
  D3_FORMAT_OPTIONS,
  DEFAULT_NUMBER_FORMAT,
  formatSelectOptions,
} from '../utils';

export const barBackground: SharedControlConfig<'CheckboxControl'> = {
  type: 'CheckboxControl',
  label: t('Bar Background'),
  renderTrigger: true,
  default: false,
  description: t('Enable the background of the bar.'),
};

export const yAxisLine: SharedControlConfig<'CheckboxControl'> = {
  name: 'y_axis_line',
  type: 'CheckboxControl',
  label: t('Y Axis Line'),
  renderTrigger: true,
  default: false,
  description: t('Show or hide the axis of Y-axis.'),
};

export const yAxisLabel: SharedControlConfig<'TextControl'> = {
  name: 'y_axis_label',
  type: 'TextControl',
  label: t('Y Axis Label'),
  renderTrigger: true,
  default: '',
  description: t('Y Axis Label'),
};

export const yAxis2Label: SharedControlConfig<'TextControl'> = {
  ...yAxisLabel,
  name: 'y_axis_2_label',
  label: t('Y Axis 2 Label'),
};

export const yAxisShowMinmax: SharedControlConfig<'CheckboxControl'> = {
  name: 'y_axis_showminmax',
  type: 'CheckboxControl',
  label: t('Maximum and minimum values for the Y axis'),
  renderTrigger: true,
  default: false,
  description: t('Whether to display the min and max values of the Y-axis'),
};

export const yAxis2ShowMinmax: SharedControlConfig<'CheckboxControl'> = {
  ...yAxisShowMinmax,
  name: 'y_axis_2_showminmax',
  label: t('Maximum and minimum values for the Y axis 2'),
  description: t('Whether to display the min and max values of the Y-axis 2'),
};

export const yAxisFormat: SharedControlConfig<'SelectControl'> = {
  type: 'SelectControl',
  label: t('Y Axis Format'),
  renderTrigger: true,
  default: DEFAULT_NUMBER_FORMAT,
  choices: D3_FORMAT_OPTIONS,
  description: D3_FORMAT_DOCS,
  mapStateToProps: state => {
    const showWarning = state.controls?.comparison_type?.value === 'percentage';
    return {
      warning: showWarning
        ? t(
            'When `Calculation type` is set to "Percentage change", the Y Axis' +
              ' Format is forced to `.1%`',
          )
        : null,
      disabled: showWarning,
    };
  },
};

export const yAxis2Format: SharedControlConfig<'SelectControl'> = {
  ...yAxisFormat,
  label: t('Y Axis 2 Format'),
  mapStateToProps: state => {
    const showWarning = state.controls?.comparison_type?.value === 'percentage';
    return {
      warning: showWarning
        ? t(
            'When `Calculation type` is set to "Percentage change", the Y Axis' +
              ' 2 Format is forced to `.1%`',
          )
        : null,
      disabled: showWarning,
    };
  },
};

export const yAxisBounds: SharedControlConfig<'BoundsControl'> = {
  name: 'y_axis_bounds',
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
};

export const yAxis2Bounds: SharedControlConfig<'BoundsControl'> = {
  ...yAxisBounds,
  name: 'y_axis_2_bounds',
  label: t('Y Axis 2 Bounds'),
  description: t(
    'Bounds for the Y-axis 2. When left empty, the bounds are ' +
      'dynamically defined based on the min/max of the data. Note that ' +
      "this feature will only expand the axis range. It won't " +
      "narrow the data's extent.",
  ),
};

export const xAxisLabel: SharedControlConfig<'TextControl'> = {
  name: 'x_axis_label',
  type: 'TextControl',
  label: t('X Axis Label'),
  renderTrigger: true,
  default: '',
};

export const xLabelLayout: SharedControlConfig<'SelectControl'> = {
  name: 'x_label_layout',
  type: 'SelectControl',
  label: t('X Axis Label Rotate'),
  choices: formatSelectOptions(['auto', '-90°', '-45°', '0°', '45°', '90°']),
  default: 'auto',
  clearable: false,
  renderTrigger: true,
  description: t(
    'Rotation degree of axis label, which is especially useful when there is no enough space for category axis.',
  ),
};
