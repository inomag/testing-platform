import _ from 'lodash';
import React, { useCallback, useState } from 'react';
import { Button, Tag, Text } from 'src/@vymo/ui/atoms';
import { Body, Footer, Header, Modal } from 'src/@vymo/ui/blocks';
import { TableGroup } from 'src/@vymo/ui/blocks/table/tableGroup';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppDispatch } from 'src/store/hooks';
import { setCurrentCta } from '../slice';
import { useStepperContext } from '../stepperProvider';
import { saveAction } from '../thunk';
import styles from './index.module.scss';

export type ILicenseProps = {
  tables: {
    tableName: string;
    rows: any;
    metaData: {
      columnConfig: any;
      groupByAttribute: string;
      filters: string[];
      pageSize: number;
      primaryGroup: string;
      selectionAttribute: string;
      selected?: string[];
      enableSelection?: boolean;
    };
  }[];
  cta: [
    {
      title: string;
      action: string;
    },
  ];
};

export default function License({ tables, cta }: ILicenseProps) {
  const dispatch = useAppDispatch();
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [selectedLicenses, setSelectedLicenses] = useState<any>(
    tables.reduce((acc, curr) => {
      (curr.metaData.selected || []).forEach((selectedRow) => {
        acc[selectedRow] = true;
      });
      return acc;
    }, {}),
  );
  const { isDialog, debugMode } = useStepperContext();

  const onLicenseSelect = useCallback(
    (selectedRows) => {
      setSelectedLicenses(selectedRows);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(selectedLicenses)],
  );

  const submitLicenses = useCallback(
    (ctaConfig: any) => {
      setShowConfirmationModal(false);
      dispatch(setCurrentCta({ isDialog, currentCta: ctaConfig }));
      dispatch(
        saveAction({
          payload: { vos: Object.keys(selectedLicenses) },
          isDialog,
          debugMode,
        }),
      );
    },
    [debugMode, dispatch, isDialog, selectedLicenses],
  );

  return (
    <div className={styles.licenseWrapper}>
      {tables.map((table) => (
        <TableGroup
          key={table.tableName}
          data={{
            ...table,
            metaData: {
              ...table.metaData,
              enableSelection: _.has(table.metaData, 'enableSelection')
                ? table.metaData.enableSelection
                : true,
              selections: table.metaData.selected?.reduce((acc, curr) => {
                acc[curr] = true;
                return acc;
              }, {}),
              hideEmpty: true,
            },
          }}
          onRowSelect={onLicenseSelect}
          dataTestId={table.tableName}
        />
      ))}
      {_.some(tables, (table) => table.metaData.enableSelection) && (
        <Button
          onClick={() => setShowConfirmationModal(!showConfirmationModal)}
          size="xLarge"
          data-test-id="save-and-continue"
          disabled={!Object.keys(selectedLicenses).length}
        >
          {locale(Keys.BUTTON_SAVE_AND_CONTINUE)}
        </Button>
      )}

      <Modal
        data-test-id="confirmation-modal"
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(!showConfirmationModal)}
      >
        <Header>
          <Text type="h4">{locale(Keys.CONFIRM_SELECTION)}</Text>
        </Header>
        <Body>
          <div className={styles.modalWrapper}>
            {tables.map((table) => (
              <TableGroup
                key={table.tableName}
                data={{
                  ...table,
                  tableName: (
                    <div>
                      You have made a selection of{' '}
                      <Tag>
                        {
                          _.uniq(
                            table?.rows
                              ?.filter((row) => selectedLicenses[row.code])
                              .map((row) =>
                                _.get(row, table.metaData?.groupByAttribute),
                              ),
                          ).length
                        }{' '}
                        states
                      </Tag>
                      and
                      <Tag>
                        {
                          Object.keys(selectedLicenses).filter(
                            (license) => selectedLicenses[license],
                          ).length
                        }{' '}
                        licenses
                      </Tag>
                    </div>
                  ),
                  rows: table.rows.filter(
                    (row) =>
                      selectedLicenses[row[table.metaData.selectionAttribute]],
                  ),
                  metaData: {
                    ...table.metaData,
                    filters: [],
                    enableSelection: false,
                    selections: selectedLicenses,
                    hideEmpty: true,
                    primaryGroup: '',
                  },
                }}
                dataTestId="selectedLicenses"
                onRowSelect={onLicenseSelect}
              />
            ))}
          </div>
        </Body>
        <Footer>
          <div className={styles.modalWrapper__footer}>
            <Button
              data-test-id="cancel-button"
              onClick={() => setShowConfirmationModal(!showConfirmationModal)}
              size="xLarge"
              type="outlined"
            >
              {locale(Keys.BUTTON_CANCEL)}
            </Button>
            {cta.map((ctaConfig) => (
              <Button
                data-test-id={`${ctaConfig.title}-button`}
                key={ctaConfig.title}
                onClick={() => submitLicenses(ctaConfig)}
                size="xLarge"
              >
                {ctaConfig.title}
              </Button>
            ))}
          </div>
        </Footer>
      </Modal>
    </div>
  );
}
