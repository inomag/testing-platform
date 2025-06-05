import React from 'react';
import { ReactComponent as CopilotSvg } from '../../../assets/copilot/copilot_user.svg';
import { ReactComponent as UserSvg } from '../../../assets/copilot/user.svg';
import { Message, SENDER } from '../types';
import styles from '../index.module.scss';

interface RenderLeadProps {
  message: Message;
}

export default function RenderText({ message }: RenderLeadProps) {
  if (message.sender === SENDER.AI) {
    return (
      <div
        className={styles.systemMessage}
        data-test-id="system-message"
        data-testid="system-message"
      >
        <CopilotSvg className={styles.aiIcon} data-testid="ai-icon" />
        <div className={styles.systemContainer}>{message.text}</div>
      </div>
    );
  }
  return (
    <div
      className={styles.userMessage}
      data-test-id="user-message"
      data-testid="user-message"
    >
      <div className={styles.userContainer}>{message.text}</div>
      <div>
        <UserSvg className={styles.userIcon} data-testid="user-icon" />
      </div>
    </div>
  );
}
