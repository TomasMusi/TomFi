<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Chart, { Legend } from 'chart.js/auto';
	import { onMount, onDestroy } from 'svelte';
	//

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

	// Chart.JS money in | Money out

	// Group data for chart
	let labels: string[] = [];
	let moneyIn: number[] = [];
	let moneyOut: number[] = [];

	onMount(() => {
		const dailyMap = new Map<string, { in: number; out: number }>();

		for (const trx of data.transactions) {
			const date = new Date(trx.timestamp).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric'
			});

			const entry = dailyMap.get(date) || { in: 0, out: 0 };
			const amount = parseFloat(trx.amount);

			if (trx.direction === 'in') {
				entry.in += amount;
			} else {
				entry.out += amount;
			}

			dailyMap.set(date, entry);
		}

		// Sort dates descending and take only the latest 4
		const sortedDates = Array.from(dailyMap.keys())
			.sort((a, b) => {
				// Convert strings back to real dates for sorting
				return new Date(b).getTime() - new Date(a).getTime();
			})
			.slice(0, 4)
			.reverse(); // reverse to show in chronological order

		labels = sortedDates;
		moneyIn = sortedDates.map((date) => dailyMap.get(date)?.in || 0);
		moneyOut = sortedDates.map((date) => dailyMap.get(date)?.out || 0);

		const ctx = document.getElementById('sorted') as HTMLCanvasElement;

		if (ctx) {
			new Chart(ctx, {
				type: 'bar',
				data: {
					labels,
					datasets: [
						{
							label: 'Money In',
							data: moneyIn,
							backgroundColor: '#14b8a6' // teal
						},
						{
							label: 'Money Out',
							data: moneyOut,
							backgroundColor: '#f97316' // orange
						}
					]
				},
				options: {
					responsive: true,
					scales: {
						y: {
							beginAtZero: true,
							title: { display: true, text: 'Amount' }
						},
						x: {
							title: { display: true, text: 'Date' }
						}
					},
					plugins: {
						legend: {
							display: true,
							position: 'top'
						},
						tooltip: {
							enabled: true
						},
						title: {
							display: false,
							text: 'Money In vs Money Out'
						}
					}
				}
			});
		}
	});

	// Chart.JS

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

	//
	const isActive = data.card.is_active === 1;

	let isOpen = false;
	let isSidebarOpen = false;

	function toggleDropdown(event: MouseEvent) {
		event.stopPropagation();
		isOpen = !isOpen;
	}

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}

	function Logout() {
		goto('/api/logout');
	}

	function closeDropdown() {
		isOpen = false;
	}

	onMount(() => {
		if (browser) {
			window.addEventListener('click', closeDropdown);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('click', closeDropdown);
		}
	});
</script>

