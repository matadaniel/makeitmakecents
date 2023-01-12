<script lang="ts">
	export let id: string;
	export let labelText: string;
</script>

<label for={id}>
	<span>{labelText}</span>
	<input {...$$props} />
</label>
