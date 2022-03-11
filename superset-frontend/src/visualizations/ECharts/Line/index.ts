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
import { Behavior, ChartMetadata, ChartPlugin, t } from 'src/core';
import buildQuery from './buildQuery';
import controlPanel from './controlPanel';
import transformProps from './transformProps';
import example1 from './images/demo1.png';
import example2 from './images/demo2.png';
import example3 from './images/demo3.png';
import example4 from './images/demo4.png';
import thumbnail from './images/thumbnail.png';
import { EchartsLineChartProps, EchartsLineFormData } from './types';

export default class LineChartPlugin extends ChartPlugin<
  EchartsLineFormData,
  EchartsLineChartProps
> {
  /**
   * The constructor is used to pass relevant metadata and callbacks that get
   * registered in respective registries that are used throughout the library
   * and application. A more thorough description of each property is given in
   * the respective imported file.
   *
   * It is worth noting that `buildQuery` and is optional, and only needed for
   * advanced visualizations that require either post processing operations
   * (pivoting, rolling aggregations, sorting etc) or submitting multiple queries.
   */
  constructor() {
    super({
      buildQuery,
      controlPanel,
      loadChart: () => import('./EchartsBar'),
      metadata: new ChartMetadata({
        behaviors: [Behavior.INTERACTIVE_CHART], // INTERACTIVE_CHART 表示创建图表，搜索图表的时候，可以搜索到。
        category: t('Evolution'),
        credits: ['https://echarts.apache.org'],
        description: t(
          'Broken line chart relates all the data points symbol by broken lines, which is used to show the trend of data changing. It could be used in both rectangular coordinate andpolar coordinate.',
        ),
        exampleGallery: [
          { url: example1 },
          { url: example3 },
          { url: example2 },
          { url: example4 },
        ],
        name: t('Line Chart'),
        tags: [t('ECharts')],
        thumbnail,
        useLegacyApi: true,
      }),
      transformProps,
    });
  }
}
