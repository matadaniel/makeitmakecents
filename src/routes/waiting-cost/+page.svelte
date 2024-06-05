<script lang="ts">
	import ModalChartForm from '$lib/ModalChartForm.svelte';
	import LineChart from '$lib/LineChart.svelte';
	import { formatToCurrency } from '$lib/stores';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { format } from 'd3';
	import { type ComponentProps } from 'svelte';
	import { z } from 'zod';

	const date = new Date();
	const currentYear = date.getFullYear();

	let interval = 10;
	let range = 42;
	const stockReturns = 0.0075;
	const bondReturns = 0.0048;
	const stockWeight = 0.6;
	const bondWeight = 0.4;
	let APY = (stockReturns * stockWeight + bondReturns * bondWeight) * 12 * 100;
	$: returns = 1 + APY / 12 / 100;
	let monthlyContributions = 300;

	$: data = Array.from({ length: Math.ceil(range / interval) }, (_, i) => {
		if (i === 0)
			return {
				id: 'Starting today',
				data: [{ month: new Date(date), total: monthlyContributions }]
			};

		const year = currentYear + i * interval;

		const month = new Date(date);
		month.setFullYear(year);

		return {
			id: `Starting ${year}`,
			data: [
				{
					month,
					// P * (1 + r / n) ** (n * t) +
					// monthlyContributions * (((1 + r / n) ** (n * t) - 1) / (r / n)),
					total:
						monthlyContributions *
						((returns ** (range * 12) - 1) / (returns ** ((range - i * interval) * 12) - 1))
				}
			]
		};
	});

	$: for (let i = 0; i < data.length; i++) {
		for (let j = 1; j < (range - i * interval) * 12; j++) {
			const prev = data[i].data[j - 1];

			const month = new Date(prev.month);
			month.setMonth(month.getMonth() + 1);

			data[i].data.push({
				month,
				total: prev.total * returns + data[i].data[0].total
			});
		}
	}

	let editableLineChartProps = {
		marginTop: 40,
		marginRight: 3,
		marginBottom: 30,
		marginLeft: 52,
		inset: 0,
		width: 700,
		height: 350,
		xLabel: '',
		yLabel: '',
		horizontalGrid: true,
		verticalGrid: true,
		showDots: false,
		dotsFilled: true,
		r: 5,
		strokeWidth: 5,
		strokeOpacity: 0.8,
		tooltipBackground: 'white',
		tooltipTextColor: 'black'
	};
	let colors = ['#F50057', '#42A5F5', '#26A69A', '#9575CD'].map((color) => ({ color }));
	let lineChartProps: ComponentProps<LineChart>;
	$: lineChartProps = {
		data,
		xFormat: (n) => n.toString(),
		yFormat: format('$~s'),
		svend3rColors: colors.map(({ color }) => color),
		...editableLineChartProps
	};

	const modalStore = getModalStore();

	function openSettings() {
		const schema = z.object({
			start: z.object({
				APY: z.number(),
				'interval (years)': z.number(),
				monthlyContributions: z.number(),
				'range (years)': z.number()
			}),
			marginTop: z.number(),
			marginRight: z.number(),
			marginBottom: z.number(),
			marginLeft: z.number(),
			inset: z.number(),
			width: z.number(),
			height: z.number(),
			xLabel: z.string(),
			yLabel: z.string(),
			horizontalGrid: z.boolean(),
			verticalGrid: z.boolean(),
			colors: z.array(z.object({ color: z.string() })),
			showDots: z.boolean(),
			dotsFilled: z.boolean(),
			r: z.number(),
			strokeWidth: z.number(),
			strokeOpacity: z.number(),
			tooltipBackground: z.string(),
			tooltipTextColor: z.string()
		});

		const c: ModalComponent = {
			ref: ModalChartForm,
			props: {
				entries: Object.entries({
					start: Object.entries({
						'interval (years)': interval,
						'range (years)': range,
						APY,
						monthlyContributions
					}),
					colors: colors.map(({ color }, i) => [i + '.color', color]),
					...editableLineChartProps
				}),

				schema
			} satisfies Omit<ComponentProps<ModalChartForm>, 'parent'>
		};

		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: 'Settings',
			response: (r: z.infer<typeof schema> | false | undefined) => {
				if (r)
					({
						start: {
							'interval (years)': interval,
							'range (years)': range,
							APY,
							monthlyContributions
						},
						colors,
						...editableLineChartProps
					} = r);
			}
		};

		modalStore.trigger(modal);
	}
</script>

<h1 class="h1 text-center">The cost of waiting</h1>

{#key lineChartProps}
	<LineChart {...lineChartProps} on:click={openSettings} />
{/key}

<h2 class="h2 pt-8 text-center">
	Investing {$formatToCurrency(monthlyContributions)} per month ({$formatToCurrency(
		monthlyContributions * data[0].data.length
	)} over {range} years) could yield you {$formatToCurrency(
		data[0].data[data[0].data.length - 1].total
	)}
</h2>

{#if data.length > 1}
	<div class="table-container max-w-max px-2 pt-12">
		<table class="table table-hover [&_thead_tr]:normal-case">
			<thead>
				<tr>
					<th>If you wait</th>
					<th>you would need to invest</th>
				</tr>
			</thead>
			<tbody>
				{#each data as subset, i}
					{#if i > 0}
						<tr>
							<td>{i * interval} years</td>
							<td
								><b>{$formatToCurrency(subset.data[0].total)}</b> per month (<b
									>{$formatToCurrency(subset.data[0].total * subset.data.length)}</b
								>
								over {range - i * interval} years) instead to catch up.</td
							>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<h3 class="h3 pt-8 text-center">No future data to show!</h3>
{/if}

<h3 class="h3 pt-8 text-center">
	Click on the chart to change the contribution amount and other properties!
</h3>
