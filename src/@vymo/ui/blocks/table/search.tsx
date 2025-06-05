import { noop } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Input } from 'src/@vymo/ui/atoms';
import classnames from 'classnames';
import styles from './index.module.scss';

function Search({ onChange = noop, classNames = '' }) {
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(searchValue);
    }, 500);
    return () => clearInterval(timer);
  }, [onChange, searchValue]);

  const searchClasses = classnames(
    [styles.table__inputControls__input],
    classNames,
  );
  return (
    <Input
      value={searchValue ?? ''}
      onChange={(value) => setSearchValue(value)}
      placeholder="Search..."
      classNames={searchClasses}
      data-test-id="search"
    />
  );
}

export default React.memo(Search);
