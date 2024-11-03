import type { NextPage } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Home: NextPage = () => {
  // const cookieStore = cookies();
  // const userJSON = cookieStore.get("user");

  // if (userJSON) {
  //   const user = JSON.parse(userJSON?.value || "");
  //   redirect(`/${user.role}/`);
  // }

  return <h1>Loading...</h1>;
};

export default Home;
