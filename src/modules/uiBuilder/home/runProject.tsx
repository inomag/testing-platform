import React, { useCallback, useState } from 'react';
import { Button, Tag } from 'src/@vymo/ui/atoms';
import { Body, Header, List, Modal, NoData } from 'src/@vymo/ui/blocks';
// import { getSearchResultsForComponents } from '../builder/leftPane/queries';
// import { getFlattenProjects } from '../queries';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
// import { ReactComponent as SearchIcon } from 'src/assets/icons/search.svg';
import { useAppDispatch } from 'src/store/hooks';
import { renderModule } from 'src/workspace/slice';
import { Templates } from '../types';
import styles from './index.module.scss';

function TemplateItem({ templateItem }) {
  const dispatch = useAppDispatch();
  const { local, git } = templateItem as Templates[string];

  return (
    <>
      {/* Local Template (Draft) */}
      {local?.name && (
        <List.Item
          onItemClick={() =>
            dispatch(
              renderModule({
                id: 'UI_RUNNER',
                props: { appProjectName: local.name },
              }),
            )
          }
          className={styles.selectionTemplate__content__item}
        >
          <div className={styles.selectionTemplate__content__item__left}>
            <div>{local.name}</div>
          </div>
          <div className={styles.selectionTemplate__content__item__right}>
            <Tag variant="info">{local.project}</Tag>
          </div>
        </List.Item>
      )}

      {/* Git Template */}
      {git?.name && (
        <List.Item
          onItemClick={() =>
            dispatch(
              renderModule({
                id: 'UI_RUNNER',
                props: { appProjectName: git.name },
              }),
            )
          }
          className={styles.selectionTemplate__content__item}
        >
          <div className={styles.selectionTemplate__content__item__left}>
            <div>{git.name}</div>
          </div>
          <div className={styles.selectionTemplate__content__item__right}>
            <Tag variant="info">{git.project}</Tag>
          </div>
        </List.Item>
      )}
    </>
  );
}

function TemplateList({
  templatesList,
  onClickTemplate,
  sliceIndex = templatesList.length,
}) {
  return Object.keys(templatesList).length > 0 ? (
    <List className={styles.selectionTemplate__content__list}>
      {Object.keys(templatesList)
        .slice(0, sliceIndex)
        .map((key, index) => (
          <TemplateItem
            templateItem={templatesList[key]}
            // @ts-ignore
            onClickTemplate={onClickTemplate}
            index={index}
          />
        ))}
    </List>
  ) : (
    <NoData message={locale(Keys.NO_PROJECTS)} />
  );
}

function RunProject({ templates }: { templates: Templates }) {
  const [showTemplateModal, selectShowTemplateModal] = useState(false);

  const [templatesList] = useState(templates);

  const onClickMoreTemplates = useCallback(() => {
    selectShowTemplateModal(true);
  }, []);

  const onClickTemplate = useCallback(() => {
    selectShowTemplateModal(false);
  }, []);

  return (
    <>
      <div className={styles.selectionTemplate}>
        <div className={styles.selectionTemplate__content}>
          <TemplateList
            templatesList={templatesList}
            onClickTemplate={onClickTemplate}
            sliceIndex={4}
          />

          {Object.keys(templatesList).length > 4 && (
            <Button size="small" type="text" onClick={onClickMoreTemplates}>
              {locale(Keys.MORE)}
            </Button>
          )}
        </div>
      </div>

      {showTemplateModal && (
        <Modal onClose={() => selectShowTemplateModal(false)}>
          <Header>Projects</Header>
          <Body>
            {/* <Input
              value={searchValue}
              classNames={styles.sidebar__input}
              iconRight={<SearchIcon />}
              onChange={handleSearch}
              placeholder="Search"
            /> */}

            <TemplateList
              templatesList={templatesList}
              onClickTemplate={onClickTemplate}
            />
          </Body>
        </Modal>
      )}
    </>
  );
}

export default RunProject;
