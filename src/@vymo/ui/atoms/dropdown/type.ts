export type DropdownProps = {
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
};
