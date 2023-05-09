import { ALL_LOGS } from '@/graphql/store.graphql';
import { useQuery } from '@apollo/client';

export default function useLogsQuery(
  pagination: { skip:number; take :number},
  filters: any[],
  sorting: any[],
) {
  const { data, loading, error } = useQuery(ALL_LOGS, {
    variables: { gridargs: { pagination, filters, sorting } },
    fetchPolicy: 'network-only',
    skip: !pagination,
  });
  const logs = data?.apploggers?.result ?? [];
  const pageInfo = data?.apploggers?.pageInfo ?? {};

  return {
    logs, pageInfo, loading, error,
  };
}
