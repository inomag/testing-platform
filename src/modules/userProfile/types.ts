type UserProfileLabelCTA = {
  code: string;
  name: string;
  url: string;
  disabled: boolean;
};

type UserProfileCategoryLabel = {
  code: string;
  title: string;
  disabled: boolean;
  ctas: UserProfileLabelCTA[];
};
export type UserProfileCategory = {
  code: string;
  name: string;
  type: string;
  custom_api?: string;
  labels?: UserProfileCategoryLabel[];
};
export type UserProfileGroup = {
  code: string;
  name: string;
  category: UserProfileCategory[];
};

export type CategoryData = {
  results?: {
    group_name?: string;
    data?: {
      inputs?: any;
    }[];
  }[];
  filters?: {
    code?: string;
    name?: string;
  }[];
  value?: {
    code?: string;
    name?: string;
  }[];
};
