<script lang="ts">
	import Input from '$lib/Input.svelte';
	import { reporter } from '@felte/reporter-svelte';
	import { validator } from '@felte/validator-zod';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { createForm } from 'felte';
	import type { ComponentProps, SvelteComponent } from 'svelte';
	import type { AnyZodObject } from 'zod';

	export let parent: SvelteComponent;

	export let entries: ComponentProps<Input>['entry'][];

	export let schema: AnyZodObject;

	const modalStore = getModalStore();

	const { form } = createForm({
		onSubmit: (values) => {
			if ($modalStore[0].response) $modalStore[0].response(values);
			modalStore.close();
		},
		extend: [validator({ schema }), reporter]
	});
</script>

{#if $modalStore[0]}
	<div class="card w-modal space-y-4 p-4 shadow-xl">
		{#if $modalStore[0].title}<header class="text-2xl font-bold">
				{$modalStore[0].title}
			</header>{/if}
		{#if $modalStore[0].body}<article>{$modalStore[0].body}</article>{/if}
		<form use:form class="space-y-4 border border-surface-500 p-4 rounded-container-token">
			{#each entries as entry}
				<Input {entry} />
			{/each}
			<footer class={parent.regionFooter}>
				<button type="button" class="btn {parent.buttonNeutral}" on:click={parent.onClose}
					>{parent.buttonTextCancel}</button
				>
				<button class="btn {parent.buttonPositive}">{parent.buttonTextSubmit}</button>
			</footer>
		</form>
	</div>
{/if}
