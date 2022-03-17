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
import { getNumberFormatter, NumberFormatter, DrillDown, t } from 'src/core';
import { CallbackDataParams } from 'echarts/types/src/util/types';
import { EChartsCoreOption } from 'echarts';
import {
  DEFAULT_FORM_DATA as DEFAULT_PIE_FORM_DATA,
  EchartsPieChartProps,
  EchartsPieFormData,
  EchartsPieLabelType,
  PieChartTransformedProps,
} from './types';
import { DEFAULT_LEGEND_FORM_DATA, LegendOrientation } from '../types';
import { sanitizeHtml } from '../utils/series';
import { defaultGrid, defaultTooltip } from '../defaults';

export function formatPieLabel({
  params,
  labelType,
  numberFormatter,
  sanitizeName = false,
}: {
  params: Pick<CallbackDataParams, 'name' | 'value' | 'percent'>;
  labelType: EchartsPieLabelType;
  numberFormatter: NumberFormatter;
  sanitizeName?: boolean;
}): string {
  const { name: rawName = '', value } = params;
  const name = sanitizeName ? sanitizeHtml(rawName) : rawName;
  const formattedValue = numberFormatter(value as number);

  switch (labelType) {
    case EchartsPieLabelType.Key:
      return name;
    case EchartsPieLabelType.Value:
      return formattedValue;
    case EchartsPieLabelType.KeyValue:
      return `${name}: ${formattedValue}`;
    default:
      return name;
  }
}

