"use client";
import { useEffect, useState } from "react";
import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { ContractRunner, ethers, parseUnits } from "ethers";
import { formatEther, parseEther } from "@ethersproject/units";

import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Stack,
  Avatar,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  TextField,
  Skeleton,
} from "@mui/material";

import abi from "./abi.json";

const [metaMask, hooks] = initializeConnector(
  (action) => new MetaMask({ actions: action })
);
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } =
  hooks;

export default function Home() {
  const contractChain = 11155111;
  const contractAddress = "0x5a1301d99489931059f5e89138edfec7fe52648b";

  const chainId = useChainId();
  const accounts = useAccounts();
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  const provider = useProvider();

  const [balance, setBalance] = useState("");
  const [myAccount, setMyAccount] = useState("");
  const [buyToken, setBuyToken] = useState("");
  const [isLoading, setIsloading] = useState(false);

  // const[balance,]
  const [error, setError] = useState(undefined);

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect eagerly to metamask");
    });
  }, []);

  useEffect(() => {
    (async () => {
      // const providerEthers = new ethers.JsonRpcProvider();
      const signer = provider?.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      // if (signer) {
      // }
      if (accounts != undefined) {
        // const myBalance = await smartContract.
        const myBalance = await smartContract.balanceOf(accounts[0]);
        setMyAccount(accounts[0]);
        setBalance(formatEther(myBalance));
      }
    })();
  }, [accounts, isActive, provider]);

  const handleConnect = () => {
    metaMask.activate(contractChain);
  };

  const handleDisconnect = () => {
    metaMask.resetState();
  };

  const handleBuyToken = async () => {
    if (parseInt(buyToken) < 0) {
      return;
    }
    try {
      setIsloading(true);
      console.log(buyToken);

      const signer = provider?.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const valueConvertEther = parseUnits(buyToken.toString(), "ether");
      // console.log({ valueConvertEther });

      const tx = await smartContract.buy({
        value: valueConvertEther,
      });
      smartContract.on("Transfer", (form, to, tokens) => {
        // console.log({ form, to, tokens, tx });
        const tokenFloat: number = parseFloat(formatEther(tokens));
        const balanceFloat: number = parseFloat(balance);
        const total = tokenFloat + balanceFloat;
        setBalance(total.toString());
        setBuyToken("");
      });
      console.log(tx.hash);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, mb: 1 }}>
        <AppBar position="static" className="bg-white">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: "black" }}
            >
              Web3
            </Typography>
            <Stack direction={"row"} gap={2}>
              {!isActivating && (
                <Stack direction={"column"}>
                  <Typography
                    noWrap
                    variant="subtitle1"
                    sx={{ color: "black", textAlign: "center", mt: 1 }}
                  >
                    {accounts}
                  </Typography>
                </Stack>
              )}

              {isActive ? (
                <Button
                  title="Disconnect"
                  type="button"
                  variant="contained"
                  sx={{
                    bgcolor: "orange",
                    color: "black",
                  }}
                  onClick={handleDisconnect}
                  className="bg-transparent border-1 border-black p-2 text-black"
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="contained"
                  title="Connect"
                  sx={{
                    bgcolor: "lime",
                  }}
                  onClick={handleConnect}
                  className="bg-transparent border-1 border-black text-black p-2"
                >
                  Connect
                </Button>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
      <Box className="w-5/6 mx-auto mt-5">
        {isActive == true ? (
          <Stack
            direction={"column"}
            gap={3}
            className="shadow-md p-2 rounded-md"
          >
            <Typography variant="h2">My wallet balance</Typography>
            <TextField
              id="Address"
              label="Address"
              variant="outlined"
              size="small"
              // value={contractAddress}
              defaultValue={myAccount}
              // onChange={(e) => {
              //   setBuyToken((prev) => ({ ...prev, address: e.target.value }));
              // }}
            />
            <TextField
              id="KEMI TOKEN"
              label="KEMI TOKEN"
              variant="outlined"
              size="small"
              // defaultValue={balance}
              value={balance}

              // value={balance}
            />
            <Typography variant="h5">Buy KEMI Token</Typography>
            <TextField
              id="token"
              label="token"
              variant="outlined"
              size="small"
              type="number"
              // defaultValue={balance}
              // value={balance}
              onChange={(e) => {
                console.log(parseInt(e.target.value));

                setBuyToken(e.target.value);
              }}
            />
            {isLoading == false ? (
              <Button
                style={{
                  backgroundColor: "lime",
                }}
                onClick={() => {
                  handleBuyToken();
                }}
              >
                ตกลง
              </Button>
            ) : (
              <p>loading............</p>
            )}
          </Stack>
        ) : (
          <Typography variant="h2" textAlign={"center"}>
            Not connect
          </Typography>
        )}
      </Box>
    </>
  );
}
