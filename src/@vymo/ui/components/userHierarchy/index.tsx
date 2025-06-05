import React, { useCallback, useState } from 'react';
import Select from 'src/@vymo/ui/atoms/select';
import { UserHierarchyProps } from './type';
import styles from './index.module.scss';

function UserHierarchy({
  user,
  onChange,
  disabled = false,
  selected = [],
}: UserHierarchyProps) {
  const [selectedUsers, setSelectedUsers] = useState(selected);
  const onUserSelected = useCallback(
    (option, idx, event) => {
      const users = selectedUsers.slice(0, idx);
      users.push(option?.code);
      onChange(users[users.length - 1], event);
      setSelectedUsers(users);
    },
    [onChange, selectedUsers],
  );

  const getSelectInput = useCallback(
    // TODO: add types Pratik
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (selectedUsers, options, depth = 0) => {
      const value = selectedUsers[depth];
      const { subordinates } = options.find(({ code }) => code === value) ?? {};
      return (
        <>
          <div
            data-test-id="user-hierarchy-wrapper"
            className={styles.select__wrapper}
          >
            <Select
              value={value}
              disabled={disabled}
              options={options}
              // TODO: add types Pratik
              // eslint-disable-next-line @typescript-eslint/no-shadow
              onChange={(options, event) =>
                onUserSelected(options[0], depth, event)
              }
            />
          </div>
          {subordinates &&
            getSelectInput(selectedUsers, subordinates, depth + 1)}
        </>
      );
    },
    [disabled, onUserSelected],
  );

  return getSelectInput(selectedUsers, user.subordinates);
}

export default UserHierarchy;
