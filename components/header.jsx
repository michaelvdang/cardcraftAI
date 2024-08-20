'use client'
import React from 'react'
import { Box, Typography, Button, useTheme, useMediaQuery, AppBar, Toolbar, List, ListItem, ListItemText, Drawer, IconButton,  } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { SignedIn, SignedOut, UserButton, SignInButton, SignInWithMetamaskButton, useUser, useAuth, SignOutButton, useClerk } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';


const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    <AppBar position="fixed" color="transparent" sx={{backgroundColor: '#000000bb', height: {xs: '50px', md: '60px'}, display: 'flex', justifyContent: 'center', backdropFilter: 'blur(25px)'}}>
      <Toolbar>
          <Typography color={'white'} sx={{width: {xs: '150px', md: '240px'}, textAlign: 'center'}} variant="h6" marginRight={2} fontSize={{xs: '1.2rem', md: '1.5rem'}}>
            Flashcard SaaS
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
              Generate
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
                <Button sx={{ border: '2px solid white', ":hover": {backgroundColor: '#333333'}, marginRight: 2}}  color="inherit" href={`/sign-in?redirectTo=${(path)}`}>Login</Button>
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
              <MenuIcon />
            </IconButton>
          </Box>
      </Toolbar>
    </AppBar>
    {/* Mobile Drawer */}
    <Drawer
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
          backgroundColor: 'black',
          color: 'white',
        }}
      >
        <List>
          <ListItem onClick={handleDrawerClose} component="a" href="/">
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem onClick={handleDrawerClose} component="a" href="/generate">
            <ListItemText primary="Generate" />
          </ListItem>
          <ListItem onClick={handleDrawerClose} component="a" href="/flashcards">
            <ListItemText primary="Flashcards" />
          </ListItem>
          <SignedOut>
            <ListItem onClick={handleDrawerClose} component="a" href="/sign-in">
              <ListItemText primary="Login" />
            </ListItem>
          </SignedOut>
          <SignedIn>
            <ListItem onClick={handleLogout} component="a" href="#">
              <ListItemText primary="Log Out" />
            </ListItem>
          </SignedIn>
        </List>
      </Box>
    </Drawer>
    </>
  )
}

export default Header