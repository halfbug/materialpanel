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
    logs, pageInfo, loading, error, clearLogs, clearLogsLoading, clearLogsData,
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
    const filterMode = mode?.items?.filter((ele: any) => ele?.value);
    setFilters(filterMode);
  };

  const handleSortModelChange = (mode) => {
    console.log('handleSortModelChange', mode);
    setSorting(mode);
  };

  return (
    <LogsList
      pagination={pagination}
      onPageChange={handlePageChange}
      loading={loading || clearLogsLoading}
      logs={logs}
      pageInfo={pageInfo}
      onPageSizeChange={handlePageSize}
      onFilterModelChange={handleFilterModelChange}
      onSortModelChange={handleSortModelChange}
      clearLogs={clearLogs}
      clearLogsData={clearLogsData}
    />
  );
}

Logs.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default Logs;
