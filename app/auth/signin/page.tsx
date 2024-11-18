import { Signin } from "@/components/auth/signin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const signin = () => {
  const cookieStore = cookies();
  const userJSON = cookieStore.get("user");

  if (userJSON) {
    const user = JSON.parse(userJSON?.value || "");
    redirect(`/${user.role}/`);
  }

  return <Signin />;
};

export default signin;
