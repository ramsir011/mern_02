import {
  AppBar,
  Badge,
  Button,
  Container,
  createTheme,
  CssBaseline,
  IconButton,
  Link,
  ThemeProvider,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemText,
  MenuItem,
  Menu,
  InputBase,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import { getError } from '../utils/error';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import Head from 'next/head';
import React, { useContext, useState, useEffect } from 'react';
import classes from '../utils/classes';
import NextLink from 'next/link';
import {
  AccountBoxRounded,

  Brightness1Rounded,
  Brightness2,
  ShoppingCart,
} from '@mui/icons-material';
import { Store } from '../utils/Store.js';
import axios from 'axios';
export default function Layout({ title, description, children }) {

  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart, userInfo, darkMode } = state;
 
  const theme = createTheme({
    components: {
      MuiLink: {
        defaultProps: {
          underline: 'hover',
        },
      },
    },
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

  const [sidbarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const [query, setQuery] = useState('');
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  useEffect(() => {
    fetchCategories();
  });

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    Cookies.remove('shippinhAddress');
    Cookies.remove('paymentMethod');
    router.push('/');
  };
  return (
    <>
      <Head>
        <title>{title ? `${title} -  Amazona` : ' Amazona'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" sx={classes.appbar}>
          <Toolbar sx={classes.toolbar}>
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
                sx={classes.menuButton}
              >
                <MenuIcon sx={classes.navbarButton} />
              </IconButton>
              <NextLink href="/" passHref>
                <Link>
                  <Typography sx={classes.brand}>amazona</Typography>
                </Link>
              </NextLink>
            </Box>
            <Drawer
              anchor="left"
              open={sidbarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>Shopping by category</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((category) => (
                  <NextLink
                    key={category}
                    href={`/search?category=${category}`}
                    passHref
                  >
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category}></ListItemText>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>
            <div>
              <Box
                component="form"
                onSubmit={submitHandler}
                sx={classes.searchForm}
              >
                <InputBase
                  name="query"
                  sx={classes.searchInput}
                  placeholder="Search products"
                  onChange={queryChangeHandler}
                />
                <IconButton
                  type="submit"
                  sx={classes.iconButton}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </Box>
            </div>
            <div>
              <IconButton checked={darkMode} onClick={darkModeChangeHandler}>
                {darkMode ? (
                  <Brightness2 color="primary" />
                ) : (
                  <Brightness1Rounded color="primary" />
                )}
              </IconButton>

              <NextLink href="/cart" passHref>
                <Link>
                  {cart.cartItems.length>0 &&(
                      <IconButton>
                        <Badge
                          color="secondary"
                          badgeContent={cart.cartItems.length}
                        >
                          <ShoppingCart color= 'primary' />
                        </Badge>
                      </IconButton>
                    )}
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    sx={classes.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, '/order-history')
                      }
                    >
                      Order Hisotry
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/admin/dashboard')
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>
                      <IconButton>
                        <AccountBoxRounded color= 'primary'/>
                    </IconButton>
                  </Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={classes.main}>
          {children}
        </Container>
        <Box component="footer" sx={classes.footer}>
          <Typography>All rights reserved. Sanity Amazona.</Typography>
        </Box>
      </ThemeProvider>
    </>
  );
}
