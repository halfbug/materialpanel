import { DROPS_PAGE } from '@/graphql/store.graphql';
import { useQuery } from '@apollo/client';

export default function useDropsQuery(
  pagination: { skip:number; take :number},
  filters: any[],
  sorting: any[],
  startdate: Date,
  endDate: Date,
) {
  console.log('🚀 ~ file: useDropsQuery.ts:5 ~ useDropsQuery ~ pagination:', pagination);
  const { data, loading, error } = useQuery(DROPS_PAGE, {
    variables: {
      gridargs: {
        pagination, filters, sorting, startdate, endDate,
      },
    },
    fetchPolicy: 'network-only',
    skip: !pagination,
  });
  console.log('🚀 ~ file: useDropsQuery.ts:9 ~ useDropsQuery ~ data:', data);

  const drops = data?.getDrops?.result ?? [];
  const pageInfo = data?.getDrops?.pageInfo ?? {};

  return {
    drops, pageInfo, loading, error,
  };
}
