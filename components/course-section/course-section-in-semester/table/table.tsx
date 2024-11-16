import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";
import { columns } from "./data";
import { RenderCell } from "./render-cell";
import { ICourseSection } from "@/interfaces/CourseSection";
import { useSelector } from "react-redux";

export const TableWrapper = ({courseSections}: {courseSections: ICourseSection[]}) => {
  const user = useSelector((state: any) => state.account.user);
  return (
    <div className=" w-full flex flex-col gap-4">
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={courseSections} emptyContent={courseSections.length == 0 && "Không có lớp học phần"}>
          {(item: ICourseSection) => (
            <TableRow key={item.course_section_id}>
              {(columnKey) => (
                <TableCell className={columnKey === "course_section_status" ? "min-w-32" : ""}>
                  {RenderCell({ courseSection: item, columnKey: columnKey, user })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
