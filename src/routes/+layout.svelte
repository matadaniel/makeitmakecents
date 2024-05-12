<script lang="ts">
	import '../app.postcss';

	import { AppShell, initializeStores, Modal } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<Modal />

<AppShell slotPageContent="flex flex-col items-center mt-24" slotPageFooter="mt-24 mx-3 mb-3">
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
