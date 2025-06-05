import { get } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { deleteItem, getItem, setItem } from 'src/indexDb/db';

/**
 * A custom hook that automatically saves data from the Redux store to IndexedDB.
 *
 * @param key - The path in the indexed db where the data will be saved.
 * @param path - The path in the Redux store for which the data has to be saved.
 * @param delay - The delay in milliseconds at which to save the data.
 * @param interval - The interval which will trigger the save at delay milliseconds. It will trigger the save at delay ms interval + when store is updated
 * @param successCallback - Callback to be called when the data is saved.
 * @returns An array where:
 * - The first element is a promise that resolves to the saved data.
 * - The second element is a function that deletes the saved data.
 */
const useAutoSave = (
  key: string,
  path: string,
  delay: number,
  interval: boolean = false,
  successCallback?: (arg0) => void,
): [() => Promise<any>, () => Promise<any>] => {
  const selectData = (state) => get(state, path);
  const storeData = useSelector(selectData);

  const addData = useCallback(async () => {
    setItem(key, storeData).then((result) => {
      successCallback?.(result);
    });
  }, [key, storeData, successCallback]);

  const timerRef = useRef<any>(null);

  const handleAutoSave = useCallback(() => {
    addData();
    if (interval) {
      timerRef.current = setTimeout(handleAutoSave, delay);
    }
  }, [addData, delay, interval]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (interval) {
      timerRef.current = setTimeout(handleAutoSave, delay);

      return () => {
        // Clear the timer when the component unmounts
        clearTimeout(timerRef.current);
      };
    }
  }, [addData, handleAutoSave, delay, interval]);

  useEffect(() => {
    // Restart the timer when storeData updates
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(handleAutoSave, delay);
  }, [addData, handleAutoSave, storeData, delay]);

  return [getItem.bind(null, key), deleteItem.bind(null, key)];
};

export default useAutoSave;
