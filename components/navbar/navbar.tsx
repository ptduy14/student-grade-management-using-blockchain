import { Input, Navbar, NavbarContent } from "@nextui-org/react";
import React from "react";
import { SearchIcon } from "../icons/searchicon";
import { BurguerButton } from "./burguer-button";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserDropdown } from "./user-dropdown";
import { Button } from "@nextui-org/react";
import { ethers } from "ethers";
import { privateChainConfig } from "@/config/private-chain";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  const connectToMetaMask = async () => {
    // Kiểm tra xem MetaMask có được cài đặt không
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      try {
        // Thêm mạng nếu chưa có
        await provider.send("wallet_addEthereumChain", [privateChainConfig]);

        // Yêu cầu người dùng kết nối tài khoản MetaMask
        const accounts = await provider.send("eth_requestAccounts", []);

        // Lấy signer
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log("Connected address:", address);

        // Lưu thông tin vào localStorage
        localStorage.setItem("connectedAccount", accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Navbar
        isBordered
        className="w-full"
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent className="md:hidden">
          <BurguerButton />
        </NavbarContent>
        <NavbarContent className="w-full max-md:hidden">
          <Input
            startContent={<SearchIcon />}
            isClearable
            className="w-full"
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search..."
          />
        </NavbarContent>
        <NavbarContent
          justify="end"
          className="w-fit data-[justify=end]:flex-grow-0"
        >
          <NotificationsDropdown />

          <Button color="primary" onClick={connectToMetaMask}>
            Kết nối ví Meta Mask
          </Button>
          <NavbarContent>
            <UserDropdown />
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
