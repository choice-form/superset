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
import isEmpty from 'lodash/isEmpty';
import {
  DatasourceKey,
  buildQueryObject,
  QueryFormData,
  QueryObject,
} from 'src/core';
import { pivotOperator } from 'src/chartConntrols';

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
    noSortB,
    order_desc,
    order_desc_b,
    legacy_order_by,
    legacy_order_by_b
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
    legacy_order_by
  };

  const formData2 = {
    ...baseFormData,
    adhoc_filters: adhocFiltersB,
    columns: groupby,
    limit: limitB,
    metrics: metricsB,
    order_desc: order_desc_b,
    legacy_order_by: legacy_order_by_b
  };

  const queryContextA = getQueryContext(formData1, noSort);
  const queryContextB = getQueryContext(formData2, noSortB);

  return {
    ...queryContextA,
    queries: [...queryContextA.queries, ...queryContextB.queries],
  };
}

// 处理查询排序
function normalizeQueryOrderBy(queryObject: QueryObject): QueryObject {
  const {
    timeseries_limit_metric,
    legacy_order_by,
    order_desc,
    ...baseQueryObject
  } = queryObject;

  // 先判断是否正序
  const isAsc = !order_desc;

  // 时间序列排序
  if (
    ![undefined, null].includes(timeseries_limit_metric) &&
    !isEmpty(legacy_order_by)
  ) {
    return {
      ...baseQueryObject,
      orderby: [[timeseries_limit_metric, isAsc]],
    };
  }

  // 指标排序
  if (
    ![undefined, null].includes(legacy_order_by) &&
    !isEmpty(legacy_order_by)
  ) {
    // console.log('预期的返回');
    return {
      ...baseQueryObject,
      // @ts-ignore
      orderby: [[legacy_order_by, isAsc]],
    };
  }

  // 如果上面没找到就返回第一个维度
  if (Array.isArray(queryObject.metrics) && queryObject.metrics.length > 0) {
    return {
      ...baseQueryObject,
      orderby: [[queryObject.metrics[0], isAsc]],
    };
  }

  // console.log('出现了异常的返回.....');

  return baseQueryObject;
}

// 获取查询对象
function getQueryContext(formData: QueryFormData, noSort: boolean) {
  // 构建查询对象
  const queryObj = buildQueryObject(formData);

  // console.log('queryObj:', queryObj);

  const queryObj2 = {
    ...queryObj,
    post_processing: [pivotOperator(formData, queryObj)],
  };

  // console.log('queryObj2:', queryObj2);

  // 不用改以前的逻辑，只要在这里把最终的值处理一下就可以了。
  let query = normalizeQueryOrderBy(queryObj2);
  if (noSort) {
    const { orderby, ...res } = normalizeQueryOrderBy(queryObj2);
    query = res;
  }
  // console.log('query:', query);

  return {
    datasource: new DatasourceKey(formData.datasource).toObject(),
    force: formData.force || false,
    queries: [query],
    result_format: formData.result_format || 'json',
    result_type: formData.result_type || 'full',
  };
}
