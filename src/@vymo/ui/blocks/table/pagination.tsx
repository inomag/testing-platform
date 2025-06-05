import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'src/@vymo/ui/atoms';
import Select from 'src/@vymo/ui/atoms/select';
import Text from 'src/@vymo/ui/atoms/text';
import styles from './index.module.scss';

function Pagination({
  table,
  currentPage = 1,
  pageSize = 10,
  'data-test-id': dataTestId = 'pagination',
}) {
  const [pageIndex, setPageIndex] = useState(1);
  const [visiblePageIndex, setVisiblePageIndex] = useState(1);
  const [visiblePages, setVisiblePages] = useState<number[]>([]);

  const options = useMemo(
    () =>
      [10, 20, 30, 40, 50].map((item) => ({
        label: item.toLocaleString(),
        value: item.toLocaleString(),
      })),
    [],
  );
  useEffect(() => {
    setPageIndex(currentPage);
    table.setPageSize(Number(pageSize));
  }, [currentPage, pageSize, table]);

  useEffect(() => {
    const page = pageIndex ? pageIndex - 1 : 0;
    table.setPageIndex(page);
  }, [pageIndex, table]);

  useEffect(() => {
    if (table.getPageCount()) {
      setVisiblePageIndex(Math.floor(table.getPageCount() / 2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, table.getPageCount()]);

  useEffect(() => {
    const pageCount = table.getPageCount();
    const pageRange = Math.min(5, pageCount);
    const startPage = Math.max(
      2,
      Math.min(visiblePageIndex - 2, pageCount - pageRange),
    );
    const endPage = Math.min(pageCount - 1, startPage + pageRange - 1);
    setVisiblePages(
      Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, visiblePageIndex, table.getPageCount(), pageIndex]);

  const handleOnEllipseClick = useCallback(
    (dir) => {
      if (dir === 'right') {
        setVisiblePageIndex(
          Math.floor((visiblePageIndex + table.getPageCount()) / 2),
        );
      } else setVisiblePageIndex(Math.floor((1 + visiblePageIndex) / 2));
    },
    [table, visiblePageIndex],
  );

  const handlePageIndexClick = useCallback(
    (dir, index = -1) => {
      if (index > 0) {
        setPageIndex(index);
        setVisiblePageIndex(index);
      } else {
        const newPageIndex = dir === 'right' ? pageIndex + 1 : pageIndex - 1;
        setPageIndex(newPageIndex);
        setVisiblePageIndex(newPageIndex);
      }
    },
    [pageIndex],
  );

  const buttonType = useCallback(
    (curIndex) => {
      if (curIndex === Number(pageIndex)) {
        return 'primary';
      }
      return 'outlined';
    },
    [pageIndex],
  );
  return (
    <div className={styles.table__pagination} data-test-id={dataTestId}>
      <Button
        type="outlined"
        onClick={() => handlePageIndexClick('left')}
        disabled={pageIndex === 1}
        size="small"
        data-test-id="pagination-button-left"
      >
        {'<'}
      </Button>
      <Button
        type={buttonType(1)}
        onClick={() => handlePageIndexClick('', 1)}
        size="small"
        className={styles.table__pagination__btn}
      >
        {1}
      </Button>
      {visiblePages && visiblePages[0] > 2 && (
        <Button
          type="outlined"
          onClick={() => handleOnEllipseClick('left')}
          size="small"
        >
          ...
        </Button>
      )}
      {visiblePages?.map((index) => (
        <Button
          onClick={() => handlePageIndexClick('', index)}
          type={buttonType(index)}
          size="small"
          data-test-id={`pagination-button-${index}`}
        >
          {index}
        </Button>
      ))}
      {visiblePages &&
        visiblePages[visiblePages.length - 1] < table.getPageCount() - 1 && (
          <Button
            type="outlined"
            onClick={() => handleOnEllipseClick('right')}
            size="small"
          >
            ...
          </Button>
        )}
      {table.getPageCount() !== 1 && (
        <Button
          type={buttonType(table.getPageCount())}
          onClick={() => handlePageIndexClick('', table.getPageCount())}
          size="small"
          data-test-id="pagination-button-1"
        >
          {table.getPageCount()}
        </Button>
      )}
      <Button
        type="outlined"
        onClick={() => handlePageIndexClick('right')}
        disabled={pageIndex === table.getPageCount()}
        size="small"
        data-test-id="pagination-button-right"
      >
        {'>'}
      </Button>
      <div className={styles.table__pagination__page_size}>
        <Text>Page Size</Text>
        <Select
          value={table.getState().pagination.pageSize?.toString()}
          // @ts-ignore
          onChange={(option) => {
            const { value } = option[0];
            table.setPageSize(Number(value));
          }}
          options={options}
          data-test-id="pagination-select-page-size"
        />
      </div>
    </div>
  );
}

export default Pagination;
