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
  activityLogs, setfilters, activityFilters,
}: any) => (
  <div>
    <h2 style={{ alignItems: 'center' }}>
      Audit History
    </h2>
    <div style={{ display: 'flex', marginBottom: '10px' }}>
      <Select
        id="filterBy"
        displayEmpty
        name="filterBy"
        value="All Fields"
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
            {activityLogs.map((activity) => (
              <Row key={activity.id} row={activity} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  </div>
);

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
          {row.user.firstName}
          {' '}
          {row.user.lastName}
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
                  {(row.operation === 'UPDATE') && row.changes.map((historyRow) => (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {historyRow.fieldname}
                      </TableCell>
                      <TableCell>{historyRow.parentTitle}</TableCell>
                      <TableCell>{historyRow.oldvalue}</TableCell>
                      <TableCell>{historyRow.newValue}</TableCell>
                    </TableRow>
                  ))}

                  {(row.operation !== 'UPDATE') && (
                  <>
                    {Object.keys(row.changes[0]).map((mkey) => (
                      // eslint-disable-next-line react/jsx-no-useless-fragment
                      <>
                        {(typeof row.changes[0][mkey] === 'string' && row.changes[0][mkey] !== null
                        && (
                        <TableRow>
                          <TableCell>{mkey}</TableCell>
                          <TableCell>{row.context === 'Manage Section Content' ? row.changes[0][mkey] : ''}</TableCell>
                          <TableCell>{row.operation === 'REMOVE' && row.context !== 'Manage Section Content' ? row.changes[0][mkey] : '-'}</TableCell>
                          <TableCell>{row.operation === 'CREATE' && row.context !== 'Manage Section Content' ? row.changes[0][mkey] : '-'}</TableCell>
                        </TableRow>
                        )
                        )}

                        {(typeof row.changes[0][mkey] === 'object' && row.changes[0][mkey] !== null && row.changes[0][mkey].length > 0
                        && mkey !== 'permission' && (
                          <>
                            {Object.keys(row.changes[0][mkey][row.changes[0][mkey].length - 1]).map((inkey) => (
                              <TableRow>
                                <TableCell>
                                  {mkey}
                                  {' '}
                                  {inkey}
                                </TableCell>
                                <TableCell />
                                <TableCell>{row.operation === 'REMOVE' ? row.changes[0][mkey][row.changes[0][mkey].length - 1][inkey] : '-'}</TableCell>
                                <TableCell>{row.operation === 'CREATE' ? row.changes[0][mkey][row.changes[0][mkey].length - 1][inkey] : '-'}</TableCell>
                              </TableRow>
                            ))}
                          </>
                        )
                        )}

                        {(typeof row.changes[0][mkey] === 'object' && row.changes[0][mkey] !== null && row.changes[0][mkey].length > 0
                        && mkey === 'permission' && (
                          <>
                            {Object.keys(row.changes[0][mkey]).map((inkey, index) => (
                              <TableRow>
                                <TableCell>Permission</TableCell>
                                <TableCell />
                                <TableCell>{row.operation === 'REMOVE' ? row.changes[0][mkey][index].name : '-'}</TableCell>
                                <TableCell>{row.operation === 'CREATE' ? row.changes[0][mkey][index].name : '-'}</TableCell>
                              </TableRow>
                            ))}
                          </>
                        )
                        )}

                      </>
                    ))}
                  </>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default DynamicAuditHistory;
