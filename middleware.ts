import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Các route cần kiểm tra
const protectedRoutes = {
  student: "/student",
  teacher: "/teacher",
};

export function middleware(request: NextRequest) {
  const userJSON = request.cookies.get("user")?.value;

  if (!userJSON) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  const user = JSON.parse(userJSON);
  
  if (
    (user.role === "teacher" &&
      request.nextUrl.pathname.startsWith(protectedRoutes.teacher)) ||
    (user.role === "student" &&
      request.nextUrl.pathname.startsWith(protectedRoutes.student))
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(`/${user.role}`, request.url))
}

// Xác định các route cần áp dụng middleware
export const config = {
  matcher: ["/","/student/:path*", "/teacher/:path*"],
};
