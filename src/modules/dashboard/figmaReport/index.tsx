/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { getFigmaReport } from '../selectors';
import { fetchFigmaChecks } from '../thunk';

export default function FigmaReport() {
  const figmaReport = useAppSelector(getFigmaReport);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFigmaChecks());
  }, [dispatch]);

  if (!figmaReport) {
    return <div>{locale(Keys.NO_COMPARISON_REPORT)}</div>;
  }
  return (
    <div
      dangerouslySetInnerHTML={{ __html: figmaReport }} // Render HTML
    />
  );
}
