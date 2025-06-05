type BaseLob = {
  lob_code: string;
  title: string;
  bullet_list: Array<string>;
  multimedia: Array<{ thumbnail: string; resourceUrl: string }>;
  setSelectedLob: (lob_code: Array<string>) => void;
  selectedLob: Array<string>;
};

export type LobProps = {
  status?: 'added' | 'in_progress';
  button_title?: string;
  button_url?: string;
  setSelectedLob: (lob_code: Array<string>) => void;
  selectedLob: Array<string>;
  progress_tag?: string;
  last_completed_action?: string;
  next_action?: string;
} & BaseLob;

export type RecommendLobType = {
  setShowChooseInterest: (arg0: boolean) => void;
} & BaseLob;

export type ActiveLobProps = {
  title: string;
  tag: string;
  attributes: Array<{
    code: string;
    name: string;
    type: string;
    value: string;
  }>;
  lob_code: string;
};

export type Props = {
  first_time_login: boolean;
  ongoing_lob_cards: Array<LobProps>;
  recommended_lob_cards: Array<BaseLob>;
  active_lob_cards: Array<ActiveLobProps>;
  isDialog?: boolean;
};
