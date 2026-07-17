"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_PASSWORD = "123yourbebeb";
const AUTH_COOKIE_NAME = "pinkspace_admin_auth";

export async function login(formData: FormData) {
  const password = formData.get("password") as string;

  if (password === ADMIN_PASSWORD) {
    // Set a cookie that expires in 1 day
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    
    return { success: true };
  }

  return { success: false, error: "Kata sandi salah" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/admin/login");
}
