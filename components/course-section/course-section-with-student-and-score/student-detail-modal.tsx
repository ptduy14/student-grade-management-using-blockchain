import { IStudent } from "@/interfaces/Student";
import { studentService } from "@/services/student-service";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function StudentDetailModal({
  studentId,
}: {
  studentId: number;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [student, setStudent] = useState<IStudent | null>(null);

  const getStudent = async () => {
    try {
      const res = await studentService.getStudentById(studentId);
      setStudent(res.data);
    } catch (error) {
      console.error("Failed to fetch student details:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getStudent();
    }
  }, [isOpen]);

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Chi tiết sinh viên
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chi tiết sinh viên
              </ModalHeader>
              <ModalBody>
                {isFetching ? (
                  <p>Loading...</p>
                ) : student ? (
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="w-36 font-bold">Mã sinh viên:</span>
                      <span>{student.student_code}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="w-36 font-bold">Họ và tên:</span>
                      <span>{student.student_name}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="w-36 font-bold">Email:</span>
                      <span>{student.student_email}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="w-36 font-bold">Số điện thoại:</span>
                      <span>{student.student_phone}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="w-36 font-bold">Lớp:</span>
                      <span>
                        {student.class.class_name} ({student.class.class_code})
                      </span>
                    </div>
                  </div>
                ) : (
                  <p>Không tìm thấy thông tin sinh viên.</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
