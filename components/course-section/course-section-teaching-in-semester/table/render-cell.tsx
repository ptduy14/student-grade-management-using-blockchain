import { Chip } from "@nextui-org/react";
import React from "react";
import { Button } from "@nextui-org/react";
import { convertSemesterStatus } from "@/heplers/convert-semester-status";
import { ICourseSection } from "@/interfaces/CourseSection";
import Link from "next/link";

interface Props {
  courseSection: ICourseSection;
  columnKey: string | React.Key;
}

export const RenderCell = ({ courseSection, columnKey }: Props) => {
  // @ts-ignore
  const cellValue = courseSection[columnKey];
  switch (columnKey) {
    case "course_id":
      return courseSection.course.course_id;

    case "course_name":
      return courseSection.course.course_name;

    case "course_credits":
      return courseSection.course.course_credits;

    case "actions":
      return (
        <Button as={Link} color="primary" href={`/teacher/course-section/students/section/${courseSection.course_section_id}`}>
          Xem lớp học phần
        </Button>
      );
    default:
      return cellValue;
  }
};
