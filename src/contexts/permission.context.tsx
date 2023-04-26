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
  userPermissions: string[] | undefined;
  generalPermissions: AdminUserRoles | undefined;
}

// eslint-disable-next-line max-len
const initialState: {userPermissions: string[] | undefined, generalPermissions: AdminUserRoles | undefined} = {
  userPermissions: undefined,
  generalPermissions: undefined,

};

export const PermissionContext = React.createContext<PermissionContextType>(
  initialState as PermissionContextType,
);

const PermissionContextProvider = ({ children }) => {
  const [userPermissions, setUserPermission] = useState<string[] | undefined>(undefined);
  const [generalPermissions, setGeneralPermission] = useState<AdminUserRoles| undefined>(undefined);

  const router = useRouter();
  //   console.log('🚀 ~ file: permission.context.tsx ~ line 30 ~ router', router);
  const { user } = useContext(AuthContext);

  const getPermissionRoute = (pname: any, allPermissions: any) => {
    const route = allPermissions.filter((item:any) => item.title === pname);
    return route;
  };

  const [getPermission, { data }] = useLazyQuery(FIND_ADMIN_ROLE_BY_NAME, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (res) => {
      const adminPermission = [];
      const genPermission = [];
      res?.findUserPermissions?.permission.forEach((per: any) => {
        const getRoute = getPermissionRoute(per.name, res?.findUserPermissions?.generalPermission);
        if (getRoute?.[0]) {
          adminPermission.push(getRoute[0].route);
        }
      });
      res?.findUserPermissions?.generalPermission.forEach((gen: any) => {
        genPermission.push(({ name: gen.title, category: gen.category }));
      });
      setUserPermission(adminPermission);
      setGeneralPermission({ permission: genPermission });
    },
    onError() { console.log('Error in finding Permissions!'); },
  });

  useEffect(() => {
    if (user?.userRole) {
      getPermission({ variables: { userRole: user?.userRole } });
    }
  }, [router.pathname, user]);

  const ctx = useMemo(() => ({
    userPermissions, generalPermissions,
  }), [userPermissions, generalPermissions]);
  console.log('🚀 ~ file: permission.context.tsx ~ line 49 ~ ctx', ctx);

  return (
    <PermissionContext.Provider value={ctx}>
      {children}
    </PermissionContext.Provider>
  );
};

export { PermissionContextProvider };
