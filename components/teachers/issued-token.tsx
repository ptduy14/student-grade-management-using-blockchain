import { ITeacher } from "@/interfaces/Teacher";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { useWeb3 } from "@/context/web3-conext";
import { ethers } from "ethers";
import { EducationTokenABI } from "@/blockchain/abi/education-token-abi";
import { toast } from "react-toastify";
import { LoaderBtn } from "../loaders/loader-btn";

export default function IssuedToken({ teacher }: { teacher: ITeacher }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [amountInput, setAmountInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { web3Provider, getSigner } = useWeb3();
  const [isHandleIssueToken, setIsHandleIssuedToken] = useState<boolean>(false);

  const handleIssuedToken = async () => {
    if (amountInput == "") {
      setError("Số token không được trống");
    }

    // Thay dấu phẩy thành dấu chấm nếu có
    const formattedAmountInput = amountInput.replace(",", ".");
    const amountInputNumber = parseFloat(formattedAmountInput);

    // Kiểm tra xem số nhập vào có hợp lệ không (phải là một số dương)
    if (isNaN(amountInputNumber) || amountInputNumber <= 0) {
      setError("Số token không hợp lệ");
      return;
    } else {
      setError("");
    }

    // Chuyển đổi số lượng token sang dạng hợp lệ cho smart contract (sử dụng BigNumber để tránh overflow)
    const amountInWei = ethers.utils.parseUnits(amountInput, 18);

    try {
      if (!web3Provider) return;

      setIsHandleIssuedToken(true);
      const signer = await getSigner();
      const EducationTokenContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_EDU_SMART_CONTRACT_ADDRESS!,
        EducationTokenABI,
        signer!
      );

      const tx = await EducationTokenContract.mint(
        teacher.teacher_wallet_address,
        amountInWei
      );

      toast.info("Giao dịch đang được xử lí");
      onClose();

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setAmountInput("");
        console.log("Mint token thành công!");
      } else {
        console.log("Giao dịch thất bại!");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Có lỗi xảy ra trong quá trình giao dịch!");
    } finally {
      setIsHandleIssuedToken(false);
    }
  };

  const handleCloseModalIssuedToken = () => {
    setAmountInput("");
    setError("");
    onClose();
  };

  return (
    <>
      <Button color="primary" size="sm" onPress={onOpen}>
        Cấp token
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cấp token cho giảng viên {teacher.teacher_name}
              </ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  label="Số lượng token"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  isInvalid={error !== ""}
                  errorMessage={error}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleCloseModalIssuedToken}
                >
                  Đóng
                </Button>
                <Button
                  color="primary"
                  onPress={handleIssuedToken}
                  isDisabled={isHandleIssueToken}
                >
                  {isHandleIssueToken ? <LoaderBtn /> : "Cấp token"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
