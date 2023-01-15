<script lang="ts">
	import { ValidationMessage } from '@felte/reporter-svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export let inputAttributes: HTMLInputAttributes & { id: string };
	export let labelText: string;
	export let value: any = undefined;
</script>

<label for={inputAttributes.id}>
	<span>{labelText}</span>
	<ValidationMessage for={inputAttributes.id} let:messages>
		{#if messages}<span class="text-error-700">{messages}</span>{/if}
		<slot name="placeholder" slot="placeholder" {value} />
	</ValidationMessage>
	<input type="number" bind:value name={inputAttributes.id} {...inputAttributes} />
</label>
