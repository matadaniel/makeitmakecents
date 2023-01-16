<script lang="ts">
	import NumInput from '$lib/NumInput.svelte';
	import { reporter } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-zod';
	import { createForm } from 'felte';
	import { z } from 'zod';

	const schema = z.object({
		expenses: z.number().nonnegative(),
		savings: z.number().nonnegative()
	});

	const { form } = createForm<z.infer<typeof schema>>({
		onSubmit: () => {},
		extend: [validator({ schema }), reporter]
	});
</script>

<h1>Congratulations!!</h1>
<h2>An oil prince has just deposited $100,000 into your bank account!</h2>
<p>Are you able to sleep in tomorrow? And the day after that, and the day after that,</p>

<br />

<form use:form>
	<NumInput
		inputAttributes={{ id: 'expenses', required: true }}
		labelText="Yearly Expenses:"
		let:value
	>
		{#if typeof value === 'number'}<span
				>{value.toLocaleString(undefined, { style: 'currency', currency: 'XXX' })}</span
			>{/if}
	</NumInput>

	<NumInput
		inputAttributes={{ id: 'savings', required: true }}
		labelText="Current Savings:"
		let:value
	>
		{#if typeof value === 'number'}<span
				>{value.toLocaleString(undefined, { style: 'currency', currency: 'XXX' })}</span
			>{/if}
	</NumInput>

	<button class="btn btn-filled-primary">Submit</button>
</form>
