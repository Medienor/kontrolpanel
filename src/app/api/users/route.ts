import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(request: Request) {
  try {
    const { username, password, locations } = await request.json();

    // Validate input
    if (!username || !password || !locations || !Array.isArray(locations)) {
      return NextResponse.json({ error: 'Username, password, and locations are required' }, { status: 400 });
    }

    // Ensure all location values are numbers
    if (!locations.every(loc => typeof loc === 'number')) {
      return NextResponse.json({ error: 'All location values must be numbers' }, { status: 400 });
    }

    // Read existing users
    const dataDirectory = path.join(process.cwd(), 'src', 'app', 'data');
    const fileContents = await fs.readFile(path.join(dataDirectory, 'users.json'), 'utf8');
    const users = JSON.parse(fileContents);

    // Check if username already exists
    if (users.some((user: { username: string }) => user.username === username)) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    // Add new user
    users.push({ username, password, role: 'user', locations });

    // Write updated users back to file
    await fs.writeFile(path.join(dataDirectory, 'users.json'), JSON.stringify(users, null, 2));

    return NextResponse.json({ message: 'User added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}