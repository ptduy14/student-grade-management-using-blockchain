import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { SetStateAction } from "react";
import { columns } from "./data";
import { RenderCell } from "./render-cell";
import { ICourseSection } from "@/interfaces/CourseSection";
import { CourseSectionStudent, CourseSectionStudentDetail } from "@/interfaces/CourseSectionStudent";

export const TableWrapper = ({students, setCourseSections, isScoreEditable}: {students: CourseSectionStudentDetail[], setCourseSections: React.Dispatch<SetStateAction<CourseSectionStudent | null>>, isScoreEditable: boolean}) => {
  return (
    <div className=" w-full flex flex-col gap-4">
      <Table isStriped aria-label="Example table with custom cells">
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
        <TableBody items={students} emptyContent={students.length == 0 && "Không có sinh viên"}>
          {(item: CourseSectionStudentDetail) => (
            <TableRow key={item.student_student_id}>
              {(columnKey) => (
                <TableCell>
                  {RenderCell({ courseSectionStudent: item, columnKey: columnKey, setCourseSections, isScoreEditable })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
