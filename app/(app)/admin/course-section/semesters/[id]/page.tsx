import { CourseSectionsInSemester } from "@/components/course-section/course-section-in-semester";

const courseSectionInSemester = ({params}: {params: {id: string}}) => {
    return <CourseSectionsInSemester semesterId={params.id}/>
}

export default courseSectionInSemester;