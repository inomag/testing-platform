import { Dispatch, useEffect, useReducer, useRef } from 'react';

type Listener<Store> = (state: Store) => void;
function useContextSubscriber<Store, Action>(
  reducer: (state: Store, action: Action) => Store,
  initialState: Store,
): [Store, Dispatch<Action>, (listener: Listener<Store>) => () => void] {
  const [state, dispatch] = useReducer(reducer, initialState);
  const listeners = useRef<Set<Listener<Store>>>(new Set());

  useEffect(() => {
    listeners.current.forEach((listener) => listener(state));
  }, [state]);

  const subscribe = (listener: Listener<Store>) => {
    listeners.current.add(listener);
    return () => listeners.current.delete(listener);
  };

  return [state, dispatch, subscribe];
}

export default useContextSubscriber;
