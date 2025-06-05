import { keys } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useBlocker } from 'react-router-dom';
import { Button, Text } from 'src/@vymo/ui/atoms';
import { Option, RadioGroup } from 'src/@vymo/ui/atoms/radio';
import { Card } from 'src/@vymo/ui/blocks';
import CountdownTimer from 'src/@vymo/ui/molecules/countdownTimer';
import { ReactComponent as LeftIcon } from 'src/assets/icons/arrowLeft.svg';
import { AssessmentModuleProps, Question } from './types';
import styles from './index.module.scss';

const Assessment = React.forwardRef<HTMLInputElement, AssessmentModuleProps>(
  (
    {
      assessmentConfig,
      onSubmit,
      onTimerEnd,
      allowNavigation = true,
      isSubmitting = false,
      submitButton,
      onQuestionChange,
      onAnswerChange,
      'data-test-id': dataTestId = 'assessment',
    },
    ref,
  ) => {
    const {
      questions = [],
      duration = 0,
      numberOfQuestions = 0,
    } = assessmentConfig || {};
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [completed, setIsCompleted] = useState(false);
    const [answers, setAnswers] = useState<
      Record<string, { question_code: string; answer_code: string[] }>
    >({});

    const currentQuestion: Question | undefined =
      questions?.[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    // Expose the getAnswers method to the parent component using the ref
    useImperativeHandle(ref as any, () => ({
      getAnswers: async (mode: 'save' | 'timeout' = 'save') => {
        let valid = false;
        if (mode === 'save') {
          valid = keys(answers).length === questions.length;
        } else {
          valid = true;
        }
        const translatedAnswers = keys(answers).map((item) => answers[item]);
        return { answers: translatedAnswers, valid };
      },
    }));

    // Handle the beforeunload event to block the assessment to reload
    useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent): string => {
        if (!completed && !allowNavigation) {
          e.preventDefault();
          e.returnValue =
            'You have unsaved changes. Are you sure you want to leave?';
          return 'You have unsaved changes. Are you sure you want to leave?';
        }
        return '';
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () =>
        window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [allowNavigation, completed]);

    // Handle route changes to block the assessment to reload or navigate
    useBlocker(({ currentLocation, nextLocation }): boolean => {
      if (
        !completed &&
        !isSubmitting &&
        !allowNavigation &&
        currentLocation.pathname !== nextLocation.pathname
      ) {
        return true;
      }
      return false;
    });

    // Handle the state update when the option is selected and stored in answers
    const handleOptionSelect = useCallback(
      (selectedOptions) => {
        const selectedOption = selectedOptions[0];
        const newAnswers = {
          ...answers,
          [currentQuestion?.code || '']: {
            question_code: currentQuestion?.code,
            answer_code: [selectedOption.code],
          },
        };
        setAnswers(newAnswers);
        onAnswerChange?.(newAnswers);
      },
      [answers, currentQuestion?.code, onAnswerChange],
    );

    // Handle the submission of the assessment
    const handleSubmit = useCallback(
      (mode) => {
        onSubmit(mode);
      },
      [onSubmit],
    );

    // Handle the timer completion where it will ultimately call the handleSubmit
    const onTimerComplete = useCallback(() => {
      setIsCompleted(true);
      handleSubmit('timeout');
      // Call the onTimerEnd callback if provided
      onTimerEnd?.();
    }, [handleSubmit, onTimerEnd]);

    // Handle the navigation between questions based on the direction
    // and call the onQuestionChange callback if provided
    const handleNavigation = useCallback(
      (direction: 'next' | 'previous') => {
        if (
          direction === 'next' &&
          currentQuestionIndex < questions.length - 1
        ) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          onQuestionChange?.(nextIndex, direction);
        } else if (direction === 'previous' && currentQuestionIndex > 0) {
          const prevIndex = currentQuestionIndex - 1;
          setCurrentQuestionIndex(prevIndex);
          onQuestionChange?.(prevIndex, direction);
        }
      },
      [currentQuestionIndex, questions.length, onQuestionChange],
    );

    interface ButtonProps {}

    const submitButtonElement = useCallback(() => {
      if (!React.isValidElement<ButtonProps>(submitButton)) {
        return (
          <Button
            onClick={() => handleSubmit('save')}
            disabled={isSubmitting || !answers[currentQuestion?.code]}
            className={styles.assessment__footer__primary}
          >
            Submit
          </Button>
        );
      }

      return React.cloneElement<{ disabled?: boolean; onClick?: () => void }>(
        submitButton,
        {
          disabled: isSubmitting || !answers[currentQuestion?.code],
        },
      );
    }, [
      answers,
      currentQuestion?.code,
      handleSubmit,
      isSubmitting,
      submitButton,
    ]);

    return (
      <div data-test-id={dataTestId} className={`${styles.assessment}`}>
        <Card>
          <div className={`${styles.assessment__card}`}>
            <div className={`${styles.assessment__card__header}`}>
              <Text
                classNames={`${styles.assessment__card__header__title}`}
                bold
              >
                Question {currentQuestionIndex + 1} of {numberOfQuestions}
              </Text>
              <div className={`${styles.assessment__card__header__timer}`}>
                <CountdownTimer
                  seconds={Number(duration)}
                  onComplete={onTimerComplete}
                />
              </div>
            </div>

            {currentQuestion && (
              <div className={`${styles.assessment__card__content}`}>
                <Text
                  classNames={`${styles.assessment__card__content__question}`}
                  bold
                >
                  {currentQuestion.name}
                </Text>
                <RadioGroup
                  classNames={`${styles.assessment__card__content__radioGroup}`}
                  {...currentQuestion}
                  type="radio"
                  orientation="vertical"
                  onChange={handleOptionSelect}
                  value={answers[currentQuestion.code]?.answer_code?.[0] || ''}
                  data-test-id={dataTestId}
                >
                  {currentQuestion.options?.map((option) => (
                    <Option
                      className={`${styles.assessment__card__content__radioGroup__option}`}
                      {...option}
                      value={option.code}
                      label={option.name}
                      key={option.code}
                    />
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>
        </Card>
        <div
          data-test-id={`${dataTestId}-footer`}
          className={styles.assessment__footer}
        >
          {currentQuestionIndex !== 0 && (
            <Button
              type="outlined"
              onClick={() => handleNavigation('previous')}
              disabled={currentQuestionIndex === 0}
              iconProps={{ icon: <LeftIcon />, iconPosition: 'left' }}
            >
              Previous
            </Button>
          )}
          {isLastQuestion ? (
            submitButtonElement()
          ) : (
            <Button
              onClick={() => handleNavigation('next')}
              className={styles.assessment__footer__primary}
              disabled={!answers[currentQuestion?.code || '']}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    );
  },
);

export default React.memo(Assessment);
