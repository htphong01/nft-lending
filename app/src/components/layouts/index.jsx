import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { setAccount } from "@src/redux/features/accountSlice";
import { useDispatch } from "react-redux";
import { getBalance } from "@src/utils/ethers";
import Header from "./header";
import Footer from "./footer";

export default function UserLayout() {
  const dispatch = useDispatch();

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
    } else {
      const balance = await getBalance(accounts[0]);
      dispatch(
        setAccount({
          address: accounts[0],
          balance: balance,
        })
      );
    }
  };

  const requireSwitchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x15B3" }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x15B3",
                rpcUrl: "https://rpc-kura.cross.technology",
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleAccountsChanged)
        .catch((err) => {
          console.error(err);
        });

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      // requireSwitchNetwork();
    } else {
      alert(
        "MetaMask is not installed. Please consider installing it: https://metamask.io/download.html"
      );
    }
  }, []);

  return (
    <>
      <Header
        handleAccountsChanged={handleAccountsChanged}
        requireSwitchNetwork={requireSwitchNetwork}
      />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
