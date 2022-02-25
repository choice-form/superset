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
import { ChartDataResponseResult, ChartProps, QueryFormColumn, QueryFormData, SetDataMaskHook } from 'src/core';
import { EchartsLegendFormData } from '../types';
import { EchartsBarLabelType } from './constants';

export type EchartsBarFormData = EchartsLegendFormData & {
  colorScheme?: string;
  currentOwnValue?: string[] | null;
  donut: boolean;
  defaultValue?: string[] | null;
  groupby: QueryFormColumn[];
  metrics: { label: string }[];
  innerRadius: number;
  labelLine: boolean;
  labelType: EchartsBarLabelType;
  labelsOutside: boolean;
  metric?: string;
  outerRadius: number;
  showLabels: boolean;
  numberFormat: string;
  dateFormat: string;
  showLabelsThreshold: number;
  xAxisLabel: string; // X轴名称
  yAxisLabel: string; // Y轴名称
} & QueryFormData;

export type EchartsBarQueriesData = {
  data: { columns: string[]; records: any[] };
}[] &
  ChartDataResponseResult[];

export interface EchartsBarChartProps extends ChartProps {
  formData: EchartsBarFormData;
  queriesData: EchartsBarQueriesData;
}

export interface BarChartTransformedProps {
  formData: EchartsBarFormData;
  height: number;
  width: number;
  echartOptions: EChartsCoreOption;
  setDataMask: SetDataMaskHook;
  groupby: QueryFormColumn[];
  selectedValues: Record<number, string>;
}
