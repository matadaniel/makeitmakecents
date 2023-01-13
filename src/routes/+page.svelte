<script lang="ts">
	import NumInput from '$lib/NumInput.svelte';

	let expenses: number;

	const handleSubmit = () => {};
</script>

<h1>Congratulations!!</h1>
<h2>An oil prince has just deposited $100,000 into your bank account!</h2>
<p>Are you able to sleep in tomorrow? And the day after that, and the day after that,</p>

<br />

<form on:submit|preventDefault={handleSubmit}>
	<NumInput
		inputAttributes={{ id: 'expenses', required: true }}
		labelText="Yearly Expenses:"
		bind:value={expenses}
	/>
	<button class="btn btn-filled-primary">Submit</button>
</form>
