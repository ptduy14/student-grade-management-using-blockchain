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
import { ISemester } from "@/interfaces/Semester";
import { useSelector } from "react-redux";

export const TableWrapper = ({semesters}: {semesters: any}) => {
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
        <TableBody items={semesters}>
          {(item: ISemester) => (
            <TableRow key={item.semester_id}>
              {(columnKey) => (
                <TableCell>
                  {RenderCell({ semester: item, columnKey: columnKey, user })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
