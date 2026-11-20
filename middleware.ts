// Protège l'espace d'administration : pages /admin et API /api/admin (sauf la page et l'API de connexion).
import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_ADMIN, sessionValide } from "@/lib/admin-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/connexion" || pathname === "/api/admin/login") return NextResponse.next();
  if (await sessionValide(req.cookies.get(COOKIE_ADMIN)?.value)) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ erreur: "Non connecté" }, { status: 401 });
  return NextResponse.redirect(new URL("/admin/connexion", req.url));
}

export const config = { matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"] };
