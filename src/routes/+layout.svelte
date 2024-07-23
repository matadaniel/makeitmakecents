<script lang="ts">
	import '../app.postcss';

	import Navigation from '$lib/Navigation/Navigation.svelte';
	import {
		AppShell,
		Drawer,
		Modal,
		getDrawerStore,
		initializeStores
	} from '@skeletonlabs/skeleton';

	initializeStores();

	const drawerStore = getDrawerStore();

	function drawerOpen(): void {
		drawerStore.open({ width: 'w-1/2' });
	}
</script>

<Modal />

<Drawer>
	<Navigation />
</Drawer>

<AppShell
	slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64"
	slotPageContent="flex flex-col items-center mt-24 min-h-screen shrink-0"
	slotPageFooter="mt-24 mx-3 mb-3"
>
	<svelte:fragment slot="sidebarLeft">
		<div class="absolute flex items-center bg-surface-500 lg:hidden">
			<button class="btn btn-sm" on:click={drawerOpen}>
				<span>
					<svg viewBox="0 0 100 80" class="fill-token h-4 w-4">
						<rect width="100" height="20" />
						<rect y="30" width="100" height="20" />
						<rect y="60" width="100" height="20" />
					</svg>
				</span>
			</button>
		</div>
		<Navigation />
	</svelte:fragment>

	<slot />

	<svelte:fragment slot="pageFooter">
		<p>
			Investing always carries some level of risk. The past performance of any investment is not a
			guarantee of future results. Please consider your risk tolerance and investment goals before
			making any investment decisions.
		</p>
		<p>
			The information provided in this app is for general informational purposes only and is not
			intended as financial advice. You should always consult with a financial advisor before making
			any investment decisions.
		</p>
		<p>
			Any mention of specific products or services in this app is for informational purposes only
			and does not constitute an endorsement or recommendation.
		</p>
		<p>We cannot guarantee any specific results from following the advice provided in this app.</p>
		<p>
			We will not be held responsible for any losses or damages incurred by users as a result of
			following the advice provided in this app.
		</p>
		<p>
			The information provided in this app is believed to be accurate, but we do not guarantee its
			accuracy. The market and financial conditions are subject to change and may impact the
			accuracy of the information provided in this app.
		</p>
	</svelte:fragment>
</AppShell>
