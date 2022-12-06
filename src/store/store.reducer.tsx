import { MStore } from '@/types/groupshop';

export interface StoreAction {
  type: 'UPDATE_BRANDNAME' | 'UPDATE_CLICK_DISCOVERBRAND';
  payload: MStore;
}

export const reducer = (
  state: MStore,
  action: StoreAction,
): MStore => {
  switch (action.type) {
    case 'UPDATE_BRANDNAME':
      return { ...state, brandName: action.payload.brandName };
    // if (action.type === 'UPDATE_BRANDNAME') {
    //   return { ...state, brandName: action.payload.brandName };
    // }
    case 'UPDATE_CLICK_DISCOVERBRAND':
      return { ...state, matchingBrandNameEvent: action.payload.matchingBrandNameEvent };
    default:
      return state;
  }
};
