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
import { getMetricLabel } from 'src/core';
import type { DataRecord } from 'src/core';
import type { CustomFunnelProps } from '../types';

export default function transformProps(chartProps: CustomFunnelProps) {
  const { width, height, formData, queriesData } = chartProps;
  const data = queriesData[0].data as DataRecord[];
  const metricName = getMetricLabel(formData.metric);
  const shape = formData.shape || 'rect';
  const percentage = data[0][metricName];
  const {
    radius,
    layerShadow,
    titleText,
    titleFontColor,
    titleFontSize,
    titleFontWeight,
    layer1,
    layer2,
    layer3,
    layer4,
    layer5,
  } = formData;
  const model = [layer1, layer2, layer3, layer4, layer5].map(text =>
    (text ?? '').split('\\n'),
  );

  return {
    model,
    radius,
    layerShadow,
    titleText,
    titleFontColor,
    titleFontSize,
    titleFontWeight,
    width,
    height,
    metricName,
    percentage,
    shape,
  };
}
