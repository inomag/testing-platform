import { capitalize } from 'lodash';
import React, { useCallback } from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import Chip from 'src/@vymo/ui/atoms/chip';
import Text from 'src/@vymo/ui/atoms/text';
import Card from 'src/@vymo/ui/blocks/card';
import Collapsible from 'src/@vymo/ui/blocks/collapsible';
import { APPROVAL_STATE } from '../constants';
import styles from '../index.module.scss';

function GroupedInputs({
  groupedInputs,
  section,
  isValidSection,
  formComponent,
  onSubmit,
}) {
  const getChipType = useCallback((approvalState) => {
    switch (approvalState) {
      case APPROVAL_STATE.APPROVED:
        return 'success';
      case APPROVAL_STATE.PENDING_APPROVAL:
        return 'warning';
      case APPROVAL_STATE.REJECTED:
        return 'error';
      default:
        return 'success';
    }
  }, []);

  return (
    <>
      <div className={styles['stepper-section-card']}>
        {Object.keys(groupedInputs).map((group) => (
          <Card
            key={group}
            hasError={
              groupedInputs[group]?.status?.state === APPROVAL_STATE.REJECTED
            }
            classNames={styles['stepper-section-card__grouped_input']}
          >
            <Collapsible
              title={groupedInputs[group]?.title ?? ''}
              open={
                !groupedInputs[group]?.status?.state ||
                groupedInputs[group]?.status?.state === APPROVAL_STATE.REJECTED
              }
            >
              <div
                className={
                  styles['stepper-section-card__grouped_input__fields']
                }
              >
                {formComponent(groupedInputs[group]?.inputs)}
              </div>
            </Collapsible>
            {groupedInputs[group]?.status?.state && (
              <div className={styles['stepper-section-card__status']}>
                <Chip
                  type={getChipType(groupedInputs[group]?.status?.state)}
                  label={groupedInputs[group]?.status?.label}
                  classNames={
                    styles['stepper-section-card__grouped_input__chip']
                  }
                  bold
                />
                <Text
                  variant={
                    groupedInputs[group]?.status?.state ===
                    APPROVAL_STATE.REJECTED
                      ? 'error'
                      : 'default'
                  }
                >
                  {groupedInputs[group]?.status?.message}
                </Text>
              </div>
            )}
          </Card>
        ))}
      </div>
      {section.action && (
        <div className={styles['stepper-form-container__action']}>
          <Button
            className={styles['stepper-form-container__action__btn']}
            disabled={!isValidSection}
            onClick={onSubmit}
          >
            {capitalize(section.action)}
          </Button>
        </div>
      )}
    </>
  );
}

export default GroupedInputs;
