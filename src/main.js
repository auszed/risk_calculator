// import App from './App.svelte';
// import App from './ifelse.svelte';
// import App from './list_items.svelte';
import App from './counter__cliclk.svelte';




// we run a constant
const app = new App({
	target: document.body,
	props: {
		// add the number
		risk: 5
	}
});

export default app;