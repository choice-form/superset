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
import { groups as D3Groups } from 'd3-array';
import type { EChartsCoreOption } from 'echarts';
import { getNumberFormatter, QueryFormMetric } from 'src/core';
import { rgbToHex } from 'src/utils/colorUtils';
import type {
  EChartsSunburstChartProps,
  EchartsSunburstTransformedProps,
} from './types';

function fromRecursively(data: [any, any[]][], nameKey: string): any {
  return data.map(entry => {
    if (Array.isArray(entry)) {
      const [key, values] = entry;
      return { name: key, children: fromRecursively(values, nameKey) };
    }
    return { name: entry[nameKey], ...(entry as {}) };
  });
}

function attachValues(data: any, valueKey: string) {
  return data.map((datum: any) => {
    if (datum.children) {
      attachValues(datum.children, valueKey);
      // eslint-disable-next-line no-param-reassign
      datum.value = datum.children.reduce(
        (final: number, child: any) => final + child.value,
        0,
      );
    } else {
      // eslint-disable-next-line no-param-reassign
      datum.value = datum[valueKey];
    }
    return datum;
    // const value = datum.children ? datum.children.reduce((sum, child) => sum + child.value, 0) : datum.value;
    // return { ...datum, value };
  });
}

function groups(data: any, keys: string[], valueKey: string) {
  const nameKey = keys[keys.length - 1];
  // const [nameKey] = keys.splice(keys.length - 1);
  const mappings = keys.map(key => (datum: any) => datum[key]);

  return attachValues(
    // @ts-expect-error
    // 这里的错误源自于旧版本的 @types/d3-array 的类型声明不够准确
    fromRecursively(D3Groups(data, ...mappings), nameKey),
    valueKey,
  );
}

export default function transformProps(
  chartProps: EChartsSunburstChartProps,
): EchartsSunburstTransformedProps {
  const { formData, height, hooks, queriesData, width } = chartProps;

  // 取维度键名
  const { groupby, metrics } = formData;
  const groupKeys = (groupby ?? [])
    .map(column => (typeof column === 'string' ? column : column.label))
    .filter(Boolean) as string[];

  // 取度量键名
  const metric = metrics?.[0] as QueryFormMetric;
  const valueKey =
    typeof metric === 'string' ? metric : (metric.label as string);

  const { r, g, b } = formData.measureLabelColor;
  const formatValue = getNumberFormatter(formData.measureLabelFormat);
  const echartOptions: EChartsCoreOption = {
    series: {
      data: groups(queriesData[0].data, groupKeys, valueKey),
      emphasis: { focus: 'ancestor' },
      itemStyle: { borderWidth: 1 },
      label: {
        show: formData.dimensionShowLabel,
        color: rgbToHex(r, g, b),
        formatter: ({ data, name, value }: any) =>
          Array.isArray(data.children) ? name : `${formatValue(value)}`,
        rotate: 'radial',
      },
      levels: [null, ...groupKeys, metric].map((level, index, levels) => {
        if (level === null) return {}; // 为下钻点预留的层

        if (index !== levels.length - 1) {
          if (index === levels.length - 2) {
            return { r: '90%' }; // 倒数第二层
          }
          return {}; // 其他中间层
        }

        // 最后一层
        return {
          label: {
            color: rgbToHex(r, g, b),
            fontWeight: 'bold',
            rotate: 'tangential',
            show: formData.measureShowLabel,
          },
          r0: '90%',
        };
      }),
      radius: ['0%', '100%'],
      type: 'sunburst',
    },
    title: {
      show: formData.mainTitle || formData.subTitle,
      text: formData.mainTitle,
      textStyle: { fontSize: formData.mainTitleSize },
      subtext: formData.subTitle,
      subtextStyle: { fontSize: formData.subTitleSize },
    },
    tooltip: {
      show: formData.showTooltip,
      trigger: 'item',
      valueFormatter: (value: number) => formatValue(value),
    },
  };

  const { setDataMask = () => {} } = hooks;

  return {
    echartOptions,
    formData,
    // @ts-expect-error
    groupby,
    height,
    selectedValues: [],
    setDataMask,
    width,
  };
}
