import useAppContext, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import { PermissionContext } from '@/contexts/permission.context';
import { useRouter } from 'next/router';

export default function usePermission() {
  const [userPermissions, setUserPermissions] = useState([]);
  const [generalPermissions, setGeneralPermissions] = useState([]);
  const router = useRouter();

  const permissions = useContext(PermissionContext);
  useEffect(() => {
    getPermissions();
  }, [permissions]);

  const getPermissions = () => {
    setUserPermissions(permissions?.userPermissions);
    setGeneralPermissions(permissions?.generalPermissions?.permission);
  };

  return {
    userPermissions,
    generalPermissions,
  };
}
