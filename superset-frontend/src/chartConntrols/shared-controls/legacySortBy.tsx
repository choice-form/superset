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
import { t } from 'src/core';
import { ControlPanelsContainerProps, ControlSetRow } from '../types';

export const legacySortBy: ControlSetRow[] = [
  ['legacy_order_by'],
  [
    {
      name: 'noSort',
      config: {
        type: 'CheckboxControl',
        label: t('No Sort'),
        default: true,
        description: t('Not using sorting operations'), // 不使用排序操作
      },
    },
  ],
  [
    {
      name: 'order_desc',
      config: {
        type: 'CheckboxControl',
        label: t('Sort descending'),
        default: true,
        description: t(
          'Whether to sort descending or ascending. Takes effect only when "Sort by" is set',
        ),
        visibility: ({ controls }: ControlPanelsContainerProps) =>
          !Boolean(controls?.noSort?.value),
      },
    },
  ],
];
