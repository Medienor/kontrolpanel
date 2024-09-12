import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

interface Lead {
  id: number;
  Kundenavn: string;
  Telefon: string;
  Epost: string;
  date: string;
  // Add other fields as needed
}

export async function POST(request: Request) {
  try {
    const leadData = await request.json();
    const dataDirectory = path.join(process.cwd(), 'src', 'app', 'data');
    const leadsFilePath = path.join(dataDirectory, 'leads.json');

    // Read existing leads
    let leads: Lead[] = [];
    try {
      const fileContents = await fs.readFile(leadsFilePath, 'utf8');
      leads = JSON.parse(fileContents);
    } catch (error) {
      console.error('Error reading leads file:', error);
    }

    // Add new lead
    const newLead: Lead = {
      id: leads.length + 1,
      Kundenavn: leadData.Kundenavn,
      Telefon: leadData.Telefon,
      Epost: leadData.Epost,
      date: new Date().toISOString(),
      // Add other fields as needed
    };

    leads.push(newLead);

    // Write updated leads back to file
    await fs.writeFile(leadsFilePath, JSON.stringify(leads, null, 2));

    return NextResponse.json({ message: 'Lead added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}