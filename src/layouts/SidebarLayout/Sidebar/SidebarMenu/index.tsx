/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem,
} from '@mui/material';
import NextLink from 'next/link';
import { SidebarContext } from 'src/contexts/SidebarContext';

import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import MmsTwoToneIcon from '@mui/icons-material/MmsTwoTone';
// import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
// import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
// import BallotTwoToneIcon from '@mui/icons-material/BallotTwoTone';
// import BeachAccessTwoToneIcon from '@mui/icons-material/BeachAccessTwoTone';
// import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import FilterVintageTwoToneIcon from '@mui/icons-material/FilterVintageTwoTone';
import usePermission from '@/hooks/usePermission';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
// import HowToVoteTwoToneIcon from '@mui/icons-material/HowToVoteTwoTone';
// import LocalPharmacyTwoToneIcon from '@mui/icons-material/LocalPharmacyTwoTone';
// import RedeemTwoToneIcon from '@mui/icons-material/RedeemTwoTone';
// import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
// import TrafficTwoToneIcon from '@mui/icons-material/TrafficTwoTone';
// import CheckBoxTwoToneIcon from '@mui/icons-material/CheckBoxTwoTone';
// import ChromeReaderModeTwoToneIcon from '@mui/icons-material/ChromeReaderModeTwoTone';
// import WorkspacePremiumTwoToneIcon from '@mui/icons-material/WorkspacePremiumTwoTone';
// import CameraFrontTwoToneIcon from '@mui/icons-material/CameraFrontTwoTone';
// import DisplaySettingsTwoToneIcon from '@mui/icons-material/DisplaySettingsTwoTone';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`,
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }

          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
    'transform',
    'opacity',
  ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`,
);

function SidebarMenu() {
  const [adminMenu, setAdminMenu] = useState([]);
  const { closeSidebar } = useContext(SidebarContext);
  const router = useRouter();
  const { userPermissions } = usePermission();
  const currentRoute = router.pathname;

  console.log('currentRoute', currentRoute);
  useEffect(() => {
    if (userPermissions?.length > 0) {
      if (!userPermissions.includes(router.pathname) && router.pathname !== '/settings') {
        router.push('/access-denied');
      }
      setAdminMenu(userPermissions);
    }
  }, [userPermissions, router.pathname]);

  return (
    <MenuWrapper>
      {/* <List component="div">
        <SubMenuWrapper>
          <List component="div">
            <ListItem component="div">
              <NextLink href="/dashboards/general" passHref>
                <Button
                  className={currentRoute === '="/' ? 'active' : ''}
                  disableRipple
                  component="a"
                  onClick={closeSidebar}
                  startIcon={<DesignServicesTwoToneIcon />}
                >
                  Overview
                </Button>
              </NextLink>
            </ListItem>
          </List>
        </SubMenuWrapper>
      </List> */}
      {/* <List
        component="div"
        subheader={(
          <ListSubheader component="div" disableSticky>
            Merchant
          </ListSubheader>
        )}
      > */}
      <SubMenuWrapper>
        <List component="div">
          {((adminMenu.includes('/merchant'))) && (
          <ListItem component="div">
            <NextLink href="/merchant" passHref>
              <Button
                className={
                  //   currentRoute === '/dashboards/crypto' ? 'active' : ''
                  // }
                      currentRoute === '/merchant' ? 'active' : ''
                    }
                disableRipple
                component="a"
                onClick={closeSidebar}
                startIcon={<StorefrontIcon />}
              >
                Stores
              </Button>
            </NextLink>
          </ListItem>
          )}
          {((adminMenu.includes('/users'))) && (
          <ListItem component="div">
            <NextLink href="/users" passHref>
              <Button
                className={
                      currentRoute === '/users' ? 'active' : ''
                    }
                disableRipple
                component="a"
                onClick={closeSidebar}
                startIcon={<PeopleOutlineIcon />}
              >
                User Management
              </Button>
            </NextLink>
          </ListItem>
          )}
          {((adminMenu.includes('/roles'))) && (
          <ListItem component="div">
            <NextLink href="/roles" passHref>
              <Button
                className={
                      currentRoute === '/roles' ? 'active' : ''
                    }
                disableRipple
                component="a"
                onClick={closeSidebar}
                startIcon={<ManageAccountsIcon />}
              >
                Role Management
              </Button>
            </NextLink>
          </ListItem>
          )}
          {((adminMenu.includes('/logs'))) && (
          <ListItem component="div">
            <NextLink href="/logs" passHref>
              <Button
                className={
                    currentRoute === '/logs' ? 'active' : ''
                  }
                disableRipple
                component="a"
                onClick={closeSidebar}
                startIcon={<FilterVintageTwoToneIcon />}
              >
                Logs
              </Button>
            </NextLink>
          </ListItem>
          )}
          {((adminMenu.includes('/drops/list'))) && (
          <ListItem component="div">
            <NextLink href="/drops/list" passHref>
              <Button
                className={
                      currentRoute === '/drops/list' ? 'active' : ''
                    }
                disableRipple
                component="a"
                onClick={closeSidebar}
                startIcon={<MmsTwoToneIcon />}
              >
                Drops
              </Button>
            </NextLink>
          </ListItem>
          )}
          <ListItem component="div">
            <NextLink href="/settings" passHref>
              <Button
                className={
                      currentRoute === '/settings' ? 'active' : ''
                    }
                disableRipple
                component="a"
                onClick={closeSidebar}
                startIcon={<SettingsApplicationsIcon />}
              >
                Settings
              </Button>
            </NextLink>
          </ListItem>
        </List>
      </SubMenuWrapper>
      {/* </List> */}
      {/* <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Management
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/management/transactions" passHref>
                  <Button
                    className={
                      currentRoute === '/management/transactions'
                        ? 'active'
                        : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<TableChartTwoToneIcon />}
                  >
                    Transactions List
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Accounts
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/management/profile" passHref>
                  <Button
                    className={
                      currentRoute === '/management/profile' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<AccountCircleTwoToneIcon />}
                  >
                    User Profile
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component="div">
                <NextLink href="/management/profile/settings" passHref>
                  <Button
                    className={
                      currentRoute === '/management/profile/settings'
                        ? 'active'
                        : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<DisplaySettingsTwoToneIcon />}
                  >
                    Account Settings
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Components
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/components/buttons" passHref>
                  <Button
                    className={
                      currentRoute === '/components/buttons' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<BallotTwoToneIcon />}
                  >
                    Buttons
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component="div">
                <NextLink href="/components/modals" passHref>
                  <Button
                    className={
                      currentRoute === '/components/modals' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<BeachAccessTwoToneIcon />}
                  >
                    Modals
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component="div">
                <NextLink href="/components/accordions" passHref>
                  <Button
                    className={
                      currentRoute === '/components/accordions' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<EmojiEventsTwoToneIcon />}
                  >
                    Accordions
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component="div">
                <NextLink href="/components/tabs" passHref>
                  <Button
                    className={
                      currentRoute === '/components/tabs' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<FilterVintageTwoToneIcon />}
                  >
                    Tabs
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component="div">
                <NextLink href="/components/badges" passHref>
                  <Button
                    className={
                      currentRoute === '/components/badges' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<HowToVoteTwoToneIcon />}
                  >
                    Badges
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component="div">
                <NextLink href="/components/tooltips" passHref>
                  <Button
                    className={
                      currentRoute === '/components/tooltips' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<LocalPharmacyTwoToneIcon />}
                  >
                    Tooltips
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component="div">
                <NextLink href="/components/avatars" passHref>
                  <Button
                    className={
                      currentRoute === '/components/avatars' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<RedeemTwoToneIcon />}
                  >
                    Avatars
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component="div">
                <NextLink href="/components/cards" passHref>
                  <Button
                    className={
                      currentRoute === '/components/cards' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<SettingsTwoToneIcon />}
                  >
                    Cards
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component="div">
                <NextLink href="/components/forms" passHref>
                  <Button
                    className={
                      currentRoute === '/components/forms' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<TrafficTwoToneIcon />}
                  >
                    Forms
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Extra Pages
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/status/404" passHref>
                  <Button
                    className={currentRoute === '/status/404' ? 'active' : ''}
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<CheckBoxTwoToneIcon />}
                  >
                    Error 404
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component="div">
                <NextLink href="/status/500" passHref>
                  <Button
                    className={currentRoute === '/status/500' ? 'active' : ''}
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<CameraFrontTwoToneIcon />}
                  >
                    Error 500
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component="div">
                <NextLink href="/status/coming-soon" passHref>
                  <Button
                    className={
                      currentRoute === '/status/coming-soon' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<ChromeReaderModeTwoToneIcon />}
                  >
                    Coming Soon
                  </Button>
                </NextLink>
              </ListItem>
              <ListItem component="div">
                <NextLink href="/status/maintenance" passHref>
                  <Button
                    className={
                      currentRoute === '/status/maintenance' ? 'active' : ''
                    }
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<WorkspacePremiumTwoToneIcon />}
                  >
                    Maintenance
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List> */}
    </MenuWrapper>
  );
}

export default SidebarMenu;
