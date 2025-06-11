<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

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
	let friend = 0;
	let food = 0;
	let sports = 0;
	let other = 0;

	for (const trx of data.transactions) {
		switch (trx.category) {
			case 'Friend':
				friend++;
				break;
			case 'Food':
				food++;
				break;
			case 'Sports':
				sports++;
				break;
			default:
				other++;
				break;
		}
	}

	onMount(() => {
		const chartData = {
			labels: ['Friend', 'Food', 'Sports', 'Other'],
			datasets: [
				{
					label: 'Transaction Distribution',
					data: [friend, food, sports, other],
					backgroundColor: [
						'#4F46E5', // Friend – deep indigo (matches your dashboard button)
						'#FBBF24', // Food – warm amber (friendly contrast)
						'#34D399', // Sports – teal green (energetic but soft)
						'#A78BFA' // Other – soft purple (neutral and blends well)
					],
					borderColor: '#fff',
					borderWidth: 1
				}
			]
		};

		const ctx = document.getElementById('acquisitions');
		if (ctx) {
			new Chart(ctx, {
				type: 'pie',
				data: chartData,
				options: {
					responsive: true,
					maintainAspectRatio: true,
					plugins: {
						legend: {
							display: false // ❌ Hides legend
						},
						tooltip: {
							enabled: true // ✅ Keeps hover tooltip
						}
					}
				}
			});
		}
	});
</script>

{#if data.transactions.length > 0}
	<div style="width: 300px;">
		<canvas id="acquisitions"></canvas>
	</div>
{:else}
	<p class="text-sm text-gray-500 italic">Don't have enough data!</p>
{/if}
