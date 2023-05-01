<script>
	let symbol_val = "RTY";


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
	];

	
	// const finish = symbol_values.find(obj => obj.Symbol === symbol_val).value_in_money;
    // console.log(finish);


    let symbol_find_value = symbol_values.find(obj => obj.Symbol === symbol_val).value_in_money;
    let value_in_money = symbol_values.find(obj => obj.Symbol === symbol_val).value_in_money;

    function handleSelect(event) {
        symbol_val = event.target.value;
        symbol_find_value = symbol_values.find(obj => obj.Symbol === symbol_val).value_in_money;
        value_in_money = symbol_find_value;
    }
</script>
<main>
    <select on:change={handleSelect}>
        {#each symbol_values as symbol}
          <option value={symbol.Symbol} selected={symbol_val === symbol.Symbol}>{symbol.Symbol}</option>
        {/each}
    </select>

      <h2>Symbol: {symbol_val}, Symbol Find Value: {symbol_find_value}, Value in Money: {value_in_money}</h2>
</main>

<style>

</style>