// authHelpers.js

import { getItem } from '@/utils/localStorage';
import { LocalStorageKey } from '@/constants/LocalStorageKey';

export const checkUserLoginStatus = async (state : any, setModalLoginWarning : any) => {
  const isLogin = await getItem(LocalStorageKey.user);
  setModalLoginWarning(!isLogin?.email && !state.isLogin);
};