export default function transformProps(
  chartProps: EchartsPieChartProps,
): PieChartTransformedProps {
  const {
    ownState,
    formData,
    height,
    hooks,
    filterState,
    queriesData,
    width,
  } = chartProps;

  const {
    // colorScheme, // echarts 图表不使用自定义配色
    donut,
    groupby: hierarchyOrColumns,
    drilldown,
    innerRadius,
    labelsOutside,
    labelLine,
    labelType,
    legendPadding,
    legendOrientation,
    legendType,
    numberFormat,
    outerRadius,
    showLabels,
    showLegend,
    sliceId,
    // showLabelsThreshold,
    emitFilter,
  }: EchartsPieFormData = {
    ...DEFAULT_LEGEND_FORM_DATA,
    ...DEFAULT_PIE_FORM_DATA,
    ...formData,
  };

  // console.log('chartProps:', chartProps);
  const groupby: any[] =
    drilldown && ownState?.drilldown
      ? [DrillDown.getColumn(ownState.drilldown, [])]
      : hierarchyOrColumns;

  const { metric_label, data } = queriesData[0].data;

  const labelMap = {};
  data.forEach(({ name }) => {
    if (!Object.keys(labelMap).includes(name)) {
      labelMap[name] = name.split(',').map(o => o.trim());
    }
  });

  const { setDataMask = () => {} } = hooks;

  // const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const numberFormatter = getNumberFormatter(numberFormat);

  // const transformedData = data.map(row => ({
  //   ...row,
  //   // itemStyle: {
  //   //   color: colorFn(row.name),
  //   // },
  // }));

  const selectedValues = (filterState.selectedValues || []).reduce(
    (acc: Record<string, number>, selectedValue: string) => {
      const index = data.findIndex(({ name }) => name === selectedValue);
      return {
        ...acc,
        [index]: selectedValue,
      };
    },
    {},
  );

  const formatter = (params: CallbackDataParams) =>
    formatPieLabel({
      params,
      numberFormatter,
      labelType,
    });

  // 饼图的通用配置
  const pieSeries = {
    type: 'pie', // 饼图
    emphasis: {
      scaleSize: 12,
      label: {
        show: showLabels,
        fontWeight: 'bold',
      },
      labelLine: {
        show: labelsOutside && labelLine,
      },
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
    // 是否启用防止标签重叠策略，
    avoidLabelOverlap: true,
  };

  // 标签配置
  const pieLabels = labelsOutside
    ? {
        position: 'outer',
        alignTo: 'none',
      }
    : {
        position: 'inner',
      };

  const series = [
    {
      ...pieSeries,
      name: metric_label,
      // 饼图显示区域
      radius: donut
        ? [`${donut ? innerRadius : 0}%`, `${outerRadius}%`]
        : `${outerRadius}%`,
      // 小于这个角度（0 ~ 360）的扇区，不显示标签（label 和 labelLine）。
      // 5.3.0 存在BUG，标签不显示的时候，标签线仍然会显示，所以暂时不开启该功能。
      // minShowLabelAngle: (showLabelsThreshold || 0) * 3.6,
      // 视觉引导线,
      labelLine: {
        show: labelsOutside && labelLine,
      },
      // 标签
      label: {
        show: showLabels,
        formatter,
        ...pieLabels,
      },
      data,
    },
  ];

  // 图例的位置布局方式
  let legendPosition = {};
  // eslint-disable-next-line default-case
  switch (legendOrientation) {
    case LegendOrientation.Right:
      legendPosition = { orient: 'vertical', top: 'center', right: 'right' };
      break;
    case LegendOrientation.Top:
      legendPosition = { top: 'top' };
      break;
    case LegendOrientation.Left:
      legendPosition = { orient: 'vertical', left: 'left', top: 'center' };
      break;
    case LegendOrientation.Bottom:
      legendPosition = { bottom: 'bottom' };
  }
  // 图例的内边距
  if (typeof legendPadding === 'number') {
    legendPosition = { ...legendPosition, padding: legendPadding };
  }

  const resetDataMask = () => {
    setDataMask(
      {
        ownState: {
          drilldown: DrillDown.fromHierarchy(hierarchyOrColumns as string[]),
        },
      },
      true,
    );
  };

  const drillUp = () => {
    const data = DrillDown.rollUp(ownState.drilldown);
    setDataMask({ ownState: { drilldown: data } }, true);
  };

  const toolbox =
    !!drilldown && !!sliceId
      ? {
          toolbox: {
            top: '2%',
            right: '5%',
            itemGap: 15,
            feature: {
              myTool2: {
                show: true,
                title: t('drill-up'),
                icon:
                  'path://M809.74592 413.38112a23.04 23.04 0 0 1 0.04096 32.54272 23.04 23.04 0 0 1-32.58368 0.07936L511.35488 181.44768 246.8352 445.9648a23.04 23.04 0 0 1-32.58368 0 23.04 23.04 0 0 1 0-32.58368L495.0144 132.6208a23.04 23.04 0 0 1 32.54528-0.04096L809.7024 413.34016z' +
                  ' M488.96 876.0832V147.9168a23.04 23.04 0 0 1 23.04-23.04 23.04 23.04 0 0 1 23.04 23.04v728.1664a23.04 23.04 0 0 1-23.04 23.04 23.04 23.04 0 0 1-23.04-23.04z',
                onclick: drillUp,
              },
              myTool1: {
                show: true,
                title: t('Reset drill-down'),
                icon:
                  'path://M517.76768 856.82176c-280.2048' +
                  ' 0-313.43616-254.87616-313.73568-257.45152a23.04 23.04 0 0 1 45.76-5.4144c1.13408 9.23136 29.57568 216.78336 267.97568 216.78336 240.64 0 277.70624-208.896 279.16544-217.79712a23.04 23.04 0 1 1 45.47072 7.46752c-0.41984 2.56768-45.33504 256.41216-324.63616 256.41216z M351.26528 602.92864a23.04 23.04 0 0 1 8.4608 31.424 23.04 23.04 0 0 1-31.45216 8.50944L219.66336 580.5056l-62.4384 108.14208a23.04 23.04 0 0 1-31.47264 8.43264 23.04 23.04 0 0 1-8.43264-31.47264l73.93024-128.04608a23.04 23.04 0 0 1 31.424-8.4608l128.54272 73.79712z' +
                  ' M204.35968 450.36288a23.05792 23.05792 0 0' +
                  ' 1-22.76608-26.7776c0.41984-2.56 45.32992-256.4096 324.63104-256.4096 280.2048 0 313.44128 254.87616 313.7408 257.45152a23.04 23.04 0 0 1-45.75488 5.44256c-1.08544-8.85248-29.3504-216.81152-267.98592-216.81152-240.64 0-277.70112 208.896-279.16032 217.79712a23.04 23.04 0 0 1-22.70464 19.30752z M672.73216 421.07648a23.04 23.04 0 0 1-8.4608-31.424 23.04 23.04 0 0 1 31.45216-8.50944l108.61568 62.35392 62.4384-108.1472a23.04 23.04 0 0 1 31.47264-8.43264 23.04 23.04 0 0 1 8.43264 31.47264l-73.93024 128.0512a23.04 23.04 0 0 1-31.424 8.4608l-128.54784-73.79712z',
                onclick: resetDataMask,
              },
            },
          },
        }
      : {};

  // 图形grid位置计算
  const gridLayout = {};
  if (showLegend) {
    gridLayout['top'] = '10%';
  }

  const echartOptions: EChartsCoreOption = {
    grid: {
      ...defaultGrid,
      ...gridLayout,
    },
    tooltip: {
      ...defaultTooltip,
      trigger: 'item',
      formatter: (params: any) => {
        const tip = formatPieLabel({
          params,
          numberFormatter,
          labelType: EchartsPieLabelType.KeyValuePercent,
          sanitizeName: true,
        });
        return `<span style="font-size: 16px;font-weight: bold;color: #000;">${params.seriesName}</span>
                  <br /><span style="color: ${params.color};font-size: 14px">●</span>
                  <span style="font-weight: bold;font-size: 14px;color: #000;">${tip}</span>`;
      },
    },
    legend: {
      show: showLegend,
      type: legendType === 'scroll' ? 'scroll' : 'plain',
      ...legendPosition,
    },
    ...toolbox,
    series,
  };

  return {
    ownState,
    formData,
    width,
    height,
    echartOptions,
    setDataMask,
    emitFilter,
    labelMap,
    groupby,
    selectedValues,
  };
}
