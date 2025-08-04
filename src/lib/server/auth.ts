import { importJWK } from 'jose';

export const SESSION_COOKIE_NAME = 'auth-session';

// Configure audience based on environment
// export const JWT_AUDIENCE = dev ? 'http://localhost:23333' : 'https://slice.lemontv.win';
export const JWT_ISSUER = 'https://lemontv.win';

// Custom error classes for better error handling
export class AuthError extends Error {
	constructor(
		message: string,
		public code: string,
		public statusCode: number = 401
	) {
		super(message);
		this.name = 'AuthError';
	}
}

export class JWKSError extends Error {
	constructor(
		message: string,
		public originalError?: Error
	) {
		super(message);
		this.name = 'JWKSError';
	}
}

export class SessionError extends Error {
	constructor(
		message: string,
		public code: string
	) {
		super(message);
		this.name = 'SessionError';
	}
}

export interface SessionValidationResult {
	session: { id: string; userId: string; expiresAt: Date } | null;
	user: { id: string; age: number | null } | null;
}

export async function fetchPublicKey(
	url: URL,
	fetch: typeof globalThis.fetch = globalThis.fetch
): Promise<CryptoKey | Uint8Array> {
	try {
		const jwksResponse = await fetch(url);
		if (!jwksResponse.ok) {
			throw new JWKSError(
				`Failed to fetch LemonTV public key: ${jwksResponse.status} ${jwksResponse.statusText}`,
				new Error(`HTTP ${jwksResponse.status}: ${jwksResponse.statusText}`)
			);
		}

		const jwksData = (await jwksResponse.json()) as {
			keys?: { alg: string; kty: string; use: string; x5c: string[] }[];
		};
		if (!jwksData || !jwksData.keys || !Array.isArray(jwksData.keys)) {
			throw new JWKSError('Invalid JWKS response format: missing or invalid keys array');
		}

		const { keys } = jwksData;

		if (keys.length === 0) {
			throw new JWKSError('No keys found in LemonTV JWKS');
		}

		const jwk = keys[0];
		if (!jwk || !jwk.alg) {
			throw new JWKSError('Invalid JWK format: missing algorithm');
		}

		return await importJWK(jwk, jwk.alg);
	} catch (error) {
		if (error instanceof JWKSError) {
			throw error;
		}
		throw new JWKSError('Failed to import JWK', error as Error);
	}
}

export function constructAuthURL(endpoint: URL, url: URL) {
	const authURL = new URL(endpoint);
	authURL.searchParams.set('redirect_uri', `${url.origin}/auth/callback`);
	authURL.searchParams.set('next', url.pathname);
	return authURL.toString();
}
