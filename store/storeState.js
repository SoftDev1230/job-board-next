import { saveToLocalStorage } from './localStorage';

export function storeState({ getState }) {
  return next => action => {
    const state = getState();

    const toSaveState = {
      ...state,
    };
    saveToLocalStorage('state', JSON.stringify(toSaveState));

    return next(action);
  };
}
