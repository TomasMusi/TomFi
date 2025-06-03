<script lang="ts">
	import Transactions from '$lib/components/Transactions.svelte';

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

<Transactions {data} />
