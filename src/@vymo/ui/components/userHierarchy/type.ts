export type UserProps = {
  code: string;
  name: string;
  subordinates?: UserProps[];
};
export type UserHierarchyProps = {
  user: UserProps;
  onChange: (arg0: string, event) => void;
  selected: string[];
  disabled?: boolean;
};
