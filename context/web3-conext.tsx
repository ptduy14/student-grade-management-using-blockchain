"use client";
import { ethers } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";
import { privateChainConfig } from "@/config/private-chain";
import { toast } from "react-toastify";

const Web3Context = createContext<Web3ProviderType | undefined>(undefined);

interface Web3ProviderType {
  connectWallet: () => void;
  isConnected: boolean;
  isCheckingConnected: boolean;
}

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isCheckingConnected, setIsCheckingConnected] = useState<boolean>(false);
  const [web3Provider, setWeb3Provider] = useState<ethers.providers.Web3Provider | null>(null);

  const connectWallet = async () => {
    if (web3Provider) {
      try {
        // thêm mạng local private chain nếu chưa có
        await web3Provider.send("wallet_addEthereumChain", [privateChainConfig]);

        // Yêu cầu người dùng kết nối tài khoản MetaMask
        await web3Provider.send("eth_requestAccounts", []);
        setIsConnected(true);
        toast.success("Kết nối thành công");
      } catch (error) {
        toast.error("Kết nối thất bại");
      }
    } else {
      toast.error("Không tìm thấy ví Meta Mask");
    }
  };

  const checkIsConnectedToWallet = async () => {
    setIsCheckingConnected(true);
    if (web3Provider) {
      const accounts = await web3Provider.listAccounts();
      if (accounts.length > 0) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    }
    setIsCheckingConnected(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setWeb3Provider(provider);
    }
  }, [])

  useEffect(() => {
    checkIsConnectedToWallet();
  }, [web3Provider]);

  const web3ProviderValue: Web3ProviderType = {
    connectWallet,
    isConnected,
    isCheckingConnected,
  };

  return (
    <Web3Context.Provider value={web3ProviderValue}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);

  if (!context) {
    throw new Error("useWeb3 must be used within an Web3Provider");
  }
  return context;
};
