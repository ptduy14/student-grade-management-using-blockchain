import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const response = NextResponse.json("success", { status: 200 });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Chỉ kích hoạt secure khi production
      expires: new Date("2099-12-31T23:59:59Z"),
      path: "/",
    };

    // gắn cookie vào response
    response.cookies.set("user", JSON.stringify(data), cookieOptions);
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        code: error.code,
        message: error.message || "Something went wrong",
      },
      { status: 500 },
    );
  }
}
