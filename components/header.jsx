'use client'
import React from 'react'
import { Box, Typography, Button, useTheme, useMediaQuery, AppBar, Toolbar, List, ListItem, ListItemText, Drawer, IconButton,  } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { SignedIn, SignedOut, UserButton, SignInButton, SignInWithMetamaskButton, useUser, useAuth, SignOutButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';


const Header = ({title}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  
  const path = usePathname()
  console.log(path)

  const router = useRouter()
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <>

    {/* App Bar */}
    <AppBar position="static" sx={{backgroundColor: 'black'}}>
      <Toolbar>
        {/* <Box
          width={'100%'}
          display={'flex'}
        > */}
          <Typography sx={{width: '180px', textAlign: 'center'}} variant="h6" marginRight={2}>
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
              width: 'auto',
              mt: 0,
              mb: 0,
              width: '100%'
            }}
          >
            <Button
              variant="contained"
              onClick={() => router.push('/')}
              sx={{
                ":hover": { backgroundColor: '#c2c2c2' },
                backgroundColor: path === '/' ? '#444444' : 'black'
              }}
            >
              Home
            </Button>
            <Button
              variant="contained"
              sx={{
                ":hover": { backgroundColor: '#c2c2c2' },
                backgroundColor: path === '/generate' ? '#444444' : 'black'
              }}
              onClick={() => router.push('/generate')}
            >
              Generate
            </Button>
            <Button
              variant="contained"
              sx={{
                ":hover": { backgroundColor: '#c2c2c2' },
                backgroundColor: path === '/flashcards' ? '#444444' : 'black'
              }}
              onClick={() => router.push('/flashcards')}
            >
              Flashcards
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            {/* </Box> */}
            <SignedOut>
              {/* <SignInButton />
              <SignInWithMetamaskButton /> */}
              <Button sx={{backgroundColor: 'white', color: 'black', marginRight: 2, border: '2px solid white', ":hover": {backgroundColor: 'black', color: 'white'} }} color="inherit" href="/sign-in">Login</Button>
              <Button sx={{ border: '2px solid white', ":hover": {backgroundColor: '#777777'}, marginRight: 2}}  color="inherit" href="/sign-up">Sign Up</Button>
            </SignedOut>
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
          <ListItem button onClick={handleDrawerClose} component="a" href="/">
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component="a" href="/generate">
            <ListItemText primary="Generate" />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component="a" href="/flashcards">
            <ListItemText primary="Flashcards" />
          </ListItem>
          <SignedOut>

          <ListItem button onClick={handleDrawerClose} component="a" href="/sign-in">
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem button onClick={handleDrawerClose} component="a" href="/sign-up">
            <ListItemText primary="Sign Up" />
          </ListItem>
          </SignedOut>
          <SignedIn>
            <SignOutButton />
            {/* <ListItem button onClick={handleDrawerClose}>
              <ListItemText primary="User" />
            </ListItem> */}
          </SignedIn>
        </List>
      </Box>
    </Drawer>
    </>
  )
}

export default Header