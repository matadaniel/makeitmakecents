<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { links } from './links';

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}

	const modules = import.meta.glob('/src/routes/**/+page.svelte');
	const routes = Object.keys(modules).map((k) => k.substring(11, k.length - 13) || '/');
	if (routes.length !== links.length) throw new Error('routes length does not match links length');
	const hrefs = new Set<string>();
	for (const [href] of links) hrefs.add(href);
	for (const route of routes) if (!hrefs.has(route)) throw new Error(`${route} not in links`);
</script>

<nav class="list-nav p-4">
	<ul>
		{#each links as [href, title]}
			<li><a {href} on:click={drawerClose}>{title}</a></li>
		{/each}
	</ul>
</nav>
