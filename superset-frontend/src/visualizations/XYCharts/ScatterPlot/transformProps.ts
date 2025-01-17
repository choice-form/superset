/*
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

import { pick } from 'lodash';
import { ChartProps } from 'src/core';
import { HookProps } from '../components/ScatterPlot/ScatterPlot';

export default function transformProps(chartProps: ChartProps) {
  const { width, height, formData, queriesData } = chartProps;
  const { encoding, margin, theme } = formData;
  const { data } = queriesData[0];
  const hooks = chartProps.hooks as HookProps;

  const fieldsFromHooks: (keyof HookProps)[] = [
    'TooltipRenderer',
    'LegendRenderer',
    'LegendGroupRenderer',
    'LegendItemRenderer',
    'LegendItemMarkRenderer',
    'LegendItemLabelRenderer',
  ];

  return {
    data,
    width,
    height,
    encoding,
    margin,
    theme,
    ...pick(hooks, fieldsFromHooks),
  };
}
