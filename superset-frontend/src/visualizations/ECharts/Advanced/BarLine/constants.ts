// @ts-ignore
import { DEFAULT_LEGEND_FORM_DATA, LegendOrientation, LegendType } from '../../types';
import { EchartsBarFormData } from './types';

export enum EchartsBarLabelType {
  Key = 'key',
  Value = 'value',
  Percent = 'percent',
  KeyValue = 'key_value',
  KeyPercent = 'key_percent',
  KeyValuePercent = 'key_value_percent',
}

// @ts-ignore
export const DEFAULT_FORM_DATA: EchartsBarFormData = {
  ...DEFAULT_LEGEND_FORM_DATA,
  donut: false,
  groupby: [],
  innerRadius: 30,
  labelLine: false,
  labelType: EchartsBarLabelType.Key,
  legendOrientation: LegendOrientation.Top,
  legendType: LegendType.Scroll,
  numberFormat: 'SMART_NUMBER',
  outerRadius: 70,
  showLabels: true,
  labelsOutside: true,
  showLabelsThreshold: 5,
  emitFilter: false,
  dateFormat: 'smart_date',
};
