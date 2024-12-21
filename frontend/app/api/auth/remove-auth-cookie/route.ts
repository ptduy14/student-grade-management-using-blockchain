import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.json("success", { status: 200 });

  // Đặt cookie "user" với giá trị rỗng và ngày hết hạn trong quá khứ để xóa
  response.cookies.set("user", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // Đặt ngày hết hạn trong quá khứ
    path: "/",
  });

  return response;
}
