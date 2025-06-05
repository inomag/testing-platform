import _ from 'lodash';
import React, { useState } from 'react';
import { Input, Text } from 'src/@vymo/ui/atoms';
import { Collapsible, ImageLoader, List } from 'src/@vymo/ui/blocks';
import { useDraggable } from '@dnd-kit/core';
import { ReactComponent as SearchIcon } from 'src/assets/icons/search.svg';
import useContainerSize from 'src/hooks/useContainerSize';
import { getSearchResultsForComponents } from './queries';
import styles from './index.module.scss';

function DraggableItem({
  id,
  componentType,
}: {
  id: string;
  componentType: string;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: {
      componentType,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={styles.sidebar__list__item}
    >
      <ImageLoader
        className={styles.sidebar__list__item__image}
        src={`/images/components/${id.toLowerCase()}.png`}
        alt={id}
      />
      <Text semiBold>{id}</Text>
    </div>
  );
}

function Sidebar({ components }) {
  const [componentsList, setComponentsList] = useState(components);

  const [searchValue, setSearchValue] = useState('');

  const [containerRef, containerSize] = useContainerSize();

  const handleSearch = (value) => {
    setSearchValue(value);
    if (!value) {
      setComponentsList(components);
    } else {
      //
      setComponentsList(getSearchResultsForComponents(components, value));
    }
  };

  return (
    <div
      className={styles.sidebar}
      ref={containerRef}
      style={{ height: containerSize.height }}
    >
      <Input
        classNames={styles.sidebar__input}
        iconRight={<SearchIcon />}
        onChange={handleSearch}
        placeholder="Search"
      />
      {Object.keys(componentsList).map((componentType) => (
        <Collapsible
          data-test-id={`${componentType}-collapsible`}
          border={false}
          title={_.capitalize(componentType)}
          open={Boolean(searchValue.length)}
        >
          <List className={styles.sidebar__list}>
            {Object.keys(componentsList[componentType]).map((name) => (
              <List.Item data-test-id={name}>
                <DraggableItem id={name} componentType={componentType} />
              </List.Item>
            ))}
          </List>
        </Collapsible>
      ))}
    </div>
  );
}

export default Sidebar;
