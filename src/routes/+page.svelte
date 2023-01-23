<script lang="ts">
	import AreaChart from '$lib/AreaChart.svelte';
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
	let data: { id: string; data: { month: Date; total: number }[] }[];

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

			const date = new Date();
			const currentMonth = date.getMonth();

			let months = 0;
			const maxMonths = 12 * 81;
			const expensesData: (typeof data)[number] = { id: 'expenses', data: [] };
			const balanceData: (typeof data)[number] = { id: 'balance', data: [] };
			const month = new Date(date);
			expensesData.data.push({ month, total: expenses });
			balanceData.data.push({ month, total: balance });
			while (balance - expenses >= 0 && months < maxMonths) {
				balance -= expenses;
				expenses *= 1 + inflation;
				balance *= 1 + returns;
				months++;

				const month = new Date(date);
				month.setMonth(currentMonth + months);
				expensesData.data.push({ month, total: expenses });
				balanceData.data.push({ month, total: balance });
			}

			data = [expensesData, balanceData];
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

{#key data}{#if data}<AreaChart {data} />{/if}{/key}

<p>
	Investing always carries some level of risk. The past performance of any investment is not a
	guarantee of future results. Please consider your risk tolerance and investment goals before
	making any investment decisions.
</p>
<p>
	The information provided in this app is for general informational purposes only and is not
	intended as financial advice. You should always consult with a financial advisor before making any
	investment decisions.
</p>
<p>
	Any mention of specific products or services in this app is for informational purposes only and
	does not constitute an endorsement or recommendation.
</p>
<p>We cannot guarantee any specific results from following the advice provided in this app.</p>
<p>
	We will not be held responsible for any losses or damages incurred by users as a result of
	following the advice provided in this app.
</p>
<p>
	The information provided in this app is believed to be accurate, but we do not guarantee its
	accuracy. The market and financial conditions are subject to change and may impact the accuracy of
	the information provided in this app.
</p>
