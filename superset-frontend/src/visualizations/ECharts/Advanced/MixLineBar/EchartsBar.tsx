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
import React from 'react';
import { EchartsMixedLineBarChartTransformedProps } from './types';
import Echart from '../../Echart';
import { EventHandlers } from '../../types';

export default function EchartsBar({
  height,
  width,
  echartOptions,
  formData,
  // setDataMask,
  // labelMap,
  // groupby,
  selectedValues,
}: EchartsMixedLineBarChartTransformedProps) {
  // const handleChange = useCallback(
  //   (values: string[]) => {
  //     if (!formData.emitFilter) {
  //       return;
  //     }
  //
  //     const groupbyValues = values.map(value => labelMap[value]);
  //
  //     setDataMask({
  //       extraFormData: {
  //         filters:
  //           values.length === 0
  //             ? []
  //             : groupby.map((col, idx) => {
  //                 const val = groupbyValues.map(v => v[idx]);
  //                 if (val === null || val === undefined)
  //                   return {
  //                     col,
  //                     op: 'IS NULL',
  //                   };
  //                 return {
  //                   col,
  //                   op: 'IN',
  //                   val: val as (string | number | boolean)[],
  //                 };
  //               }),
  //       },
  //       filterState: {
  //         value: groupbyValues.length ? groupbyValues : null,
  //         selectedValues: values.length ? values : null,
  //       },
  //     });
  //   },
  //   [groupby, labelMap, setDataMask, selectedValues],
  // );

  // 图表事件定义
  const eventHandlers: EventHandlers = {
    click: props => {
      // 具体信息看打印日志，堆叠信息都有
      // const { name } = props;
      // console.log('props:', props)
      // const values = Object.values(selectedValues);
      // if (values.includes(name)) {
      //   handleChange(values.filter(v => v !== name));
      // } else {
      //   handleChange([name]);
      // }
    },
  };

  return (
    <Echart
      themeType={formData.themeType}
      height={height}
      width={width}
      echartOptions={echartOptions}
      eventHandlers={eventHandlers}
      selectedValues={selectedValues}
    />
  );
}
