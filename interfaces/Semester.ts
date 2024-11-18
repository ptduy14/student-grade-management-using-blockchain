import { SemesterStatusEnum } from "@/common/enum/semester-status-enum"

export interface ISemester {
    semester_id: number,
    semester_name: string
    semester_status: SemesterStatusEnum
}