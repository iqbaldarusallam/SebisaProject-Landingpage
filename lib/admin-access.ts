import { getServerSession } from "next-auth";
import { errorResponse } from "@/lib/api-utils";
import { authOptions } from "@/lib/auth";

export async function requireSuperAdmin() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "super_admin") {
    return Response.json(errorResponse("Forbidden: super admin only"), {
      status: 403,
    });
  }

  return null;
}
