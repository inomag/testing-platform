import React, { useState } from 'react';
import { Tag, Text } from 'src/@vymo/ui/atoms';
import { List, NoData } from 'src/@vymo/ui/blocks';
import Tooltip from 'src/@vymo/ui/blocks/tooltip';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { UIBuilderState } from '../types';
import styles from './index.module.scss';

function TemplateItem({ templateItem, onClickTemplate, index, setError }) {
  const { name, isDraft, draftVersion, project } =
    templateItem as UIBuilderState['project']['selfserve'];

  const onItemClick = () => {
    if (!draftVersion) {
      onClickTemplate(index);
    } else {
      setError(
        locale(Keys.TEMPLATE_DRAFT_VERSION_EXISTS_ERROR, { draftVersion }),
      );
    }
  };

  return (
    <List.Item
      onItemClick={onItemClick}
      className={styles.selectionTemplate__content__item}
    >
      <div className={styles.selectionTemplate__content__item__left}>
        {isDraft && (
          <Tooltip content={locale(Keys.TEMPLATE_NOT_PUBLISHED)}>
            {name}
          </Tooltip>
        )}
        {!isDraft &&
          (draftVersion ? (
            <Tooltip
              content={locale(Keys.TEMPLATE_DRAFT_ALREADY_EXISTS, {
                draftVersion,
              })}
            >
              {name}
            </Tooltip>
          ) : (
            name
          ))}
      </div>

      <div className={styles.selectionTemplate__content__item__right}>
        <Tag variant="info">{project}</Tag>
      </div>
    </List.Item>
  );
}

function TemplateList({
  templatesList,
  onClickTemplate,
  sliceIndex = templatesList.length,
}) {
  const [error, setError] = useState('');

  return templatesList.length > 0 ? (
    <>
      <List className={styles.selectionTemplate__content__list}>
        {templatesList.slice(0, sliceIndex).map((templateItem, index) => (
          <TemplateItem
            templateItem={templateItem}
            onClickTemplate={onClickTemplate}
            index={index}
            setError={setError}
          />
        ))}
      </List>
      {error && <Text variant="error">{error}</Text>}
    </>
  ) : (
    <NoData message={locale(Keys.NO_PROJECTS)} />
  );
}

export default TemplateList;
