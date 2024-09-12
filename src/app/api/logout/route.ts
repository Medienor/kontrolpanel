import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear the authentication cookie
  cookies().delete('authToken');

  // You might also want to invalidate the session on the server-side if you're using server-side sessions

  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}
