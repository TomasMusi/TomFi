<script lang="ts">
	import Wallet from '$lib/components/Wallet.svelte';

	export let data: {
		user: {
			id: number;
			email: string;
			Name: string;
			user_profile_picture: string;
		};
		decoded: any;
	};
</script>

<Wallet {data} />
