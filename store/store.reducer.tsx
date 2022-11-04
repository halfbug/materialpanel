import { MStore } from 'types/groupshop';

export interface StoreAction {
  type: 'UPDATE_BRANDNAME';
  payload: MStore;
}

export const reducer = (
  state: MStore,
  action: StoreAction,
): MStore => {
  if (action.type === 'UPDATE_BRANDNAME') {
    return { ...state, brandName: action.payload.brandName };
  }
  return state;
};
