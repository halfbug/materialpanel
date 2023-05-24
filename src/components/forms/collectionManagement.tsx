/* eslint-disable react-hooks/rules-of-hooks */
import { GET_COLLECTION_LIST } from '@/graphql/store.graphql';
import { useQuery } from '@apollo/client';
import {
  Button, Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import {
  useState, useEffect, useCallback, useContext,
} from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { StoreContext } from '@/store/store.context';

interface CollectioList {
  collectionTitle: string;
  collectionId: string;
  isSynced: boolean;
  productCount: boolean;
}

const CollectionManagement = ({ fetch }: any) => {
  const [collectionData, setCollectionData] = useState<CollectioList[]>([]);
  const { store } = useContext(StoreContext);
  const {
    data, refetch,
  } = useQuery(
    GET_COLLECTION_LIST,
    {
      variables: {
        shop: store?.removeUserData?.shop,
      },
      skip: !store?.removeUserData?.shop,
    },
  );

  const refetchData = useCallback(() => {
    fetch(refetch());
  }, [fetch]);

  useEffect(() => {
    refetchData();
  }, [fetch]);

  useEffect(() => {
    if (data) {
      const { getCollectionList } = data;
      const temp = getCollectionList.slice()
        .sort(
          (
            { isSynced: stateA = false },
            { isSynced: stateB = false },
          ) => Number(stateA) - Number(stateB),
        );
      setCollectionData(temp);
    }
  }, [data]);

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
