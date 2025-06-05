import React, { useState } from 'react';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { ReactComponent as CopilotSvg } from '../../../assets/copilot/copilot_user.svg';
import { ReactComponent as LeadSvg } from '../../../assets/copilot/lead.svg';
import { ReactComponent as RightSvg } from '../../../assets/copilot/right_arrow.svg';
import { Message } from '../types';
import styles from '../index.module.scss';

interface RenderLeadProps {
  message: Message;
}

export default function RenderLead({ message }: RenderLeadProps) {
  const toggleDetailsScreen = (lead_code: string) => {
    const data = {
      code: 'view-details',
      text: locale(Keys.VIEW_LEAD),
      params: {
        activity: 'leads',
        code: lead_code,
      },
    };
    const messageData = JSON.stringify(data);

    // @ts-ignore
    if (window.Android) {
      // @ts-ignore
      window.Android.handleMessage(messageData);
    }
    // @ts-ignore
    if (window?.ReactNativeWebView?.postMessage) {
      // @ts-ignore
      window?.ReactNativeWebView?.postMessage(messageData, '*');
    }
  };

  const [displayedRows, setDisplayedRows] = useState(3);

  const handleViewMore = () => {
    if (message?.leads_data) {
      setDisplayedRows(message?.leads_data.length);
    }
  };

  const renderLeadName = (lead: { lead_name: string; lead_code?: string }) => {
    if (lead.lead_name.length > 15) {
      return `${lead.lead_name.slice(0, 12)}...`;
    }
    return lead.lead_name;
  };

  return (
    <div className={styles.systemMessage} data-test-id="lead-message">
      <div>
        <CopilotSvg style={{ marginRight: '10px' }} />
      </div>
      <div>
        <div className={styles.systemContainer}>{message.text}</div>
        <div className={styles.leadContainer}>
          <div className={styles.leadList}>
            {message?.leads_data &&
              message?.leads_data.slice(0, displayedRows).map((lead) => (
                <button
                  type="button"
                  onClick={() => toggleDetailsScreen(lead.lead_code)}
                  className={styles.lead}
                >
                  <LeadSvg />
                  <span className={styles.leadName}>
                    {renderLeadName(lead)}
                  </span>
                  <RightSvg />
                </button>
              ))}
          </div>
          {message?.leads_data &&
            displayedRows < message?.leads_data.length && (
              <button
                onClick={handleViewMore}
                type="button"
                className={styles.moreData}
              >
                View All
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
