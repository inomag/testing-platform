import React from 'react';
import { flexRender } from '@tanstack/react-table';
import styles from './index.module.scss';

const Cell = React.memo(({ cell }: { cell: any }) => (
  <td className={styles.table__body__cell}>
    {flexRender(cell.column.columnDef.cell, cell.getContext())}
  </td>
));

function Row({ row }) {
  return (
    <tr data-test-id={`table-row-${row.id}`}>
      {row.getVisibleCells().map((cell) => (
        <Cell key={cell.id} cell={cell} />
      ))}
    </tr>
  );
}

export default React.memo(Row);
