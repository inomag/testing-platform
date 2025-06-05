import { del, get, set } from 'idb-keyval';

export const getItem = (key) => get(key);

export const setItem = (key, value) => set(key, value);

export const deleteItem = (key) => del(key);
