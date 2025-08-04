import type { PageServerLoad } from './$types';
import { constructAuthURL } from '$lib/server/auth';
import { LEMON_AUTH_SERVER_ENDPOINT } from '$env/static/private';

export const load: PageServerLoad = async ({ locals, url }) => {
	return {
		user: locals.user,
		authURL: constructAuthURL(new URL(LEMON_AUTH_SERVER_ENDPOINT), url),
		events: [
			{
				id: crypto.randomUUID(),
				slug: 'ftt',
				name: 'Fate Trigger Trials',
				date: '2025-08-02/2025-08-03',
				status: 'finished',
				image: 'https://pbs.twimg.com/media/Gvv78z-bMAA1hDT?format=jpg&name=4096x4096',
				imageURL: 'https://pbs.twimg.com/media/Gvv78z-bMAA1hDT?format=jpg&name=4096x4096',
				capacity: 24
			}
		] as const
	};
};
