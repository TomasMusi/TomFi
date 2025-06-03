<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	export let data: {
		user: {
			id: number;
			email: string;
			Name: string;
			user_profile_picture: string;
		};
		decoded: any;
	};

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

	import { onMount, onDestroy } from 'svelte';

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
				<a href="/dashboard" class="px-4 py-2 hover:text-blue-600">Dashboard</a>
				<a
					href="/dashboard/transactions"
					class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow">Transactions</a
				>
				<a href="/dashboard/mail" class="px-4 py-2 hover:text-blue-600">Mail</a>
				<a href="/dashboard/Wallet" class="px-4 py-2 hover:text-blue-600">Wallet</a>
				<a href="/dashboard/profile" class="px-4 py-2 hover:text-blue-600">Settings</a>
			</nav>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 space-y-6 overflow-y-auto bg-gray-50 p-6 sm:p-10">
			<!-- Header -->
			<div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
				<h1 class="text-2xl font-bold text-gray-800">Transactions</h1>
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

			<!-- Transactions Table -->
			<div class="rounded-xl bg-white p-6 shadow-md">
				<h2 class="mb-4 text-lg font-bold text-gray-800">Your Recent Transactions</h2>
				<div class="overflow-auto rounded-lg border border-gray-200">
					<table class="min-w-full bg-white">
						<thead class="bg-gray-100 text-gray-700">
							<tr>
								<th class="px-6 py-3 text-left text-sm font-medium">Date</th>
								<th class="px-6 py-3 text-left text-sm font-medium">Description</th>
								<th class="px-6 py-3 text-left text-sm font-medium">Category</th>
								<th class="px-6 py-3 text-left text-sm font-medium">Amount</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 text-sm text-gray-700">
							<tr>
								<td class="px-6 py-4 whitespace-nowrap">May 28, 2025</td>
								<td class="px-6 py-4 whitespace-nowrap">Uber Eats</td>
								<td class="px-6 py-4 whitespace-nowrap">Food</td>
								<td class="px-6 py-4 whitespace-nowrap text-red-500">-$23.10</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap">May 26, 2025</td>
								<td class="px-6 py-4 whitespace-nowrap">Gym Membership</td>
								<td class="px-6 py-4 whitespace-nowrap">Health</td>
								<td class="px-6 py-4 whitespace-nowrap text-red-500">-$150.00</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap">May 25, 2025</td>
								<td class="px-6 py-4 whitespace-nowrap">Salary</td>
								<td class="px-6 py-4 whitespace-nowrap">Income</td>
								<td class="px-6 py-4 whitespace-nowrap text-green-500">+$5,000.00</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap">May 25, 2025</td>
								<td class="px-6 py-4 whitespace-nowrap">Salary</td>
								<td class="px-6 py-4 whitespace-nowrap">Income</td>
								<td class="px-6 py-4 whitespace-nowrap text-green-500">+$5,000.00</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap">May 25, 2025</td>
								<td class="px-6 py-4 whitespace-nowrap">Salary</td>
								<td class="px-6 py-4 whitespace-nowrap">Income</td>
								<td class="px-6 py-4 whitespace-nowrap text-green-500">+$5,000.00</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap">May 25, 2025</td>
								<td class="px-6 py-4 whitespace-nowrap">Salary</td>
								<td class="px-6 py-4 whitespace-nowrap">Income</td>
								<td class="px-6 py-4 whitespace-nowrap text-green-500">+$5,000.00</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap">May 25, 2025</td>
								<td class="px-6 py-4 whitespace-nowrap">Salary</td>
								<td class="px-6 py-4 whitespace-nowrap">Income</td>
								<td class="px-6 py-4 whitespace-nowrap text-green-500">+$5,000.00</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap">May 25, 2025</td>
								<td class="px-6 py-4 whitespace-nowrap">Salary</td>
								<td class="px-6 py-4 whitespace-nowrap">Income</td>
								<td class="px-6 py-4 whitespace-nowrap text-green-500">+$5,000.00</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap">May 25, 2025</td>
								<td class="px-6 py-4 whitespace-nowrap">Salary</td>
								<td class="px-6 py-4 whitespace-nowrap">Income</td>
								<td class="px-6 py-4 whitespace-nowrap text-green-500">+$5,000.00</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap">May 25, 2025</td>
								<td class="px-6 py-4 whitespace-nowrap">Salary</td>
								<td class="px-6 py-4 whitespace-nowrap">Income</td>
								<td class="px-6 py-4 whitespace-nowrap text-green-500">+$5,000.00</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap">May 25, 2025</td>
								<td class="px-6 py-4 whitespace-nowrap">Salary</td>
								<td class="px-6 py-4 whitespace-nowrap">Income</td>
								<td class="px-6 py-4 whitespace-nowrap text-green-500">+$5,000.00</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</main>
	</div>
</div>
