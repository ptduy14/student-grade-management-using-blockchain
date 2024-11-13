import { TransactionTypeEnum, TransactionTypeNames } from "@/components/course-section/course-section-with-student-and-score/enum/transaction-type-enum";
import { ITransactionHistory } from "@/interfaces/TransactionHistory";
import { transactionHistoryService } from "@/services/transaction-history-service";
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

export default function TransactionHistory({ scoreId }: { scoreId: number }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [transactionHistories, setTransactionHistories] = useState<
    ITransactionHistory[]
  >([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const getTransactionHistories = async () => {
    try {
      const res =
        await transactionHistoryService.getTransactionHistoriesByScoreId(
          scoreId
        );
      setTransactionHistories(res.data);
    } catch (error) {
      console.error("Error fetching transaction histories:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getTransactionHistories();
    }
  }, [isOpen]);

  return (
    <>
      <Button color="primary" size="sm" onPress={onOpen}>
        Xem lịch sử
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Lịch sử giao dịch
              </ModalHeader>
              <ModalBody>
                {isFetching || transactionHistories.length === 0 ? (
                  <p>Không có lịch sử giao dịch.</p>
                ) : (
                  <ul className="list-disc list-inside space-y-2">
                    {transactionHistories.map((history) => (
                      <li key={history.id}>
                        <p>
                          <strong>Hash:</strong> {history.transaction_hash}
                        </p>
                        <p>
                          <strong>Loại giao dịch:</strong>{" "}
                          {TransactionTypeNames[history.transaction_type]}
                        </p>
                        <p>
                          <strong>Block Number:</strong> {history.block_number}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
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
