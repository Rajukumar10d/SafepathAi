import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Test from '@/models/Test';

export async function GET() {
  try {
    await dbConnect();
    const tests = await Test.find({});
    return NextResponse.json({ success: true, data: tests });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    await dbConnect();
    const test = await Test.create({ name });
    return NextResponse.json({ success: true, data: test }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
