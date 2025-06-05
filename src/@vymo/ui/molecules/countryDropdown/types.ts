export type CountryCodeDropdownProps = {
  selectedCode: string;
  onCodeChange: (code: string) => void;
  'data-test-id'?: string;
};

export type CountryOptionType = {
  label: string;
  value: string;
};
