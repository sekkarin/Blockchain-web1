"use client";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";
import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { ethers } from "ethers";
import { formatEther, parseEther } from "@ethersproject/units";
import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

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

  // const[balance,]
  const [error, setError] = useState(undefined);

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect eagerly to metamask");
    });
  }, []);

  const handleConnect = () => {
    metaMask.activate(contractChain);
  };

  const handleDisconnect = () => {
    metaMask.resetState();
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
      <div>
        <p>chainId: {chainId}</p>
        <p>isActive: {isActive.toString()}</p>
        <p>accounts: {accounts ? accounts : ""}</p>
      </div>
    </>
  );
}
