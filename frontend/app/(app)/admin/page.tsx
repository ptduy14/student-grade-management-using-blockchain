import type { NextPage } from "next";
import { Content } from "@/components/home/content";
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: "Trang Chủ",
   description: "Student grade management",
}

const Home: NextPage = () => {
  return <Content />;
};

export default Home;
