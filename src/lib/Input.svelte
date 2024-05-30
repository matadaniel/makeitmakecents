<script lang="ts">
	import { sentenceCase } from '$lib/utils';
	import { ValidationMessage } from '@felte/reporter-svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	type Entry = [string, boolean | number | string | Entry[]];
	export let entry: Entry;
	let [key, value] = entry;

	const l = key.lastIndexOf('.');
	const label = sentenceCase(l !== -1 ? key.slice(l + 1) : key);
</script>

{#if typeof value === 'boolean'}
	<SlideToggle name={key} checked={value} class="!block">{label}</SlideToggle>
{:else if typeof value !== 'object'}
	{#if key.startsWith('colors.')}
		<div class="grid grid-cols-[auto_1fr] gap-2">
			<input class="input" type="color" bind:value name={key} />
			<input class="input" type="text" {value} readonly tabindex="-1" />
		</div>
	{:else}
		<label class="label">
			<span>{label}</span>
			<ValidationMessage for={key} let:messages>
				{#if messages}<span class="text-error-700">{messages}</span>{/if}
				<slot slot="placeholder" {value} />
			</ValidationMessage>
			<input
				type={typeof value === 'number' ? 'number' : 'text'}
				class="input"
				{value}
				name={key}
			/>
		</label>
	{/if}
{:else}
	<fieldset class="modal-form space-y-4 border border-surface-500 p-4 rounded-container-token">
		<legend>{label}</legend>
		{#each value as [k, v]}
			<svelte:self entry={[key + '.' + k, v]} />
		{:else}
			<span>No settings available</span>
		{/each}
	</fieldset>
{/if}
