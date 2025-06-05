import _ from 'lodash';
import React, { useCallback, useRef } from 'react';
import { Avatar, Divider, Tag, Text } from 'src/@vymo/ui/atoms';
import { NoData } from 'src/@vymo/ui/blocks';
import SkeletonLoader from 'src/@vymo/ui/blocks/skelton';
import { TableGroup } from 'src/@vymo/ui/blocks/table/tableGroup';
import TabLayout from 'src/@vymo/ui/blocks/tabs';
import { Form } from 'src/@vymo/ui/molecules';
import { FormVersion } from 'src/@vymo/ui/molecules/form/types';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { getClientConfigData } from 'src/workspace/utils';
import { getConvertedValues } from '../queries';
import styles from './index.module.scss';

export type CategoryLayoutProps = {
  layoutData: any;
  refreshCategory: (key: string) => void;
  isLoading: Boolean;
};

export function CategoryLayout({
  layoutData,
  refreshCategory,
  isLoading,
}: CategoryLayoutProps) {
  const formRef = useRef(null);
  const { branding } = getClientConfigData();

  const handleFormChange = useCallback(() => {}, []);

  const getLayout = () => {
    if (isLoading) {
      return <SkeletonLoader lines={4} />;
    }

    switch (layoutData.type) {
      case 'grouping_view':
        if (_.isEmpty(layoutData.groups)) {
          return <NoData classNames={styles.layout__noData} />;
        }
        return (
          <div className={styles.layout__input}>
            {layoutData.groups?.map((group, idx) => (
              <div className={styles.layout__input__subGroup}>
                <span className={styles.layout__input__subGroup__title}>
                  {group.name}
                </span>
                {!_.isEmpty(group?.inputs || []) ? (
                  <Form
                    key={layoutData.code}
                    ref={formRef}
                    id="grouping_view"
                    name="userProfile"
                    onChange={handleFormChange}
                    className={styles.layout__input__subGroup__form}
                    config={{
                      version: FormVersion.web,
                      data: group.inputs || [],
                      grouping: [],
                      fieldItemConfig: {
                        showDisabledIcon: true,
                      },
                      viewMode: true,
                    }}
                    value={getConvertedValues(group.inputs || [])}
                  />
                ) : (
                  <NoData
                    classNames={styles.layout__noData}
                    message={locale(Keys.NO_INPUTS_FOUND)}
                  />
                )}
                {idx < layoutData.groups.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        );
      case 'input_list_view':
        return (
          <div className={styles.layout__userList}>
            {layoutData.users
              ?.filter((user) => !_.isEmpty(user))
              ?.map(({ name, profile_photo_s3_link: imageUrl, inputs_map }) => (
                <div
                  className={styles.layout__userList__user}
                  data-test-id="user_item"
                >
                  <Avatar
                    imageUrl={imageUrl}
                    text={name.charAt(0)}
                    shape="circle"
                    background={branding?.colors?.secondary}
                    size="small"
                  />
                  <div className={styles.layout__userList__user__info}>
                    <Text type="h5" bold>
                      {name}
                    </Text>
                    <Tag variant="info" bold>
                      {inputs_map.role}
                    </Tag>
                  </div>
                </div>
              ))}
          </div>
        );
      case 'table_view':
        if (layoutData.tables?.length > 0) {
          return (
            <div className={styles.layout__table}>
              {layoutData.tables?.map((table) => (
                <TableGroup
                  key={table.tableName}
                  data={{
                    ...table,
                    metaData: {
                      ...table.metaData,
                      enableSelection: false,
                      hideEmpty: true,
                    },
                  }}
                  onRowSelect={() => {}}
                  dataTestId={table.tableName}
                />
              ))}
            </div>
          );
        }
        return <NoData classNames={styles.layout__noData} />;

      default:
        return <NoData classNames={styles.layout__noData} />;
    }
  };

  return layoutData.tabItems.length ? (
    <TabLayout
      items={layoutData.tabItems.map((item) => ({
        ...item,
        children: getLayout(),
      }))}
      defaultKey={layoutData.selectedTab}
      onChange={refreshCategory}
      classNames={styles.layout__tab}
    />
  ) : (
    getLayout()
  );
}
