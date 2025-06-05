<script lang="ts">
	import Dashboard from '$lib/components/Dashboard.svelte';

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

<!-- This must be here otherwide it doesnt work-->
<Dashboard {data} />
