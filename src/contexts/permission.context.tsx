import * as React from 'react';
import {
  useState, useEffect, useContext, useMemo,
} from 'react';
import { useRouter } from 'next/router';
import { AdminUserRoles } from '@/types/groupshop';
import { useLazyQuery } from '@apollo/client';
import { FIND_ADMIN_ROLE_BY_NAME } from '@/graphql/store.graphql';
import { AuthContext } from './auth.context';

interface PermissionContextType {
  userPermission: AdminUserRoles | undefined;
}

const initialState: {userPermission: AdminUserRoles | undefined} = {
  userPermission: undefined,

};

export const PermissionContext = React.createContext<PermissionContextType>(
  initialState as PermissionContextType,
);

const PermissionContextProvider = ({ children }) => {
  const [userPermission, setUserPermission] = useState<AdminUserRoles| undefined>(undefined);

  const router = useRouter();
  //   console.log('🚀 ~ file: permission.context.tsx ~ line 30 ~ router', router);
  const { user } = useContext(AuthContext);

  const [getPermission, { data }] = useLazyQuery(FIND_ADMIN_ROLE_BY_NAME, {
    onCompleted: (res) => {
      setUserPermission(res?.findRoleByName);
    },
    onError() { console.log('Error in finding Droplist!'); },
  });

  useEffect(() => {
    if (user?.userRole) {
      getPermission({ variables: { userRole: user?.userRole } });
    }
  }, [router.pathname, user, userPermission]);

  const ctx = useMemo(() => ({
    userPermission,
  }), [userPermission]);
  console.log('🚀 ~ file: permission.context.tsx ~ line 49 ~ ctx', ctx);

  return (
    <PermissionContext.Provider value={ctx}>
      {children}
    </PermissionContext.Provider>
  );
};

export { PermissionContextProvider };
