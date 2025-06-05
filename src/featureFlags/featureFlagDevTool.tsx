import React, { useCallback, useEffect, useState } from 'react';
import { Button, Switch } from 'src/@vymo/ui/atoms';
import Table from 'src/@vymo/ui/blocks/table';
import { featureFlags } from './index';

function FeatureFlagDevTool() {
  const [showDetails, setShowDetails] = useState(false);
  const [flags, setFlags] = useState({});

  useEffect(() => {
    setFlags({
      ...featureFlags,
      ...JSON.parse(localStorage.getItem('flags') as string),
    });
  }, []);

  const onCheckboxClick = useCallback(
    (checked, id) => {
      setFlags({
        ...flags,
        [id]: checked,
      });
    },
    [flags],
  );

  const onSaveClick = () => {
    localStorage.setItem('flags', JSON.stringify(flags));
    window.location.reload();
  };

  const columns = [
    {
      title: 'Flag',
      dataIndex: 'flag',
      key: 'flag',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value, record) => (
        <Switch
          value={value}
          onChange={(checked) => onCheckboxClick(checked, record.flag)}
        />
      ),
    },
  ];

  return (
    <div>
      <div>
        <p>Feature Flags</p>
        <Button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide' : 'Show'}
        </Button>
      </div>
      {showDetails && (
        <div className="mt-4">
          <Table
            columnConfigs={columns as any}
            tableData={Object.keys(flags).map((flag) => ({
              flag,
              status: flags[flag],
            }))}
          />
          <Button onClick={onSaveClick}>Save</Button>
        </div>
      )}
    </div>
  );
}

export default FeatureFlagDevTool;
