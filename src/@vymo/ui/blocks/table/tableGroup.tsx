import _ from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { Text } from 'src/@vymo/ui/atoms';
import NoData from 'src/@vymo/ui/blocks/noData';
import classnames from 'classnames';
import Table from '.';
import Search from './search';
import TableFilter from './tableFilter';
import styles from './index.module.scss';

export interface TableGroupProps {
  data: {
    tableName: string | React.ReactElement;
    rows: any;
    metaData: {
      columnConfig: any;
      groupByAttribute?: string;
      primaryGroup?: string;
      filters?: string[];
      pageSize?: number;
      selectionAttribute?: string;
      showSearch?: boolean;
      enableSelection?: boolean;
      selections?: any;
      hideEmpty?: boolean;
    };
  };
  dataTestId?: string;
  onRowSelect?: (selectedRows: any) => void;
}

export function TableGroup({ data, onRowSelect, dataTestId }: TableGroupProps) {
  const [groupFilterValues, setGroupFilterValues] = useState({});
  const [expandPrimaryGroup, setExpandPrimaryGroup] = useState(true);
  const [groupGlobalFilter, setGroupGlobalFilter] = useState('');
  const selectedRows = useRef({});

  const onTableGroupSelect = useCallback((key, selected) => {
    selectedRows.current[key] = selected;
    if (onRowSelect) {
      onRowSelect(
        Object.keys(selectedRows.current || {}).reduce((acc, groupKey) => {
          acc = { ...acc, ...(selectedRows?.current?.[groupKey] || {}) };
          return acc;
        }, {}),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const args = {
    tableData: data.rows,
    columnConfigs: data.metaData.columnConfig,
    onRowSelect: onTableGroupSelect,
    tableConfig: {
      showSearch: data?.metaData?.showSearch,
      hideEmpty: data?.metaData?.hideEmpty,
      name: data.tableName,
      isRowSelectionEnabled: data?.metaData?.enableSelection,
      selectionAttribute: data.metaData?.selectionAttribute,
      fetchSize: 5,
      visualizedRows: false,
      pagination: {
        visible: false,
        pageSize: data.metaData.pageSize,
        currentPage: 1,
      },
      filters: data.metaData?.filters?.map((filter) => ({
        column: filter,
        type: 'select',
      })),
      selections: data.metaData?.selections,
    },
  };

  if (data.metaData.groupByAttribute) {
    const groupByAttribute = (rowData, attribute) =>
      rowData.reduce((result, row) => {
        const key = _.get(row, attribute);
        if (!result[key]) {
          result[key] = [];
        }
        result[key].push(row);
        return result;
      }, {});

    const updateTableCols = (columns, attribute) =>
      columns.map((col) => {
        if (col.field === attribute) {
          return { ...col, visible: false };
        }
        return col;
      });

    const groupedData = groupByAttribute(
      data.rows,
      data.metaData.groupByAttribute,
    );

    // Example usage
    const updatedTableCols = updateTableCols(
      data.metaData.columnConfig,
      data.metaData.groupByAttribute,
    );
    const tableInputsWrapperClasses = classnames({
      [styles.table__inputControls]: data.metaData?.filters?.length,
    });
    return (
      <div className={styles.tableGroup} data-test-id={dataTestId}>
        <Text type="h5">{data.tableName}</Text>
        {(data.metaData?.filters?.length || data.metaData.showSearch) && (
          <div className={tableInputsWrapperClasses}>
            <div className={styles.table__inputControls__filterWrapper}>
              <TableFilter
                filters={
                  data.metaData?.filters?.map((filter) => ({
                    column: filter,
                    type: 'select',
                  })) || []
                }
                rowData={data.rows}
                onChange={(values) => {
                  setGroupFilterValues(values);
                  setExpandPrimaryGroup(false);
                }}
              />
            </div>
            {data.metaData?.showSearch && (
              <Search onChange={(value) => setGroupGlobalFilter(value)} />
            )}
          </div>
        )}
        {Object.keys(groupedData).length === 0 && (
          <NoData
            message="No Rows Found"
            classNames={styles.tableGroup__noData}
          />
        )}
        {Object.keys(groupedData).map((key) => (
          <Table
            key={key}
            {...args}
            tableData={groupedData[key]}
            tableConfig={{
              ...args.tableConfig,
              name: key,
              showSearch: false,
              hideFilters: true,
              hideEmpty: true,
            }}
            columnConfigs={updatedTableCols}
            groupFilterValues={groupFilterValues}
            groupGlobalFilter={groupGlobalFilter}
            data-test-id={`${dataTestId}-${key}`}
            expandTable={
              data.metaData?.primaryGroup && expandPrimaryGroup
                ? key === data.metaData?.primaryGroup
                : true
            }
          />
        ))}
      </div>
    );
  }

  return <Table {...args} data-test-id={dataTestId} />;
}
