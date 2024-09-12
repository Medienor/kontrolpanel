import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), 'src', 'app', 'data');
    console.log('Reading locations from:', path.join(dataDirectory, 'locations.json'));
    const fileContents = await fs.readFile(path.join(dataDirectory, 'locations.json'), 'utf8');
    const locations = JSON.parse(fileContents);
    console.log('Parsed locations:', locations);

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error reading locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}