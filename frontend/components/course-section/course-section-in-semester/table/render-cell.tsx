import { Chip } from "@nextui-org/react";
import React from "react";
import { Button } from "@nextui-org/react";
import { convertSemesterStatus } from "@/heplers/convert-semester-status";
import { ICourseSection } from "@/interfaces/CourseSection";
import Link from "next/link";
import {
  CourseSectionStatusEnum,
  CourseSectionStatusNames,
} from "../../course-section-with-student-and-score/enum/course-section-status-enum";

interface Props {
  courseSection: ICourseSection;
  columnKey: string | React.Key;
  user: any
}

export const RenderCell = ({ courseSection, columnKey, user }: Props) => {
  // @ts-ignore
  const cellValue = courseSection[columnKey];
  switch (columnKey) {
    case "course_id":
      return courseSection.course.course_id;

    case "course_credits":
      return courseSection.course.course_credits;

      case "teacher_name":
        return courseSection.teacher.teacher_name;

    case "course_section_status":
      return courseSection.course_section_status ===
        CourseSectionStatusEnum.IN_PROGRESS ? (
        <Chip className="capitalize" color="warning" size="sm" variant="flat">
          {CourseSectionStatusNames[courseSection.course_section_status]}
        </Chip>
      ) : courseSection.course_section_status ===
        CourseSectionStatusEnum.COMPLETED ? (
        <Chip className="capitalize" color="success" size="sm" variant="flat">
          {CourseSectionStatusNames[courseSection.course_section_status]}
        </Chip>
      ) : (
        <Chip className="capitalize" color="danger" size="sm" variant="flat">
          {CourseSectionStatusNames[courseSection.course_section_status]}
        </Chip>
      );

    case "actions":
      return (
        <Button
          as={Link}
          color="primary"
          href={`/${user?.role}/course-section/students/section/${courseSection.course_section_id}`}
        >
          Xem lớp học phần
        </Button>
      );
    default:
      return cellValue;
  }
};
