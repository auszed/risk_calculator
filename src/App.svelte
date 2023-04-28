<script>
	export let risk;
	let name = "<b>Example html code <b>"
	let title_text = "title_text"
</script>

<main>
	<h1 class={title_text}>Risk calculator</h1>


	<!-- 1st 2 secctions -->
	<div style="display: flex;">
		<div style="flex: 1;">
			<label for="risk">Amount of Risk:    </label>
			<input type="number" id="risk" name="risk" class="form-control" value="200"><br>
		</div>
		<div style="flex: 1; ">
			<!-- this its an example on how it looks -->
			<!-- <label for="target">Target in R 1:{risk}</label> -->
			<label for="target">Target in R 1:</label>
			<input type="number" id="target" name="target" class="form-control" value="5"><br>
		</div>
	</div>

	<!-- 1st row -->
	<div class="flex-container">
		<div class="flex-item">
			<label for="risk">Amount of Risk:</label>
			<input type="number" id="risk" name="risk" class="form-control" value="200"><br>
		</div>
		<div class="flex-item">
			<label for="target">Target in R 1:{risk}</label>
			<input type="number" id="target" name="target" class="form-control" value="5"><br>
		</div>
		<div class="flex-item">
			<label for="target">Target in R 1:{risk}</label>
			<input type="number" id="target" name="target" class="form-control" value="5"><br>
		</div>
	</div>

	<!-- 2nd row -->
	<div class="flex-container">
		<div class="flex-item">
			<label for="risk">Amount of Risk:</label>
			<input type="number" id="risk" name="risk" class="form-control" value="200"><br>
		</div>
		<div class="flex-item">
			<label for="target">Target in R 1:{risk}</label>
			<input type="number" id="target" name="target" class="form-control" value="5"><br>
		</div>
		<div class="flex-item">
			<label for="target">Target in R 1:{risk}</label>
			<input type="number" id="target" name="target" class="form-control" value="5"><br>
		</div>
	</div>


	<!-- 3rt row -->
	<div class="flex-container">
		<div class="flex-item">
			<label for="risk">Amount of Risk:</label>
			<input type="number" id="risk" name="risk" class="form-control" value="200"><br>
		</div>
		<div class="flex-item">
			<label for="target">Target in R 1:{risk}</label>
			<input type="number" id="target" name="target" class="form-control" value="5"><br>
		</div>
		<div class="flex-item">
			<label for="target">Target in R 1:{risk}</label>
			<input type="number" id="target" name="target" class="form-control" value="5"><br>
		</div>
	</div>



	<!-- 4rt row -->
	<div class="flex-container">
		<div class="flex-item">
			<label for="risk">Amount of Risk:</label>
			<input type="number" id="risk" name="risk" class="form-control" value="200"><br>
		</div>
		<div class="flex-item">
			<label for="target">Target in R 1:{risk}</label>
			<input type="number" id="target" name="target" class="form-control" value="5"><br>
		</div>
		<div class="flex-item">
			<label for="target">Target in R 1:{risk}</label>
			<input type="number" id="target" name="target" class="form-control" value="5"><br>
		</div>
	</div>

	<!-- add @html so we can see the html variable -->
	<p>{@html name}</p>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
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