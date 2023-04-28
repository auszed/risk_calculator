<script>
	const  symbol_val =[
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
</script>


<main>
	<!-- we add the iteration and the index -->
	{#each symbol_val as value_iteretion, index}
	<h2>{index + 1} :  {value_iteretion.Symbol} == {value_iteretion.value_in_money} $, </h2>
	{/each}

	<!-- This could be an issue in the future -->
	<!-- https://www.youtube.com/watch?v=xUcbipS0rR0&list=PLC3y8-rFHvwiYZOsc2D8AO1MYwLjZQrKx&index=11 -->
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

