import { DataMask } from 'src/core';

export const getChartDataMask = (
  values: any[],
  groupby: any[],
  groupbyValues: any[],
): DataMask => {
  return {
    extraFormData: {
      filters:
        values.length === 0
          ? []
          : groupby.map((col: any, idx: string | number) => {
              const val = groupbyValues.map(v => v[idx]);
              if (val === null || val === undefined) {
                return {
                  col,
                  op: 'IS NULL',
                };
              }
              return {
                col,
                op: 'IN',
                val: val as (string | number | boolean)[],
              };
            }),
    },
    filterState: {
      value: groupbyValues.length ? groupbyValues : null,
      selectedValues: values.length ? values : null,
    },
  };
};
