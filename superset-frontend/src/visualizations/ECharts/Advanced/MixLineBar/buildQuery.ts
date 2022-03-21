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

import { QueryFormData } from 'src/core';
import { getQueryContext } from '../../utils/query';

export default function buildQuery(formData: QueryFormData) {
  const {
    adhocFilters,
    adhocFiltersB,
    groupby,
    limit,
    limitB,
    metrics,
    metricsB,
    noSort,
    // noSortB,
    order_desc,
    // order_desc_b,
    legacy_order_by,
    // legacy_order_by_b,
    ...baseFormData
  } = formData;

  // console.log('formData:', formData);

  const formData1 = {
    ...baseFormData,
    adhoc_filters: adhocFilters,
    columns: groupby,
    limit,
    metrics,
    order_desc,
    legacy_order_by,
  };

  const formData2 = {
    ...baseFormData,
    adhoc_filters: adhocFiltersB,
    columns: groupby,
    limit: limitB,
    metrics: metricsB,
    // order_desc: order_desc_b,
    // legacy_order_by: legacy_order_by_b,
  };

  const queryContextA = getQueryContext(formData1, noSort);
  // 第二个查询不排序
  const queryContextB = getQueryContext(formData2, true);

  return {
    ...queryContextA,
    queries: [...queryContextA.queries, ...queryContextB.queries],
  };
}
