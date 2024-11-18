import { useDisclosure } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { FlagIcon } from "@/components/icons/flag-icon";
import React, { SetStateAction, useState } from "react";
import { LoaderBtn } from "@/components/loaders/loader-btn";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { courseSectionService } from "@/services/course-section-service";

export const CompleteCourseSectionModal = ({
  courseSectionId,
  isScoreEditable,
  setIsScoreEditable,
}: {
  courseSectionId: string;
  isScoreEditable: boolean;
  setIsScoreEditable: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isHandleCompleteCourseSection, setIsHandleCompleteCourseSection] =
    useState<boolean>(false);

  const handleCompleteCourseSection = async () => {
    try {
      setIsHandleCompleteCourseSection(true);
      await courseSectionService.completeCourseSection(courseSectionId);
      setIsScoreEditable(false);
      onClose();
      toast.success("Xác nhận hoàn thành hoàn tất");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setIsHandleCompleteCourseSection(false);
    }
  };

  return (
    <>
      <Button
        color="primary"
        startContent={<FlagIcon />}
        onPress={onOpen}
        isDisabled={!isScoreEditable}
      >
        Xác nhận hoàn thàn
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Xác nhận hoàn thành lớp học phần
              </ModalHeader>
              <ModalBody>
                <p>Bạn có thật sự muốn xác nhận hoàn thành không?</p>
                <p>Thao tác này sẽ không thể hoàn tác</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button
                  color="primary"
                  onPress={handleCompleteCourseSection}
                  isDisabled={isHandleCompleteCourseSection}
                >
                  {isHandleCompleteCourseSection ? <LoaderBtn /> : "Xác nhận"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
