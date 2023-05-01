<script>
	// export let risk;
    const num = -5
</script>

<main>
	{#if num === 0}
        {num + 5}
	{:else if num < 0}
        <h3>menor que 0</h3>
    {:else if num > 0}
        <h3>mayor que  {num * 5}</h3>
    {:else}
        <h4>000</h4>

    {/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		border:  0;
		padding: 0;
		margin: 0;
		
	}

	.title_text {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 3em;
		font-weight: 100;
		font-weight: bold;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	input{
		background-color: rgb(88, 88, 88);
		color: #ff3e00;
		font-size:  2em;
		font-weight: bold;
		border: none;
		text-align: center;
	}
	label{
		font-size:  1.5em;
		font-weight: bold;
	}

	.flex-container {
		display: flex;
		flex-wrap: wrap;
		}
		
	.flex-item {
  		flex: 1 0 10%;
		margin: 10px;
		height: 100px;
	}

</style>