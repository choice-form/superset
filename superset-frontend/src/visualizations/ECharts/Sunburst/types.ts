import type { ChartProps, QueryFormData } from 'src/core';
import type { EChartTransformedProps } from '../types';

export interface EChartsSunburstChartProps extends ChartProps {
  formData: QueryFormData;
}

export type EchartsSunburstTransformedProps = EChartTransformedProps<QueryFormData>;
