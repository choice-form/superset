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
import {
  ChartTransformedProps,
  DEFAULT_FORM_DATA as DEFAULT_RADAR_FORM_DATA,
  EchartsChartProps,
  EchartsFormData,
} from './types';
import { DEFAULT_LEGEND_FORM_DATA } from '../types';
import { getFontSize } from '../utils/chart';
import { EchartsLabelType } from './constants';
import { defaultGrid } from '../defaults';
import { toRGBA } from '../utils/colors';

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
    titleFontWeight,
    subTitleText,
    subTitleFontSize,
    subTitleFontColor,
    subTitleFontWeight,

    showDataZoomY,
    zoomStartY,
    zoomEndY,
    showDataZoomX,
    zoomStartX,
    zoomEndX,

    groupby,
    // metrics = [],
    labelType,

    showLabels, // 显示标签
    averageLine, // 平均线
    averageLineType, // 线类型
    averageLineColor, // 平均线颜色

    bubbles, // 是否显示气泡
    scaling, // 气泡缩放
    pointSize, // 非气泡时散点大小

    yAverageLineTitle,
    yAverageLineLabel,
    yValueSuffix,
    xAverageLineTitle,
    xValueSuffix,
    xAverageLineLabel,

    yAxisLabel, // 是否显示Y轴标签
    yAxisName, // Y轴名称
    yAxisLine, // 是否显示Y轴的轴线
    yAxisArrow, // Y轴轴线是否显示箭头
    yAxisFormat, // Y轴的格式化类
    yNameFontColor,
    ySplitLine, // 内部分割线
    yAxisTick, // Y轴刻度

    xAxisLine, // 是否显示X轴的轴线
    xAxisArrow, // X轴线显示箭头
    xAxisFormat, // X轴的格式化
    xAxisName, // X轴名称
    xAxisTick, // 显示x轴刻度
    xAxisLabel, // 显示x轴标签
    xSplitLine, // X轴内部分割线

    xDistance,
    xNameFontColor,
  }: EchartsFormData = {
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

  // console.log('labels:', labels);
  // console.log('list:', list);
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
            show: xAverageLineLabel,
            formatter: `{b}\n{c|{c}${xValueSuffix ?? ''}}`,
            position: 'start',
            distance: xAxisLabel ? 32 : 15,
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
            show: yAverageLineLabel,
            formatter: `{b}\n{c|{c}${yValueSuffix ?? ''}}`,
            position: 'start',
            distance: yAxisLabel ? 32 : 15,
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

  // 图形grid位置计算
  const gridLayout = {};
  if (xAxisName || showDataZoomX) {
    gridLayout['bottom'] = 64;
  } else {
    gridLayout['bottom'] = 'auto';
  }

  // 数据缩放
  let dataZoom = {};
  if (showDataZoomX || showDataZoomY) {
    const zoomX = {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
      start: zoomStartX,
      end: zoomEndX,
    };
    const zoomY = {
      type: 'slider',
      show: true,
      yAxisIndex: [0],
      left: '93%',
      start: zoomStartY,
      end: zoomEndY,
    };
    const list = [];
    if (showDataZoomX) {
      list.push(zoomX);
    }
    if (showDataZoomY) {
      list.push(zoomY);
    }
    dataZoom = {
      dataZoom: list,
    };
  }

  const echartOptions = {
    grid: {
      ...defaultGrid,
      ...gridLayout,
    },
    ...dataZoom,
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
    tooltip: {
      confine: true,
      formatter: (params: any) => {
        const key = params.value.join(',');
        return labels[key];
      },
    },
    xAxis: {
      type: 'value', // 类目轴
      name: xAxisName, // X 表示类目轴
      nameGap: 32,
      nameLocation: 'end',
      nameTextStyle: {
        color: toRGBA(xNameFontColor),
        fontWeight: 'bold',
        fontSize: 16,
        padding: [0, 0, -40, 0 - (50 + xDistance)],
        verticalAlign: 'bottom',
      },
      // 轴线
      axisLine: {
        show: xAxisLine,
        symbol: xAxisArrow ? ['none', 'arrow'] : 'none',
      },
      // 轴线上的刻度
      axisTick: {
        show: xAxisTick,
      },
      // 内部分割线
      splitLine: {
        show: xSplitLine,
      },
      // 轴线上的文字
      axisLabel: {
        show: xAxisLabel,
        hideOverlap: true, // 是否隐藏重叠的标签
        formatter: xFormatter,
      },
    },
    yAxis: {
      type: 'value', // 数值轴
      name: yAxisName, // Y表示数值轴
      nameLocation: 'end',
      nameGap: 15,
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: toRGBA(yNameFontColor),
      },
      // 轴线
      axisLine: {
        // 是否显示数值轴的轴线
        show: yAxisLine,
        symbol: yAxisArrow ? ['none', yAxisTick ? 'none' : 'arrow'] : 'none',
      },
      // 轴线上的刻度
      axisTick: {
        show: yAxisTick,
      },
      // 内部分割线
      splitLine: {
        show: ySplitLine,
      },
      // 轴线上的文字
      axisLabel: {
        show: yAxisLabel,
        hideOverlap: true, // 是否隐藏重叠的标签
        formatter: yFormatter,
      },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (data: any) => {
          if (bubbles) {
            return data[1] / scaling;
          }
          return pointSize;
        },
        itemStyle: {
          color: 'auto',
        },
        label: {
          show: showLabels,
          position: 'right',
          formatter: (params: any) => {
            const key = params.value.join(',');
            const [x, y] = params.value;
            switch (labelType) {
              case EchartsLabelType.Key:
                return labels[key];
              case EchartsLabelType.Value:
                return [xFormatter(x), yFormatter(y)];
              default:
                return `${labels[key]}: ${[xFormatter(x), yFormatter(y)]}`;
            }
          },
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
          lineStyle: {
            type: averageLineType,
            color: toRGBA(averageLineColor),
          },
          ...averageData,
        },
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
