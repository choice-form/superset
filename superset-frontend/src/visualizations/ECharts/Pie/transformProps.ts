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
import { CategoricalColorNamespace, getNumberFormatter, NumberFormats, NumberFormatter } from 'src/core';
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

const percentFormatter = getNumberFormatter(NumberFormats.PERCENT_2_POINT);

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
  const { name: rawName = '', value, percent } = params;
  const name = sanitizeName ? sanitizeHtml(rawName) : rawName;
  const formattedValue = numberFormatter(value as number);
  const formattedPercent = percentFormatter((percent as number) / 100);

  switch (labelType) {
    case EchartsPieLabelType.Key:
      return name;
    case EchartsPieLabelType.Value:
      return formattedValue;
    case EchartsPieLabelType.Percent:
      return formattedPercent;
    case EchartsPieLabelType.KeyValue:
      return `${name}: ${formattedValue}`;
    case EchartsPieLabelType.KeyValuePercent:
      return `${name}: ${formattedValue} (${formattedPercent})`;
    case EchartsPieLabelType.KeyPercent:
      return `${name}: ${formattedPercent}`;
    default:
      return name;
  }
}

export default function transformProps(chartProps: EchartsPieChartProps): PieChartTransformedProps {
  const { formData, height, hooks, filterState, queriesData, width } = chartProps;

  const {
    colorScheme,
    donut,
    groupby,
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
    // showLabelsThreshold,
    emitFilter,
  }: EchartsPieFormData = {
    ...DEFAULT_LEGEND_FORM_DATA,
    ...DEFAULT_PIE_FORM_DATA,
    ...formData,
  };

  // console.log('chartProps:', chartProps);

  const { metric_label, data } = queriesData[0].data;

  const labelMap = {};
  data.forEach(({ name }) => {
    if (!Object.keys(labelMap).includes(name)) {
      labelMap[name] = name.split(',').map(o => o.trim());
    }
  });

  const { setDataMask = () => {} } = hooks;

  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const numberFormatter = getNumberFormatter(numberFormat);

  const transformedData = data.map(row => ({
    ...row,
    itemStyle: {
      color: colorFn(row.name),
    },
  }));

  const selectedValues = (filterState.selectedValues || []).reduce(
    (acc: Record<string, number>, selectedValue: string) => {
      const index = transformedData.findIndex(({ name }) => name === selectedValue);
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
      radius: donut ? [`${donut ? innerRadius : 0}%`, `${outerRadius}%`] : `${outerRadius}%`,
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
      data: transformedData,
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

  const echartOptions: EChartsCoreOption = {
    grid: {
      ...defaultGrid,
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
    series,
  };

  return {
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
