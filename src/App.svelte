<script>
	// import Component_example from './components/Component_example.svelte'



	// risk calculator
	import Calculator_comp from './components/Calculator_comp.svelte'


	// reactive
	// import Reactive from './components/Reactive.svelte'


	// import Test from './components/Test.svelte'
</script>
	


<main>
	<!-- this its the way to write a compoennt -->

	<h1 id="title">💸 Risk Calculator</h1>
	<table style="margin: 0 auto;">
		<tr>
		  <th><Calculator_comp /> </th>
		  <th><Calculator_comp /> </th>
		  <th><Calculator_comp /> </th>
		  <th><Calculator_comp /> </tr>
		<tr>
	</table>


</main>




<style>
	main {
			text-align: center;
			padding: 0.2em;
			width: 100%;
			margin: 0 auto;
			border:  0;
			padding: 0;
			margin: 0;
			
		}
	#title{
		font-size: 3em;
	}
	
	h1{
		margin-top: 2px;
	}

</style>