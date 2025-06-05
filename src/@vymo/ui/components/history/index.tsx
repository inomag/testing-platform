import React from 'react';
import { Text } from 'src/@vymo/ui/atoms';
import { Collapsible } from 'src/@vymo/ui/blocks';
import { processTimeStamp } from './queries';

function History({ data, open }) {
  const { date, timestamp, history, action_type: actionType } = data;
  const { formattedTime, formattedDate } = processTimeStamp(date || timestamp);
  return (
    <Collapsible
      title={
        <div style={{ display: 'flex', gap: '24px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Text type="h5" bold>
              {formattedDate}
            </Text>
            <Text type="h5">{formattedTime}</Text>
          </div>
          <Text type="h5">{actionType}</Text>
        </div>
      }
      open={open}
      border={false}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginLeft: '134px',
        }}
      >
        {history.map((input) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: 'fit-content',
            }}
          >
            <Text type="label">{input.name}</Text>
            <Text>{input.value}</Text>
          </div>
        ))}
      </div>
    </Collapsible>
  );
}

export default History;
