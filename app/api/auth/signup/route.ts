import { NextRequest, NextResponse } from "next/server";

export interface SignupBody {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignupBody;
    const { name, email, password, phone } = body;

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    // Mock: create user and return token for auto-login
    const mockUser = {
      id: "user-" + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
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
