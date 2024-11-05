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
import { EditIcon } from "@/components/icons/table/edit-icon";
import { useState, SetStateAction } from "react";
import {
  CourseSectionStudent,
  CourseSectionStudentDetail,
} from "@/interfaces/CourseSectionStudent";
import { ScoreTypeEnum } from "./enum/score-type-enum";
import { UpdateIcon } from "@/components/icons/table/update-icon";
import { ScoreService } from "@/services/score-service";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useWeb3 } from "@/context/web3-conext";

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
  const {isConnected, getSigner} = useWeb3();

  const handleUpdateScore = async () => {
    const signer = await getSigner();
    if (signer === null) {
      return;
    }

    const score = parseFloat(scoreInput);

    // Kiểm tra xem điểm có trống không
    if (!scoreInput) {
      setError("Điểm không được để trống.");
      return;
    }

    // Kiểm tra xem điểm có nằm trong khoảng từ 0 đến 10 không
    if (isNaN(score) || score < 0 || score > 10) {
      setError("Điểm phải từ 0 đến 10.");
      return;
    }

    // Reset error nếu tất cả các điều kiện đều hợp lệ
    setError("");

    const scoreSubmission: ScoreSubmission = {
      student_id: courseSectionStudent.student_student_id,
      semester_id: courseSectionStudent.semester_semester_id,
      course_section_id:
        courseSectionStudent.student_enrollment_course_section_id,
      score: Number(scoreInput),
      score_type: scoreType == ScoreTypeEnum.MIDTERM ? "midterm" : "final",
    };

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

      toast.success("Cập nhật điểm thành công");
      setScoreInput("");
      onClose();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setIsHandling(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 items-center">
        <span>{courseSectionStudent[scoreType]}</span>{" "}
        <Button size="sm" color="primary" onPress={onOpen} isDisabled={!isConnected}>
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
                  onPress={onClose}
                  isDisabled={isHandling}
                >
                  Thoát
                </Button>
                <Button
                  color="primary"
                  onClick={handleUpdateScore}
                  disabled={isHandling}
                >
                  Thêm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
