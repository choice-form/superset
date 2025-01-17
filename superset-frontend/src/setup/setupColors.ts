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
import airbnb from 'src/core/color/colorSchemes/categorical/airbnb';
import categoricalD3 from 'src/core/color/colorSchemes/categorical/d3';
import echarts from 'src/core/color/colorSchemes/categorical/echarts';
import google from 'src/core/color/colorSchemes/categorical/google';
import lyft from 'src/core/color/colorSchemes/categorical/lyft';
import preset from 'src/core/color/colorSchemes/categorical/preset';
import sequentialCommon from 'src/core/color/colorSchemes/sequential/common';
import sequentialD3 from 'src/core/color/colorSchemes/sequential/d3';
import {
  CategoricalScheme,
  getCategoricalSchemeRegistry,
  getSequentialSchemeRegistry,
  SequentialScheme,
} from 'src/core';
import superset from 'src/core/color/colorSchemes/categorical/superset';
import ColorSchemeRegistry from 'src/core/color/ColorSchemeRegistry';

function registerColorSchemes(
  registry: ColorSchemeRegistry<unknown>,
  colorSchemes: (CategoricalScheme | SequentialScheme)[],
  standardDefaultKey: string,
) {
  colorSchemes.forEach(scheme => {
    registry.registerValue(scheme.id, scheme);
  });

  const defaultKey =
    colorSchemes.find(scheme => scheme.isDefault)?.id || standardDefaultKey;
  registry.setDefaultKey(defaultKey);
}

export default function setupColors(
  extraCategoricalColorSchemes: CategoricalScheme[] = [],
  extraSequentialColorSchemes: SequentialScheme[] = [],
) {
  registerColorSchemes(
    // @ts-ignore
    getCategoricalSchemeRegistry(),
    [
      ...superset,
      ...airbnb,
      ...categoricalD3,
      ...echarts,
      ...google,
      ...lyft,
      ...preset,
      ...extraCategoricalColorSchemes,
    ],
    'supersetColors',
  );
  registerColorSchemes(
    // @ts-ignore
    getSequentialSchemeRegistry(),
    [...sequentialCommon, ...sequentialD3, ...extraSequentialColorSchemes],
    'superset_seq_1',
  );
}
