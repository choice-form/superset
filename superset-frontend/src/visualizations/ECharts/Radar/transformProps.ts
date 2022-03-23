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
import { getNumberFormatter } from 'src/core';
import { max } from 'lodash';
import {
  DEFAULT_FORM_DATA as DEFAULT_RADAR_FORM_DATA,
  EchartsRadarChartProps,
  EchartsRadarFormData,
  RadarChartTransformedProps,
} from './types';
import { DEFAULT_LEGEND_FORM_DATA, LegendOrientation } from '../types';
import { getFontSize } from '../utils/chart';
import { toRGBA } from '../utils/colors';

export default function transformProps(
  chartProps: EchartsRadarChartProps,
): RadarChartTransformedProps {
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
    titleFontWeight,
    subTitleText,
    subTitleFontSize,
    subTitleFontColor,
    subTitleFontWeight,

    groupby,
    // metrics = [],
    numberFormat,
    showLabels, // 显示标签
    isCircle, // 雷达形状
    percentData, // 显示的百分比数据
    showLegend, // 是否显示图例
    legendMode, // 图例显示模式
    legendPadding, // 图例的内边距
    legendType, // 图例的显示类型：滚动还是平铺
    legendOrientation,
  }: EchartsRadarFormData = {
    ...DEFAULT_LEGEND_FORM_DATA,
    ...DEFAULT_RADAR_FORM_DATA,
    ...formData,
  };
  const { setDataMask = () => {} } = hooks;

  // console.log('chartProps:', chartProps);

  const { data, coltypes } = queriesData[0];
  const firstData = data[0];
  const colIdx = coltypes.indexOf(0);
  // 取出指标数组
  const metrics = Object.keys(firstData).splice(
    colIdx,
    Object.keys(firstData).length,
  );
  const names = Object.keys(firstData).splice(0, colIdx);
  // console.log('metrics:', metrics, names);

  // 最大值列表
  const indicators: any[] = [];
  //  最终值
  const dataList: any[] = [];
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
    // 构建雷达的范围
    indicators.push({
      name,
      // @ts-ignore
      max: percentData ? 100 : max(vals) * 1.25,
    });
    // 第一次循环直接添加
    if (idx === 0) {
      metrics.forEach(metric => {
        dataList.push({ name: metric, value: [raw[metric]] });
      });
    } else {
      metrics.forEach(metric => {
        const obj = dataList.find(d => d.name === metric);
        obj.value.push(raw[metric]);
      });
    }
  });

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
    legendPosition = { ...legendPosition, padding: [5, legendPadding] };
  }

  const echartOptions = {
    title: {
      text: titleText,
      textStyle: {
        fontSize: getFontSize(titleFontSize, width),
        fontWeight: titleFontWeight,
        color: toRGBA(titleFontColor),
      },
      subtext: subTitleText,
      subtextStyle: {
        fontSize: getFontSize(subTitleFontSize, width),
        fontWeight: subTitleFontWeight,
        color: toRGBA(subTitleFontColor),
      },
    },
    legend: {
      show: showLegend,
      type: legendType === 'scroll' ? 'scroll' : 'plain',
      selectedMode: legendMode,
      ...legendPosition,
    },
    radar: {
      shape: isCircle ? 'circle' : 'polygon',
      name: {
        show: true,
        fontSize: 16,
        fontWeight: 600,
        textStyle: {
          color: '#333',
        },
      },
      indicator: indicators,
    },
    tooltip: {
      confine: true,
      valueFormatter: numberFormatter,
    },
    series: [
      {
        type: 'radar',
        emphasis: {
          label: {
            show: showLabels,
            fontWeight: 'bold',
          },
        },
        label: {
          show: showLabels,
          formatter: ({ value }: any) => numberFormatter(value),
        },
        // 标签的统一布局配置。
        labelLayout: {
          // 是否隐藏重叠的标签
          hideOverlap: true,
        },
        data: dataList,
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
