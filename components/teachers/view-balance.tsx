import { useState } from "react";
import {
  useDisclosure,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { EyeIcon } from "../icons/table/eye-icon";
import { ITeacher } from "@/interfaces/Teacher";
import { useEffect } from "react";
import { ethers } from "ethers";
import { EducationTokenABI } from "@/blockchain/abi/education-token-abi";
import { useWeb3 } from "@/context/web3-conext";

export const ViewBalance = ({ teacher }: { teacher: ITeacher }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [balance, setBalance] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const { web3Provider, getSigner } = useWeb3();

  const getBalance = async () => {
    try {
      if (!web3Provider) return;

      const signer = await getSigner();
      const EducationTokenContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_EDU_SMART_CONTRACT_ADDRESS!,
        EducationTokenABI,
        signer!
      );

      const balance = await EducationTokenContract.balanceOf(teacher.teacher_wallet_address);
      // Định dạng số dư
      const decimals = await EducationTokenContract.decimals();
      const formattedBalance = ethers.utils.formatUnits(balance, decimals);
      setBalance(formattedBalance);
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(null);
    } finally {
      setIsFetching;
    }
  };

  useEffect(() => {
    if (isOpen) {
      getBalance();
    }
  }, [isOpen]);

  return (
    <>
      <Tooltip content="Xem số dư token">
        <button onClick={onOpen} disabled={teacher.teacher_wallet_address === null}>
          <EyeIcon size={20} fill="#979797" />
        </button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Số dư token
              </ModalHeader>
              <ModalBody>
                {isFetching ? "Waiting..." : <p>{`${balance} EDU`}</p>}
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
};
