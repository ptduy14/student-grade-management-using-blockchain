import { useDisclosure } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useState, SetStateAction, useEffect } from "react";
import {
  CourseSectionStudent,
  CourseSectionStudentDetail,
} from "@/interfaces/CourseSectionStudent";
import { ScoreTypeEnum, ScoreTypeNames } from "./enum/score-type-enum";
import { UpdateIcon } from "@/components/icons/table/update-icon";
import { ScoreService } from "@/services/score-service";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useWeb3 } from "@/context/web3-conext";
import { ethers, Signer } from "ethers";
import { SemesterManagementABI } from "@/blockchain/abi/semester-management-abi";
import { LoaderBtn } from "@/components/loaders/loader-btn";
import { TransactionTypeEnum } from "./enum/transaction-type-enum";
import { BlockchainService } from "@/services/blockchain-service";
import { PreviousDataScore } from "@/interfaces/PreviousDataScore";

export const UpdateScoreModal = ({
  courseSectionStudent,
  scoreType,
  setCourseSections,
}: {
  courseSectionStudent: CourseSectionStudentDetail;
  scoreType: keyof CourseSectionStudentDetail;
  setCourseSections: React.Dispatch<
    SetStateAction<CourseSectionStudent | null>
  >;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [scoreInput, setScoreInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isHandling, setIsHandling] = useState<boolean>(false);
  const { isConnected, getSigner, web3Provider, getBalance } = useWeb3();

  const handleUpdateScore = async () => {
    setIsHandling(true);

    const signer = await getSigner();
    if (signer === null || web3Provider === null) {
      setIsHandling(false);
      return;
    }

    // Kiểm tra xem điểm có trống không
    if (!scoreInput) {
      setError("Điểm không được để trống.");
      setIsHandling(false);
      return;
    }

    const score = parseFloat(scoreInput);

    // Kiểm tra xem điểm có nằm trong khoảng từ 0 đến 10 không
    if (isNaN(score) || score < 0 || score > 10) {
      setError("Điểm phải từ 0 đến 10.");
      setIsHandling(false);
      return;
    }

    // Reset error nếu tất cả các điều kiện đều hợp lệ
    setError("");

    // kiểm tra số dư tài khoản
    const etherBalance = await getBalance();
    if (parseFloat(etherBalance || "0") == 0) {
      toast.error("Không đủ số dư giao dịch");
      setIsHandling(false);
      return;
    }

    // gọi hàm để update điểm trong blockchain
    await handleUpdateScoreToBlockchain(score, signer);
  };

  const handleUpdateScoreToBlockchain = async (
    score: number,
    signer: Signer
  ) => {
    try {
      const SemesterManagementContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_SEMESTER_MANAGEMENT_ADDRESS!,
        SemesterManagementABI,
        signer!
      );

      const scoreUpdateToBlockchain = score * 100;
      const scoreTypeUpdateToBlockchain =
        scoreType === ScoreTypeEnum.MIDTERM ? 0 : 1;

      const tx = await SemesterManagementContract.addOrUpdateCourseSection(
        courseSectionStudent.semester_semester_id,
        courseSectionStudent.student_student_id,
        courseSectionStudent.student_enrollment_course_section_id,
        scoreUpdateToBlockchain,
        scoreTypeUpdateToBlockchain
      );

      toast.success("Cập nhật điểm thành công, giao dịch đang được xử lí");

      const transactionHash = tx.hash;

      const previousDataScore: PreviousDataScore = {
        transaction_hash: transactionHash,
        course_section_id: courseSectionStudent.student_enrollment_course_section_id,
        enrollment_pass_status: courseSectionStudent.student_enrollment_pass_status,
        student_id: courseSectionStudent.student_student_id,
        semester_id: courseSectionStudent.semester_semester_id,
        score_id: courseSectionStudent.score_score_id,
        midterm_score: courseSectionStudent.score_midterm_score,
        final_score: courseSectionStudent.score_final_score,
        total_score: courseSectionStudent.score_final_score,
        transaction_type: TransactionTypeEnum.UPDATE
      }

      // gọi hàm để cập nhật điểm trên DB
      await handleUpdateScoreToDB(score);

      // chuyển lắng nghe sự kiện mint transaction lên server
      await BlockchainService.listenTransaction(previousDataScore);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateScoreToDB = async (score: any) => {
    const scoreSubmission: ScoreSubmission = {
      student_id: courseSectionStudent.student_student_id,
      semester_id: courseSectionStudent.semester_semester_id,
      course_section_id:
        courseSectionStudent.student_enrollment_course_section_id,
      score: score,
      score_type: scoreType == ScoreTypeEnum.MIDTERM ? "midterm" : "final",
    };
    console.log(scoreSubmission);

    try {
      setIsHandling(true);
      const res = await ScoreService.update(scoreSubmission);
      const data = res.data;

      // Đảm bảo các điểm có định dạng thập phân "x.00"
      data.score.midterm_score =
        data.score.midterm_score !== null
          ? parseFloat(data.score.midterm_score).toFixed(2)
          : null;

      data.score.final_score =
        data.score.final_score !== null
          ? parseFloat(data.score.final_score).toFixed(2)
          : null;

      data.score.total_score =
        data.score.total_score !== null
          ? parseFloat(data.score.total_score).toFixed(2)
          : null;

      setCourseSections((prev) => {
        if (prev === null) return null;

        const updatedStudents = prev.students.map(
          (item: CourseSectionStudentDetail) => {
            if (item.student_student_id === data.student_id) {
              return {
                ...item,
                student_enrollment_pass_status: data.pass_status,
                score_midterm_score: data.score.midterm_score,
                score_final_score: data.score.final_score,
                score_total_score: data.score.total_score,
              };
            }

            return item;
          }
        );

        return {
          ...prev,
          students: updatedStudents,
        };
      });

      onClose();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setIsHandling(false);
    }
  };

  const handleClose = () => {
    setIsHandling(false);
    onClose();
    setError("");
  };

  useEffect(() => {
    if (!isOpen) {
      handleClose();
    }
  }, [isOpen])

  return (
    <>
      <div className="flex flex-wrap gap-4 items-center">
        <span>{courseSectionStudent[scoreType]}</span>{" "}
        <Button
          size="sm"
          color="primary"
          onPress={onOpen}
          isDisabled={!isConnected}
        >
          <UpdateIcon size={20} />
          Sửa
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xs">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Sửa điểm{" "}
                {ScoreTypeNames[scoreType]}
              </ModalHeader>
              <ModalBody className="space-y-3">
                <h1>
                  Mã số sinh viên:{" "}
                  <span className="font-bold">
                    {courseSectionStudent.student_student_code}
                  </span>
                </h1>
                <h1>
                  Họ tên sinh viên:{" "}
                  <span className="font-bold">
                    {courseSectionStudent.student_student_name}
                  </span>
                </h1>
                <Input
                  disabled={isHandling}
                  type="text"
                  label="Điểm"
                  isRequired
                  onChange={(e: any) => setScoreInput(e.target.value)}
                  value={scoreInput}
                  isInvalid={error ? true : false}
                  errorMessage={error}
                  color={error ? "danger" : "default"} // Thay đổi màu sắc của input nếu có lỗi
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onClick={handleClose}
                  isDisabled={isHandling}
                >
                  Thoát
                </Button>
                <Button
                  color="primary"
                  onClick={handleUpdateScore}
                  disabled={isHandling}
                >
                  {isHandling ? <LoaderBtn/> : "Thêm"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
