import { LoaderBtn } from "@/components/loaders/loader-btn";
import { courseSectionService } from "@/services/course-section-service";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { isAxiosError } from "axios";
import React, { SetStateAction, useState } from "react";
import { toast } from "react-toastify";

export default function ReopenCourseSection({
  courseSectionId,
  setIsReopenCompleted,
}: {
  courseSectionId: string;
  setIsReopenCompleted: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isHandling, setIsHandling] = useState<boolean>(false);

  const handleReopenCourseSection = async () => {
    try {
      setIsHandling(true);
      await courseSectionService.reopenCourseSection(courseSectionId);
      setIsReopenCompleted(true);
      toast.success("Mở khóa lớp học phần thành công");
      onClose();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.info(error.response?.data.message);
      }
    } finally {
      setIsHandling(false);
    }
  };

  return (
    <>
      <Button color="warning" onPress={onOpen}>
        Mở khóa lớp học phần
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Xác nhận thay đổi trạng thái
              </ModalHeader>
              <ModalBody>
                <p>
                  Bạn có chắc chắn muốn mở lại lớp học phần để chỉnh sửa điểm?
                  Điều này sẽ cho phép giảng viên{" "}
                  <span className="font-bold">cập nhật điểm</span> của sinh
                  viên.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isHandling}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={handleReopenCourseSection}
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
