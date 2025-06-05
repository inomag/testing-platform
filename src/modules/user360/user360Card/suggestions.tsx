import _ from 'lodash';
import React from 'react';
import { Button, Divider, Tag } from 'src/@vymo/ui/atoms';
import Text from 'src/@vymo/ui/atoms/text';
import { Card, NoData } from 'src/@vymo/ui/blocks';
import { ReactComponent as SampleIcon } from 'src/assets/icons/pending.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { processSuggestions } from './queries';
import styles from './index.module.scss';

function Suggestions({ data = { suggestions: [] }, card }) {
  const suggestionsData: {
    ctas: any;
    title: string;
    message: string;
    dateText: string;
    tagText: string;
    tagColor: string;
    iconResource: string;
  }[] = processSuggestions(data.suggestions || []);
  return (
    <>
      <div className={styles.lastEngagementHeader}>
        <Text semiBold type="h5">
          {card.name}
        </Text>
      </div>
      {suggestionsData.length === 0 && (
        <NoData
          message={locale(Keys.NO_DATA_FOUND_FOR_CARD, { cardName: card.name })}
        />
      )}
      <div className={styles.suggestionsWrapper}>
        {suggestionsData.map((suggestion) => (
          <Card classNames={styles.suggestionsWrapper__card}>
            <Tag className={styles.suggestionsWrapper__card__tag}>
              {_.upperCase(suggestion.tagText)}
            </Tag>
            <div className={styles.suggestionsWrapper__card__infoWrapper}>
              <SampleIcon />
              <div
                className={styles.suggestionsWrapper__card__infoWrapper__info}
              >
                <Text semiBold type="h5">
                  {suggestion.title}
                </Text>
                <Text type="label">{suggestion.message}</Text>
              </div>
            </div>
            {suggestion.ctas?.length > 0 && (
              <>
                <Divider />
                <div className={styles.suggestionsWrapper__card__ctaWrapper}>
                  {suggestion.ctas.map((cta) => (
                    <Button type="text">
                      <Text type="label">{_.upperCase(cta.text)}</Text>
                    </Button>
                  ))}
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}

export default Suggestions;
