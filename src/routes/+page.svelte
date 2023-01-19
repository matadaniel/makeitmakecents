<script lang="ts">
	import NumInput from '$lib/NumInput.svelte';
	import { currency } from '$lib/stores';
	import { reporter } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-zod';
	import { createForm } from 'felte';
	import { z } from 'zod';

	const schema = z.object({
		expenses: z.number().nonnegative(),
		savings: z.number().nonnegative()
	});

	let deposit = 100000;

	const { form } = createForm<z.infer<typeof schema>>({
		onSubmit: ({ expenses, savings }) => {
			// https://ssrn.com/abstract=3964908

			expenses /= 12;

			const stockReturns = 0.0075;
			const bondReturns = 0.0048;
			const stockWeight = 0.6;
			const bondWeight = 0.4;
			const returns = stockReturns * stockWeight + bondReturns * bondWeight;

			const inflation = 0.0198 / 12;

			let balance = deposit + savings;

			let months = 0;
			const maxMonths = 12 * 81;
			while (balance - expenses >= 0 && months < maxMonths) {
				balance -= expenses;
				expenses *= 1 + inflation;
				balance *= 1 + returns;
				months++;
			}
			console.log(
				Math.trunc(months / 12),
				' years',
				months % 12 > 0 ? ` and ${months % 12} months` : ''
			);
		},
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
				>{value.toLocaleString(undefined, { style: 'currency', currency: $currency })}</span
			>{/if}
	</NumInput>

	<NumInput
		inputAttributes={{ id: 'savings', required: true }}
		labelText="Current Savings:"
		let:value
	>
		{#if typeof value === 'number'}<span
				>{value.toLocaleString(undefined, { style: 'currency', currency: $currency })}</span
			>{/if}
	</NumInput>

	<button class="btn btn-filled-primary">Submit</button>
</form>
