<script>
	let name = "jose"
	let last =  "ruiz"


	$:fullbane = `${name} ${last}`
	
	// items
	let items = [
		{
		id: 1,
		title: 'TV',
		price: 100
		},
		{
		id: 2,
		title: 'Phone',
		price: 200
		},
		{
		id: 3,
		title: 'Laptop',
		price: 300
		}
	]
 
	$: total_price = items.reduce((total, curr) => (total = total + curr.price), 0)

	// Statements

	// use statements to add the concatenated name
	// we add several statments
	$: {
		let greet = `full name ${name} ${last}`
		console.log(greet)
		
	}
	let volume = 0

	// vloume control between 0 and 20

	$: if (volume < 0) {
		alert("can't go lower")
		// volume = 0
	}else if (volume > 10){
		alert("can't go higher")
		volume = 10
	}
</script>

<main>


	<!-- -------------------------------------- -->
	<!-- declarations -->

	<!-- button for changin the name -->


	<h2>{fullbane}</h2>

	<button on:click={() => {
		name ='carlos'
		last = 'lopez'
	}}> change name</button>

	<h2>Total - {total_price}</h2>

	<button on:click={() => ( items = [...items, {id: 4, title:"keyboard", price:50}])}
		>change price</button>

	<!-- -------------------------------------- -->
	<!-- Statements -->

	<h2>current volume: {volume}</h2>
	<button on:click={() => (volume += 1 )}> increase volume</button>
	<button on:click={() => (volume -= 1 )}> decrease volume</button>





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

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
/* 
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
	} */


</style>