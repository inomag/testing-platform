import React, { useCallback, useMemo, useRef, useState } from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import Card from 'src/@vymo/ui/blocks/card';
import Collapsible from 'src/@vymo/ui/blocks/collapsible';
import Form from 'src/@vymo/ui/molecules/form';
import {
  getApiError,
  getStepperSectionData,
} from 'src/models/stepperFormLegacy/selectors';
import { updateStepperForm } from 'src/models/stepperFormLegacy/slice';
import {
  DropdownValue,
  Input,
  InputsMap,
  Input as InputType,
  Section as SectionType,
} from 'src/models/stepperFormLegacy/types';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { SECTION_TYPE } from '../constants';
import {
  getGroupedFields,
  getUpdatedInput,
  getUpdatedSectionData,
} from '../queries';
import ESignature from './eSignature';
import GroupedInputs from './groupedInputs';
import InfoSection from './info';
import MeetingSection from './meeting';
import TermsAndConditions from './termsAndConditions';
import styles from '../index.module.scss';

interface IProps {
  section: SectionType;
  inputsMap: InputsMap;
  handleOnSubmit: (section: SectionType, args) => void;
}
function Section({ section, inputsMap = {}, handleOnSubmit }: IProps) {
  const dispatch = useAppDispatch();
  const [showEditModal, setShowEditModal] = useState(false);
  const stateRef = useRef<any>(null);
  const formRef = useRef(null);
  stateRef.current = useAppSelector(getStepperSectionData);
  const apiErrorMessage = useAppSelector(getApiError);

  // useEffect(() => {
  //   async function fetchAutoSaveData() {
  //     const autoSavedData = await fetchAutosaveData();
  //     const autoSaveData = await handleAutoSavePrepopulation(
  //       autoSavedData,
  //       stepperFormData,
  //     );
  //     await clearAutosaveData();
  //     if (autoSaveData) dispatch(dispatch(initializeStepperForm(autoSaveData)));
  //   }
  //   fetchAutoSaveData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const isValidSection = useMemo(() => {
    let isValid = true;
    if (stateRef.current) {
      // eslint-disable-next-line complexity
      stateRef.current[section.code ?? '']?.forEach((inputObj: InputType) => {
        if (inputObj.required) {
          if (
            !inputObj.value ||
            inputObj.value?.toString()?.trim()?.length === 0
          ) {
            isValid = false;
          } else if (
            Array.isArray(inputObj.value) &&
            inputObj.value.length < 1
          ) {
            isValid = false;
          } else if (
            typeof inputObj.value === 'object' &&
            Object.keys(inputObj.value)?.length > 1
          ) {
            const dropdownValue = inputObj.value as DropdownValue;
            if (!dropdownValue.value) {
              isValid = false;
            }
          }
        }
        const valueLength =
          (Array.isArray(inputObj.value) && inputObj.value.length) || 0;

        if (
          (inputObj.multimedia_options?.min_files &&
            valueLength < inputObj.multimedia_options?.min_files) ||
          (inputObj.multimedia_options?.max_files &&
            valueLength > inputObj.multimedia_options?.max_files)
        ) {
          isValid = false;
        }
      });
    } else {
      return false;
    }
    return isValid;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.code, stateRef.current]);
  const handleOnChange = useCallback(
    (inputValue) => {
      if (section.code) {
        const updateSection = getUpdatedSectionData(
          stateRef.current,
          inputValue,
          section.code,
        );
        dispatch(
          updateStepperForm({
            section: section.code,
            value: updateSection,
          }),
        );
      }
    },
    [section.code, dispatch],
  );
  const handleIdentificationChange = useCallback(
    (newValue) => {
      const updatedInput = getUpdatedInput(
        section.component.meta.inputs[0],
        newValue,
      );
      dispatch(
        updateStepperForm({
          section: section.code,
          value: [updatedInput],
        }),
      );
    },
    [dispatch, section.component.meta.inputs, section.code],
  );

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
  }, []);

  const handleEditButton = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const onSubmit = useCallback(async () => {
    if (String(section?.action) === 'initiatePayment') {
      handleOnSubmit(section, {});
    } else {
      const updatedInputfields =
        // @ts-ignore
        await formRef?.current?.getFieldsForSubmission?.();
      const isValid = updatedInputfields?.valid;
      if (isValid === 'valid') {
        handleOnSubmit(section, {
          updatedInputfields: updatedInputfields?.data,
        });
      }
    }
  }, [handleOnSubmit, section]);

  const formComponent = useCallback(
    (inputs) => {
      const updatedInputsMap = {};
      const updatedInputs = inputs?.map((input) => ({
        ...input,
        type: input.metaData?.isMasked ? 'password' : input.type,
      }));
      Object.keys(inputsMap)?.forEach((key) => {
        updatedInputsMap[key] = { value: inputsMap[key] } as any;
      });
      inputs?.forEach((input) => {
        if (input.value) {
          updatedInputsMap[input.code] = { value: input.value } as any;
        }
      });
      return (
        <Form
          id={section.code}
          key={section.code}
          name={section.code}
          ref={formRef}
          // @ts-ignore
          value={updatedInputsMap}
          onChange={() => {}}
          config={{
            // @ts-ignore
            version: 'web',
            data: updatedInputs,
            grouping: [],
            beforeSaveHookConfig: {
              multimedia: {
                isMultimediaBeforeSaveHookDisabled: true,
              },
            },
          }}
          className={styles['stepper-section-card__form']}
        />
      );
    },
    [inputsMap, section.code],
  );

  const sectionItem = useMemo(() => {
    switch (section.component.type) {
      case SECTION_TYPE.IDENTIFICATION:
      case SECTION_TYPE.INPUT_FORM:
        return formComponent(stateRef.current?.[section.code]);
      case SECTION_TYPE.MEETING:
        return (
          <MeetingSection
            startDate={section?.component?.meta?.start_time}
            endDate={section?.component?.meta?.end_time}
            format="DD-MM-YYYY HH:mm:ss"
            meeting={section?.component?.meta?.meeting}
            info={section?.component?.meta?.info}
          />
        );
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    section,
    handleIdentificationChange,
    handleEditButton,
    handleOnSubmit,
    showEditModal,
    closeEditModal,
    handleOnChange,
    apiErrorMessage,
  ]);

  const isCTAVisible = useMemo(
    () =>
      section?.component?.type === SECTION_TYPE.INPUT_FORM ||
      section?.component?.type === SECTION_TYPE.IDENTIFICATION ||
      section?.component?.type === SECTION_TYPE.MULTIMEDIA,
    [section?.component?.type],
  );

  const capitalize = useMemo(() => {
    const words = section?.action?.replace(/([A-Z])/g, ' $1').trim();
    const titleCaseStr = words
      ?.split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return titleCaseStr;
  }, [section?.action]);

  // eslint-disable-next-line complexity
  const renderSection = useMemo(() => {
    switch (section.component.type) {
      case SECTION_TYPE.GROUPED_FIELDS: {
        const groupedInputs = getGroupedFields(
          section.action,
          section.component.meta,
        );
        return (
          <GroupedInputs
            groupedInputs={groupedInputs}
            section={section}
            isValidSection={isValidSection}
            onSubmit={onSubmit}
            formComponent={formComponent}
          />
        );
      }
      case SECTION_TYPE.INFO_SECTION:
      case SECTION_TYPE.DOWNLOAD_REPORTS: {
        return (
          <Card>
            <InfoSection meta={section?.component?.meta} />
          </Card>
        );
      }
      case SECTION_TYPE.ESIGNATURE: {
        return (
          <Card>
            <InfoSection meta={section?.component?.meta}>
              <ESignature
                label={section?.component?.meta?.action?.label || ''}
                code={section.code}
                templateId={section?.component?.meta?.templateId || ''}
                inputObj={section?.component?.meta?.inputObj as Input}
                scriptLink={section?.component?.meta?.scriptLink || ''}
              />
            </InfoSection>
          </Card>
        );
      }
      case SECTION_TYPE.TERMS_AND_CONDITIONS: {
        return (
          <Card>
            <InfoSection meta={section?.component?.meta}>
              <TermsAndConditions
                title={section?.component?.meta?.title || ''}
                code={section.code}
                inputObj={section?.component?.meta?.inputObj as Input}
                action={section?.component?.meta?.action}
              />
            </InfoSection>
          </Card>
        );
      }
      default:
        return (
          <Card>
            <Collapsible
              title={section.title ?? ''}
              description={section.description}
              open
              border={false}
              className={styles['stepper-section-card__collapsible']}
            >
              <div className={styles['stepper-section-card']}>
                {sectionItem}
                {isCTAVisible && section.action && (
                  <div className={styles['stepper-section-card__action']}>
                    <Button
                      onClick={onSubmit}
                      className={styles['section-button']}
                      data-test-id="section-button"
                    >
                      {capitalize}
                    </Button>
                  </div>
                )}
              </div>
            </Collapsible>
          </Card>
        );
    }
  }, [
    formComponent,
    isCTAVisible,
    isValidSection,
    onSubmit,
    section,
    sectionItem,
    capitalize,
  ]);
  return renderSection;
}

export default Section;
