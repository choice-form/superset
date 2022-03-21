import isEmpty from 'lodash/isEmpty';
import {
  buildQueryObject,
  DatasourceKey,
  QueryFormData,
  QueryObject,
} from 'src/core';
import { pivotOperator } from 'src/chartConntrols';

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
    // @ts-ignore
    ![undefined, null].includes(timeseries_limit_metric) &&
    !isEmpty(legacy_order_by)
  ) {
    return {
      ...baseQueryObject,
      // @ts-ignore
      orderby: [[timeseries_limit_metric, isAsc]],
    };
  }

  // 指标排序
  if (
    // @ts-ignore
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
export function getQueryContext(formData: QueryFormData, noSort: boolean) {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
