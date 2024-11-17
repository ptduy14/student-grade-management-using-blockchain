import { IStudent } from "@/interfaces/Student";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

interface Props {
  student: IStudent;
  columnKey: string | React.Key;
}

export const RenderCell = ({ student, columnKey }: Props) => {
  // @ts-ignore
  const cellValue = student[columnKey];
  switch (columnKey) {
    case "class_name":
      return student.class.class_name;
    case "actions":
      return (
        <Button
          color="primary"
          size="sm"
          href={`/admin/students/${student.student_id}/results`}
          as={Link}
        >
          Kết quả học tập
        </Button>
      );
    default:
      return cellValue;
  }
};
