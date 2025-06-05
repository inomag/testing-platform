import _ from 'lodash';
import React, { useCallback, useState } from 'react';
import { Button, Input } from 'src/@vymo/ui/atoms';
import { Body, Header, Modal } from 'src/@vymo/ui/blocks';
import { ReactComponent as SearchIcon } from 'src/assets/icons/search.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppDispatch } from 'src/store/hooks';
// import { ReactComponent as StorageIcon } from 'src/assets/icons/storage.svg';
import { renderModule } from 'src/workspace/slice';
import { getSearchResultsForComponents } from '../builder/leftPane/queries';
import { getProjectTemplatesByType } from '../queries';
import { setProjectData } from '../slice';
import { Templates } from '../types';
import TemplateList from './templateList';
import styles from './index.module.scss';

function SelectTemplate({
  templates,
  showModalOnly = false,
  isLocal = false,
  goToStep = _.noop,
}: {
  templates: Templates;
  showModalOnly?: boolean;
  isLocal?: boolean;
  goToStep?: (step: number) => void;
}) {
  const dispatch = useAppDispatch();
  const [showTemplateModal, selectShowTemplateModal] = useState(false);

  const [templatesList, setTemplatesList] = useState(
    getProjectTemplatesByType(templates, isLocal),
  );

  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value) => {
    setSearchValue(value);
    if (!value) {
      setTemplatesList(getProjectTemplatesByType(templates, isLocal));
    } else {
      // @ts-ignore
      setTemplatesList(getSearchResultsForComponents(templatesList, value));
    }
  };

  const onClickMoreTemplates = useCallback(() => {
    selectShowTemplateModal(true);
  }, []);

  const onClickTemplate = useCallback(
    (itemIndex) => {
      const selectedTemplate = templatesList[itemIndex];
      if (isLocal) {
        selectShowTemplateModal(false);
        dispatch(
          renderModule({
            id: 'UI_BUILDER',
            // @ts-ignore
            props: { appProjectName: selectedTemplate.name },
          }),
        );
      } else {
        dispatch(
          setProjectData({
            ...selectedTemplate,
            name: `${selectedTemplate.name} Draft V1`,
          }),
        );
        goToStep(2);
      }
    },
    [dispatch, goToStep, isLocal, templatesList],
  );

  return (
    <>
      {!showModalOnly && (
        <div className={styles.selectionTemplate}>
          <div className={styles.selectionTemplate__content}>
            <TemplateList
              templatesList={templatesList}
              onClickTemplate={onClickTemplate}
              sliceIndex={4}
            />

            {templatesList.length > 4 && (
              <Button size="small" type="text" onClick={onClickMoreTemplates}>
                {locale(Keys.MORE)}
              </Button>
            )}
          </div>
        </div>
      )}

      {(showTemplateModal || showModalOnly) && (
        <Modal
          onClose={() =>
            showModalOnly ? goToStep(0) : selectShowTemplateModal(false)
          }
        >
          <Header>Templates</Header>
          <Body>
            <Input
              value={searchValue}
              classNames={styles.sidebar__input}
              iconRight={<SearchIcon />}
              onChange={handleSearch}
              placeholder="Search"
            />

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

export default SelectTemplate;
