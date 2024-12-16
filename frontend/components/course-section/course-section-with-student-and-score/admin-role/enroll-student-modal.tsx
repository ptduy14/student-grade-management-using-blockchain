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
import { IStudent } from "@/interfaces/Student";
import { studentService } from "@/services/student-service";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { studentEnrollmentService } from "@/services/student-enrollment-service";

export default function EnrollStudentModal({
  courseSectionId,
  setRefreshKey
}: {
  courseSectionId: string;
  setRefreshKey: React.Dispatch<SetStateAction<number>>
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isHandling, setIsHandling] = useState<boolean>(false);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");

  const handleEnrollmentStudent = async () => {
    if (selectedStudent === "") {
      toast.error("Vui lòng chọn sinh viên");
      return;
    }

    const payload = {
      student_id: Number(selectedStudent),
      course_section_id: Number(courseSectionId),
    };

    try {
      setIsHandling(true);
      const res = await studentEnrollmentService.enrollmentStudent(payload);
      setRefreshKey((prev) => prev + 1);
      toast.success("Ghi danh sinh viên thành công");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.info(error.response?.data.message);
      }
    } finally {
      handleCloseModal();
      setIsHandling(false);
    }
  };

  const getAllStudents = async () => {
    const res = await studentService.getAllStudents();
    setStudents(res.data);
  };

  useEffect(() => {
    if (isOpen) {
      getAllStudents();
    }
  }, [isOpen]);

  const handleCloseModal = () => {
    setSelectedStudent("");
    onClose();
  };

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Ghi danh sinh viên
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ghi danh sinh viên
              </ModalHeader>
              <ModalBody>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Chọn Sinh Viên:
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="" disabled>
                      Chọn sinh viên
                    </option>
                    {students.map((student) => (
                      <option
                        key={student.student_id}
                        value={student.student_id}
                      >
                        {student.student_name}
                      </option>
                    ))}
                  </select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleCloseModal}
                  isDisabled={isHandling}
                >
                  Đóng
                </Button>
                <Button
                  color="primary"
                  onClick={handleEnrollmentStudent}
                  isDisabled={isHandling}
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
