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
import { getFontSize } from '../utils/chart';
import { toRGBA } from '../utils/colors';
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
      datum._value = datum.children.reduce(
        (final: number, child: any) => final + child._value,
        0,
      );
    } else {
      // eslint-disable-next-line no-param-reassign
      datum.value = 1;
      // eslint-disable-next-line no-param-reassign
      datum._value = datum[valueKey];
    }
    return datum;
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

  const data = groups(queriesData[0].data, groupKeys, valueKey);
  const formatValue = getNumberFormatter(formData.measureLabelFormat);
  const echartOptions: EChartsCoreOption = {
    series: {
      data,
      emphasis: { focus: 'none' },
      itemStyle: { borderWidth: 1 },
      label: {
        color: toRGBA(formData.dimensionLabelColor),
        fontWeight: 'bold',
        formatter: ({ data: { children, _value }, name }: any) =>
          Array.isArray(children) ? name : `${formatValue(_value)}`,
        rotate: 'tangential',
        show: formData.dimensionShowLabel,
        textBorderColor: 'transparent',
        textBorderWidth: 1,
      },
      levels: [null, ...groupKeys, metric].map((level, index, levels) => {
        if (level === null) return {}; // 为下钻点预留的层

        if (index !== levels.length - 1) {
          if (index === levels.length - 2) {
            return { label: { rotate: 'radial' }, r: '90%' }; // 倒数第二层
          }
          return {}; // 其他中间层
        }

        // 最后一层
        return {
          label: {
            color: toRGBA(formData.measureLabelColor),
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
      textStyle: { fontSize: getFontSize(formData.mainTitleSize, width, 50) },
      subtext: formData.subTitle,
      subtextStyle: { fontSize: getFontSize(formData.subTitleSize, width, 50) },
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
