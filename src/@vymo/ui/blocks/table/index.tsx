/* eslint-disable complexity */

/* eslint-disable react/no-unstable-nested-components */
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox } from 'src/@vymo/ui/atoms';
// eslint-disable-next-line vymo-ui/restrict-import
import { Collapsible } from 'src/@vymo/ui/blocks';
import classnames from 'classnames';
import { ReactComponent as CollapsibleIcon } from 'src/assets/icons/collapsibleArrow.svg';
import Header from './header';
import Pagination from './pagination';
import Row from './row';
import Search from './search';
import TableFilter from './tableFilter';
import { TableProps } from './types';
import VirtualizedRows from './virtualizedRows';
// eslint-disable-next-line import/order
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// eslint-disable-next-line import/order
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import styles from './index.module.scss';

//  Sample custom sorting example on Status column
//  const sortFn = (rowA, rowB, _columnId) => {
//     // rowA.original.<columnID>
//     const statusA = rowA.original.status;
//     const statusB = rowB.original.status;
//     const statusOrder = ['Single', 'Married', 'Widowed', 'relationship'];
//     return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
//   };

function Table({
  tableData,
  tableConfig = { name: 'Table' },
  columnConfigs = [],
  sortOn,
  onSort,
  onRowSelect = () => {},
  'data-test-id': dataTestId = '',
  classNames,
  groupFilterValues = {},
  groupGlobalFilter = '',
  expandTable = true,
}: TableProps) {
  const [globalFilter, setGlobalFilter] = useState(groupGlobalFilter);
  const [rowSelection, setRowSelection] = React.useState(
    tableConfig.selections || {},
  );
  const [filterValues, setFilterValues] = useState(groupFilterValues);

  useEffect(() => {
    if (!_.isEqual(groupFilterValues, filterValues)) {
      setFilterValues(groupFilterValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupFilterValues]);

  useEffect(() => {
    if (!_.isEqual(groupGlobalFilter, globalFilter)) {
      setGlobalFilter(groupGlobalFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupGlobalFilter]);

  const columnVisibility = useMemo(() => {
    if (columnConfigs) {
      const columns = columnConfigs.reduce((acc, column) => {
        acc[column.field] = column.visible;
        return acc;
      }, {});
      return columns;
    }
    return [];
  }, [columnConfigs]);

  const memoizedColumns = useMemo<ColumnDef<any>[]>(() => {
    const tableColumns = columnConfigs?.map((column) => {
      const newColumn: any = {
        accessorKey: column.field,
        id: column.field,
        header: column.title,
        enableSorting: column.canSort,
        cell: (info) => info.getValue(),
        filterFn: (row, columnId, filterValue) => {
          const rowValue = row.getValue(columnId);

          // If filterValue is an array, check if any option matches rowValue
          if (Array.isArray(filterValue) && filterValue.length) {
            return filterValue.includes(rowValue);
          }

          // If filterValue is a string, check if it is included in rowValue
          if (typeof filterValue === 'string') {
            return rowValue.toString().includes(filterValue);
          }

          // Default return true if filterValue is neither array nor string
          return true;
        },
      };
      if (onSort) {
        newColumn.sortingFn = onSort;
      }
      return newColumn;
    });
    if (tableConfig?.isRowSelectionEnabled) {
      tableColumns.unshift({
        id: 'select',
        cell: ({ row }) => (
          <Checkbox
            value={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={(checked, value, event) =>
              row.getToggleSelectedHandler()(event)
            }
            data-test-id={`table-row-select-${row.id}`}
          />
        ),
      });
    }
    return tableColumns;
  }, [columnConfigs, onSort, tableConfig?.isRowSelectionEnabled]);

  const table = useReactTable({
    data: tableData,
    columns: memoizedColumns || [],
    state: {
      globalFilter,
      rowSelection,
      columnVisibility,
    },
    initialState: {
      sorting: [
        {
          id: sortOn?.column || '',
          desc: sortOn?.defaultSort === 'desc',
        },
      ],
    },
    enableRowSelection: true,
    getRowId: (row) => _.get(row, tableConfig.selectionAttribute || 'id'),
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    table.setRowSelection(rowSelection);
  }, [rowSelection, table]);

  useEffect(() => {
    if (onRowSelect) {
      onRowSelect(tableConfig.name, table.getState().rowSelection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRowSelect, table?.getState()?.rowSelection]);

  // Apply filters to the table whenever filterValues changes
  useEffect(() => {
    const columnFilters = Object.keys(filterValues).map((columnId) => ({
      id: columnId,
      value: filterValues[columnId],
    }));
    table.setColumnFilters(columnFilters);
  }, [filterValues, table]);

  // Sorts table data on initial state
  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === sortOn?.column) {
      if (table.getState().sorting[0]?.id !== sortOn?.column) {
        table.setSorting([
          { id: sortOn?.column, desc: sortOn?.defaultSort === 'desc' },
        ]);
      }
    }
  }, [sortOn, table]);

  const tableClasses = classnames([styles.table], classNames);

  const tableInputsWrapperClasses = classnames({
    [styles.table__inputControls]:
      tableConfig?.showSearch || tableConfig?.filters?.length,
  });

  const queryClient = new QueryClient();
  if (tableConfig.hideEmpty && table.getRowModel()?.rows?.length === 0) {
    return null;
  }
  return (
    <div className={tableClasses} data-test-id={`table-${dataTestId}`}>
      <div className={tableInputsWrapperClasses}>
        {!tableConfig.hideFilters && (
          <div className={styles.table__inputControls__filterWrapper}>
            <TableFilter
              filters={tableConfig.filters || []}
              table={table}
              onChange={setFilterValues}
            />
          </div>
        )}

        {tableConfig?.showSearch && (
          <Search onChange={(value) => setGlobalFilter(value)} />
        )}
      </div>
      <Collapsible
        title={
          <div className={styles.table__collapsible__header}>
            {tableConfig.isRowSelectionEnabled && (
              <Checkbox
                value={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={(checked, value, event) => {
                  event.stopPropagation();
                  table.getToggleAllRowsSelectedHandler()(event);
                }}
              />
            )}
            <div className={styles.table__collapsible__title}>
              {tableConfig?.name}
            </div>
            <CollapsibleIcon />
          </div>
        }
        iconRight={<span />}
        open={expandTable}
        className={styles.table__collapsible}
      >
        {!tableConfig?.pagination?.visible && tableConfig.visualizedRows ? (
          <QueryClientProvider client={queryClient}>
            <VirtualizedRows
              columns={memoizedColumns}
              fetchData={tableConfig.fetchData}
              onRowSelect={onRowSelect}
              fetchSize={tableConfig?.fetchSize}
              tableConfig={tableConfig}
            />
          </QueryClientProvider>
        ) : (
          <table
            className={styles.table__tag}
            data-test-id={`table-index-${
              table.getState().pagination.pageIndex + 1
            }`}
          >
            <Header table={table} />
            <tbody className={styles.table__body}>
              {table.getRowModel().rows.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        )}
      </Collapsible>
      {tableConfig?.pagination?.visible && (
        <Pagination
          table={table}
          currentPage={tableConfig.pagination?.currentPage}
          pageSize={tableConfig.pagination?.pageSize}
        />
      )}
    </div>
  );
}

export default React.memo(Table);
