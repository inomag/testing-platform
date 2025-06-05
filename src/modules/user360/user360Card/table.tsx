import React from 'react';
import Text from 'src/@vymo/ui/atoms/text';
import { NoData } from 'src/@vymo/ui/blocks';
import { TableGroup } from 'src/@vymo/ui/blocks/table/tableGroup';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import styles from './index.module.scss';

function TableView({ data, card }) {
  const { results = [] } = data;
  return (
    <>
      <div className={styles.lastEngagementHeader}>
        <Text semiBold type="h5">
          {card.name}
        </Text>
      </div>
      {results.length === 0 && (
        <NoData
          message={locale(Keys.NO_DATA_FOUND_FOR_CARD, { cardName: card.name })}
        />
      )}

      <div className={styles.layout__table}>
        {results?.map((table: any) => (
          <TableGroup
            key={table.tableName}
            data={{
              ...table,
              metaData: {
                ...table.metaData,
                hideEmpty: true,
              },
            }}
            onRowSelect={() => {}}
            dataTestId={table.tableName}
          />
        ))}
      </div>
    </>
  );
}

export default TableView;
