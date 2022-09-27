import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

interface BaseLayoutProps {
  children?: ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => (
  <Box
    sx={{
      display: 'flex',
      flex: 1,
      height: '100%',
    }}
  >
    {children}
  </Box>
);

BaseLayout.propTypes = {
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.node,
};

export default BaseLayout;
