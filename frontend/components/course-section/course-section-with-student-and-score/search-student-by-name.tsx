import { Input } from "@nextui-org/react";
import { useDebounce } from "@/hooks/useDebounce";
import { useState, useEffect, SetStateAction } from "react";
import { CourseSectionStudent } from "@/interfaces/CourseSectionStudent";
import { courseSectionService } from "@/services/course-section-service";

export const SearchStudentByName = ({courseSectionId, setCourseSections, getCourseSectionWithStudentAndScore}: {courseSectionId: string, setCourseSections: React.Dispatch<SetStateAction<CourseSectionStudent | null>>, getCourseSectionWithStudentAndScore: () => void}) => {
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebounce(searchValue, 500); // Debounce sau 500ms

    const findStudentByName = async(courseSectionId: string, studentName: string) => {
        const res = await courseSectionService.findStudentByName(courseSectionId, studentName);
        setCourseSections(res.data);
    }

    useEffect(() => {
      if (debouncedSearchValue) {
        findStudentByName(courseSectionId, debouncedSearchValue);
      }
    }, [debouncedSearchValue]);

    const handleClearInputSearch = () => {
        setSearchValue("")
        getCourseSectionWithStudentAndScore();
    }
  
    return (
      <Input
        classNames={{
          input: "w-full",
          mainWrapper: "w-full",
        }}
        placeholder="Tìm kiếm sinh viên"
        value={searchValue}
        onClear={() => handleClearInputSearch()}
        onChange={(e: any) => setSearchValue(e.target.value)}
      />
    );
  };