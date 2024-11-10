import React, { useEffect, useState } from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { acdemicYearService } from "@/services/academic-year-service";
import { IAcademicYear } from "@/interfaces/AcademicYear";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  const user = useSelector((state: any) => state.account.user);

  const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);

  const getAllAcademicYear = async () => {
    const res = await acdemicYearService.getAllAcademicYear();
    setAcademicYears(res.data);
  };

  useEffect(() => {
    if (user?.role === "teacher") {
      getAllAcademicYear();
    }
  }, []);

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Logo_ctuet.png"
            className="w-20 mx-auto"
          />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Trang chủ"
              icon={<HomeIcon />}
              isActive={pathname === `/${user?.role}`}
              href={`/${user?.role}`}
            />
            <SidebarMenu title="Main Menu">
              {user?.role === "teacher" && (
                <CollapseItems
                  icon={<BalanceIcon />}
                  items={academicYears}
                  title="Năm học"
                />
              )}
              {user?.role === "admin" && (
                <SidebarItem
                  isActive={pathname === "/admin/teachers"}
                  title="Quản lí giảng viên"
                  icon={<CustomersIcon />}
                  href={`/${user?.role}/teachers`}
                />
              )}
              {user?.role === "student" && (
                <SidebarItem
                  isActive={pathname === "/students/results"}
                  title="Kết quả học tập"
                  icon={<ReportsIcon />}
                  href={`/${user?.role}/results`}
                />
              )}
            </SidebarMenu>

            <SidebarMenu title="General">
              <SidebarItem
                isActive={pathname === "/developers"}
                title="Developers"
                icon={<DevIcon />}
              />
              <SidebarItem
                isActive={pathname === "/view"}
                title="View Test Data"
                icon={<ViewIcon />}
              />
              <SidebarItem
                isActive={pathname === "/settings"}
                title="Settings"
                icon={<SettingsIcon />}
              />
            </SidebarMenu>

            <SidebarMenu title="Updates">
              <SidebarItem
                isActive={pathname === "/changelog"}
                title="Changelog"
                icon={<ChangeLogIcon />}
              />
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
};
