<script lang="ts">
	import Mail from '$lib/components/Mail.svelte';

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

<Mail {data} />
