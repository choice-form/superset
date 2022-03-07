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
import {
  ChartProps,
  DataRecord,
  extractTimegrain,
  GenericDataType,
  getTimeFormatter,
  getTimeFormatterForGranularity,
  QueryFormData,
  smartDateFormatter,
  TimeFormats,
} from 'src/core';
import { sum } from 'lodash';
import { getColorFormatters } from 'src/chartConntrols';
import { DateFormatter } from '../types';

const { DATABASE_DATETIME } = TimeFormats;

function isNumeric(key: string, data: DataRecord[] = []) {
  return data.every(
    record =>
      record[key] === null ||
      record[key] === undefined ||
      typeof record[key] === 'number',
  );
}

export default function transformProps(chartProps: ChartProps<QueryFormData>) {
  /**
   * This function is called after a successful response has been
   * received from the chart data endpoint, and is used to transform
   * the incoming data prior to being sent to the Visualization.
   *
   * The transformProps function is also quite useful to return
   * additional/modified props to your data viz component. The formData
   * can also be accessed from your PivotTableChart.tsx file, but
   * doing supplying custom props here is often handy for integrating third
   * party libraries that rely on specific props.
   *
   * A description of properties in `chartProps`:
   * - `height`, `width`: the height/width of the DOM element in which
   *   the chart is located
   * - `formData`: the chart data request payload that was sent to the
   *   backend.
   * - `queriesData`: the chart data response payload that was received
   *   from the backend. Some notable properties of `queriesData`:
   *   - `data`: an array with data, each row with an object mapping
   *     the column/alias to its value. Example:
   *     `[{ col1: 'abc', metric1: 10 }, { col1: 'xyz', metric1: 20 }]`
   *   - `rowcount`: the number of rows in `data`
   *   - `query`: the query that was issued.
   *
   * Please note: the transformProps function gets cached when the
   * application loads. When making changes to the `transformProps`
   * function during development with hot reloading, changes won't
   * be seen until restarting the development server.
   */
  const {
    width,
    height,
    queriesData,
    formData,
    rawFormData,
    hooks: { setDataMask = () => {} },
    filterState,
    datasource: { verboseMap = {}, columnFormats = {} },
  } = chartProps;
  const { colnames, coltypes } = queriesData[0];
  // 如果是百分比差值计算，这里的data，会被后面的计算结果替代，所以是变量取值
  let { data } = queriesData[0];
  const {
    groupbyRows,
    groupbyColumns,
    metrics,
    tableRenderer,
    colOrder,
    rowOrder,
    aggregateFunction,
    transposePivot,
    combineMetric,
    rowSubtotalPosition,
    colSubtotalPosition,
    colTotals,
    rowTotals,
    valueFormat,
    dateFormat,
    emitFilter,
    metricsLayout,
    conditionalFormatting,
    percentageDifference,
  } = formData;

  // 如果是百分比差值计算，更新数据
  if (percentageDifference) {
    // 行总计数据
    const rows: { [name: string]: number }[] = [];
    // 将对象数组变成纯数字，便于统计
    const rawData = data.map((o: object) => {
      const arr = Object.values(o);
      const real = arr.splice(1, arr.length);
      // 每行的值求和
      rows.push({ [arr[0]]: Math.round(sum(real) * 100) });
      // 返回的值默认是小数，需要处理成百分比的整数
      return real.map(o => Math.round(o * 100));
    });
    // console.log('rawData:', rawData);
    // 计算每列的值求和
    const cols: number[] = [];
    for (let i = 0; i < colnames.length - 1; i++) {
      let val = 0;
      rawData.forEach((raw: number[]) => {
        val += raw[i];
      });
      cols.push(val);
    }

    // 计算总数：每列的总和加起来
    const total = sum(cols);

    // 计算出中间数组，行总计*列总计/总总计（也就是列总计的求和）= 每个单元格的值，这里是一个二维数组
    const res2: any[] = [];
    rows.forEach(item => {
      const val = Object.values(item)[0];
      const key = Object.keys(item)[0];
      // 把第一个字符串名称先放进去。
      const arr: any[] = [key];
      cols.forEach(col => {
        arr.push(Math.round((val * col) / total));
      });
      // 一行的数据放进去
      res2.push(arr);
    });

    const result: any[] = [];
    // 求差值，生成最终数据
    res2.forEach((res, idx1) => {
      // 第二个元素开始，才能计算
      const arr = res.splice(1, res.length);
      const end = [res[0]];
      // 和前面拿出来的第一个二维数组，进行差值计算
      const endArr = arr.map((row: number, idx2: number) => {
        return rawData[idx1][idx2] - row;
      });
      // 生成新的一行数据
      const returnData = end.concat(endArr);
      const newData = {};
      // 将新的数据，和标题组合成图表需要的数据
      colnames.forEach((col: string, index: number) => {
        newData[col] = returnData[index];
      });
      // 将最终的一行数据添加到最终的数组中
      result.push(newData);
    });
    // 更新数据，替换默认的数据
    data = result;
  } else {
    // 将小数点转换成百分比整数
    data = data.map((row: object) => {
      const res = {};
      Object.entries(row).forEach(([k, v], idx) => {
        if (idx > 0) {
          res[k] = Math.round((v as number) * 100);
        } else {
          res[k] = v;
        }
      });
      return res;
    });
  }

  const { selectedFilters } = filterState;
  const granularity = extractTimegrain(rawFormData);

  const dateFormatters = colnames
    .filter(
      (colname: string, index: number) =>
        coltypes[index] === GenericDataType.TEMPORAL,
    )
    .reduce(
      (
        acc: Record<string, DateFormatter | undefined>,
        temporalColname: string,
      ) => {
        let formatter: DateFormatter | undefined;
        if (dateFormat === smartDateFormatter.id) {
          if (granularity) {
            // time column use formats based on granularity
            formatter = getTimeFormatterForGranularity(granularity);
          } else if (isNumeric(temporalColname, data)) {
            formatter = getTimeFormatter(DATABASE_DATETIME);
          } else {
            // if no column-specific format, print cell as is
            formatter = String;
          }
        } else if (dateFormat) {
          formatter = getTimeFormatter(dateFormat);
        }
        if (formatter) {
          acc[temporalColname] = formatter;
        }
        return acc;
      },
      {},
    );
  const metricColorFormatters = getColorFormatters(conditionalFormatting, data);

  return {
    width,
    height,
    data,
    groupbyRows,
    groupbyColumns,
    metrics,
    tableRenderer,
    colOrder,
    rowOrder,
    aggregateFunction,
    transposePivot,
    combineMetric,
    rowSubtotalPosition,
    colSubtotalPosition,
    colTotals,
    rowTotals,
    valueFormat,
    emitFilter,
    setDataMask,
    selectedFilters,
    verboseMap,
    columnFormats,
    metricsLayout,
    metricColorFormatters,
    dateFormatters,
  };
}
