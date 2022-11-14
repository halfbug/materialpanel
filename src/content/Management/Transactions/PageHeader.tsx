import {
  Typography, Button, Grid, Alert,
} from '@mui/material';

interface PageHeaderProps {
  meta: { billingStatus: boolean },
}
function PageHeader({ meta }: PageHeaderProps) {
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg',
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item xs={12}>
        <Alert severity={meta.billingStatus ? 'info' : 'warning'}>
          Billing status is
          {' '}
          {meta.billingStatus ? 'true' : 'false'}
          !
        </Alert>
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Merchant
        </Typography>
        <Typography variant="subtitle2">
          {user.name}
          , these are your recent stores
        </Typography>
      </Grid>
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
