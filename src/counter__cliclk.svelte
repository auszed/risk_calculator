<script>
	let count = 0

	function handle_click(event, stepSize = 1) {
		console.log(event)
		count += stepSize
	}
</script>


<main>
	
	<!-- listen to events-->
	<!-- the code its inline -->
	<button on:click={() =>(count = count + 1)}> Count {count}</button>

	<!-- ussing the function to run the code -->
	<button on:click={(event) => handle_click(event)}> Count with a function {count}</button>

		<!-- here we add a function with some variables inside of it -->
	<button on:click={(event) => handle_click(event, 10)}> Count with a function {count}</button>
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

