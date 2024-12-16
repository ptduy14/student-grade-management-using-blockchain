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
import { CourseIcon } from "../icons/course-icon";
import { DocumentIcon } from "../icons/sidebar/document-icon";

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
    if (user?.role === "teacher" || user?.role === "admin") {
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
            src="https://cdn.haitrieu.com/wp-content/uploads/2022/12/Artboard-2.png"
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
                <>
                  <CollapseItems
                    icon={<BalanceIcon />}
                    items={academicYears}
                    title="Năm học"
                  />
                  <SidebarItem
                    isActive={
                      pathname ===
                      "/teacher/course-section/current-open-semester"
                    }
                    title="Lớp học phần"
                    icon={<CourseIcon />}
                    href={`/${user?.role}/course-section/current-open-semester`}
                  />
                  <SidebarItem
                    isActive={pathname === "/teacher/documents"}
                    title="Tài liệu"
                    icon={<DocumentIcon />}
                    href={`/${user?.role}/documents`}
                  />
                </>
              )}
              {user?.role === "admin" && (
                <>
                  <CollapseItems
                    icon={<BalanceIcon />}
                    items={academicYears}
                    title="Năm học"
                  />
                  <SidebarItem
                    isActive={pathname === "/admin/teachers"}
                    title="Giảng viên"
                    icon={<CustomersIcon />}
                    href={`/${user?.role}/teachers`}
                  />

                  <SidebarItem
                    isActive={pathname === "/admin/students"}
                    title="Sinh viên"
                    icon={<CustomersIcon />}
                    href={`/${user?.role}/students`}
                  />

                  <SidebarItem
                    isActive={pathname === "/admin/courses"}
                    title="Môn học"
                    icon={<CourseIcon />}
                    href={`/${user?.role}/courses`}
                  />
                  <SidebarItem
                    isActive={pathname === "admin/classes"}
                    title="Lớp học"
                    icon={<ViewIcon />}
                    href={`/${user?.role}/classes`}
                  />
                </>
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
                isActive={pathname === "/supports"}
                title="Hỗ trợ"
                icon={<ChangeLogIcon />}
              />
              <SidebarItem
                isActive={pathname === "/settings"}
                title="Cài đặt"
                icon={<SettingsIcon />}
              />
            </SidebarMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};
