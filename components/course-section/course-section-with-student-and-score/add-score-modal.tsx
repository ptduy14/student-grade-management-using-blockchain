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
import { AddIcon } from "@/components/icons/table/add-icon";
import {
  CourseSectionStudent,
  CourseSectionStudentDetail,
} from "@/interfaces/CourseSectionStudent";
import { ScoreTypeEnum } from "./enum/score-type-enum";
import { SetStateAction, useState } from "react";
import { ScoreService } from "@/services/score-service";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useWeb3 } from "@/context/web3-conext";
import { ethers, Signer } from "ethers";
import { SemesterManagementABI } from "@/blockchain/abi/semester-management-abi";
import { LoaderBtn } from "@/components/loaders/loader-btn";
import { PreviousDataScore } from "@/interfaces/PreviousDataScore";
import { BlockchainService } from "@/services/blockchain-service";

export const AddScoreModal = ({
  courseSectionStudent,
  scoreType,
  setCourseSections,
}: {
  courseSectionStudent: CourseSectionStudentDetail;
  scoreType: string;
  setCourseSections: React.Dispatch<
    SetStateAction<CourseSectionStudent | null>
  >;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [scoreInput, setScoreInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isHandling, setIsHandling] = useState<boolean>(false);
  const { isConnected, getSigner, web3Provider, getBalance } = useWeb3();

  const handleAddScore = async () => {
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

    // thực hiện kiểm tra validate logic thêm điểm
    if (
      courseSectionStudent.score_midterm_score === null &&
      scoreType === ScoreTypeEnum.FINAL
    ) {
      toast.error("Không thể thêm điểm cuối kì");
      setIsHandling(false);
      return;
    }

    await handleStoreScoreToBlockchain(score, signer);
  };

  const handleStoreScoreToBlockchain = async (
    score: number,
    signer: Signer
  ) => {
    try {
      const SemesterManagementContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_SEMESTER_MANAGEMENT_ADDRESS!,
        SemesterManagementABI,
        signer!
      );

      const scoreAddToBlockchain = score * 100;
      const scoreTypeAddToBlockchain =
        scoreType === ScoreTypeEnum.MIDTERM ? 0 : 1;

      const tx = await SemesterManagementContract.addOrUpdateCourseSection(
        courseSectionStudent.semester_semester_id,
        courseSectionStudent.student_student_id,
        courseSectionStudent.student_enrollment_course_section_id,
        scoreAddToBlockchain,
        scoreTypeAddToBlockchain
      );

      toast.success("Thêm điểm thành công, giao dịch đang được xử lí");

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
        total_score: courseSectionStudent.score_final_score
      }

      // gọi hàm để store điểm vào DB
      await handleStoreScoreToDB(score);
      
      // chuyển lắng nghe sự kiện mint transaction lên server
      await BlockchainService.listenTransaction(previousDataScore);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStoreScoreToDB = async (score: any) => {
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
      const res = await ScoreService.add(scoreSubmission);
      const data = res.data;
      console.log(data);

      data.score.midterm_score =
        data.score.midterm_score !== null
          ? parseFloat(data.score.midterm_score).toFixed(2)
          : "-";

      data.score.final_score =
        data.score.final_score !== null
          ? parseFloat(data.score.final_score).toFixed(2)
          : "-";

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
    onClose();
    setError("");
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 items-center">
        <span>-</span>{" "}
        <Button
          onPress={onOpen}
          size="sm"
          color="primary"
          isDisabled={!isConnected}
        >
          <AddIcon size={20} />
          Thêm
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xs">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Thêm điểm{" "}
                {scoreType === ScoreTypeEnum.MIDTERM ? "giữa kì" : "cuối kì"}
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
                  onPress={handleClose}
                  isDisabled={isHandling}
                >
                  Thoát
                </Button>
                <Button
                  color="primary"
                  onClick={handleAddScore}
                  disabled={isHandling}
                >
                  {isHandling ? <LoaderBtn /> : "Thêm"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
