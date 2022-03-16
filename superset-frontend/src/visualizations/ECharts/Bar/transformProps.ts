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
import { EChartsCoreOption } from 'echarts';
import { sum, max } from 'lodash';
import {
  BarChartTransformedProps,
  EchartsBarChartProps,
  EchartsBarFormData,
} from './types';
import { DEFAULT_FORM_DATA as DEFAULT_PIE_FORM_DATA } from './constants';
import { DEFAULT_LEGEND_FORM_DATA, LegendOrientation } from '../types';
import { defaultGrid, defaultTooltip } from '../defaults';
import { rgbToHex } from '../../../utils/colorUtils';

// 将值切换为百分比数据
// @ts-ignore
const switchPrecent: number[] = (arr: (string | number)[]) => {
  if (arr.length < 2) return arr;
  const name: string = arr[0] as string;
  const tmpArr = arr.slice(1, arr.length) as number[];
  const total = sum(tmpArr);
  const newArr = tmpArr.map(o => o / total);
  return [name, ...newArr];
};

export default function transformProps(
  chartProps: EchartsBarChartProps,
): BarChartTransformedProps {
  const {
    formData,
    height,
    hooks,
    // filterState,
    queriesData,
    width,
  } = chartProps;

  // console.log('chartProps:', chartProps);

  const {
    barBackground, // 柱形的背景控制
    chartOrient, // 图表布局方向
    groupby,
    metrics, // 查询指标
    showAxisPointer, // 是否显示坐标轴指示器
    ringgit, // 是否显示环比

    yAxisLine, // 是否显示Y轴的轴线
    yAxisFormat, // Y轴的格式化类
    yAxisName, // Y轴名称
    yNameFontColor, // 名称颜色
    yAxisTick, // 轴线上的刻度
    ySplitLine, // Y轴方向的内部分割线
    yAxisLabel, // 是否显示Y轴标签
    yAxisShowMinmax, // 是否显示Y轴的最大值最小值限制
    yAxisBounds, // Y轴的最小值和最大值数组

    xAxisName, // X轴名称
    xNameFontColor, // 名称颜色
    xAxisLine, // X轴的轴线是否显示
    xAxisLabel, // X轴标签是否显示
    xLabelLayout, // X轴布局：标签旋转角度
    xAxisTick, // X轴是否显示刻度
    xSplitLine, // X轴方向的内部分割线
    xDistance, // X轴名称的距离

    showLabel, // 是否显示图形上的文本标签
    stacked, // 堆叠
    stackedPrecent, // 堆叠显示成百分比

    tooltipFormat,
    showLegend,
    legendPadding,
    legendOrientation,
    legendType,
    legendMode,
  }: EchartsBarFormData = {
    ...DEFAULT_LEGEND_FORM_DATA,
    ...DEFAULT_PIE_FORM_DATA,
    ...formData,
  };

  let rawData = queriesData[0].data;
  // 如果堆叠百分比
  if (stacked && stackedPrecent) {
    const tmpArr = rawData.slice(1, rawData.length);
    // @ts-ignore
    rawData = [rawData[0], ...tmpArr.map(switchPrecent)];
  }

  const { setDataMask = () => {} } = hooks;

  // 标签位置，默认顶部
  let labelPosition = { position: 'top' };
  // 旋转角度
  let labelRotate = { rotate: 0 };
  if (metrics.length > 1) {
    // 横向布局的时候，显示
    if (chartOrient === 'horizontal') {
      if (stacked) {
        // 多个放在内部显示
        labelPosition = { position: 'inside' };
      }
    } else {
      // 纵向布局的时候，也就是类目轴是竖着的时候
      labelPosition = { position: 'right' };
      if (stacked) {
        labelPosition = { position: 'inside' };
        labelRotate = { rotate: -90 };
      }
    }
  } else {
    // 横向布局的时候，显示
    // eslint-disable-next-line no-lonely-if
    if (chartOrient !== 'horizontal') {
      labelPosition = { position: 'right' };
    }
  }

  // tooltip的格式化方法, 堆叠百分比的时候，自动显示百分比格式化类型
  const tooltipFormatter = getNumberFormatter(
    stacked && stackedPrecent ? '.0%' : tooltipFormat,
  );

  // Y轴的格式化方法, 堆叠百分比的时候，自动显示百分比格式化类型
  const yFormatter = getNumberFormatter(
    stacked && stackedPrecent ? '.0%' : yAxisFormat,
  );

  // console.log('rawData:', rawData);

  let markPoint = {};
  if (ringgit) {
    const hbList: string[] = [];
    const mpList: object[] = [];
    // 一个维度，直接取值
    if (metrics.length === 1) {
      // 第一个值
      const raw1 = rawData[1][1];
      // 第二个值
      const raw2 = rawData[2][1];
      // 计算环比（环比只会有两个数据比较）
      let val: any = Math.round(((raw2 - raw1) / raw1) * 100);
      if (val === 0) {
        val = (((raw2 - raw1) / raw1) * 100).toFixed(1);
      }
      const maxVal = max([raw1, raw2]);
      mpList.push({
        value: maxVal,
        xAxis: [raw1, raw2].indexOf(maxVal) + 1,
        yAxis: maxVal,
      });
      hbList.push(`${val}%`);
    }

    rawData.forEach((raw, idx) => {
      if (idx > 0) {
        // 计算环比（环比只会有两个数据比较）
        let val: any = Math.round(((raw[2] - raw[1]) / raw[1]) * 100);
        // 如果是0，就显示小数
        if (val === 0) {
          val = (((raw[2] - raw[1]) / raw[1]) * 100).toFixed(1);
        }
        const maxVal = max([raw[1], raw[2]]);
        mpList.push({
          value: maxVal,
          xAxis: idx - 1,
          yAxis: maxVal,
        });
        hbList.push(`${val}%`);
      }
    });
    markPoint = {
      symbolSize: 0,
      silent: true, // 不响应和触发鼠标事件
      label: {
        fontSize: 12,
        color: 'red',
        fontWeight: 'bold',
        show: true,
        position: 'top',
        distance: 30,
        formatter: (params: any) => {
          // console.log('params:', params);
          if (metrics.length === 1) {
            // 第一个值
            const raw1 = rawData[1][1];
            // 第二个值
            const raw2 = rawData[2][1];
            const maxVal = max([raw1, raw2]);
            if (maxVal === raw1 && params.dataIndex === 0) {
              return `{a|${hbList[0]}}`;
            }
            if (maxVal === raw2 && params.dataIndex === 1) {
              return `{a|${hbList[0]}}`;
            }
            return '';
          }
          if (params.seriesIndex === 0) {
            return `{a|${hbList[params.dataIndex]}}`;
          }
          return '';
        },
        rich: {
          a: {
            align: 'center',
            fontSize: 18,
            textShadowBlur: 2,
            textShadowColor: '#000',
            textShadowOffsetX: 0,
            textShadowOffsetY: 1,
            backgroundColor: 'rgb(242,242,242)',
            borderColor: '#aaa',
            borderWidth: 1,
            borderRadius: 4,
            padding: [10, 10],
            lineHeight: 26,
            color: '#ff8811',
          },
        },
      },
      data: mpList,
    };
  }

  // 柱状图的通用配置
  const barSeries = {
    type: 'bar', // 柱状图
    animation: true, // 开启动画
    // 标签的统一布局配置。
    labelLayout: {
      // 是否隐藏重叠的标签
      hideOverlap: true,
    },
    label: {
      // 是否显示图形上的文本标签
      show: showLabel,
      // 标签的位置
      ...labelPosition,
      // 旋转
      ...labelRotate,
      // 格式化值(标准数据集的取值格式化，非数据集才可以直接格式化)
      formatter({ value, encode }: any) {
        const idx = chartOrient === 'horizontal' ? encode.y[0] : encode.x[0];
        const row = value[idx];
        return yFormatter(row);
      },
    },
    stack: stacked && 'total', // 这个值相同的柱子，会堆叠起来。值是什么都行，但最好是有意义的值。
    markPoint,
  };

  // 这里只是生成相应数据的系列值
  const series = Array.from({ length: rawData[0].length - 1 }).map(() => ({
    ...barSeries,
    showBackground: barBackground,
    backgroundStyle: {
      color: 'rgba(180, 180, 180, 0.2)',
    },
  }));

  // 暂时还用不到这个，保留做参考
  // const selectedValues = (filterState.selectedValues || []).reduce(
  //   (acc: Record<string, number>, selectedValue: string) => {
  //     const index = series.findIndex(({ name }) => name === selectedValue);
  //     return {
  //       ...acc,
  //       [index]: selectedValue,
  //     };
  //   },
  //   {},
  // );

  // Y轴的最大值和最小值
  let yMinMax = {};
  if (stacked && stackedPrecent) {
    yMinMax = {
      min: 0,
      max: 1,
    };
  } else if (yAxisShowMinmax && yAxisBounds.length === 2) {
    yMinMax = {
      min: yAxisBounds[0],
      max: yAxisBounds[1],
    };
  }

  // X轴标签布局: 旋转角度
  const getRotate = (rotate: string): number => {
    switch (rotate) {
      case '0°':
        return 0;
      case '-45°':
        return -45;
      case '-90°':
        return -90;
      case '45°':
        return 45;
      case '90°':
        return 90;
      default:
        return chartOrient === 'horizontal' ? -45 : 0;
    }
  };

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

  // 类目轴的名称
  let xLabelGap = {};
  if (xAxisName) {
    xLabelGap = {
      name: xAxisName, // X 表示类目轴
      nameGap: xDistance,
      nameLocation: 'center',
      nameTextStyle: {
        color:
          xNameFontColor &&
          rgbToHex(xNameFontColor?.r, xNameFontColor?.g, xNameFontColor?.b),
        fontWeight: 'bold',
        fontSize: 16,
      },
    };
  }

  // 默认：一般横向，数组直接用就行，第一个分类是X，第二个值就是Y。如果是纵向的布局，就倒过来。
  const axisData = [
    {
      type: 'category', // 类目轴
      ...xLabelGap,
      // 轴线
      axisLine: {
        show: xAxisLine,
      },
      // 轴线上的刻度
      axisTick: {
        show: xAxisTick,
      },
      // 内部分割线
      splitLine: {
        show: xSplitLine,
      },
      axisLabel: {
        show: xAxisLabel,
        hideOverlap: true, // 是否隐藏重叠的标签
        rotate: getRotate(xLabelLayout), // 标签旋转角度
      },
    },
    {
      type: 'value', // 数值轴
      name: yAxisName, // Y表示数值轴
      nameLocation: 'center',
      nameGap: 32,
      nameTextStyle: {
        fontWeight: 'bold',
        fontSize: 16,
        color:
          yNameFontColor &&
          rgbToHex(yNameFontColor?.r, yNameFontColor?.g, yNameFontColor?.b),
      },
      ...yMinMax,
      axisLine: {
        // 是否显示数值轴的轴线
        show: yAxisLine,
      },
      // 轴线上的刻度
      axisTick: {
        show: yAxisTick,
      },
      // 内部分割线
      splitLine: {
        show: ySplitLine,
      },
      axisLabel: {
        show: yAxisLabel,
        hideOverlap: true, // 是否隐藏重叠的标签
        formatter: yFormatter,
      },
    },
  ];
  const xAxis = chartOrient === 'horizontal' ? axisData[0] : axisData[1];
  const yAxis = chartOrient === 'horizontal' ? axisData[1] : axisData[0];

  // 图形grid位置计算
  const gridLayout = {};
  if (xAxisName) {
    if (getRotate(xLabelLayout) === 0) {
      gridLayout['bottom'] = 64;
    } else {
      gridLayout['bottom'] = 32;
    }
  } else {
    gridLayout['bottom'] = 'auto';
  }
  if (showLegend) {
    gridLayout['top'] = '5%';
  }

  if (chartOrient !== 'horizontal') {
    gridLayout['right'] = '12%';
  }

  let axisPointer = {};
  if (showAxisPointer) {
    axisPointer = {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    };
  }

  const echartOptions: EChartsCoreOption = {
    grid: {
      ...defaultGrid,
      ...gridLayout,
    },
    tooltip: {
      ...defaultTooltip,
      ...axisPointer,
      // 提示的值格式化
      valueFormatter: tooltipFormatter,
    },
    legend: {
      show: showLegend,
      type: legendType === 'scroll' ? 'scroll' : 'plain',
      selectedMode: legendMode,
      ...legendPosition,
    },
    dataset: {
      source: rawData,
    },
    xAxis,
    yAxis,
    series,
  };

  // console.log('echartOptions', echartOptions);

  return {
    formData,
    width,
    height,
    echartOptions,
    setDataMask,
    groupby,
    selectedValues: [],
  };
}
