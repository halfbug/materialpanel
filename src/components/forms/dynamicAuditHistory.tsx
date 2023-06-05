/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable max-len */
import {
  Button,
  Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, Typography, TableRow, MenuItem, Select,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import moment from 'moment';

const DynamicAuditHistory = ({
  activityLogs, adminRoles, setfilters, filters, activityFilters,
}: any) => {
  const [logsData, setLogsData] = useState<any[]>([]);

  useEffect(() => {
    const temp = [];
    activityLogs.forEach((row:any) => {
      const tempInner = [];
      if (row.operation === 'UPDATE') {
        row.changes.forEach((inrow:any) => {
          let { newValue, oldvalue } = inrow;
          if (inrow.fieldname === 'userRole' && inrow.oldvalue !== '') {
            const getRole = adminRoles.filter((adminRole) => adminRole.id === inrow.oldvalue);
            oldvalue = getRole[0].roleName;
          }
          if (inrow.fieldname === 'userRole' && inrow.newValue !== '') {
            const getRole = adminRoles.filter((adminRole) => adminRole.id === inrow.newValue);
            newValue = getRole[0].roleName;
          }
          tempInner.push({
            fieldname: inrow.fieldname,
            parentTitle: inrow.parentTitle,
            oldValue: oldvalue,
            newValue,
          });
        });
      }
      if (row.operation !== 'UPDATE') {
        Object.keys(row.changes[0]).forEach((mrow:any) => {
          if (typeof row.changes[0][mrow] === 'string' && row.changes[0][mrow] !== null) {
            let oldValue = row.changes[0][mrow];
            if ((row.operation === 'REMOVE' || row.operation === 'CREATE') && row.context !== 'Manage Section Content') {
              if (mrow === 'userRole') {
                const getRole = adminRoles.filter((adminRole) => adminRole.id === row.changes[0][mrow]);
                oldValue = getRole[0]?.roleName;
              } else {
                oldValue = row.changes[0][mrow];
              }
            } else {
              oldValue = '-';
            }
            tempInner.push({
              fieldname: mrow,
              parentTitle: row.context === 'Manage Section Content' ? row.changes[0][mrow] : '',
              oldValue: row.operation === 'REMOVE' ? oldValue : '-',
              newValue: row.operation === 'CREATE' ? oldValue : '-',
            });
          }

          if (typeof row.changes[0][mrow] === 'object' && row.changes[0][mrow] !== null && row.changes[0][mrow].length > 0
          && mrow !== 'permission') {
            Object.keys(row.changes[0][mrow][row.changes[0][mrow].length - 1]).forEach((inkey) => {
              tempInner.push({
                fieldname: `${mrow}${' '}${inkey}`,
                parentTitle: null,
                oldValue: row.operation === 'REMOVE' ? row.changes[0][mrow][row.changes[0][mrow].length - 1][inkey] : '-',
                newValue: row.operation === 'CREATE' ? row.changes[0][mrow][row.changes[0][mrow].length - 1][inkey] : '-',
              });
            });
          }

          if (typeof row.changes[0][mrow] === 'object' && row.changes[0][mrow] !== null && row.changes[0][mrow].length > 0
          && mrow === 'permission') {
            Object.keys(row.changes[0][mrow]).forEach((inkey, dindex) => {
              tempInner.push({
                fieldname: 'Permission',
                parentTitle: null,
                oldValue: row.operation === 'REMOVE' ? row.changes[0][mrow][dindex].name : '-',
                newValue: row.operation === 'CREATE' ? row.changes[0][mrow][dindex].name : '-',
              });
            });
          }
        });
      }
      temp.push({
        id: row.id,
        context: row.context,
        operation: row.operation,
        user: row.user,
        changes: tempInner,
        createdAt: row.createdAt,
      });
    });
    setLogsData(temp);
  }, [activityLogs]);

  return (
    <div>
      <h2 style={{ alignItems: 'center' }}>
        Audit History
      </h2>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <Select
          id="filterBy"
          displayEmpty
          name="filterBy"
          value={filters}
          onChange={(e) => setfilters(e.target.value)}
          style={{ width: '200px' }}
        >
          <MenuItem value="All Fields">All Fields</MenuItem>
          {activityFilters?.map((mkey) => (
            <MenuItem value={mkey}>{mkey}</MenuItem>
          ))}
          ;

        </Select>
      </div>
      <Card style={{ padding: '20px' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Changed Date</TableCell>
                <TableCell>Operation</TableCell>
                <TableCell>Context</TableCell>
                <TableCell>Value Changed</TableCell>
                <TableCell>Changed By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logsData.map((activity, index) => (
                <Row key={activity.id} row={logsData[index]} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
};

function Row(props: { row: any }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <TableRow
        key="mytitle"
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {moment(row.createdAt).format('MMM Do YYYY, HH:mm:ss')}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.operation}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.context}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.changes.length}
        </TableCell>
        <TableCell component="th" scope="row">
          {row?.user?.firstName}
          {' '}
          {row?.user?.lastName}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Field Name</TableCell>
                    <TableCell>Parent Title</TableCell>
                    <TableCell>Old Value</TableCell>
                    <TableCell>New Value</TableCell>
                  </TableRow>

                </TableHead>
                <TableBody>
                  {row.changes.map((historyRow) => (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {historyRow.fieldname}
                      </TableCell>
                      <TableCell>{historyRow.parentTitle}</TableCell>
                      <TableCell>{historyRow.oldValue}</TableCell>
                      <TableCell>{historyRow.newValue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

DynamicAuditHistory.defaultProps = {
  adminRoles: [],
};

export default DynamicAuditHistory;
