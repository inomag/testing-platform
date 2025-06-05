import React, { useCallback } from 'react';
import classnames from 'classnames';
import { ReactComponent as SortAsc } from 'src/assets/icons/sortAscending.svg';
import { ReactComponent as SortDesc } from 'src/assets/icons/sortDescending.svg';
import { ReactComponent as SortNeutral } from 'src/assets/icons/sortNeutral.svg';
import { flexRender } from '@tanstack/react-table';
import styles from './index.module.scss';

function Header({ table, isVirtual = false }) {
  const sortIcon = useCallback((direction, canSort) => {
    if (direction === 'asc') {
      return <SortAsc />;
    }
    if (direction === 'desc') {
      return <SortDesc />;
    }
    if (canSort) {
      return <SortNeutral />;
    }
    return null;
  }, []);
  const rowClass = classnames({
    [styles.table__virtual_head__row]: isVirtual,
  });
  return (
    <thead
      className={isVirtual ? styles.table__virtual_head : styles.table__head}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className={rowClass}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              colSpan={header.colSpan}
              style={{
                width: header.column.id === 'select' ? '24px' : 'auto',
              }}
              className={styles.table__head__row}
            >
              {header.isPlaceholder ? null : (
                <div
                  {...{
                    className: header.column.getCanSort()
                      ? styles.table__head__sortable_field
                      : styles.table__head__field,
                    onClick: header.column.getToggleSortingHandler(),
                  }}
                  aria-hidden="true"
                  data-test-id={`${header.column.id}-header`}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {sortIcon(
                    header.column.getIsSorted(),
                    header.column.getCanSort(),
                  )}
                </div>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

export default React.memo(Header);
