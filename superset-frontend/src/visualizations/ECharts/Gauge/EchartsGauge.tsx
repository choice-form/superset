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
import React, { useCallback } from 'react';
import Echart from 'src/visualizations/ECharts/Echart';
import { GaugeChartTransformedProps } from './types';
import { EventHandlers } from '../types';
import { getChartDataMask } from '../utils/datamask';
import './EchartsGauge.less';
import { toRGBA } from '../utils/colors';

export default function EchartsGauge(props: GaugeChartTransformedProps) {
  const {
    height,
    width,
    echartOptions,
    setDataMask,
    labelMap,
    groupby,
    selectedValues,
    formData: {
      showLegend,
      startRangeColor,
      secondRangeColor,
      thirdRangeColor,
      endRangeColor,
      emitFilter,
    },
  } = props;

  const handleChange = useCallback(
    (values: string[]) => {
      if (!emitFilter) {
        return;
      }
      const groupbyValues = values.map(value => labelMap[value]);
      const dataMask = getChartDataMask(values, groupby, groupbyValues);
      setDataMask(dataMask);
    },
    [emitFilter, groupby, setDataMask, labelMap],
  );

  const eventHandlers: EventHandlers = {
    click: props => {
      const { name } = props;
      const values = Object.values(selectedValues);
      if (values.includes(name)) {
        handleChange(values.filter(v => v !== name));
      } else {
        handleChange([name]);
      }
    },
  };

  let legends: any[] = [];
  if (showLegend) {
    legends = [
      startRangeColor,
      secondRangeColor,
      thirdRangeColor,
      endRangeColor,
    ].map((value, index) => {
      const color = toRGBA(value);
      const label =
        index === 1
          ? '保底目标'
          : index === 2
          ? '尖叫目标'
          : index === 3
          ? '嚎叫目标'
          : '？？目标';
      return { color, label };
    });
  }

  return (
    <>
      {showLegend && (
        <ul className="gauge-legend">
          {legends.map(({ color, label }) => (
            <li className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: color }}
              />
              <span className="legend-label">{label}</span>
            </li>
          ))}
        </ul>
      )}

      <Echart
        height={height}
        width={width}
        echartOptions={echartOptions}
        eventHandlers={eventHandlers}
        selectedValues={selectedValues}
      />
    </>
  );
}
