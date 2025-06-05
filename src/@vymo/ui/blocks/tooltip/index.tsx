import React from 'react';
import Popup from 'src/@vymo/ui/blocks/popup';
import { ReactComponent as TooltipIcon } from 'src/assets/icons/tooltip.svg';
import { TooltipProps } from './types';
import styles from './index.module.scss';

function Tooltip({ content, placement = 'top', children }: TooltipProps) {
  return (
    <div className={styles.tooltip}>
      {children}
      <Popup
        content={content}
        popupClass={styles.tooltip}
        className={styles.tooltip_content}
        openTrigger="hover"
        closeTrigger="hover"
        placement={placement}
      >
        <TooltipIcon />
      </Popup>
    </div>
  );
}

export default Tooltip;
