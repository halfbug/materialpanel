/* eslint-disable react/jsx-no-constructed-context-values */
import * as React from 'react';
import { MStore } from '@/types/groupshop';
import { reducer, StoreAction } from './store.reducer';

interface StoreContextType {
  store: MStore,
  dispatch: React.Dispatch<StoreAction>;
}

const initialState: MStore = {
  brandName: '',
  matchingBrandNameEvent: '',
  collectionIdsData: [],
  editId: '',
  removeId: '',
};

export const StoreContext = React.createContext<StoreContextType>(
  initialState as StoreContextType,
);

export const StoreContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [store, dispatch] = React.useReducer(reducer, {
    brandName: '',
    collectionIdsData: [],
    editId: '',
    removeId: '',
  });

  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
