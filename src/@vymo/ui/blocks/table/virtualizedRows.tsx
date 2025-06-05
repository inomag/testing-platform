import React from 'react';
import classnames from 'classnames';
// eslint-disable-next-line import/order
import Header from './header';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import styles from './index.module.scss';

function VirtualizedRows({
  columns,
  fetchData,
  onRowSelect,
  fetchSize = 50,
  tableConfig,
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: [sorting],
    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number) * fetchSize;
      const fetchedData = await fetchData(start, fetchSize, sorting);
      return fetchedData;
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page?.data) ?? [],
    [data],
  );
  const table = useReactTable({
    data: flatData,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    debugTable: true,
  });
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 20,
    getScrollElement: () => tableContainerRef?.current,
    // measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });
  // scroll to top of table when sorting changes
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    if (table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  };
  table.setOptions((prev) => ({
    ...prev,
    onSortingChange: handleSortingChange,
  }));

  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        // once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );

  const rowClass = classnames({
    [styles.table__row_selectable]: tableConfig?.isRowSelectionEnabled,
  });

  if (isLoading) {
    return <>Loading...</>;
  }
  return (
    <div>
      <div
        onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        ref={tableContainerRef}
        className={styles.table__virtual_container}
      >
        <table
          className={styles.table__tag}
          data-test-id={`table-index-${
            table.getState().pagination.pageIndex + 1
          }`}
        >
          <Header table={table} isVirtual />
          <tbody
            className={styles.table__body}
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  data-index={virtualRow.index}
                  ref={(node) => rowVirtualizer.measureElement(node)}
                  key={row.id}
                  onClick={() => onRowSelect(row.original)}
                  className={rowClass}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={styles.table__body__cell}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isFetching && <div>Fetching More...</div>}
    </div>
  );
}
export default VirtualizedRows;
