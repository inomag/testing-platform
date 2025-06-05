import { ReactNode } from 'react';

export type NavigationProps = {
  items: NavigationItem[];
  defaultKey: string;
};

export type NavigationItem = {
  key: string;
  value: string;
  icon?: ReactNode;
  onClick: (key: string) => void;
  items?: NavigationItem[];
};
