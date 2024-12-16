import { User, Tooltip, Chip, Button } from "@nextui-org/react";
import React from "react";
import { IClass } from "@/interfaces/Class";
import Link from "next/link";

interface Props {
  clss: IClass;
  columnKey: string | React.Key;
}

export const RenderCell = ({ clss, columnKey }: Props) => {
  // @ts-ignore
  const cellValue = clss[columnKey];
  switch (columnKey) {
    case "actions":
      return (
        <div className="flex items-center gap-4 ">
         <Button href="" as={Link} title="Chi tiết" color="primary">Chi tiết</Button>
        </div>
      );
    default:
      return cellValue;
  }
};
