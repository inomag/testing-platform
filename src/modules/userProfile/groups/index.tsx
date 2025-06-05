import React from 'react';
import { Button, Text } from 'src/@vymo/ui/atoms';
import { Card } from 'src/@vymo/ui/blocks';
import { ReactComponent as ArrowTopRight } from 'src/assets/icons/arrowTopRight.svg';
import CategoryCard from '../category';
import { UserProfileGroup } from '../types';
import styles from './index.module.scss';

type ProfileGroupProps = {
  group: UserProfileGroup;
};

export function ProfileGroup({ group }: ProfileGroupProps) {
  return (
    <>
      <Text classNames={styles.cardTitle}>{group.name}</Text>
      {group.category?.map(
        (groupCategory) =>
          !['website'].includes(groupCategory.type) && (
            <Card classNames={styles.container__card}>
              <div id={`${groupCategory.code}-categoryCard`}>
                <Text classNames={styles.container__category__title}>
                  {groupCategory.name}
                </Text>
                <div data-test-id="group-category-label-wrapper">
                  {groupCategory.labels?.map((label) => (
                    <div
                      key={label?.code}
                      className={styles.container__category__label}
                      data-test-id="group-category-label"
                    >
                      <Text>{label?.title}</Text>
                      <div
                        data-test-id="category-label-cta-wrapper"
                        className={
                          styles.container__category__label__ctaWrapper
                        }
                      >
                        {label?.ctas?.map((cta) => (
                          <Button
                            type="outlined"
                            key={cta?.code}
                            className={styles.container__category__label__cta}
                            disabled={cta?.disabled}
                            iconProps={{
                              icon: <ArrowTopRight />,
                              iconPosition: 'right',
                            }}
                            onClick={() => {
                              window.open(cta?.url, '_blank');
                            }}
                          >
                            {cta?.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <CategoryCard category={groupCategory} />
              </div>
            </Card>
          ),
      )}
    </>
  );
}
