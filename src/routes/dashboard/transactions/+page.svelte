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
		card: {
			card_number: string;
			balance: string;
			pin_hash: string;
			is_active: number;
		};
	};
</script>

<Transactions {data} />
