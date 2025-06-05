import React from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { parseCategoryData } from '../queries';
import { getCategoryData, getError, getIsLoading } from '../selectors';
import { fetchProfileGroup } from '../thunk';
import { UserProfileCategory } from '../types';
import { CategoryLayout } from './layout';
import styles from './index.module.scss';

export interface CategoryCardProps {
  category: UserProfileCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector((state) =>
    getIsLoading(state, category.code),
  );

  const error = useAppSelector((state) => getError(state, category.code));
  const categoryData = useAppSelector((state) =>
    getCategoryData(state, category.code),
  );

  if (error) {
    return <div className={styles.layout__noData}>{error}</div>;
  }

  const layoutData = parseCategoryData(categoryData, category);

  return (
    <CategoryLayout
      layoutData={layoutData}
      isLoading={isLoading}
      refreshCategory={(key) =>
        dispatch(
          fetchProfileGroup({
            category: category.code,
            customApi: category.custom_api,
            params: {
              filter_code: key,
            },
          }),
        )
      }
    />
  );
}
