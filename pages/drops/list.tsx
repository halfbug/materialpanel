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
  const [startdate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const {
    drops, pageInfo, loading, error,
  } = useDropsQuery(pagination, filters, sorting, startdate, endDate);

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
  const handleDate = (dateSet) => {
    console.log('handleDate', dateSet.split(' - '));
    const dateArray = dateSet.split(' - ');
    const sdate = new Date(dateArray[0]);
    const edate = new Date(dateArray[1]);
    edate.setDate(edate.getDate() + 1);
    setStartDate(sdate);
    setEndDate(edate);
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
        onHandleDate={handleDate}
      />
    </SidebarLayout>
  );
}

export default Drops;
