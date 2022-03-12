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
import { t, ChartMetadata, ChartPlugin, Behavior } from 'src/core';
import controlPanel from './controlPanel';
import transformProps from './transformProps';
import thumbnail from './images/thumbnail.png';
import buildQuery from '../buildQuery';
import { EchartsGaugeChartProps, EchartsGaugeFormData } from '../types';

export default class EchartsNumberChartPlugin extends ChartPlugin<
  EchartsGaugeFormData,
  EchartsGaugeChartProps
> {
  constructor() {
    super({
      buildQuery,
      controlPanel,
      loadChart: () => import('../EchartsGauge'),
      metadata: new ChartMetadata({
        behaviors: [Behavior.INTERACTIVE_CHART],
        category: t('KPI'),
        credits: ['https://echarts.apache.org'],
        // 数字图最适合用来, 提醒大家注意KPI或你希望听众关注的一件事。
        description: t(
          'The number chart is best used to remind people of KPIs or the one thing you want your audience to focus on.',
        ),
        // exampleGallery: [{ url: demo1 }, { url: demo2 }],
        name: t('Number Chart'),
        tags: [t('ECharts'), t('Choiceform')],
        thumbnail,
      }),
      transformProps,
    });
  }
}