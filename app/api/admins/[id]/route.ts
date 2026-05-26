import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, parseRouteId } from "@/lib/api-utils";
import { requireSuperAdmin } from "@/lib/admin-access";
import { adminUpdateSchema } from "@/lib/validations";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const forbidden = await requireSuperAdmin();
    if (forbidden) return forbidden;

    const id = await parseRouteId(params);
    if (!id) {
      return Response.json(errorResponse("Invalid admin id"), { status: 400 });
    }

    const body = await request.json();
    const parsed = adminUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 },
      );
    }

    const { password, ...adminData } = parsed.data;
    const existingAdmin = await prisma.admin.findUnique({ where: { id } });

    if (!existingAdmin) {
      return Response.json(errorResponse("Admin not found"), { status: 404 });
    }

    if (
      parsed.data.role === "super_admin" &&
      existingAdmin.role !== "super_admin"
    ) {
      return Response.json(errorResponse("Super admin hanya boleh satu"), {
        status: 400,
      });
    }

    if (
      existingAdmin.role === "super_admin" &&
      parsed.data.role !== "super_admin"
    ) {
      return Response.json(errorResponse("Super admin tidak boleh diubah role"), {
        status: 400,
      });
    }

    const admin = await prisma.admin.update({
      where: { id },
      data: {
        ...adminData,
        ...(password ? { password: await bcryptjs.hash(password, 10) } : {}),
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

    return Response.json(successResponse(admin, "Admin updated"));
  } catch (error) {
    return Response.json(
      errorResponse(error instanceof Error ? error.message : "Error updating admin"),
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const forbidden = await requireSuperAdmin();
    if (forbidden) return forbidden;

    const id = await parseRouteId(params);
    if (!id) {
      return Response.json(errorResponse("Invalid admin id"), { status: 400 });
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { id } });

    if (!existingAdmin) {
      return Response.json(errorResponse("Admin not found"), { status: 404 });
    }

    if (existingAdmin.role === "super_admin") {
      return Response.json(errorResponse("Super admin tidak boleh dihapus"), {
        status: 400,
      });
    }

    const adminCount = await prisma.admin.count();
    if (adminCount <= 1) {
      return Response.json(errorResponse("Minimal harus ada satu admin"), {
        status: 400,
      });
    }

    const admin = await prisma.admin.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return Response.json(successResponse(admin, "Admin deleted"));
  } catch (error) {
    return Response.json(
      errorResponse(error instanceof Error ? error.message : "Error deleting admin"),
      { status: 500 },
    );
  }
}
