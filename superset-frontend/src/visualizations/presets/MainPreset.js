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
import { isFeatureEnabled, Preset, FeatureFlag } from 'src/core';
import { DeckGLChartPreset } from '@superset-ui/legacy-preset-chart-deckgl';
import {
  SelectFilterPlugin,
  RangeFilterPlugin,
  TimeFilterPlugin,
  TimeColumnFilterPlugin,
  TimeGrainFilterPlugin,
  GroupByFilterPlugin,
} from 'src/filters/components';

// 正常显示的图
import EchartsBoxPlotChartPlugin from '../ECharts/BoxPlot';
import EchartsTimeseriesChartPlugin from '../ECharts/Timeseries';
import EchartsAreaChartPlugin from '../ECharts/Timeseries/Area';
import EchartsTimeseriesBarChartPlugin from '../ECharts/Timeseries/Regular/Bar';
import EchartsTimeseriesLineChartPlugin from '../ECharts/Timeseries/Regular/Line';
import EchartsTimeseriesScatterChartPlugin from '../ECharts/Timeseries/Regular/Scatter';
import EchartsTimeseriesSmoothLineChartPlugin from '../ECharts/Timeseries/Regular/SmoothLine';
import EchartsTimeseriesStepChartPlugin from '../ECharts/Timeseries/Step';
import EchartsPieChartPlugin from '../ECharts/Pie';
import EchartsTreeChartPlugin from '../ECharts/Tree';
import EchartsTreemapChartPlugin from '../ECharts/Treemap';
import EchartsGraphChartPlugin from '../ECharts/Graph';
import EchartsGaugeChartPlugin from '../ECharts/Gauge';
import EchartsRadarChartPlugin from '../ECharts/Radar';
import EchartsFunnelChartPlugin from '../ECharts/Funnel';
import EchartsMixedTimeseriesChartPlugin from '../ECharts/MixedTimeseries';

import FilterBoxChartPlugin from '../FilterBox';
import MapBoxChartPlugin from '../MapBoxChart';
import PairedTTestChartPlugin from '../PairedTTestChart';

import { WordCloudChartPlugin } from '../D3/WordCloud';
import TableChartPlugin from '../D3/TableChart';
import CalendarChartPlugin from '../D3/CalendarChart';
import ChordChartPlugin from '../D3/ChordChart';
import CountryMapChartPlugin from '../D3/CountryMapChart';
import ForceDirectedChartPlugin from '../D3/ForceDirectedChart';
import HeatmapChartPlugin from '../D3/HeatmapChart';
import HorizonChartPlugin from '../D3/HorizonChart';
import ParallelCoordinatesChartPlugin from '../D3/ParallelCoordinatesChart';
import PartitionChartPlugin from '../D3/PartitionChart';
import PivotTableChartPlugin from '../D3/PivotTableChart';
import SankeyChartPlugin from '../D3/SankeyChart';
import SankeyLoopChartPlugin from '../D3/SankeyLoopChart';
import SunburstChartPlugin from '../D3/SunburstChart';
import TreemapChartPlugin from '../D3/TreemapChart';
import WorldMapChartPlugin from '../D3/WorldMapChart';

import RoseChartPlugin from '../D3/Nvd3/RoseChart';
import {
  AreaChartPlugin,
  BarChartPlugin,
  BubbleChartPlugin,
  BulletChartPlugin,
  CompareChartPlugin,
  DistBarChartPlugin,
  DualLineChartPlugin,
  LineChartPlugin,
  LineMultiChartPlugin,
  TimePivotChartPlugin,
} from '../NVD3';

import HistogramChartPlugin from '../DataUI/HistogramChart';
import EventFlowChartPlugin from '../DataUI/EventFlowChart';
import TimeTableChartPlugin from '../DataUI/TimeTable';
import {
  BigNumberChartPlugin,
  BigNumberTotalChartPlugin,
} from '../DataUI/BigNumber';

import { PivotTableChartPlugin as PivotTableChartPluginV2 } from '../PivotTable';

