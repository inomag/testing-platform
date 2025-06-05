import React, { useRef } from 'react';
import { Button, Divider, Text } from 'src/@vymo/ui/atoms';
import { NoData } from 'src/@vymo/ui/blocks';
import SkeletonLoader from 'src/@vymo/ui/blocks/skelton';
import { Form } from 'src/@vymo/ui/molecules';
import { FormVersion } from 'src/@vymo/ui/molecules/form/types';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { WORKFLOW_FORM } from 'src/modules/constants';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { renderDialog } from 'src/workspace/slice';
import { getClientConfigData } from 'src/workspace/utils';
import { getConvertedValues, processDetailInputs } from '../queries';
import { getCardData, getError, getIsLoading } from '../selectors';
import { CardConfig } from '../types';
import { getUserEditButtonConfig } from '../userActions/queries';
import styles from './index.module.scss';

function ProfileDetails({
  card,
  userCode,
  onRefresh,
}: {
  card: CardConfig;
  userCode: string;
  onRefresh: () => void;
}) {
  const dispatch = useAppDispatch();
  const config = getClientConfigData();
  const { name, sections = [] } = card;
  const formRef = useRef(null);

  const cardData = useAppSelector((state) => getCardData(state, 'header'));

  const isLoading = useAppSelector((state) => getIsLoading(state, 'header'));

  const error = useAppSelector((state) => getError(state, 'header'));

  if (error || isLoading) {
    return (
      <>
        <Text semiBold type="h5">
          {card.name}
        </Text>
        {error && !isLoading && (
          <NoData
            message={locale(Keys.ERROR_FETCHING_CARD_DATA, {
              cardName: card.name,
            })}
          />
        )}
        {isLoading && <SkeletonLoader lines={5} />}
      </>
    );
  }

  const { inputs } = processDetailInputs(sections, cardData);
  const editButton = getUserEditButtonConfig(config, cardData);

  const handleEdit = () => {
    dispatch(
      renderDialog({
        id: WORKFLOW_FORM,
        props: { action: 'edit_user', voId: userCode, moduleCode: 'user' },
      }),
    );
  };

  return (
    <div className={styles.details}>
      <div className={styles.details__header}>
        <Text semiBold type="h5">
          {name}
        </Text>
        <div>
          <Button
            type="text"
            onClick={onRefresh}
            className={styles.details_refresh}
          >
            {locale(Keys.REFRESH)}
          </Button>
          <Button
            type="text"
            disabled={editButton.disabled}
            onClick={() => handleEdit()}
          >
            {editButton.name}
          </Button>
        </div>
      </div>
      <div>
        {inputs.map((groupedInput, idx) => (
          <>
            <Text>{groupedInput.name}</Text>
            <Form
              key={groupedInput.code}
              ref={formRef}
              id="grouping_view"
              name="userDetails"
              onChange={() => {}}
              config={{
                version: FormVersion.web,
                data: groupedInput.inputs || [],
                grouping: [],
                fieldItemConfig: {
                  showDisabledIcon: true,
                },
                viewMode: true,
              }}
              className={styles.detailsForm}
              value={getConvertedValues(groupedInput.inputs || [])}
            />
            {idx !== inputs.length - 1 && <Divider />}
          </>
        ))}
      </div>
    </div>
  );
}

export default ProfileDetails;
