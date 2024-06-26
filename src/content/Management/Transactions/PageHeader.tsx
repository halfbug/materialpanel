import React, { useContext } from 'react';
import { AuthContext } from '@/contexts/auth.context';
import {
  Typography, Button, Grid, Alert,
} from '@mui/material';

interface PageHeaderProps {
  meta?: { billingStatus: boolean },
  title?: string,
  subtitle?: string,
  pagetitle?:string,
}
function PageHeader({
  meta, title, subtitle, pagetitle,
}: PageHeaderProps) {
  // const user = {
  //   name: 'Catherine Pike ss',
  //   avatar: '/static/images/avatars/1.jpg',
  // };
  const { user } = useContext(AuthContext);
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      { meta && (
      <Grid item xs={12}>
        {/* <Alert severity={meta.billingStatus ? 'info' : 'warning'}>
          Billing status is
          {' '}
          {meta.billingStatus ? 'true' : 'false'}
          !
        </Alert> */}
      </Grid>
      )}

      { (pagetitle !== '') ? (
        <Grid item xs={12}>
          <Typography variant="h3" component="h3" gutterBottom>
            {pagetitle}
          </Typography>
        </Grid>
      )
        : (
          <Grid item>
            <Typography variant="h3" component="h3" mt={2} gutterBottom>
              {title ?? 'Dashboard'}
            </Typography>
            <Typography variant="subtitle2" className="title_case">
              {user?.name}
              ,
              {' '}
              {subtitle || 'these are your recent stores'}
            </Typography>
          </Grid>
        )}

      <Grid item>
        {/* <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Create transaction
        </Button> */}
      </Grid>
    </Grid>
  );
}

export default PageHeader;
PageHeader.PageHeader = {
  meta: {},
  pagetitle: '',
};
