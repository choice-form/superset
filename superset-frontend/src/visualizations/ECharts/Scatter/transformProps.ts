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

import { NumberFormatter, getNumberFormatter } from 'src/core';
import { CallbackDataParams } from 'echarts/types/src/util/types';
import {
  DEFAULT_FORM_DATA as DEFAULT_RADAR_FORM_DATA,
  EchartsChartProps,
  EchartsFormData,
  ChartTransformedProps,
} from './types';
import { EchartsLabelType } from './constants';
import { DEFAULT_LEGEND_FORM_DATA } from '../types';
import { rgbToHex } from '../../../utils/colorUtils';
import { getFontSize } from '../utils/chart';

export function formatLabel({
  params,
  labelType,
  numberFormatter,
}: {
  params: CallbackDataParams;
  labelType: EchartsLabelType;
  numberFormatter: NumberFormatter;
}): string {
  const { name = '', value } = params;
  const formattedValue = numberFormatter(value as number);

  switch (labelType) {
    case EchartsLabelType.Value:
      return formattedValue;
    case EchartsLabelType.KeyValue:
      return `${name}: ${formattedValue}`;
    default:
      return name;
  }
}

export default function transformProps(
  chartProps: EchartsChartProps,
): ChartTransformedProps {
  const {
    formData,
    height,
    hooks,
    // filterState,
    queriesData,
    width,
  } = chartProps;

  const {
    titleText,
    titleFontSize,
    titleFontColor,
    groupby,
    // metrics = [],
    numberFormat,
    showLabels, // 显示标签
    averageLine, // 平均线
    yAverageLineTitle,
    yValueSuffix,
    xAverageLineTitle,
    xValueSuffix,

    yAxisLabel, // Y轴名称
    yAxisLine, // 是否显示Y轴的轴线
    yAxisFormat, // Y轴的格式化类
    yLabelFontColor,

    xAxisFormat, // X轴的格式化类
    xAxisLabel, // X轴名称
    xDistance,
    xLabelFontColor,
  }: EchartsFormData = {
    ...DEFAULT_LEGEND_FORM_DATA,
    ...DEFAULT_RADAR_FORM_DATA,
    ...formData,
  };
  const { setDataMask = () => {} } = hooks;

  console.log('chartProps:', chartProps);

  const { data, coltypes } = queriesData[0];

  const firstData = data[0];
  const colIdx = coltypes.indexOf(0);
  // 取出指标数组
  const metrics = Object.keys(firstData).splice(
    colIdx,
    Object.keys(firstData).length,
  );
  const names = Object.keys(firstData).splice(0, colIdx);
  console.log('metrics:', metrics, names);

  // 气泡列表
  const list: any[] = [];
  // 气泡对应的标签
  const labels: object = {};
  data.forEach((raw: object, idx) => {
    // 取最大值
    const vals: number[] = Object.values(raw).splice(colIdx, metrics.length);
    let name = '';
    names.forEach((col, index) => {
      if (index === 0) {
        name += raw[col];
      } else {
        name += `,${raw[col]}`;
      }
    });
    // 构建气泡的数据
    list.push(vals);
    // 标签数据
    labels[vals.join(',')] = name;
  });

  console.log('labels:', labels);
  console.log('list:', list);
  // const coltypeMapping = getColtypesMapping(queriesData[0]);

  // const selectedValues = (filterState.selectedValues || []).reduce(
  //   (acc: Record<string, number>, selectedValue: string) => {
  //     const index = transformedData.findIndex(
  //       ({ name }) => name === selectedValue,
  //     );
  //     return {
  //       ...acc,
  //       [index]: selectedValue,
  //     };
  //   },
  //   {},
  // );

  const numberFormatter = getNumberFormatter(numberFormat);
  const yFormatter = getNumberFormatter(yAxisFormat);
  const xFormatter = getNumberFormatter(xAxisFormat);

  // Y轴平均线
  let averageData = {};
  if (averageLine) {
    averageData = {
      data: [
        {
          name: xAverageLineTitle,
          type: 'average',
          valueIndex: 0,
          label: {
            show: true,
            formatter: `{b}\n{c|{c}${xValueSuffix ?? ''}}`,
            position: 'start',
            distance: 15,
            rich: {
              c: {
                align: 'center',
                height: 30,
              },
            },
          },
        },
        {
          name: yAverageLineTitle,
          type: 'average',
          valueIndex: 1,
          label: {
            show: true,
            formatter: `{b}\n{c|{c}${yValueSuffix ?? ''}}`,
            position: 'start',
            distance: 15,
            rich: {
              c: {
                align: 'center',
                height: 30,
              },
            },
          },
        },
      ],
    };
  }

  const echartOptions = {
    title: {
      text: titleText,
      textAlign: 'right',
      right: 0,
      textStyle: {
        fontSize: getFontSize(titleFontSize, width),
        color:
          titleFontColor &&
          rgbToHex(titleFontColor?.r, titleFontColor?.g, titleFontColor?.b),
      },
    },
    tooltip: {
      confine: true,
      formatter: (params: any) => {
        // console.log('params:', params);
        const key = params.value.join(',');
        return labels[key];
      },
      valueFormatter: numberFormatter,
    },
    xAxis: {
      type: 'value', // 类目轴
      name: xAxisLabel, // X 表示类目轴
      nameGap: 32,
      nameLocation: 'end',
      nameTextStyle: {
        color:
          xLabelFontColor &&
          rgbToHex(xLabelFontColor?.r, xLabelFontColor?.g, xLabelFontColor?.b),
        fontWeight: 'bold',
        fontSize: 16,
        padding: [0, 0, -40, 0 - (50 + xDistance)],
        verticalAlign: 'bottom',
      },
      // 轴线
      axisLine: {
        show: true,
        symbol: ['none', 'arrow'],
      },
      // 轴线上的刻度
      axisTick: {
        show: false,
      },
      // 内部分割线
      splitLine: {
        show: false,
      },
      // 轴线上的文字
      axisLabel: {
        show: false,
        hideOverlap: true, // 是否隐藏重叠的标签
        formatter: xFormatter,
      },
    },
    yAxis: {
      type: 'value', // 数值轴
      name: yAxisLabel, // Y表示数值轴
      nameLocation: 'end',
      nameGap: 10,
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 16,
        color:
          yLabelFontColor &&
          rgbToHex(yLabelFontColor?.r, yLabelFontColor?.g, yLabelFontColor?.b),
      },
      // 轴线
      axisLine: {
        // 是否显示数值轴的轴线
        show: yAxisLine,
        symbol: ['none', 'arrow'],
      },
      // 轴线上的刻度
      axisTick: {
        show: false,
      },
      // 内部分割线
      splitLine: {
        show: false,
      },
      // 轴线上的文字
      axisLabel: {
        show: false,
        hideOverlap: true, // 是否隐藏重叠的标签
        formatter: yFormatter,
      },
    },
    series: [
      {
        type: 'scatter',
        label: {
          show: showLabels,
          position: 'right',
          formatter: (params: any) => {
            const key = params.value.join(',');
            return labels[key];
          },
          valueFormatter: xFormatter,
        },
        // 标签的统一布局配置。
        labelLayout: {
          // 是否隐藏重叠的标签
          hideOverlap: true,
        },
        markLine: {
          // 不响应事件
          silent: true,
          symbol: 'none',
          ...averageData,
        },
        symbolSize: 20,
        data: list,
      },
    ],
  };

  // console.log('echartOptions:', echartOptions);

  return {
    formData,
    width,
    height,
    echartOptions,
    setDataMask,
    labelMap: {},
    groupby,
    selectedValues: [],
  };
}
