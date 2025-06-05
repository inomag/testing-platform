import { del, get, set } from 'idb-keyval';
import { deleteItem, getItem, setItem } from './db';

jest.mock('idb-keyval');

describe('db', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get item from IndexedDB', async () => {
    const key = 'testKey';
    const value = 'testValue';
    (get as jest.Mock).mockResolvedValue(value);

    const result = await getItem(key);

    expect(get).toHaveBeenCalledWith(key);
    expect(result).toBe(value);
  });

  it('should set item to IndexedDB', async () => {
    const key = 'testKey';
    const value = 'testValue';
    await setItem(key, value);

    expect(set).toHaveBeenCalledWith(key, value);
  });

  it('should delete item from IndexedDB', async () => {
    const key = 'testKey';
    await deleteItem(key);

    expect(del).toHaveBeenCalledWith(key);
  });
});
