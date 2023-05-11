import { ALL_LOGS, CLEAR_LOG_BY_LEVEL } from '@/graphql/store.graphql';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect } from 'react';

export default function useLogsQuery(
  pagination: { skip:number; take :number},
  filters: any[],
  sorting: any[],
) {
  const [clearLogs, {
    data: clearLogsData,
    loading: clearLogsLoading,
  }] = useMutation<any>(CLEAR_LOG_BY_LEVEL, {
    fetchPolicy: 'network-only',
  });

  const {
    data, loading, error, refetch,
  } = useQuery(ALL_LOGS, {
    variables: { gridargs: { pagination, filters, sorting } },
    fetchPolicy: 'network-only',
    skip: !pagination,
  });

  useEffect(() => {
    if (clearLogsData?.removeAppLoggerByLevel?.message) {
      refetch();
    }
  }, [clearLogsData]);

  const logs = data?.apploggers?.result ?? [];
  const pageInfo = data?.apploggers?.pageInfo ?? {};

  return {
    logs, pageInfo, loading, error, clearLogs, clearLogsLoading, clearLogsData,
  };
}
