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

import { ChartProps, getNumberFormatter } from 'src/core';
import { rgbToHex } from 'src/utils/colorUtils';

function convertColor(color: Record<PropertyKey, number> | string): string {
  return typeof color === 'string'
    ? color
    : rgbToHex(color.r, color.g, color.b);
}

// {
//   center: ['50%', '50%'],
//   amplitude: '8%',
//   waveLength: '80%',
//   phase: 'auto',
//   period: 'auto',

//   animationEasing: 'linear',
//   animationEasingUpdate: 'linear',
//   animationDuration: 2000,
//   animationDurationUpdate: 1000,

//   outline: {
//     itemStyle: {
//       color: 'none',
//       borderWidth: 8,
//       shadowBlur: 20,
//       shadowColor: 'rgba(0, 0, 0, 0.25)',
//     },
//   },

//   itemStyle: {
//     // opacity: 0.95,
//     shadowBlur: 50,
//     shadowColor: 'rgba(0, 0, 0, 0.4)',
//   },

//   label: {
//     show: true,
//     color: '#294D99',

//     align: 'center',
//     baseline: 'middle',
//     position: 'inside',
//   },

//   emphasis: {
//     itemStyle: {
//       opacity: 0.8,
//     },
//   },
// };

export default function (props: ChartProps) {
  const { formData, height, queriesData, width } = props;

  const data = queriesData.map(query => {
    const name = query.colnames[0];
    const value = query.data[0][name];
    return { name, value };
  });

  const formatValue = getNumberFormatter(formData.valueFormat);
  const echartOptions = {
    series: {
      backgroundStyle: {
        color: convertColor(formData.backgroundColor),
      },
      color: [convertColor(formData.waveColor)],
      data,
      direction: formData.waveDirection,
      itemStyle: { opacity: formData.waveOpacity, shadowBlur: 0 },
      label: {
        fontSize: formData.textFontSize,
        fontWeight: formData.textFontWeight,
        formatter: (params: any) => {
          const prefix = (formData.prefixText ?? '')
            .replaceAll('\\n', '\n')
            .replaceAll('{label}', params.name);
          const value = formatValue(params.value * 100);
          const suffix = (formData.suffixText ?? '')
            .replaceAll('\\n', '\n')
            .replaceAll('{label}', params.name);
          return prefix + value + suffix;
        },
        insideColor: convertColor(formData.textFontColor),
      },
      outline: {
        borderDistance: formData.borderDistance,
        itemStyle: {
          borderColor: convertColor(formData.borderColor),
          shadowBlur: 0,
        },
        show: formData.showOutline,
      },
      radius: `${formData.radius}%`,
      shape: formData.liquidShape,
      type: 'liquidFill',
      waveAnimation: formData.waveAnimation,
    },
    title: {
      show: formData.showTitle,
      text: formData.mainTitle,
      textStyle: {
        color: convertColor(formData.mainTitleTextColor),
        fontSize: formData.mainTitleFontSize,
        fontWeight: formData.mainTitleFontWeight,
      },
      subtext: formData.subTitle,
      subtextStyle: {
        color: convertColor(formData.subTitleTextColor),
        fontSize: formData.subTitleFontSize,
        fontWeight: formData.subTitleFontWeight,
      },
    },
  };

  return {
    echartOptions,
    formData,
    height,
    width,
  };
}
