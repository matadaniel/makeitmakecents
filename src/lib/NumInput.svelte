<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	export let inputAttributes: HTMLInputAttributes & { id: string };
	export let labelText: string;
	export let value: any = undefined;
</script>

<label for={inputAttributes.id}>
	<span>{labelText}</span>
	<input type="number" bind:value {...inputAttributes} />
</label>
