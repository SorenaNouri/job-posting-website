import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  try {
    const data = await request.json();

    const job = await prisma.job.create({
      data: {
        ...data,
        postedById: session.user.id,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log("Error creating job: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET() {
  try {
    const job = await prisma.job.findMany({
      orderBy: { postedAt: "desc" },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log("Error getting job: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
