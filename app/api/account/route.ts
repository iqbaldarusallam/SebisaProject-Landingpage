import bcryptjs from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-utils";
import { accountUpdateSchema } from "@/lib/validations";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const body = await request.json();
    const parsed = accountUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 },
      );
    }

    const sessionId = Number(session.user.id);
    const admin = await prisma.admin.findFirst({
      where: Number.isInteger(sessionId)
        ? { id: sessionId }
        : { email: session.user.email },
    });

    if (!admin) {
      return Response.json(errorResponse("Admin not found"), { status: 404 });
    }

    const passwordMatch = await bcryptjs.compare(
      parsed.data.currentPassword,
      admin.password,
    );

    if (!passwordMatch) {
      return Response.json(errorResponse("Password saat ini salah"), {
        status: 400,
      });
    }

    if (parsed.data.email !== admin.email) {
      const existingEmail = await prisma.admin.findUnique({
        where: { email: parsed.data.email },
        select: { id: true },
      });

      if (existingEmail && existingEmail.id !== admin.id) {
        return Response.json(errorResponse("Email sudah digunakan"), {
          status: 400,
        });
      }
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        ...(parsed.data.newPassword
          ? { password: await bcryptjs.hash(parsed.data.newPassword, 10) }
          : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return Response.json(successResponse(updatedAdmin, "Account updated"));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error updating account",
      ),
      { status: 500 },
    );
  }
}
