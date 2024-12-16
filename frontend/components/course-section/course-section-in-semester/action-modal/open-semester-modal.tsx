import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { FlagIcon } from "@/components/icons/flag-icon";
import { SetStateAction, useState } from "react";
import { semesterService } from "@/services/semester-service";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { LoaderBtn } from "@/components/loaders/loader-btn";

export default function OpenSemesterModal({
  semesterId,
  setIsCompletedOpenSemester,
}: {
  semesterId: string;
  setIsCompletedOpenSemester: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isHandling, setIsHandling] = useState<boolean>();

  const handleOPenSemester = async () => {
    try {
      setIsHandling(true);
      await semesterService.openSemester(semesterId);
      setIsCompletedOpenSemester(true);
      toast.success("Đã xác nhận mở học kỳ");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    } finally {
      onClose();
      setIsHandling(false);
    }
  };

  return (
    <>
      <Button color="success" onPress={onOpen} className="text-white">
        Xác nhận mở học kỳ
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Xác nhận mở học kỳ
              </ModalHeader>
              <ModalBody>
                <ModalBody>
                  <p>
                    Bạn có chắc chắn muốn mở học kỳ này không? Hành động này sẽ{" "}
                    <span className="font-bold">
                      cho phép các học phần được sinh viên đăng ký và không thể hoàn
                      tác
                    </span>
                    . Vui lòng đảm bảo rằng tất cả các chuẩn bị cần thiết đã
                    được hoàn tất.
                  </p>
                  {isHandling && (
                    <p className="font-bold">
                      Thao tác này có thể mất một chút thời gian để hệ thống xử
                      lý, vui lòng chờ...
                    </p>
                  )}
                </ModalBody>
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={isHandling}
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Đóng
                </Button>
                <Button
                  isDisabled={isHandling}
                  color="primary"
                  onClick={handleOPenSemester}
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
