import { NextRequest, NextResponse } from "next/server";

export interface LoginBody {
  email?: string;
  phone?: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginBody;
    const { email, phone, password } = body;

    if (!password || (!email && !phone)) {
      return NextResponse.json(
        { error: "Email or phone and password are required." },
        { status: 400 }
      );
    }

    // Mock: accept any non-empty password; in production validate against backend
    if (password.length < 1) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const identifier = email?.trim() || phone?.trim() || "";
    const isEmail = identifier.includes("@");
    const mockUser = {
      id: "user-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9),
      name: isEmail ? identifier.split("@")[0] : "User",
      email: isEmail ? identifier : `${identifier}@comics.local`,
      phone: isEmail ? undefined : identifier,
    };
    const mockToken = "mock-jwt-" + Date.now();

    return NextResponse.json({
      token: mockToken,
      user: mockUser,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
