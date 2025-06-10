<script lang="ts">
	import Transactions from '$lib/components/Transactions.svelte';

	type Transaction = {
		id: number;
		amount: string;
		category: string;
		description: string;
		direction: 'in' | 'out';
		receiver_account: string;
		receiver_user_id: number | null;
		reciever_name: string;
		sender_account_id: number;
		timestamp: string | Date;
	};

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
		transactions: Transaction[];
	};
</script>

<Transactions {data} />
