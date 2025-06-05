export type Option = {
  code: string;
  name: string;
};

export type Question = {
  code: string;
  name: string;
  single_select: boolean;
  options: Option[];
};

export type ButtonConfig = Record<
  string,
  {
    name: string;
    type: 'primary' | 'outlined';
    disabled: boolean;
    apiPath: string;
  }
>;

export type AssessmentConfig = {
  auditId?: string;
  duration?: string;
  numberOfQuestions: string;
  passCriteria?: string;
  additionalInstructions?: string;
  draftApiPath?: string;
  canEditAnswers?: boolean;
  questions: Question[];
};

export type AssessmentModuleProps = {
  assessmentConfig: AssessmentConfig;
  ref?: any;
  onSubmit: (
    answers: Record<string, { question_code: string; answer_code: string[] }>,
  ) => void;
  onTimerEnd?: () => void;
  allowNavigation: boolean;
  isSubmitting?: boolean;
  submitButton?: React.ReactNode;
  onQuestionChange?: (questionIndex: number, direction: string) => void;
  onAnswerChange?: (
    answers: Record<string, { question_code: string; answer_code: string[] }>,
  ) => void;
  'data-test-id'?: string;
};
