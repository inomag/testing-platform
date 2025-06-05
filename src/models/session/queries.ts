import localStorageService from 'src/localStorage';

export const setApiHitTime = () =>
  localStorageService.set('lastApiHit', Date.now());

export const getLastApiHitTime = () =>
  localStorageService.get<number>('lastApiHit') || 0;
