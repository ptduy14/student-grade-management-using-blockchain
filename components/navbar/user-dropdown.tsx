import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
} from "@nextui-org/react";
import React from "react";
import { DarkModeSwitch } from "./darkmodeswitch";
import { useDispatch, useSelector } from "react-redux";
import { AuthService } from "@/services/auth-service";
import { jwtManage } from "@/helpers/jwt-manage";
import { removeUser } from "@/redux/slices/userSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const UserDropdown = () => {
  const user = useSelector((state: any) => state.account.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await AuthService.removeAuthCookie();
    jwtManage.remoteToken();
    dispatch(removeUser());

    toast.success("Đăng xuất thành công");
    router.push('/auth/signin')
  }

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        onAction={(actionKey) => console.log({ actionKey })}
      >
        <DropdownItem
          key="profile"
          className="flex flex-col justify-start w-full items-start"
        >
          <p>{user?.name}</p>
          <p className="opacity-70">{user?.email}</p>
        </DropdownItem>
        <DropdownItem key="settings">Thông tin cá nhân</DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          className="text-danger"
          onPress={() => handleLogout()}
        >
          Đăng xuất
        </DropdownItem>
        <DropdownItem key="switch">
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
