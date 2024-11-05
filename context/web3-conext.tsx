"use client";
import { ethers, Signer } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";
import { privateChainConfig } from "@/config/private-chain";
import { toast } from "react-toastify";
import { AuthService } from "@/services/auth-service";
import { isAxiosError } from "axios";

const Web3Context = createContext<Web3ProviderType | undefined>(undefined);

interface Web3ProviderType {
  web3Provider: ethers.providers.Web3Provider | null,
  connectWallet: () => void;
  isConnected: boolean;
  isCheckingConnected: boolean;
  getSigner: () => Promise<Signer | null>;
}

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isCheckingConnected, setIsCheckingConnected] =
    useState<boolean>(false);
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider | null>(null);

  const connectWallet = async () => {
    if (web3Provider) {
      try {
        // thêm mạng local private chain nếu chưa có
        await web3Provider.send("wallet_addEthereumChain", [
          privateChainConfig,
        ]);

        // Yêu cầu người dùng kết nối tài khoản MetaMask
        const accounts = await web3Provider.send("eth_requestAccounts", []);

        // kiểm tra wallet ở database
        const res = await AuthService.checkWalletAddress();

        if (!res.data.isExisted) {
          await AuthService.addWalletAddress(accounts[0]);
        }

        setIsConnected(true);
        toast.success("Kết nối thành công");
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message);
          return;
        }

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

  const getSigner = async () => {
    if (!isConnected || !web3Provider) {
      toast.error("Chưa kết nối ví MetaMask");
      return null;
    }

    const accounts = await web3Provider.listAccounts();
    const signerAddress = accounts[0];

    const res = await AuthService.checkWalletAddress();
    if (res.data.isExisted && res.data.walletAddress === signerAddress.toLowerCase()) {
      return web3Provider.getSigner(signerAddress);
    }

    toast.error("Địa chỉ không khớp hoặc chưa được đăng ký trong hệ thống.");
    return null;
  };

  

  useEffect(() => {
    if (!window.ethereum) {
      // Nothing to do here... no ethereum provider found
      return;
    }

    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setWeb3Provider(provider);
    }
  }, []);

  useEffect(() => {
    checkIsConnectedToWallet();
  }, [web3Provider]);

  const web3ProviderValue: Web3ProviderType = {
    web3Provider,
    connectWallet,
    isConnected,
    isCheckingConnected,
    getSigner,
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
