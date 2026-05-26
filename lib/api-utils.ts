export function successResponse<T>(data: T, message = "Success") {
  return {
    ok: true,
    message,
    data,
  };
}

export function errorResponse(message: string, statusCode = 400) {
  return {
    ok: false,
    message,
    statusCode,
  };
}

export async function parseRouteId(params: Promise<{ id: string }>) {
  const { id } = await params;
  const parsedId = Number(id);

  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

export async function apiHandler(
  handler: (req: Request) => Promise<Response>
) {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error("API Error:", error);
      return Response.json(
        errorResponse(
          error instanceof Error ? error.message : "Internal server error"
        ),
        { status: 500 }
      );
    }
  };
}
