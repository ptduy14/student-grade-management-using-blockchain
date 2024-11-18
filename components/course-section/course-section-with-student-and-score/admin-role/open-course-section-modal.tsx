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

export default function OpenCourseSectionModal({
  courseSectionId,
  setRefreshKey,
}: {
  courseSectionId: string;
  setRefreshKey: React.Dispatch<SetStateAction<number>>
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isHandling, setIsHandling] = useState<boolean>(false);

  const handleOpenCourseSection = async () => {
    try {
      setIsHandling(true);
      await courseSectionService.openCourseSection(courseSectionId);
      setRefreshKey((prev) => prev + 1);
      toast.success("Bắt đầu học phần thành công");
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
      <Button color="success" onPress={onOpen}>
        Bắt đầu Học Phần
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Xác nhận thay đổi trạng thái
              </ModalHeader>
              <ModalBody>
                <p>Bạn có chắc chắn muốn bắt đầu học phần này không?</p>
                <p>
                  Trạng thái sẽ được chuyển sang "Đang dạy (In Progress)" và
                  không thể quay lại trạng thái trước.
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
                  onClick={handleOpenCourseSection}
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
