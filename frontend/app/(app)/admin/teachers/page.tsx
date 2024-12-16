import { Teachers } from "@/components/teachers";
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: "Quản lí giảng viên",
   description: "Student grade management",
}


const teachers = () => {
  return <Teachers />;
};

export default teachers;
