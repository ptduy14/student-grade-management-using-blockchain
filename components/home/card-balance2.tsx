import { Card, CardBody } from "@nextui-org/react";
import React from "react";
import { ICourseSection } from "@/interfaces/CourseSection";
import { CourseSectionStatusEnum } from "../course-section/course-section-with-student-and-score/enum/course-section-status-enum";

export const CardBalance2 = ({
  courseSections,
}: {
  courseSections: ICourseSection[];
}) => {
  const countCourseSectionInProgress = () => {
    const courseSectionsFilltered = courseSections.filter((courseSection: ICourseSection) => courseSection.course_section_status === CourseSectionStatusEnum.IN_PROGRESS)
    return courseSectionsFilltered.length;
  }
  return (
    <Card className="xl:max-w-xs bg-default-50 rounded-xl shadow-md px-3 w-full h-40">
      <CardBody className="py-5 flex items-center justify-center">
        <span className="text-4xl font-bold text-center">{courseSections.length === 0 ? "waiting..." : countCourseSectionInProgress()}</span>
      </CardBody>
    </Card>
  );
};
