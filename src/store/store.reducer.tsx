import { MStore } from '@/types/groupshop';

export interface StoreAction {
  type: 'UPDATE_BRANDNAME' | 'UPDATE_CLICK_DISCOVERBRAND' | 'UPDATE_EDITID' | 'UPDATE_REMOVEID' | 'UPDATE_COLLECTIONIDDATA' | 'REMOVE_USERDATA';
  payload: MStore;
}

export const reducer = (
  state: MStore,
  action: StoreAction,
): MStore => {
  switch (action.type) {
    case 'UPDATE_BRANDNAME':
      return { ...state, brandName: action.payload.brandName };
    case 'UPDATE_CLICK_DISCOVERBRAND':
      return { ...state, matchingBrandNameEvent: action.payload.matchingBrandNameEvent };
    case 'UPDATE_EDITID':
      return { ...state, editId: action.payload };
    case 'UPDATE_REMOVEID':
      return { ...state, removeId: action.payload };
    case 'UPDATE_COLLECTIONIDDATA':
      return { ...state, collectionIdsData: action.payload };
    case 'REMOVE_USERDATA':
      return { ...state, removeUserData: action.payload };
    default:
      return state;
  }
};
