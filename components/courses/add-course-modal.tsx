import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AddCourseValidationSchemaType,
  addCourseValidationSchema,
} from "./schemas/add-course-validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SetStateAction, useState } from "react";
import { CourseService } from "@/services/course-service";
import { ICourse } from "@/interfaces/Course";
import { LoaderBtn } from "../loaders/loader-btn";
import { toast } from "react-toastify";

export default function AddCourseModal({setCourses}: {setCourses: React.Dispatch<SetStateAction<ICourse[]>>}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    clearErrors,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCourseValidationSchemaType>({
    resolver: zodResolver(addCourseValidationSchema),
  });

  const onSubmit: SubmitHandler<AddCourseValidationSchemaType> = async (
    data
  ) => {
    try {
        setIsLoading(true);
        const res = await CourseService.createCourse(data);
        setCourses((prev: ICourse[]) => [...prev, res.data]);
        toast.success("Thêm môn học thành công");
        handleCloseModal();
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);   
    }
  };

  const handleCloseModal = () => {
    onClose();
    clearErrors();
    reset();
  }

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Thêm môn học
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Thêm Môn Học
              </ModalHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                  {/* Input 1 */}
                  <div className="mb-4">
                    <Input
                      type="text"
                      label="Tên Môn học"
                      disabled={isLoading}
                      {...register("course_name")}
                    />
                    {errors.course_name && <span className="text-red-500 text-sm">
                      {errors.course_name.message}
                    </span>}
                  </div>
                  {/* Input 2 */}
                  <div className="mb-4">
                    <Input
                      type="number"
                      label="Số tín chỉ"
                      disabled={isLoading}
                      {...register("course_credits")}
                    />
                    {errors.course_credits && <span className="text-red-500 text-sm">
                      {errors.course_credits.message}
                    </span>}
                </div>
                  {/* Input 3 */}
                  <div className="mb-4">
                    <Input
                      type="text"
                      label="Mô tả môn học"
                      disabled={isLoading}
                      {...register("course_des")}
                    />
                    {errors.course_des && <span className="text-red-500 text-sm">
                      {errors.course_des.message}
                    </span>}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button isDisabled={isLoading} color="danger" variant="light" onPress={handleCloseModal}>
                    Đóng
                  </Button>
                  <Button isDisabled={isLoading} color="primary" type="submit">
                    {isLoading ? <LoaderBtn /> : "Lưu"}
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
