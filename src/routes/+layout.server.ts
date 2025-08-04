import type { LayoutServerLoad } from './$types';

import { LEMON_AUTH_SERVER_ENDPOINT } from '$env/static/private';
import { constructAuthURL } from '$lib/server/auth';

// https://lemontv.win/login/jwt?redirect_uri=https://slice.lemontv.win/auth/callback&next=/

export const load: LayoutServerLoad = async ({ locals: { user }, url }) => {
	return {
		user,
		authURL: constructAuthURL(new URL(LEMON_AUTH_SERVER_ENDPOINT), url)
	};
};
