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
  createDurationFormatter,
  getNumberFormatter,
  getNumberFormatterRegistry,
  NumberFormats,
  getTimeFormatterRegistry,
  smartDateFormatter,
  smartDateVerboseFormatter,
  createD3NumberFormatter,
} from 'src/core';

export default function setupFormatters() {
  getNumberFormatterRegistry()
    // Add shims for format strings that are deprecated or common typos.
    // Temporary solution until performing a db migration to fix this.
    .registerValue(',0', getNumberFormatter(',.4~f'))
    .registerValue('null', getNumberFormatter(',.4~f'))
    .registerValue('%', getNumberFormatter('.0%'))
    .registerValue('.', getNumberFormatter('.4~f'))
    .registerValue(',f', getNumberFormatter(',d'))
    .registerValue(',r', getNumberFormatter(',.4f'))
    .registerValue('0f', getNumberFormatter(',d'))
    .registerValue(',#', getNumberFormatter(',.4~f'))
    .registerValue('$,f', getNumberFormatter('$,d'))
    .registerValue('0%', getNumberFormatter('.0%'))
    .registerValue('f', getNumberFormatter(',d'))
    .registerValue(',.', getNumberFormatter(',.4~f'))
    .registerValue('.1%f', getNumberFormatter('.1%'))
    .registerValue('1%', getNumberFormatter('.0%'))
    .registerValue('3%', getNumberFormatter('.0%'))
    .registerValue(',%', getNumberFormatter(',.0%'))
    .registerValue('.r', getNumberFormatter('.4~f'))
    .registerValue('$,.0', getNumberFormatter('$,d'))
    .registerValue('$,.1', getNumberFormatter('$,.1~f'))
    .registerValue(',0s', getNumberFormatter(',.4~f'))
    .registerValue('%%%', getNumberFormatter('.0%'))
    .registerValue(',0f', getNumberFormatter(',d'))
    .registerValue('+,%', getNumberFormatter('+,.0%'))
    .registerValue('$f', getNumberFormatter('$,d'))
    .registerValue('+,', getNumberFormatter(NumberFormats.INTEGER_SIGNED))
    .registerValue(',2f', getNumberFormatter(',.4~f'))
    .registerValue(',g', getNumberFormatter(',.4~f'))
    .registerValue('int', getNumberFormatter(NumberFormats.INTEGER))
    .registerValue('.0%f', getNumberFormatter('.1%'))
    .registerValue('$,0', getNumberFormatter('$,.4f'))
    .registerValue('$,0f', getNumberFormatter('$,.4f'))
    .registerValue('$,.f', getNumberFormatter('$,.4f'))
    .registerValue('DURATION', createDurationFormatter())
    .registerValue(
      'DURATION_SUB',
      createDurationFormatter({ formatSubMilliseconds: true }),
    )
    .registerValue(
      'PRECENT', // 格式key
      createD3NumberFormatter({
        locale: {
          decimal: '.', // 小数点符号
          thousands: ',', // 分隔符
          grouping: [100], // 指定多少位使用分隔符
          currency: ['', '%'], // 前缀，后缀
        },
        formatString: '$,', // 固定格式，不要改！
      }),
    )
    .registerValue(
      'Not Decimal Precent', // 非小数百分比，一般用于整数显示成百分比
      createD3NumberFormatter({
        locale: {
          decimal: '.', // 小数点符号
          thousands: ',', // 分隔符
          grouping: [100], // 指定多少位使用分隔符
          currency: ['', '%'], // 前缀，后缀
        },
        formatString: '$,.0f', // 固定格式，不要改！
      }),
    )
    .registerValue(
      '1 Decimal Precent', // 1位小数点
      createD3NumberFormatter({
        locale: {
          decimal: '.', // 小数点符号
          thousands: ',', // 分隔符
          grouping: [100], // 指定多少位使用分隔符
          currency: ['', '%'], // 前缀，后缀
        },
        formatString: '$,.1f', // 固定格式，不要改！
      }),
    )
    .registerValue(
      '2 Decimal Precent', // 2位小数点
      createD3NumberFormatter({
        locale: {
          decimal: '.', // 小数点符号
          thousands: ',', // 分隔符
          grouping: [100], // 指定多少位使用分隔符
          currency: ['', '%'], // 前缀，后缀
        },
        formatString: '$,.2f', // 固定格式，不要改！
      }),
    )
    .registerValue(
      'Thousand Separator',
      createD3NumberFormatter({
        locale: {
          decimal: '.',
          thousands: ',',
          grouping: [3],
          currency: ['', ''],
        },
        formatString: '$,',
      }),
    );

  getTimeFormatterRegistry()
    .registerValue('smart_date', smartDateFormatter)
    .registerValue('smart_date_verbose', smartDateVerboseFormatter)
    .setDefaultKey('smart_date');
}
