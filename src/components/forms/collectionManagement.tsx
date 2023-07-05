/* eslint-disable react-hooks/rules-of-hooks */
import {
  Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useRouter } from 'next/router';

const CollectionManagement = ({ data: collectionData }: any) => {
  const router = useRouter();
  const { shop } = router.query;

  return (
    <div>
      <h2 style={{ alignItems: 'center' }}>
        Collection Management
      </h2>
      <Card style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'end' }} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Collection Name</TableCell>
                <TableCell>Collection ID</TableCell>
                <TableCell>Product Count</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                collectionData.map((ele) => (
                  <TableRow
                    key="row.title"
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {ele.collectionTitle}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {ele.collectionId}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {ele.productCount}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {
                        ele.isSynced
                          ? <CheckCircleIcon style={{ color: 'green' }} />
                          : <ErrorOutlineIcon style={{ color: 'red' }} />
                      }
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
};

export default CollectionManagement;
