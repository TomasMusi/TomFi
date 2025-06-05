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
		card: {
			card_number: string;
			balance: string;
			pin_hash: string;
			is_active: number;
		};
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
				<a href="/dashboard/transactions" class="px-4 py-2 hover:text-blue-600">Transactions</a>
				<a href="/dashboard/mail" class="px-4 py-2 hover:text-blue-600">Mail</a>
				<a
					href="/dashboard/Wallet"
					class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow">Wallet</a
				>
				<a href="/dashboard/profile" class="px-4 py-2 hover:text-blue-600">Settings</a>
			</nav>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 space-y-6 overflow-y-auto bg-gray-50 p-6 sm:p-10">
			<!-- Header -->
			<div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
				<h1 class="text-2xl font-bold text-gray-800">Wallet</h1>
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

			<div
				class="mx-auto w-full max-w-7xl space-y-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg"
			>
				<!-- Balance -->
				<div class="text-3xl font-semibold">${data.card.balance}</div>

				<!-- Card Details -->
				<div class="flex flex-col text-lg tracking-widest md:flex-row md:justify-between">
					<div>{data.card.card_number}</div>
					<div class="mt-2 flex gap-8 text-sm text-gray-200 md:mt-0">
						<div>
							<p>EXPIRES</p>
							<p class="text-white">12/24</p>
						</div>
						<div>
							<p>CVV</p>
							<p class="text-white">***</p>
						</div>
					</div>
				</div>

				<!-- Cardholder -->
				<div class="text-sm">
					<p class="text-gray-200">Cardholder</p>
					<p class="font-medium">{data.user.Name}</p>
				</div>

				<!-- Button: Responsive position -->
				<div class="w-full md:flex md:justify-end">
					<button
						class="mt-2 w-full rounded-lg bg-indigo-500 px-6 py-2 font-medium hover:bg-indigo-600 md:w-auto"
					>
						+ New transaction
					</button>
				</div>
			</div>

			<!-- Icon Button Panel -->
			<div class="mt-6 grid grid-cols-2 gap-4 text-center sm:grid-cols-3 md:grid-cols-6">
				<!-- Existing buttons ... -->
				<!-- Transfer -->
				<button
					class="flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow hover:bg-gray-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mb-1 h-6 w-6 text-blue-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2M7 16H5a2 2 0 01-2-2v-6a2 2 0 012-2h2m10 0l-4-4m0 0L7 8m4-4v12"
						/>
					</svg>
					<span class="text-sm font-medium text-gray-700">Transfer</span>
				</button>

				<!-- Show PIN -->
				<button
					class="flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow hover:bg-gray-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mb-1 h-6 w-6 text-indigo-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12h2m-6 4h6m2 0a2 2 0 002-2V8a2 2 0 00-2-2h-1.5"
						/>
					</svg>
					<span class="text-sm font-medium text-gray-700">Show PIN</span>
				</button>

				<!-- Deposit -->
				<button
					class="flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow hover:bg-gray-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mb-1 h-6 w-6 text-green-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8c1.5 0 4 1 4 3s-2.5 3-4 3-4-1-4-3 2.5-3 4-3zm0-6v4m0 12v4m-7-4h14"
						/>
					</svg>
					<span class="text-sm font-medium text-gray-700">Deposit</span>
				</button>

				<!-- Deactivate -->
				<button
					class="flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow hover:bg-gray-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mb-1 h-6 w-6 text-red-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
					<span class="text-sm font-medium text-gray-700">Deactivate</span>
				</button>

				<!-- Info -->
				<button
					class="flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow hover:bg-gray-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mb-1 h-6 w-6 text-yellow-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
						/>
					</svg>
					<span class="text-sm font-medium text-gray-700">Info</span>
				</button>

				<!-- QR Code -->
				<button
					class="flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow hover:bg-gray-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mb-1 h-6 w-6 text-purple-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 3h4v4H3V3zm0 14h4v4H3v-4zm14-14h4v4h-4V3zm0 14h4v4h-4v-4zM9 9h6v6H9V9z"
						/>
					</svg>
					<span class="text-sm font-medium text-gray-700">QR Code</span>
				</button>
			</div>
		</main>
	</div>
</div>
