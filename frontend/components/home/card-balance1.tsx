import { Card, CardBody } from "@nextui-org/react";
import React from "react";
import { ICourseSection } from "@/interfaces/CourseSection";

export const CardBalance1 = ({
  courseSections,
}: {
  courseSections: ICourseSection[];
}) => {
  return (
    <Card className="xl:max-w-xs bg-primary rounded-xl shadow-md px-3 w-full h-40">
      <CardBody className="py-5 overflow-hidden flex items-center justify-center">
        <span className="text-4xl font-bold text-center">
          {courseSections.length}
        </span>
      </CardBody>
    </Card>
  );
};
