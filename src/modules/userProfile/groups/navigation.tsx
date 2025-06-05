/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import { find } from 'lodash';
import React, { useState } from 'react';
import { Card } from 'src/@vymo/ui/blocks';
import classnames from 'classnames';
import { ReactComponent as AccountBox2Line } from 'src/assets/icons/account-box-2-line.svg';
import { ReactComponent as BankLine } from 'src/assets/icons/bank-line.svg';
import { ReactComponent as FileTextLine } from 'src/assets/icons/file-text-line.svg';
import { ReactComponent as ParentLine } from 'src/assets/icons/parent-line.svg';
import { ReactComponent as QuestionLine } from 'src/assets/icons/question-line.svg';
import { ReactComponent as TeamLine } from 'src/assets/icons/team-line.svg';
import { ReactComponent as TodoLine } from 'src/assets/icons/todo-line.svg';
import { ReactComponent as User2Line } from 'src/assets/icons/user-2-line.svg';
import { ReactComponent as UserLine } from 'src/assets/icons/user-line.svg';
import { UserProfileGroup } from '../types';
import styles from './index.module.scss';

type ProfileNavigationProps = {
  userProfileGroups: UserProfileGroup[];
};

function ProfileNavigation({ userProfileGroups }: ProfileNavigationProps) {
  const [selectedCard, setSelected] = useState<string>(
    find(userProfileGroups, (group) => group.category?.length > 0)?.category[0]
      ?.code || '',
  );
  const scrollToDiv = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getCategoryIcon = (code) => {
    switch (code) {
      case 'help_and_support':
        return <QuestionLine />;
      case 'contact_details':
        return <TeamLine />;
      case 'linked_accounts':
        return <AccountBox2Line />;
      case 'nominee':
        return <ParentLine />;
      case 'my_bank_details':
        return <BankLine />;
      case 'recruitment':
        return <User2Line />;
      case 'appointments':
        return <TodoLine />;
      case 'licenses':
        return <FileTextLine />;

      case 'personal_details':
      default:
        return <UserLine />;
    }
  };

  return (
    <Card
      classNames={styles.navigation__card}
      key="userProfileNavigation"
      data-test-id="userProfileNavigation"
    >
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        id="userProfileNavigation"
        data-test-id="userProfileNavigation"
      >
        {userProfileGroups.map((group) => (
          <div>
            <div className={styles.navigation__group__title}>{group.name}</div>
            <div className={styles.navigation__group}>
              {group.category.map((groupCategory) => (
                <div
                  onClick={() => {
                    scrollToDiv(`${groupCategory.code}-categoryCard`);
                    setSelected(groupCategory.code);
                  }}
                  className={classnames(
                    styles.navigation__category,
                    styles.navigation__category__title,
                    {
                      [styles.navigation__category__selected]:
                        groupCategory.code === selectedCard,
                    },
                  )}
                  data-test-id={`userProfileNavigation-${groupCategory.name}`}
                >
                  {getCategoryIcon(groupCategory.code)}
                  {groupCategory.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ProfileNavigation;
