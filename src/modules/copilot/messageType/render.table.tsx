import React, { useState } from 'react';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { ReactComponent as CopilotSvg } from '../../../assets/copilot/copilot_user.svg';
import { Message } from '../types';
import styles from '../index.module.scss';

interface RenderLeadProps {
  message: Message;
}

export default function RenderTable({ message }: RenderLeadProps) {
  const [displayedRows, setDisplayedRows] = useState(10);
  const data = message?.tabular_data || [[]];

  const handleViewMore = () => {
    setDisplayedRows(data.length - 1);
  };

  const getColumnNames = () => {
    if (data.length === 0) {
      return [];
    }
    return data[0];
  };
  const columnNames = getColumnNames();

  return (
    <div className={styles.systemMessage} data-test-id="table-message">
      <div>
        <CopilotSvg className={styles.aiIcon} />
      </div>
      <div className={styles.systemContainer}>
        <div>{message.text}</div>
        {columnNames.length > 0 && (
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              {columnNames[0] !== 'Key' && (
                <thead>
                  <tr>
                    {columnNames.map((columnName) => (
                      <th>{columnName}</th>
                    ))}
                  </tr>
                  <tr>
                    <td colSpan={columnNames.length} style={{ padding: 0 }}>
                      <hr className={styles.hr} />
                      <span id="hrLabel" className={styles.visually_hidden}>
                        {locale(Keys.HORIZONTAL_LINE)}
                      </span>
                    </td>
                  </tr>
                </thead>
              )}
              <tbody>
                {data.slice(1, displayedRows).map((row) => (
                  <>
                    <tr>
                      {row.map((cell) => (
                        <td>{cell}</td>
                      ))}
                    </tr>
                    <tr>
                      <td colSpan={columnNames.length} style={{ padding: 0 }}>
                        <hr className={styles.hr} />
                        <span id="hrLabel" className={styles.visually_hidden}>
                          {locale(Keys.HORIZONTAL_LINE)}
                        </span>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {displayedRows < data.length - 1 && (
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
  );
}
