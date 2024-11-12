"use client";
import { useEffect, useState } from "react"
import { ISemester } from "@/interfaces/Semester";
import { semesterService } from "@/services/semester-service";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { CourseSectionTeachingInSemester } from "../course-section-teaching-in-semester";

export const CourseSectionTeachingInCurrentOpenSemester = () => {
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [currentSemester, setCurrentSemester] = useState<ISemester | null>();

    // const getCurrentOpenSemester = async () => {
    //     try {
    //         const res = await semesterService.getCurrentOpenSemester();
    //         setCurrentSemester(res.data);
    //     } catch (error) {
    //         if (isAxiosError(error)) {
    //             toast.info(error.response?.data.message);
    //         }
    //     } finally {
    //         setIsFetching(false);
    //     }
    // }

    // useEffect(() => {
    //     getCurrentOpenSemester();
    // }, [])

    if (isFetching) return <div className="w-full h-full flex justify-center items-center">Waiting...</div>

    if (!currentSemester) return <div className="w-full h-full flex justify-center items-center">Hiện tại không có lớp học phần</div>

    return <CourseSectionTeachingInSemester semesterId={currentSemester.semester_id.toString()}/>
}