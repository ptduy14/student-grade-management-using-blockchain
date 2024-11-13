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

export default function CompleteSemesterModal({semesterId, isSemesterCompleted, setIsSemesterCompleted}: {semesterId: string,isSemesterCompleted: boolean, setIsSemesterCompleted: React.Dispatch<SetStateAction<boolean>>}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [isHandling, setIsHandling] = useState<boolean>();

    const handleCompleteSemester = async () => {
        try {
            setIsHandling(true);
            await semesterService.completeSemester(semesterId);
            toast.success("Đã xác nhận hoàn tất học kỳ");
            setIsSemesterCompleted(true);
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
            }
        } finally {
            onClose();
            setIsHandling(false);
        }
    }

  return (
    <>
      <Button color="primary" startContent={<FlagIcon />} onPress={onOpen} isDisabled={isSemesterCompleted}>
        Xác nhận hoàn tất học kỳ
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <p>
                  Bạn có chắc chắn muốn hoàn tất học kỳ này không? Hành động này
                  sẽ <span className="font-bold">khóa mọi chỉnh sửa và không thể thay đổi</span>. Vui lòng đảm bảo
                  rằng tất cả học phần đã được hoàn tất.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button isDisabled={isHandling} color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button isDisabled={isHandling} color="primary" onClick={handleCompleteSemester}>
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
