import { sql } from './db';

// Session and user types based on Neon Auth schema
export interface NeonAuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string | null;
  banned: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NeonAuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Validate session token and return user if valid
export async function validateSession(sessionToken: string): Promise<NeonAuthUser | null> {
  if (!sessionToken) {
    return null;
  }

  try {
    const result = await sql`
      SELECT u.id, u.name, u.email, u."emailVerified", u.image, u.role, u.banned, u."createdAt", u."updatedAt"
      FROM neon_auth.session s
      JOIN neon_auth."user" u ON s."userId" = u.id
      WHERE s.token = ${sessionToken}
        AND s."expiresAt" > NOW()
        AND (u.banned IS NULL OR u.banned = false)
    `;

    if (result.length === 0) {
      return null;
    }

    return result[0] as NeonAuthUser;
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

// Check if user has admin role
export function isAdmin(user: NeonAuthUser | null): boolean {
  return user?.role === 'admin';
}

// Get session token from request (Authorization header or cookies)
export function getSessionTokenFromRequest(request: Request): string | null {
  // Check Authorization header first (Bearer token)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Fall back to cookies
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return null;
  }

  // Neon Auth uses 'better-auth.session_token' cookie by default
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...rest] = c.trim().split('=');
      return [key, rest.join('=')];
    })
  );

  return cookies['better-auth.session_token'] || cookies['neon-auth-session'] || null;
}

// Auth result types
export type AuthResult =
  | { authenticated: true; user: NeonAuthUser }
  | { authenticated: false; error: 'unauthorized' | 'forbidden'; status: 401 | 403 };

// Require authenticated user
export async function requireAuth(request: Request): Promise<AuthResult> {
  const sessionToken = getSessionTokenFromRequest(request);

  if (!sessionToken) {
    return { authenticated: false, error: 'unauthorized', status: 401 };
  }

  const user = await validateSession(sessionToken);

  if (!user) {
    return { authenticated: false, error: 'unauthorized', status: 401 };
  }

  return { authenticated: true, user };
}

// Require admin user
export async function requireAdmin(request: Request): Promise<AuthResult> {
  const authResult = await requireAuth(request);

  if (!authResult.authenticated) {
    return authResult;
  }

  if (!isAdmin(authResult.user)) {
    return { authenticated: false, error: 'forbidden', status: 403 };
  }

  return authResult;
}

// JSON error response helper
export function authErrorResponse(error: 'unauthorized' | 'forbidden', status: 401 | 403): Response {
  return Response.json(
    {
      error: error === 'unauthorized' ? 'Authentication required' : 'Admin access required',
      code: error.toUpperCase()
    },
    { status }
  );
}
