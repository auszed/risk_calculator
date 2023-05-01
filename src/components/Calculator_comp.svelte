<script>
	let risk = 200
	let ratio_value = 5


	let symbol_val = "MES"

	const symbol_values = [
		{Symbol: 'MES'	, value_in_money:	'5'},
		{Symbol: 'MNQ'	, value_in_money:	'2'},
		{Symbol: 'MYM'	, value_in_money:	'1'},	
		{Symbol: 'M2K'	, value_in_money:	'5'},
		{Symbol: 'FDXS', value_in_money:	'1'},	
		{Symbol: 'FSXE', value_in_money:	'1'},
		{Symbol: 'ES'	, value_in_money:	'50'},
		{Symbol: 'NQ'	, value_in_money:	'20'},
		{Symbol: 'YM'	, value_in_money:	'5'},
		{Symbol: 'RTY'	, value_in_money:	'50'},
		{Symbol: 'EMD'	, value_in_money:	'100'},
		{Symbol: 'NKD'	, value_in_money:	'25'},
		{Symbol: 'CL'	, value_in_money:	'1000'},
		{Symbol: 'QM'	, value_in_money:	'500'},
		{Symbol: 'MCL'	, value_in_money:	'100'},
		{Symbol: 'NG'	, value_in_money:	'10000'},
		{Symbol: 'QG'	, value_in_money:	'2500'},
		{Symbol: 'RB'	, value_in_money:	'42000'},
		{Symbol: 'HO'	, value_in_money:	'42000'},
		{Symbol: 'B'	, value_in_money:	'1000'},
		{Symbol: 'T'	, value_in_money:	'1000'},
		{Symbol: 'G'	, value_in_money:	'20'},
		]


	let stop_points_validation = 10
	let contracts_loaded = 2
	let risk_configuration = 3

	let symbol_find_value = symbol_values.find(obj => obj.Symbol === symbol_val).value_in_money;
    let value_in_money = symbol_values.find(obj => obj.Symbol === symbol_val).value_in_money;

    function handleSelect(event) {
        symbol_val = event.target.value;
        symbol_find_value = symbol_values.find(obj => obj.Symbol === symbol_val).value_in_money;
        value_in_money = symbol_find_value;
    }


	let volume = 0
	$: if (volume < 0) {
		alert("can't go lower")
		// volume = 0
	}else if (volume > 10){
		alert("can't go higher")
		volume = 10
	}
</script>

<main>

	


	<div >
		<div >
			<label for="risk">💶 Risk 💶: </label>
			<input type="number" id="risk" name="risk" bind:value={risk}> <br>
		</div>
		<div >
			<!-- this its an example on how it looks -->
			<!-- <label for="target">Target in R 1:{risk}</label> -->
			<label for="target"> 🎯Min target in R:{risk_configuration}🎯</label>
			<input type="number" id="target" name="target" bind:value={ratio_value}><br>
		</div>
	</div>


	<!-- symbol selection -->
	<div>
		<label for="symbol">🛒Symbol selection🛒</label>
		<!-- <select name="" id="symbol" bind:value={symbol_val} on:change={handleInput} > -->
			<select on:change={handleSelect}>
				{#each symbol_values as symbol}
				  <option value={symbol.Symbol} selected={symbol_val === symbol.Symbol}>{symbol.Symbol}</option>
				{/each}
			</select>
	</div>


	<!-- Stop in points -->
	<label for="stop_points_validation">🚫Stop in points🚫</label>
	<input type="number" id="stop_points_validation" bind:value={stop_points_validation}> 

	<!-- contracts loaded -->
	<label for="contracts_loaded">📜Contracts load📜</label>
	<input type="number" id="contracts_loaded" bind:value={contracts_loaded}> 

	<!-- risk_configuration -->
	<label for="risk_configuration">📈Minimum risk📈</label>
	<input type="number" id="risk_configuration" bind:value={risk_configuration}> 

	{#if contracts_loaded ||  stop_points_validation} 
	<p>total points in cash</p>
	<h1>{(contracts_loaded * stop_points_validation) * value_in_money} $</h1>
	{/if}

	

	{#if contracts_loaded ||  stop_points_validation} 
	<p>total poins</p>
	<h1>{contracts_loaded * stop_points_validation}</h1>
	{/if}

	<!-- <h1>Symbol: {symbol_val}, Symbol Find Value: {symbol_find_value}, Value in Money: {value_in_money}</h1> -->
    <p>Price per point: </p>
	<h1>{symbol_find_value} $</h1>

	{#if risk ||  value_in_money || stop_points_validation} 
	<p>contracts need from the risk</p>
	<h1> {risk/(value_in_money * stop_points_validation )}</h1>

	{/if} 


	
	{#if risk_configuration ||  stop_points_validation} 
	<p>risk ratio {risk_configuration} : 1</p>
	<h1> {risk_configuration * stop_points_validation}</h1>

	{/if} 
	

		
	<h2>current volume: {volume}</h2>
	<button on:click={() => (volume += 1 )}> increase volume</button>
	<button on:click={() => (volume -= 1 )}> decrease volume</button>




</main>

<style>

	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
		border:  0;
		padding: 0;
		margin: 0;
		
		
	}

	
	div{
		width: 100%;
	}
	

	input, select{
		background-color: rgb(88, 88, 88);
		color: rgb(255, 238, 0);
		font-size:  2em;
		font-weight: bold;
		border: none;
		text-align: center;
		padding: 0;
		margin: 2px;

	}
	label{
		font-size:  1.2em;
		margin: 0px;
		text-align: center;
	}

	p, h1{
		margin: 2px;
	}

	

</style>