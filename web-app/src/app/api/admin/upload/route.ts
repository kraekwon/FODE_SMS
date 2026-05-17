import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('dbFile') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save uploaded file locally
    const uploadDir = path.join(process.cwd(), 'temp');
    const filePath = path.join(uploadDir, 'uploaded_studentsBE.mdb');
    
    // Ensure temp dir exists
    await exec(`mkdir -p ${uploadDir}`);
    await writeFile(filePath, buffer);

    // Update the migration script target and run it
    const migrateScriptPath = path.join(process.cwd(), 'scripts', 'migrate.js');
    
    return new Promise<NextResponse>((resolve) => {
      exec(`node ${migrateScriptPath} "${filePath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Migration error: ${error.message}`);
          resolve(NextResponse.json({ error: 'Migration failed. Make sure it is a valid .mdb file.' }, { status: 500 }));
        } else {
          console.log(`Migration output: ${stdout}`);
          resolve(NextResponse.json({ success: true, message: 'Database updated successfully!' }));
        }
      });
    });

  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
