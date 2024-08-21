'use client'
import React from 'react'
import { Box, Typography, Button, useTheme, useMediaQuery, AppBar, Toolbar, List, ListItem, ListItemText, Drawer, IconButton,  } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { SignedIn, SignedOut, UserButton, SignInButton, SignInWithMetamaskButton, useUser, useAuth, SignOutButton, useClerk } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Opacity } from '@mui/icons-material';
import Link from 'next/link';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault();
    };
  
    if (drawerOpen) {
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    }
  
    return () => {
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [drawerOpen]);
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    signOut({ redirectUrl: '/' })
    setDrawerOpen(false);
  }

  const { signOut } = useClerk();
  
  const path = usePathname()
  console.log('Header path: ', path)

  const router = useRouter()
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <>

    {/* App Bar */}
    {/* backgroundColor: ffffff22 */}
    <AppBar 
      position="fixed" 
      className='appbar-custom'
    >
      <Toolbar sx={{maxWidth: '1600px', width: '100%'}}>
          <Typography color={'white'} className='header-title' sx={{ marginX: -1 }}>
            CardCraft AI
          </Typography>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 2,
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            <Button
              variant="contained"
              onClick={() => router.push('/')}
              sx={{
                ":hover": { backgroundColor: '#555555' },
                backgroundColor: path === '/' ? '#333333' : 'black'
              }}
            >
              Home
            </Button>
            <Button
              variant="contained"
              sx={{
                ":hover": { backgroundColor: '#555555' },
                backgroundColor: path === '/generate' ? '#333333' : 'black'
              }}
              onClick={() => router.push('/generate')}
            >
              Create
            </Button>
            <Button
              variant="contained"
              sx={{
                ":hover": { backgroundColor: '#555555' },
                backgroundColor: path === '/flashcards' ? '#333333' : 'black'
              }}
              onClick={() => router.push('/flashcards')}
            >
              Flashcards
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            {/* </Box> */}
            { path !== '/sign-in' && 
              <SignedOut>
                <Button 
                  variant="contained"
                  sx={{
                    ":hover": { backgroundColor: '#555555' },
                    backgroundColor: path === '/generate' ? '#333333' : 'black'
                  }}
                  href={`/sign-in?redirectTo=${(path)}`}
                >
                  Log in
                </Button>
              </SignedOut>
            }
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Box>

          {/* Mobile Menu Icon */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              justifyContent: 'flex-end',
            }}
          >
            <IconButton
              color="inherit"
              onClick={handleDrawerOpen}
            >
              <MenuIcon style={{ color: 'white' }} />
            </IconButton>
          </Box>
      </Toolbar>
    </AppBar>
    {/* Mobile Drawer Top*/}
    <Drawer
      anchor="top"
      open={drawerOpen}
      onClose={handleDrawerClose}
    >
      <Box
        role="presentation"
        sx={{
          position: 'fixed',
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000000bb',
          color: 'white',
          backdropFilter: 'blur(5px)',
          // WebkitBackdropFilter: 'blur(5px)', // Ensure compatibility with WebKit browsers
        }}
      >
        <List>
          <ListItem sx={{display: 'flex', justifyContent: 'flex-end'}} >
              <CloseIcon style={{ color: 'white'}} onClick={handleDrawerClose} sx={{ maxWidth: '22px', marginRight: '10px', ":hover": {opacity: 0.2}}} />
          </ListItem>
          
          <ListItem sx={{":hover": {backgroundColor: '#555555'}}} onClick={handleDrawerClose} component="a" href="/">
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem sx={{":hover": {backgroundColor: '#555555'}}} onClick={handleDrawerClose} component="a" href="/generate">
            <ListItemText primary="Create" />
          </ListItem>
          <ListItem sx={{":hover": {backgroundColor: '#555555'}}} onClick={handleDrawerClose} component="a" href="/flashcards">
            <ListItemText primary="Flashcards" />
          </ListItem>
          <SignedOut>
            <ListItem sx={{":hover": {backgroundColor: '#555555'}}} onClick={handleDrawerClose} component="a" href="/sign-in">
              <ListItemText primary="Login" />
            </ListItem>
          </SignedOut>
          <SignedIn>
            <ListItem sx={{":hover": {backgroundColor: '#555555'}}} onClick={handleLogout} component="a" href="#">
              <ListItemText primary="Log Out" />
            </ListItem>
          </SignedIn>
        </List>
      </Box>
    </Drawer>
    {/* Mobile Drawer Right */}
    {/* <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={handleDrawerClose}
    >
      <Box
        sx={{
          width: 250,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000000bb',
          color: 'white',
          backdropFilter: 'blur(5px)',
        }}
      >
        <List>
          <ListItem sx={{display: 'flex', justifyContent: 'flex-end'}} >
              <CloseIcon style={{ color: 'white'}} onClick={handleDrawerClose} sx={{ maxWidth: '22px', marginRight: '10px', ":hover": {opacity: 0.2}}} />
          </ListItem>
          
          <ListItem sx={{":hover": {backgroundColor: '#555555'}}} onClick={handleDrawerClose} component="a" href="/">
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem sx={{":hover": {backgroundColor: '#555555'}}} onClick={handleDrawerClose} component="a" href="/generate">
            <ListItemText primary="Create" />
          </ListItem>
          <ListItem sx={{":hover": {backgroundColor: '#555555'}}} onClick={handleDrawerClose} component="a" href="/flashcards">
            <ListItemText primary="Flashcards" />
          </ListItem>
          <SignedOut>
            <ListItem sx={{":hover": {backgroundColor: '#555555'}}} onClick={handleDrawerClose} component="a" href="/sign-in">
              <ListItemText primary="Login" />
            </ListItem>
          </SignedOut>
          <SignedIn>
            <ListItem sx={{":hover": {backgroundColor: '#555555'}}} onClick={handleLogout} component="a" href="#">
              <ListItemText primary="Log Out" />
            </ListItem>
          </SignedIn>
        </List>
      </Box>
    </Drawer> */}
    </>
  )
}

export default Header