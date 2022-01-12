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

import abi from './utils/WavePortal.json';
import { ethers } from "ethers";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/marcvernet31">
        Website
      </Link>{''}
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
        Made with love by <Link href="https://github.com/marcvernet31"> @marcvernet31</Link>
      </Typography>
      <Copyright />
    </Box>
  )
}

const Message = ({address, message, timestamp}) => {
  return(
    <Card
    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h5" component="h2">
        {address.slice(0, 6)} ... {address.slice(38, 42)}
      </Typography>
      <Typography>
        {message}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        {timestamp.slice(0, timestamp.length - 33)}
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
        This is a message board on the Rinkeby testnet. Any message send will be stored 
        for eternity on the blockchain. Say hello!
      </Typography>
    </>
  )
}


const theme = createTheme();

export default function App() {
  const [connected, setConnected] = useState(false)
  //const [messages, setMessages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9])
  const [loading, setLoading] = useState(false)

  const contractAddress = "0x27522a73b43D44e599c7517c892d7c449B640216"
  const contractABI = abi.abi;

  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [textBox, setTextBox] = useState("");

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        // Call the getAllWaves method from Contract
        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      //     * First make sure we have access to window.ethereum
      const { ethereum } = window;

      // Find ethereum object
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      // Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
        getAllWaves()
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
 
      if (!ethereum) {
        alert("Install MetaMask!");
        return;
      }
 
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
 
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      setLoading(true)

      const { ethereum } = window;

      if(ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        // execute wave from smart contract
        const waveTxn = await wavePortalContract.wave(textBox);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        // Check result
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        // update wave list and text box value
        getAllWaves()
        setLoading(false)
        setTextBox("")

      }
      else {
        console.log("Ethereum object doesn't exists!")
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

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

            {currentAccount != "" ? (
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
                  value={textBox}
                  onChange={(event) => setTextBox(event.target.value)}
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
                    onClick={wave}
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
            {allWaves.slice(0).reverse().map((wave, id) => (
              <Grid item key={id} xs={12} sm={6} md={4}>
                <Message address={wave.address} message={wave.message} timestamp={wave.timestamp.toString()}/>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Footer/>
    </ThemeProvider>
  );
}
