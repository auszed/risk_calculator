<script>
	
	const form_values = {
		name: 'dfjy',
		number: 5,
		profile_summary: '',
		country: '',
		job_location : [],
		remote_work: false,
		skillset: [],
		years_experience: ''
	}


	// function for the submit
	function submitForm(event){

		console.log(form_values)
	}

</script>


<main>
	<div>
		<pre>
			<!-- JSON.stringify == is a JavaScript method that converts a JavaScript object or value to a JSON string.  -->
			{JSON.stringify(form_values,null,8)}

		</pre>
	</div>
	<!-- when the boton its clicked create an evente called submit Submit -->
	<!-- preventDefault to refresh the site -->
	<form action="" on:submitpreventDefault={submitForm}>
			<label for="name">name</label>
			<!-- bind == This allows changes to the parent component's variable to automatically update the child component's property, and vice versa. -->
			<input type="text" id="name" bind:value={form_values.name}> 
			<input type="number" id="name" bind:value={form_values.number}> 


			<!-- profile summary -->
			<div>
				<label for="profile">profile summary</label>
				<textarea id="profile" cols="100" rows="1" bind:value={form_values.profile_summary}></textarea>
			</div>

			<!-- which country-->
			<div>
				<label for="country">country</label>
				<select name="" id="country" bind:value={form_values.country}>
					<option value="">select a value</option>
					<option value="india">india</option>
					<option value="malasia">malasia</option>
					<option value="japon">japon</option>
				</select>
			</div>

			<!-- job_location -->
			<!-- here we are allow to select multiple values -->
			<!-- we selected using control and click -->
			<div>
				<label for="job_location">job_location</label>
				<select name="" id="job_location" bind:value={form_values.job_location} multiple>
					<option value="">select a value</option>
					<option value="india">india</option>
					<option value="malasia">malasia</option>
					<option value="japon">japon</option>
				</select>
			</div>

			<!-- remote work -->

			<div>
				<input type="checkbox" id="remote_work" bind:checked={form_values.remote_work}>
				<label for="remote_work">open to work remote?</label>
			</div>

			<!-- skillset -->
			<div>
				<label for="skillset">skillset</label>
				<input type="checkbox" id="html" bind:group={form_values.skillset} value="html">
				<label for="html">html</label>
				<input type="checkbox" id="css" bind:group={form_values.skillset} value="css">
				<label for="css">css</label>
				<input type="checkbox" id="javascript" bind:group={form_values.skillset} value="javascript">
				<label for="javascript">javascript</label>
			</div>

			<!-- years_experience -->
			<!-- unique selection -->
			<div>
				<label for="years_experience">years_experience</label>
				<input type="radio" id="0-2" bind:group={form_values.years_experience} value="0-2">
				<label for="0-2">0-2</label>
				<input type="radio" id="3-5" bind:group={form_values.years_experience} value="3-5">
				<label for="3-5">3-5</label>
			</div>

			<!-- submut botton -->
			<div>
				<button>Submit</button>
			</div>
	</form>
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

