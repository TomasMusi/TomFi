<script lang="ts">
	// Linked Components.
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Testimony from '$lib/components/Testimony.svelte';
	import Benefits from '$lib/components/Benefits.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import App from '$lib/components/App.svelte';

	export let data: {
		user: {
			id: number;
			email: string;
			Name: string;
			user_profile_picture: string;
		};
		decoded: any;
		logged: boolean;
	};
</script>

<Navbar {data} />
<Hero />
<App />
<Testimony />
<Benefits />
<Footer />
