import { links } from '$lib/Navigation/links';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	redirect(301, links[0][0]);
};
