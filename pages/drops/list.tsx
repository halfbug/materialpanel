import SidebarLayout from '@/layouts/SidebarLayout';
import { useQuery } from '@apollo/client';
import { DROPS_PAGE } from '@/graphql/store.graphql';
import { useState } from 'react';
import DropsList from '@/components/Grids/droplist';
import useDropsQuery from '@/hooks/useDropsQuery';

function Drops() {
  const [pagination, setPagination] = useState<{skip: number, take:number}>({ skip: 0, take: 25 });
  const [pageSize, setPageSize] = useState<number>(25);
  const [filters, setFilters] = useState<any[]>([]);
  const [sorting, setSorting] = useState<any[]>([]);

  const {
    drops, pageInfo, loading, error,
  } = useDropsQuery(pagination, filters, sorting);

  const handlePageChange = (page) => {
    setPagination({ skip: page * pageSize, take: pageSize });
  };

  const handlePageSize = (pgsize) => {
    setPageSize(pgsize);
    setPagination({ skip: 0, take: pgsize });
  };

  const handleFilterModelChange = (mode) => {
    console.log('handleFilterModelChange', mode);
    const filterMode = mode?.items?.filter((ele: any) => ele?.value);
    setFilters(filterMode);
  };

  const handleSortModelChange = (mode) => {
    console.log('handleSortModelChange', mode);
    setSorting(mode);
  };

  return (
    <SidebarLayout>
      <DropsList
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
        drops={drops}
        pageInfo={pageInfo}
        onPageSizeChange={handlePageSize}
        onFilterModelChange={handleFilterModelChange}
        onSortModelChange={handleSortModelChange}
      />
    </SidebarLayout>
  );
}

export default Drops;
