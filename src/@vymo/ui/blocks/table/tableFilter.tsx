import _, { noop } from 'lodash';
import React, { useMemo, useState } from 'react';
import { Input, Select } from 'src/@vymo/ui/atoms';
import { TableFilter as FilterProps } from './types';
import styles from './index.module.scss';

type TableFilterProps = {
  table?: any;
  filters: FilterProps[];
  onChange: any;
  rowData?: any;
};

function TableFilter({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  table,
  filters = [],
  onChange = noop,
  rowData = [],
}: TableFilterProps) {
  const [filterValues, setFilterValues] = useState({});

  const columnOptions = useMemo(() => {
    const options = {};
    filters.forEach((filter) => {
      if (filter.type === 'select') {
        const uniqueValues = Array.from(
          new Set(
            table
              ? table
                  .getRowModel()
                  .rows.map((row) => row.getValue(filter.column))
              : rowData.map((row) => _.get(row, filter.column)),
          ),
        );
        options[filter.column] = uniqueValues
          ?.filter(Boolean)
          ?.map((value) => ({
            label: value,
            value,
          }));
      }
    });
    return options;
  }, [table, filters, rowData]);

  if (filters.length === 0) return null;
  return filters.map((filter, index) => {
    if (filter.type === 'text') {
      return (
        <Input
          // eslint-disable-next-line react/no-array-index-key
          key={`${filter.type}__${index}`}
          value={filterValues[filter.column] ?? ''}
          onChange={(value) => {
            setFilterValues({ ...filterValues, [filter.column]: value });
            onChange({ ...filterValues, [filter.column]: value });
          }}
          placeholder={`Filter ${filter.column}...`}
          classNames={styles.table__inputControls__input}
          data-test-id={`filter-${filter.column}`}
          variant="input"
        />
      );
    }
    return (
      <Select
        // eslint-disable-next-line react/no-array-index-key
        key={`${filter.type}__${index}`}
        value={filterValues[filter.column] ?? null}
        multi
        search
        options={columnOptions[filter.column] || []}
        placeholder={`Filter ${_.chain(filter.column)
          .split('.')
          .last()
          .replace(/[_-]/g, ' ')
          .upperFirst()
          .value()}`}
        onChange={(selectedOptions) => {
          setFilterValues({
            ...filterValues,
            [filter.column]: selectedOptions.map((option) => option.value),
          });
          onChange({
            ...filterValues,
            [filter.column]: selectedOptions.map((option) => option.value),
          });
        }}
        classNames={styles.table__inputControls__input}
        data-test-id={`filter-${filter.column}`}
      />
    );
  });
}

export default React.memo(TableFilter);
