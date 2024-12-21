import { Input, Navbar, NavbarContent } from "@nextui-org/react";
import React from "react";
import { SearchIcon } from "../icons/searchicon";
import { BurguerButton } from "./burguer-button";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserDropdown } from "./user-dropdown";
import { Button } from "@nextui-org/react";
import { useWeb3 } from "@/context/web3-conext";
import { LoaderBtn } from "../loaders/loader-btn";
import { useSelector } from "react-redux";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  const user = useSelector((state: any) => state.account.user);
  const { isConnected, connectWallet, isCheckingConnected } = useWeb3();

  const connectToMetaMask = async () => {
    connectWallet();
  };

  const buttonContent = isCheckingConnected ? (
    <LoaderBtn />
  ) : isConnected ? (
    "Đã kết nối ví Meta Mask"
  ) : (
    "Kết nối ví Meta Mask"
  );

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

          {user?.role === "student" ? null : (
            <Button
              color="primary"
              onClick={connectToMetaMask}
              isDisabled={isConnected}
            >
              {buttonContent}
            </Button>
          )}
          <NavbarContent>
            <UserDropdown />
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
