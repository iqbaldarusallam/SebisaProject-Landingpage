import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requireSuperAdmin } from "@/lib/admin-access";
import { adminCreateSchema } from "@/lib/validations";

export async function GET() {
  try {
    const forbidden = await requireSuperAdmin();
    if (forbidden) return forbidden;

    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return Response.json(successResponse(admins));
  } catch (error) {
    return Response.json(
      errorResponse(error instanceof Error ? error.message : "Error fetching admins"),
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const forbidden = await requireSuperAdmin();
    if (forbidden) return forbidden;

    const body = await request.json();
    const parsed = adminCreateSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 },
      );
    }

    if (parsed.data.role === "super_admin") {
      return Response.json(errorResponse("Super admin hanya boleh satu"), {
        status: 400,
      });
    }

    const password = await bcryptjs.hash(parsed.data.password, 10);
    const admin = await prisma.admin.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        password,
        role: parsed.data.role,
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

    return Response.json(successResponse(admin, "Admin created"), {
      status: 201,
    });
  } catch (error) {
    return Response.json(
      errorResponse(error instanceof Error ? error.message : "Error creating admin"),
      { status: 500 },
    );
  }
}