export default class MainPreset extends Preset {
  constructor() {
    const experimentalplugins = isFeatureEnabled(
      FeatureFlag.DASHBOARD_FILTERS_EXPERIMENTAL,
    )
      ? [new GroupByFilterPlugin().configure({ key: 'filter_groupby' })]
      : [];

    super({
      name: 'Legacy charts',
      presets: [new DeckGLChartPreset()],
      plugins: [
        new AreaChartPlugin().configure({ key: 'area' }),
        new BarChartPlugin().configure({ key: 'bar' }),
        new BigNumberChartPlugin().configure({ key: 'big_number' }),
        new BigNumberTotalChartPlugin().configure({ key: 'big_number_total' }),
        new EchartsBoxPlotChartPlugin().configure({ key: 'box_plot' }),
        new BubbleChartPlugin().configure({ key: 'bubble' }),
        new BulletChartPlugin().configure({ key: 'bullet' }),
        new CalendarChartPlugin().configure({ key: 'cal_heatmap' }),
        new ChordChartPlugin().configure({ key: 'chord' }),
        new CompareChartPlugin().configure({ key: 'compare' }),
        new CountryMapChartPlugin().configure({ key: 'country_map' }),
        new DistBarChartPlugin().configure({ key: 'dist_bar' }),
        new DualLineChartPlugin().configure({ key: 'dual_line' }),
        new EventFlowChartPlugin().configure({ key: 'event_flow' }),
        new FilterBoxChartPlugin().configure({ key: 'filter_box' }),
        new EchartsFunnelChartPlugin().configure({ key: 'funnel' }),
        new EchartsTreeChartPlugin().configure({ key: 'tree_chart' }),
        new EchartsTreemapChartPlugin().configure({ key: 'treemap_v2' }),
        new EchartsGaugeChartPlugin().configure({ key: 'gauge_chart' }),
        new EchartsGraphChartPlugin().configure({ key: 'graph_chart' }),
        new EchartsRadarChartPlugin().configure({ key: 'radar' }),
        new EchartsMixedTimeseriesChartPlugin().configure({
          key: 'mixed_timeseries',
        }),
        new ForceDirectedChartPlugin().configure({
          key: 'force_directed_graph',
        }),
        new HeatmapChartPlugin().configure({ key: 'heatmap' }),
        new HistogramChartPlugin().configure({ key: 'histogram' }),
        new HorizonChartPlugin().configure({ key: 'horizon' }),
        new LineChartPlugin().configure({ key: 'line' }),
        new LineMultiChartPlugin().configure({ key: 'line_multi' }),
        new MapBoxChartPlugin().configure({ key: 'mapbox' }),
        new PairedTTestChartPlugin().configure({ key: 'paired_ttest' }),
        new ParallelCoordinatesChartPlugin().configure({ key: 'para' }),
        new PartitionChartPlugin().configure({ key: 'partition' }),
        new EchartsPieChartPlugin().configure({ key: 'pie' }),
        new PivotTableChartPlugin().configure({ key: 'pivot_table' }),
        new PivotTableChartPluginV2().configure({ key: 'pivot_table_v2' }),
        new RoseChartPlugin().configure({ key: 'rose' }),
        new SankeyChartPlugin().configure({ key: 'sankey' }),
        new SankeyLoopChartPlugin().configure({ key: 'sankey_loop' }),
        new SunburstChartPlugin().configure({ key: 'sunburst' }),
        new TableChartPlugin().configure({ key: 'table' }),
        new TimePivotChartPlugin().configure({ key: 'time_pivot' }),
        new TimeTableChartPlugin().configure({ key: 'time_table' }),
        new TreemapChartPlugin().configure({ key: 'treemap' }),
        new WordCloudChartPlugin().configure({ key: 'word_cloud' }),
        new WorldMapChartPlugin().configure({ key: 'world_map' }),
        new EchartsAreaChartPlugin().configure({
          key: 'echarts_area',
        }),
        new EchartsTimeseriesChartPlugin().configure({
          key: 'echarts_timeseries',
        }),
        new EchartsTimeseriesBarChartPlugin().configure({
          key: 'echarts_timeseries_bar',
        }),
        new EchartsTimeseriesLineChartPlugin().configure({
          key: 'echarts_timeseries_line',
        }),
        new EchartsTimeseriesSmoothLineChartPlugin().configure({
          key: 'echarts_timeseries_smooth',
        }),
        new EchartsTimeseriesScatterChartPlugin().configure({
          key: 'echarts_timeseries_scatter',
        }),
        new EchartsTimeseriesStepChartPlugin().configure({
          key: 'echarts_timeseries_step',
        }),
        new SelectFilterPlugin().configure({ key: 'filter_select' }),
        new RangeFilterPlugin().configure({ key: 'filter_range' }),
        new TimeFilterPlugin().configure({ key: 'filter_time' }),
        new TimeColumnFilterPlugin().configure({ key: 'filter_timecolumn' }),
        new TimeGrainFilterPlugin().configure({ key: 'filter_timegrain' }),
        ...experimentalplugins,
      ],
    });
  }
}
