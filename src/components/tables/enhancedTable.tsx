import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import Checkbox from '@mui/material/Checkbox';
// import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import Label from '@/components/Label';
import { visuallyHidden } from '@mui/utils';
import _ from 'lodash';
import NextLink from 'next/link';
import { StoreContext } from '@/store/store.context';
import Button from '@mui/material/Button/Button';
import { IconButton } from '@mui/material';
import { StorefrontOutlined } from '@mui/icons-material';

// interface Data {
//   calories: number;
//   carbs: number;
//   fat: numbei tr;
//   name: string;
//   protein: number;
// }

// function createData(
//   name: string,
//   calories: number,
//   fat: number,
//   carbs: number,
//   protein: number,
// ): Data {
//   return {
//     name,
//     calories,
//     fat,
//     carbs,
//     protein,
//   };
// }

// const rows = [
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Donut', 452, 25.0, 51, 4.9),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
//   createData('Honeycomb', 408, 3.2, 87, 6.5),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Jelly Bean', 375, 0.0, 94, 0.0),
//   createData('KitKat', 518, 26.0, 65, 7.0),
//   createData('Lollipop', 392, 0.2, 98, 0.0),
//   createData('Marshmallow', 318, 0, 81, 2.0),
//   createData('Nougat', 360, 19.0, 9, 37.0),
//   createData('Oreo', 437, 18.0, 63, 4.0),
// ];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface statues {
  error
}
export interface HeadCell<T>{
  disablePadding?: boolean;
  id: keyof T;
  label: string;
  type?: 'string' | 'numeric' | 'datetime'| 'custom' | 'timestamp' | 'boolean' | 'status'| 'link';
  options?: any;
  statusOptions?: any;
}

interface EnhancedTableProps<T> {
  numSelected: number;
   onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string | number | symbol;
  rowCount: number;
  headCells: Array<HeadCell<T>>;

}

const EnhancedTableHead = <T extends {}>(props: EnhancedTableProps<T>) => {
  const {
    onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells,
  } = props;
  const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id.toString()}
            align={headCell.type === 'numeric' ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

interface EnhancedTableToolbarProps {
  numSelected: number;
}

// const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
//   const { numSelected } = props;

//   return (
//     <Toolbar
//       sx={{
//         pl: { sm: 2 },
//         pr: { xs: 1, sm: 1 },
//         ...(numSelected > 0 && {
//           bgcolor: (theme: {
//             palette: { primary: { main: string; }; action: {
//               activatedOpacity: number;
//             }; }; }) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
//         }),
//       }}
//     >
//       {numSelected > 0 ? (
//         <Typography
//           sx={{ flex: '1 1 100%' }}
//           color="inherit"
//           variant="subtitle1"
//           component="div"
//         >
//           {numSelected}
//           {' '}
//           selected
//         </Typography>
//       ) : (
//         <Typography
//           sx={{ flex: '1 1 100%' }}
//           variant="h6"
//           id="tableTitle"
//           component="div"
//         >
//           Nutrition
//         </Typography>
//       )}
//       {numSelected > 0 ? (
//         <Tooltip title="Delete">
//           <IconButton>
//             <DeleteIcon />
//           </IconButton>
//         </Tooltip>
//       ) : (
//         <Tooltip title="Filter list">
//           <IconButton>
//             <FilterListIcon />
//           </IconButton>
//         </Tooltip>
//       )}
//     </Toolbar>
//   );
// };

interface ITableProps<T> {
  headCells: Array<HeadCell<T>>,
  rows: T[],
  orderByFieldName: string | number | symbol,
}

const EnhancedTable = <T extends {}>(props : ITableProps<T>) => {
  const { rows, headCells, orderByFieldName } = props;
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string | number | symbol>(orderByFieldName);
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const { store, dispatch } = React.useContext(StoreContext);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n[0]);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.includes(name);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const getStatusLabel = (options, text:string) => {
    // console.log(options);
    let color : 'black' | 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info';
    // eslint-disable-next-line no-restricted-syntax
    for (const key in options) {
      // console.log('🚀 ~ file: enhancedTable.tsx ~ line 300 ~ getStatusLabel ~ text', text);
      // console.log('🚀 ~ file: enhancedTable.tsx
      //  ~ line 300 ~ getStatusLabel ~ options[key]', options[key]);
      if (options[key].includes(text.toLowerCase())) {
        color = key as typeof color;
      }
    }
    return <Label color={color} className="text-capitalize">{text}</Label>;
  };

  const handleClik = (data:any) => {
    dispatch({ type: 'REMOVE_USERDATA', payload: data });
    dispatch({ type: 'UPDATE_BRANDNAME', payload: { ...store, brandName: data?.brandName } });
  };

  return (
    <>
      {/* // <Box sx={{ width: '100%' }}>
    //   <Paper sx={{ width: '100%', mb: 2 }}> */}
      {/* <EnhancedTableToolbar numSelected={selected?.length} /> */}
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={dense ? 'small' : 'medium'}
        >
          <EnhancedTableHead
            numSelected={selected?.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows?.length}
            headCells={headCells}
          />
          <TableBody>
            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row:any, index) => {
                const isItemSelected = isSelected(row?.id?.toString());
                const labelId = `enhanced-table-checkbox-${index}`;

                console.log('🚀 ~ file: enhancedTable.tsx ~ line 366 ~ .map ~ row', row);
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row?.id?.toString())}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row?.id}
                    // selected={isItemSelected}
                  >
                    {headCells.map(({
                      id, type, options, statusOptions,
                    }) => (
                      <TableCell
                        id={labelId}
                        scope="row"
                        onClick={() => handleClik(row)}
                      >

                        {// eslint-disable-next-line func-names, consistent-return
                        (function () {
                          // console.log(options);
                          console.log('row', row, row.shop);
                          // console.log('🚀 ~ file: enhancedTable.tsx ~ line 338 ~ .map ~ id', id);
                          if (_.get(row, id) || type === 'custom') {
                            switch (type) {
                              case 'timestamp':
                                return new Date(parseInt(row[id]?.toString(), 10)).toDateString();
                              case 'datetime':
                                return new Date(row[id]).toLocaleString();
                              case 'status':
                                return getStatusLabel(statusOptions, _.get(row, id) as string);
                              case 'link': return <NextLink href={row[id]} passHref><a>{row[id]}</a></NextLink>;
                              case 'custom':
                                return options.map(({
                                  icon, perm, btn, link, callback, changeIcon, removeUser, ...rest
                                }) => {
                                  if (icon) { return <IconButton aria-label="icon" color="primary" onClick={() => callback(row[perm])}>{icon}</IconButton>; }
                                  if (changeIcon) { return <NextLink href={`${link as string}?sid=${row?.id}`} passHref><a {...rest}><IconButton aria-label="delete" color={row?.drops?.status === 'Active' ? 'success' : 'primary'}><StorefrontOutlined /></IconButton></a></NextLink>; }
                                  if (removeUser) { return removeUser; }
                                  return <NextLink href={`${link as string}?sid=${row?.id}`} passHref><a {...rest}>{btn}</a></NextLink>;
                                });
                              default:
                                return _.get(row, id);
                            }
                          }
                        }())
}

                      </TableCell>
                    ))}

                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
            <TableRow
              style={{
                height: (dense ? 33 : 53) * emptyRows,
              }}
            >
              <TableCell colSpan={6} />
            </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* </Paper>

    </Box> */}
    </>
  );
};

export default EnhancedTable;
