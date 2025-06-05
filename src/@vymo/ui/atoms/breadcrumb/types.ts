export type BreadcrumbProps = {
  separator?: string;
  items: ItemType[];
  className?: string;
  'data-test-id'?: string;
};

export type ItemType = {
  className?: string;
  path?: string;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onHover?: (e: React.MouseEvent) => void;
  title: string | React.ReactNode;
  menu?: MenuItem[];
  onBeforeNavigate?: (navigate) => void;
};

export type MenuItem = {
  value: string;
  label: string;
};
