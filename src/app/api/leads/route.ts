import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

// Define an interface for the lead object
interface Lead {
  id: string;
  Kundenavn: string;
  Telefon: string;
  Epost: string;
  date: string;
  Postnummer: string;
  // Add other necessary fields here
}

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), 'src', 'app', 'data');
    const leadsFilePath = path.join(dataDirectory, 'leads.json');

    const fileContents = await fs.readFile(leadsFilePath, 'utf8');
    const leads: Lead[] = JSON.parse(fileContents);

    // Ensure all necessary fields are included
    const sanitizedLeads = leads.map((lead: Lead) => ({
      id: lead.id,
      Kundenavn: lead.Kundenavn,
      Telefon: lead.Telefon,
      Epost: lead.Epost,
      date: lead.date,
      Postnummer: lead.Postnummer,
      // Include other necessary fields
    }));

    return NextResponse.json(sanitizedLeads);
  } catch (error) {
    console.error('Error reading leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}