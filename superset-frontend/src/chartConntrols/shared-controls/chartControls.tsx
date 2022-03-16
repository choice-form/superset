import { t } from 'src/core';
import { hexToRgba } from 'src/utils/colorUtils';
import { ControlPanelsContainerProps, SharedControlConfig } from '../types';
import {
  D3_FORMAT_DOCS,
  D3_FORMAT_OPTIONS,
  DEFAULT_NUMBER_FORMAT,
  formatSelectOptions,
} from '../utils';

// 图表标题文本
export const titleText: SharedControlConfig<'TextControl'> = {
  type: 'TextControl',
  label: t('Title Text'),
  description: t('Set the text of the title'),
  renderTrigger: true,
  default: '',
};
// 图表的标题字体大小
export const TitleFontSize: SharedControlConfig<'SliderControl'> = {
  type: 'SliderControl',
  label: t('Title Font Size'),
  description: t('Set the font size of the title'),
  renderTrigger: true,
  min: 16,
  max: 100,
  default: 22,
  visibility: ({ controls }: ControlPanelsContainerProps) =>
    Boolean(controls?.titleText?.value),
};
// 图表的标题字体颜色
export const TitleFontColor: SharedControlConfig<'ColorPickerControl'> = {
  type: 'ColorPickerControl',
  label: t('Title Font Color'),
  description: t('Set the font color of the title'),
  renderTrigger: true,
  default: hexToRgba('#333'),
  visibility: ({ controls }: ControlPanelsContainerProps) =>
    Boolean(controls?.titleText?.value),
};

// 环形宽度: 仪表盘进度条的宽度
export const ringWidth: SharedControlConfig<'SliderControl'> = {
  type: 'SliderControl',
  label: t('Ring Width'),
  description: t('Ring Width'),
  renderTrigger: true,
  min: 20,
  max: 200,
  default: 20,
};
// 值颜色
export const valueFontColor: SharedControlConfig<'ColorPickerControl'> = {
  type: 'ColorPickerControl',
  label: t('Value Font Color'),
  description: t('Set the font color of the value.'),
  renderTrigger: true,
  default: hexToRgba('#464646'),
};

// 显示图形上的文本标签
export const showLabel: SharedControlConfig<'CheckboxControl'> = {
  type: 'CheckboxControl',
  label: t('Show Label'),
  default: true,
  renderTrigger: true,
  description: t(
    'Text label of , to explain some data information about graphic item like value, name and so on.',
  ),
};

// 调整间距的值（一般用于两个元素之间的距离调节, 默认是百分比的计算值）
export const distance: SharedControlConfig<'SliderControl'> = {
  type: 'SliderControl',
  label: t('Distance'),
  description: t('Distance'),
  renderTrigger: true,
  min: -100,
  max: 100,
  default: 0,
};

// 显示面积图
export const showAreaChart: SharedControlConfig<'CheckboxControl'> = {
  type: 'CheckboxControl',
  label: t('Show Area Chart'),
  renderTrigger: true,
  default: false,
  description: t(
    'Area fill style. The settings are displayed as an area chart.',
  ),
};
// 面积图的线性渐变
export const areaLinearGradient: SharedControlConfig<'CheckboxControl'> = {
  type: 'CheckboxControl',
  label: t('Area Linear Gradient'),
  renderTrigger: true,
  default: false,
  description: t('Area map with linear gradient effect on.'),
  visibility: ({ controls }: ControlPanelsContainerProps) =>
    Boolean(controls?.showAreaChart?.value),
};

// 平滑, 折线图
export const smooth: SharedControlConfig<'CheckboxControl'> = {
  type: 'CheckboxControl',
  label: t('Smooth'),
  renderTrigger: true,
  default: true,
  description: t('Whether to show as smooth curve.'),
};

// 折线图上，线节点的标记
export const symbol: SharedControlConfig<'SelectControl'> = {
  type: 'SelectControl',
  label: t('Node Symbol'),
  choices: [
    ['emptyCircle', t('emptyCircle')],
    ['circle', t('circle')],
    ['rect', t('rect')],
    ['roundRect', t('roundRect')],
    ['triangle', t('triangle')],
    ['diamond', t('diamond')],
    ['arrow', t('arrow')],
    ['none', t('none')],
  ],
  default: 'emptyCircle',
  clearable: false,
  renderTrigger: true,
  description: t('Node symbol of the line.'),
};
// 标记的大小
export const symbolSize: SharedControlConfig<'SliderControl'> = {
  type: 'SliderControl',
  label: t('Symbol Size'),
  renderTrigger: true,
  min: 4,
  max: 50,
  step: 1,
  default: 4,
  description: t('Resize of symbols.'),
  visibility: ({ controls }: ControlPanelsContainerProps) =>
    Boolean(controls?.symbol?.value !== 'none'),
};
// 标记的旋转角度
export const symbolRotate: SharedControlConfig<'SliderControl'> = {
  type: 'SliderControl',
  label: t('Symbol Rotate'),
  renderTrigger: true,
  min: -180,
  max: 180,
  step: 1,
  default: 0,
  description: t(
    'Rotate degree of symbol. The negative value represents clockwise. Note that when symbol is set to be arrow in markLine, symbolRotate value will be ignored, and compulsively use tangent angle.',
  ),
  visibility: ({ controls }: ControlPanelsContainerProps) =>
    Boolean(controls?.symbol?.value !== 'none'),
};

export const stacked: SharedControlConfig<'CheckboxControl'> = {
  type: 'CheckboxControl',
  label: t('Stacked'),
  renderTrigger: true,
  default: false,
  description: null,
};

export const stackedPrecent: SharedControlConfig<'CheckboxControl'> = {
  type: 'CheckboxControl',
  label: t('Show Stacked Precent'),
  renderTrigger: true,
  default: false,
  description: null,
  visibility: ({ controls }: ControlPanelsContainerProps) =>
    Boolean(controls?.stacked?.value),
};

export const showAxisPointer: SharedControlConfig<'CheckboxControl'> = {
  type: 'CheckboxControl',
  label: t('Axis Pointer'), // 坐标轴指示器
  default: true,
  renderTrigger: true,
  description: t('Show Axis Pointer'),
};

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

export const yAxisName: SharedControlConfig<'TextControl'> = {
  name: 'y_axis_name',
  type: 'TextControl',
  label: t('Y Axis Name'),
  renderTrigger: true,
  default: '',
  description: t('Y Axis Name'),
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

export const xAxisLine: SharedControlConfig<'CheckboxControl'> = {
  name: 'x_axis_line',
  type: 'CheckboxControl',
  label: t('X Axis Line'),
  renderTrigger: true,
  default: true,
  description: t('Show or hide the axis of X-axis.'),
};

export const xAxisFormat: SharedControlConfig<'SelectControl'> = {
  type: 'SelectControl',
  label: t('X Axis Format'),
  renderTrigger: true,
  default: DEFAULT_NUMBER_FORMAT,
  choices: D3_FORMAT_OPTIONS,
  description: D3_FORMAT_DOCS,
};

export const xAxisName: SharedControlConfig<'TextControl'> = {
  type: 'TextControl',
  label: t('X Axis Label'),
  renderTrigger: true,
  default: t('X Axis Label'),
};

export const xAxisLabel: SharedControlConfig<'TextControl'> = {
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
