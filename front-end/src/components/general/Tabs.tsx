import React, { ReactElement } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


interface OneTabProps {
    value: string,
    label: string,
    content: ReactElement,
}

interface TabsProps {
    tabs: OneTabProps[],
}

export const Tabs = ({
    tabs,
}: TabsProps) => {

  const [value, setValue] = React.useState('1');

  const handleChange = (event: any, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList centered onChange={handleChange} aria-label="lab API tabs example">
              {tabs.map(({ label, value }) => (
                <Tab
                    label={label}
                    value={value}
                />
              ))}
          </TabList>
        </Box>
        {tabs.map(({ value, content }) => (
            <TabPanel value={value}>
                {content}
            </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}