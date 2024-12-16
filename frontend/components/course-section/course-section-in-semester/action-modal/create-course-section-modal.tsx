import React, { SetStateAction, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { LoaderBtn } from "@/components/loaders/loader-btn";
import { ITeacher } from "@/interfaces/Teacher";
import { ICourse } from "@/interfaces/Course";
import { TeacherService } from "@/services/teacher-service";
import { CourseService } from "@/services/course-service";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { courseSectionService } from "@/services/course-section-service";
import { ICourseSection } from "@/interfaces/CourseSection";

export default function CreateCourseSectionModal({
  semesterId,
  setCourseSection
}: {
  semesterId: string;
  setCourseSection: React.Dispatch<SetStateAction<ICourseSection[]>>
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isHandling, setIsHandling] = useState<boolean>(false);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const getAllTeachers = async () => {
    const res = await TeacherService.getAllTeachers();
    const teacherList = res.data.filter(
      (teacher: ITeacher) => teacher.teacher_role !== "admin"
    );
    setTeachers(teacherList);
  };

  const getAllCourses = async () => {
    const res = await CourseService.getAllCourses();
    setCourses(res.data);
  };

  useEffect(() => {
    if (isOpen) {
      getAllTeachers();
      getAllCourses();
    }
  }, [isOpen]);

  const handleCreateCourseSection = async () => {
    if (selectedCourse === "") {
      toast.error("Vui lòng chọn môn học");
      return;
    }

    if (selectedTeacher === "") {
      toast.error("Vui lòng chọn giảng viên")
      return;
    }

    const payload = {
      semester_id: Number(semesterId),
      course_id: Number(selectedCourse),
      teacher_id: Number(selectedTeacher),
    };
    
    try {
      setIsHandling(true);
      const res = await courseSectionService.createCourseSection(payload);
      setCourseSection((prev: ICourseSection[]) => ([...prev, res.data]));
      toast.success("Tạo lớp học phần thành công"); 
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setIsHandling(false);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setSelectedTeacher("");
    setSelectedCourse("");
    onClose();
  }

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Tạo lớp học phần
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tạo lớp học phần
              </ModalHeader>
              <ModalBody>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Chọn Giảng Viên:
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                  >
                    <option value="" disabled>
                      Chọn giảng viên
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.teacher_id}
                        value={teacher.teacher_id}
                      >
                        {teacher.teacher_email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Chọn Môn Học:
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="" disabled>
                      Chọn môn học
                    </option>
                    {courses.map((course) => (
                      <option key={course.course_id} value={course.course_id}>
                        {course.course_name}
                      </option>
                    ))}
                  </select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={isHandling}
                  color="danger"
                  variant="light"
                  onPress={handleCloseModal}
                >
                  Đóng
                </Button>
                <Button
                  isDisabled={isHandling}
                  color="primary"
                  onClick={handleCreateCourseSection}
                >
                  {isHandling ? <LoaderBtn /> : "Xác nhận"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
