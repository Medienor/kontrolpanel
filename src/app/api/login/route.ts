import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  locations?: number[];
}

const adminUser: User = { id: 1, username: 'admin', password: 'admin', role: 'superadmin' };

const usersFilePath = path.join(process.cwd(), 'src', 'app', 'data', 'users.json');

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()

  let allUsers: User[] = [adminUser];

  try {
    const usersData = fs.readFileSync(usersFilePath, 'utf-8')
    const savedUsers: User[] = JSON.parse(usersData)
    allUsers = allUsers.concat(savedUsers.map((user, index) => ({
      ...user,
      id: index + 2 // Ensure unique IDs, starting after the admin user
    })))
  } catch (error) {
    console.error('Error reading users file:', error)
  }

  const user = allUsers.find(u => u.username === username && u.password === password)

  if (user) {
    const response = NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        locations: user.locations 
      } 
    })
    response.cookies.set('session', JSON.stringify({ 
      id: user.id, 
      username: user.username, 
      role: user.role,
      locations: user.locations 
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    })
    return response
  } else {
    return NextResponse.json({ success: false }, { status: 401 })
  }
}