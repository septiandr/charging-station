// authHelpers.js

import { getItem } from '@/utils/localStorage';
import { LocalStorageKey } from '@/constants/LocalStorageKey';
import { Context } from '@/app/_layout';
import { useContext } from 'react';

export const checkUserLoginStatus = async (state : any, setModalLoginWarning : any) => {

  const isLogin = await getItem(LocalStorageKey.user);
  console.log("🚀 ~ checkUserLoginStatus ~ isLogin:", isLogin)

  setModalLoginWarning(!isLogin?.email && !state.isLogin);
};
