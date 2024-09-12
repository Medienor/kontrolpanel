import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const session = request.cookies.get('session')?.value

  if (session) {
    try {
      const user = JSON.parse(session)
      return NextResponse.json(user)
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
  } else {
    return NextResponse.json({ error: 'No session found' }, { status: 401 })
  }
}