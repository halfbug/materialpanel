import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import React, { useState } from 'react';

const Tabs = ({ tabList, defaultTab = '1' }: any) => {
  const [tab, setTab] = useState<string>(defaultTab);

  const handleChangeTab = (_: any, newValue: any) => {
    setTab(newValue);
  };
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            {tabList.map((ele: any) => <Tab label={ele.label} value={ele.value} />)}
          </TabList>
        </Box>
        {tabList.map((ele: any) => (
          <TabPanel value={ele.value}>
            {ele.component}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default Tabs;
