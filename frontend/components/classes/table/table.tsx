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
import { IClass } from "@/interfaces/Class";

export const TableWrapper = ({classes}: {classes: IClass[]}) => {
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
        <TableBody items={classes}>
          {(item: IClass) => (
            <TableRow key={item.class_id}>
              {(columnKey) => (
                <TableCell>
                  {RenderCell({ clss: item, columnKey: columnKey })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
