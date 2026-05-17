import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get('skip') || '0');
  const take = parseInt(searchParams.get('take') || '50');

  try {
    const students = await prisma.student.findMany({ skip, take, include: { marks: true, fees: true } });
    return NextResponse.json(students);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
