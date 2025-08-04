import type { PageServerLoad } from './$types';
import { constructAuthURL } from '$lib/server/auth';
import { LEMON_AUTH_SERVER_ENDPOINT } from '$env/static/private';

export const load: PageServerLoad = async ({ locals, url }) => {
	return {
		user: locals.user,
		authURL: constructAuthURL(new URL(LEMON_AUTH_SERVER_ENDPOINT), url)
	};
};
