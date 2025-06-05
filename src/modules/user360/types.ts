export type CardRequestInfo = {
  api: string;
  body: any;
  type: 'get' | 'post';
  cardCode: string;
};

export type CardConfig = {
  code: string;
  name: string;
  card_type: string;
  order?: number;
  sections?: any;
};

export type TabConfig = {
  code: string;
  name: string;
  order?: number;
  scopeMappings?: Array<string>;
  cards: Array<CardConfig>;
};

export type User360Config = {
  disable: boolean;
  user_search_config: any;
  tabs: Array<TabConfig>;
};