<!-- Full Page Container -->
<div class="flex h-screen items-center justify-center bg-gray-100">
	<div
		class="relative flex h-[70vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl lg:flex-row"
	>
		<!-- Mobile Sidebar Toggle Button -->
		<button
			class="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-md bg-white p-2 shadow lg:hidden"
			onclick={toggleSidebar}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 text-gray-700"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
			<span class="text-sm font-medium text-gray-700">Menu</span>
		</button>

		<!-- Sidebar -->
		<aside
			class={`absolute top-0 left-0 z-10 h-full w-64 transform bg-white p-6 shadow-md transition-transform duration-300 ease-in-out lg:static lg:flex lg:translate-x-0 lg:flex-col ${
				isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
			}`}
		>
			<h2
				class="mb-6 bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-xl font-bold text-transparent"
			>
				TomFi
			</h2>
			<nav class="flex flex-col space-y-2 overflow-y-auto text-gray-700">
				<a href="/dashboard" class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow"
					>Dashboard</a
				>
				<a href="/dashboard/transactions" class="px-4 py-2 hover:text-blue-600">Transactions</a>
				<a href="/dashboard/mail" class="px-4 py-2 hover:text-blue-600">Mail</a>
				<a href="/dashboard/Wallet" class="px-4 py-2 hover:text-blue-600">Wallet</a>
				<a href="/dashboard/profile" class="px-4 py-2 hover:text-blue-600">Settings</a>
			</nav>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 space-y-6 overflow-y-auto bg-gray-50 p-6 sm:p-10">
			<!-- Header -->
			<div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
				<h1 class="text-2xl font-bold text-gray-800">Welcome {data.user.Name}!</h1>
				<div class="flex items-center gap-4">
					<input
						type="text"
						placeholder="Search..."
						class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none md:w-64"
					/>
					<div class="relative">
						<button onclick={toggleDropdown}>
							<img
								src={data.user.user_profile_picture}
								alt="User"
								class="h-10 w-10 rounded-full ring-2 ring-blue-500"
							/>
						</button>
						{#if isOpen}
							<div
								class="absolute right-0 z-50 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-blue-500"
							>
								<div class="border-b border-blue-100 p-4">
									<p class="text-sm font-medium text-gray-800">{data.user.Name}</p>
									<p class="text-xs text-gray-500">{data.user.email}</p>
								</div>
								<ul class="divide-y divide-blue-100 text-sm text-gray-700">
									<li>
										<a href="/dashboard" class="block px-4 py-2 hover:bg-blue-50">Dashboard</a>
									</li>
									<li>
										<a href="/dashboard/transactions" class="block px-4 py-2 hover:bg-blue-50"
											>Transactions</a
										>
									</li>
									<li>
										<a href="/dashboard/mail" class="block px-4 py-2 hover:bg-blue-50">Mail</a>
									</li>
									<li>
										<a href="#" class="block px-4 py-2 text-red-600" onclick={Logout}>Logout</a>
									</li>
								</ul>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Cards Section -->
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div class="rounded-xl bg-white p-6 shadow-md">
					<p class="mb-4 font-semibold text-gray-700">Expenses by category</p>
					<div class="flex h-48 items-center justify-center rounded-lg bg-gray-100">
						{#if data.transactions.length > 0}
							<canvas id="acquisitions"></canvas>
						{:else}
							<p class="text-sm text-gray-500 italic">Don't have enough data!</p>
						{/if}
					</div>
				</div>
				<div class="rounded-xl bg-white p-6 shadow-md">
					<p class="mb-4 font-semibold text-gray-700">Transactions</p>
					<ul class="space-y-2 text-sm text-gray-600">
						{#if data.transactions}
							{#each data.transactions.slice(0, 3) as tx}
								<li class="flex justify-between">
									{tx.description.length > 25
										? `${tx.description.slice(0, 25)}...`
										: tx.description}
									<span class={tx.direction === 'out' ? 'text-red-500' : 'text-green-500'}>
										{tx.direction === 'out' ? '-' : '+'}${parseFloat(tx.amount).toFixed(2)}
									</span>
								</li>
							{/each}
						{:else}
							<li class="text-gray-400 italic">No transactions available</li>
						{/if}
					</ul>
				</div>

				<div
					class="relative mx-auto w-full max-w-7xl space-y-4 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 p-6 text-white shadow-lg"
				>
					<!-- Status Badge -->
					<div class="absolute top-4 right-4">
						{#if isActive}
							<span
								class="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
							>
								✅ Active
							</span>
						{:else}
							<span
								class="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800"
							>
								❌ Deactivated
							</span>
						{/if}
					</div>

					<!-- Balance -->
					<div class="text-3xl font-bold">${data.card.balance}</div>

					<!-- Card Number -->
					<div class="mt-4 font-mono text-lg tracking-widest">{data.card.card_number}</div>

					<!-- Expiry & CVV -->
					<div class="mt-4 flex justify-between text-sm text-gray-100">
						<div>
							<p class="text-xs">EXPIRES</p>
							<p class="text-white">12/24</p>
						</div>
						<div>
							<p class="text-xs">CVV</p>
							<p class="text-white">***</p>
						</div>
					</div>

					<!-- Cardholder -->
					<div class="mt-6 text-sm">
						<p class="text-gray-200">Cardholder</p>
						<p class="font-medium">{data.user.Name}</p>
					</div>

					<!-- Button -->
					<div class="w-full pt-4 md:flex md:justify-end">
						<button
							onclick={openCardQRModal}
							class="w-full rounded-lg bg-white/10 px-6 py-2 text-sm font-medium text-white transition hover:bg-white/20 md:w-auto"
						>
							+ New transaction
						</button>
					</div>
				</div>
			</div>

			<!-- Analytics Section -->
			<div class="rounded-xl bg-white p-6 shadow-md">
				<h2 class="mb-4 text-lg font-bold text-gray-800">Analytics</h2>

				{#if data.transactions.length > 0}
					<div class="relative w-full overflow-x-auto">
						<div class="relative mx-auto w-full max-w-3xl">
							<canvas class="h-auto w-full" id="sorted"></canvas>
						</div>
					</div>
				{:else}
					<p class="text-center text-sm text-gray-500 italic">
						Not enough transaction data to generate chart.
					</p>
				{/if}
			</div>
		</main>
	</div>
</div>
