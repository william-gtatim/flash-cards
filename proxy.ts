import { updateSession } from "@/lib/supabase/proxy";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (error: unknown) {
    // Never block auth pages if session refresh fails in middleware/proxy.
    if (request.nextUrl.pathname.startsWith("/auth")) {
      const response = NextResponse.next({ request });

      request.cookies.getAll().forEach(({ name }) => {
        if (name.startsWith("sb-")) {
          response.cookies.delete(name);
        }
      });

      return response;
    }

    throw error;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
