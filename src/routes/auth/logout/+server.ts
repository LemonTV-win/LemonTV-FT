import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SESSION_COOKIE_NAME } from '$lib/server/auth';
import { db } from '$lib/server/db';
export const POST: RequestHandler = async ({ cookies, locals }) => {
	console.info(
		`[Auth] Logging out user: ${locals.user?.username} (${locals.user?.id}); ${cookies.get(SESSION_COOKIE_NAME)}`
	);
	// Clear the session cookie
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });

	// Redirect to home page
	throw redirect(303, '/');
};
