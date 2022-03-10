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
import { EChartsCoreOption } from 'echarts';
import {
  ChartDataResponseResult,
  ChartProps,
  QueryFormColumn,
  QueryFormData,
  SetDataMaskHook,
  DataRecordValue,
} from 'src/core';
import { EchartsLegendFormData, EchartsTitleFormData } from '../../types';

export type EchartsMixedLineBarFormData = QueryFormData & {
  // shared properties
  minorSplitLine: boolean;
  logAxis: boolean;
  logAxisSecondary: boolean;
  yAxisFormat: string;
  yAxisFormatSecondary?: string;
  yAxisTitleSecondary: string;
  yAxisBounds: [number | undefined | null, number | undefined | null];
  yAxisBoundsSecondary: [number | undefined | null, number | undefined | null];
  truncateYAxis: boolean;
  truncateYAxisSecondary: boolean;
  richTooltip: boolean;
  xAxisLabelRotation: number;
  // types specific to Query A and Query B
  area: boolean;
  areaB: boolean;
  opacity: number;
  opacityB: number;
  orderDesc: boolean;
  orderDescB: boolean;
  rowLimit: number;
  rowLimitB: number;
  showValue: boolean;
  showValueB: boolean;
  stack: boolean;
  stackB: boolean;
  yAxisIndex?: number;
  yAxisIndexB?: number;
  groupby: QueryFormColumn[];
  emitFilter: boolean;
  emitFilterB: boolean;
} & EchartsLegendFormData &
  EchartsTitleFormData;

export interface EchartsMixedLineBarProps extends ChartProps {
  formData: EchartsMixedLineBarFormData;
  queriesData: ChartDataResponseResult[];
}

export type EchartsMixedLineBarChartTransformedProps = {
  formData: EchartsMixedLineBarFormData;
  height: number;
  width: number;
  echartOptions: EChartsCoreOption;
  emitFilter: boolean;
  emitFilterB: boolean;
  setDataMask: SetDataMaskHook;
  groupby: QueryFormColumn[];
  labelMap: Record<string, DataRecordValue[]>;
  labelMapB: Record<string, DataRecordValue[]>;
  selectedValues: Record<number, string>;
};
