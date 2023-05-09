import SidebarLayout from '@/layouts/SidebarLayout';
import { useState } from 'react';
import LogsList from '@/components/Grids/logslist';
import useLogsQuery from '@/hooks/useLogsQuery';

function Logs() {
  const [pagination, setPagination] = useState<{skip: number, take:number}>({ skip: 0, take: 100 });
  const [pageSize, setPageSize] = useState<number>(100);
  const [filters, setFilters] = useState<any[]>([]);
  const [sorting, setSorting] = useState<any[]>([]);

  const {
    logs, pageInfo, loading, error,
  } = useLogsQuery(pagination, filters, sorting);

  const handlePageChange = (page) => {
    setPagination({ skip: page * pageSize, take: pageSize });
  };

  const handlePageSize = (pgsize) => {
    setPageSize(pgsize);
    setPagination({ skip: 0, take: pgsize });
  };

  const handleFilterModelChange = (mode) => {
    console.log('handleFilterModelChange', mode);
    setFilters(mode.items);
  };

  const handleSortModelChange = (mode) => {
    console.log('handleSortModelChange', mode);
    setSorting(mode);
  };

  return (
    <LogsList
      pagination={pagination}
      onPageChange={handlePageChange}
      loading={loading}
      logs={logs}
      pageInfo={pageInfo}
      onPageSizeChange={handlePageSize}
      onFilterModelChange={handleFilterModelChange}
      onSortModelChange={handleSortModelChange}
    />
  );
}

Logs.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default Logs;
