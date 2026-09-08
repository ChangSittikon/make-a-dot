import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry') || 'วงการ E-Sports / เกมมิ่ง';

    const seedPath = path.join(process.cwd(), 'scratch/industry-flow-seeds.json');
    const fileContents = fs.readFileSync(seedPath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Find the requested industry or default to the first one
    const industryData = data.find((d: any) => d.industry.includes(industry)) || data[0];

    return NextResponse.json({ nodes: industryData.nodes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read JSON" }, { status: 500 });
  }
}
