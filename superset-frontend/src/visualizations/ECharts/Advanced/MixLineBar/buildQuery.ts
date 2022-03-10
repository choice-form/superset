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
  buildQueryContext,
  normalizeOrderBy,
  QueryFormData,
  QueryObject,
} from 'src/core';
import { pivotOperator } from '../../../../chartConntrols';

export default function buildQuery(formData: QueryFormData) {
  const {
    adhocFilters,
    adhocFiltersB,
    groupby,
    limit,
    limitB,
    metrics,
    metricsB,
    orderDesc,
    orderDescB,
    ...baseFormData
  } = formData;

  const formData1 = {
    ...baseFormData,
    adhocFilters,
    columns: groupby,
    limit,
    metrics,
    orderDesc,
  };
  const formData2 = {
    ...baseFormData,
    adhoc_filters: adhocFiltersB,
    columns: groupby,
    limit: limitB,
    metrics: metricsB,
    order_desc: orderDescB,
  };

  const queryContextA = buildQueryContext(formData1, baseQueryObject => {
    const queryObjectA = {
      ...baseQueryObject,
      post_processing: [pivotOperator(formData1, baseQueryObject)],
    } as QueryObject;
    return [normalizeOrderBy(queryObjectA)];
  });

  const queryContextB = buildQueryContext(formData2, baseQueryObject => {
    const queryObjectB = {
      ...baseQueryObject,
      post_processing: [pivotOperator(formData2, baseQueryObject)],
    } as QueryObject;
    return [normalizeOrderBy(queryObjectB)];
  });

  return {
    ...queryContextA,
    queries: [...queryContextA.queries, ...queryContextB.queries],
  };
}
