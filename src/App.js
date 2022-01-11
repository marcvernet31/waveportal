import * as React from 'react';
import { useState, useEffect} from 'react'

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Footer = () => {
  return(
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        component="p"
      >
        Made with love by @marcvernet31
      </Typography>
      <Copyright />
    </Box>
  )
}

const Message = () => {
  return(
    <Card
    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h5" component="h2">
        0x5643...2342
      </Typography>
      <Typography>
        This is a media card. You can use this section to describe the
        content.
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Tue, 11 Jan 2022 19:12:44 GMT
      </Typography>
    </CardContent>
  </Card>
  )
}

const Title = () => {
  return(
    <>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        👋 Hey there!
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary" paragraph>
        This is a blockchain waver. Any message send will be stored 
        for eternity on the Ethereum blockchain. Say hello!
      </Typography>
    </>
  )
}


const theme = createTheme();

export default function App() {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9])
  const [loading, setLoading] = useState(false)

  const connectWallet = () => {
    setConnected(true)
  }

  const sendMessage = () => {
    setLoading(true)
    setTimeout(function(){
      setLoading(false)
    }, 3000);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Title/>

            {connected ? (
              <Stack
                sx={{ pt: 4 }}
                direction="column"
                spacing={2}
                justifyContent="center"
              >
                <TextField
                  align="center"
                  id="outlined-multiline-static"
                  label="Writte something!"
                  multiline
                  rows={4}
                  defaultValue="Hello?"
                />
                {loading ? (
                  <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Button 
                    variant="contained" 
                    style={{maxWidth: '90px', maxHeight: '50px'}}
                    align="center"
                    onClick={sendMessage}
                  > 
                    Send 
                  </Button>
                )}
              </Stack>
            ) 
            : 
            (
              <Box textAlign="center" sx={{ p: 5}}>
                <Button 
                  align="center" 
                  variant="contained" 
                  onClick={connectWallet}
                > 
                  Connect wallet 
                </Button>    
              </Box>
            )}



          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {messages.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Message/>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Footer/>
    </ThemeProvider>
  );
}
