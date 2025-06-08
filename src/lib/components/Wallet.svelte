<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { showError, showSucess } from '$lib/alerts';

	// Add funds to your account Function Code

	let showAddFundsModal = false;
	let fundAmount = '';

	function openAddFundsModal() {
		showAddFundsModal = true;
	}

	function closeAddFundsModal() {
		showAddFundsModal = false;
		fundAmount = '';
	}

	async function appendFunds() {
		const parsedAmount = Number(fundAmount);

		const response = await fetch('/api/Deposit', {
			method: 'POST',
			body: JSON.stringify({ money: parsedAmount }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok) {
			showSucess('Succesfully added funds!');
			closeAddFundsModal();
			window.location.reload();
		} else {
			showError('Failed to add your funds!');
			closeAddFundsModal();
		}
	}

	// Show Transaction Function code

	let showCardQRModal = false;
	let qrCodeUrl: string | null = null;
	let selectedMethod: 'card' | 'qr' | null = null;

	let cardNumber = '';
	let pin = '';
	let amount = '';
	let username = '';
	let description = '';
	let selectedCategories: string[] = [];

	// Mock latest sent transactions
	const latestTransactions = [
		{ recipient: 'johndoe', amount: 150, date: '2025-06-06' },
		{ recipient: 'sarah88', amount: 45.75, date: '2025-06-05' },
		{ recipient: 'michael99', amount: 220, date: '2025-06-03' }
	];

	const categories = ['Friend', 'Food', 'Sports', 'Other'];

	function openCardQRModal() {
		showCardQRModal = true;
	}

	function closeCardQRModal() {
		showCardQRModal = false;
		qrCodeUrl = null;
		selectedMethod = null;
		cardNumber = '';
		pin = '';
		amount = '';
		username = '';
		description = '';
		selectedCategories = [];
	}

	function handleQRFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			qrCodeUrl = URL.createObjectURL(file);
		}
	}

	// Show QR Code Function

	let showQRPrompt = false;
	let showQRImage = false;
	let qrImageUrl: string | null = null;

	let showErrorModalQR = false;
	let errorMessageQR: string | null = null;

	function closeErrorModalQR() {
		showErrorModalQR = false;
		errorMessageQR = null;
	}

	function openQRPrompt() {
		showQRPrompt = true;
	}

	function closeQRPrompt() {
		showQRPrompt = false;
	}

	function closeQRImageModal() {
		showQRImage = false;
		qrImageUrl = null;
	}

	async function confirmGenerateQR() {
		closeQRPrompt();

		const response = await fetch('/api/qrcode');
		const result = await response.json();

		if (response.ok && result.qrCode) {
			qrImageUrl = result.qrCode;
			showQRImage = true;
		} else {
			errorMessageQR = 'Failed to generate QR code.';
			showErrorModalQR = true;
		}
	}

	// Show Pin Function.

	let showModal = false;
	let showPinModal = false;
	let password = '';
	let decryptedPin: string | null = null;

	let showErrorModal = false;
	let errorMessage: string | null = null;

	function closeErrorModal() {
		showErrorModal = false;
		errorMessage = null;
	}

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		password = '';
	}

	function closePinModal() {
		showPinModal = false;
		decryptedPin = null;
	}

	async function submitPassword() {
		const response = await fetch('/api/SeePin', {
			method: 'POST',
			body: JSON.stringify({ password }),
			headers: {
				'content-type': 'application/json'
			}
		});

		const result = await response.json();

		if (response.ok) {
			decryptedPin = result.pin;
			closeModal(); // close password modal
			showPinModal = true; // open pin modal
		} else {
			errorMessage = result.error || 'Unknown error occurred.';
			closeModal(); // close password modal
			showErrorModal = true; // show error modal
		}
	}

	// Set Card Status

	async function SetCardStatus() {
		console.log('Funguju');

		const response = await fetch(`/api/setCardStatus`, {
			method: 'GET'
		});

		if (response.ok) {
			window.location.reload();
		}
	}

	// Data From DB.

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

	const isActive = data.card.is_active === 1;

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
				class="relative mx-auto w-full max-w-7xl space-y-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg"
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
						onclick={openCardQRModal}
						class="mt-2 w-full rounded-lg bg-indigo-500 px-6 py-2 font-medium hover:bg-indigo-600 md:w-auto"
					>
						+ New transaction
					</button>
				</div>
			</div>

			<!-- Icon Button Panel -->
			<div class="mt-6 grid grid-cols-2 gap-4 text-center sm:grid-cols-3 md:grid-cols-6">
				<!-- Transfer -->
				<button
					onclick={openCardQRModal}
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
					onclick={openModal}
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
					onclick={openAddFundsModal}
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

				{#if isActive}
					<!-- Deactivate Button -->
					<button
						onclick={SetCardStatus}
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
				{:else}
					<!-- Activate Button -->
					<button
						onclick={SetCardStatus}
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
								d="M5 13l4 4L19 7"
							/>
						</svg>
						<span class="text-sm font-medium text-gray-700">Activate</span>
					</button>
				{/if}

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
					onclick={openQRPrompt}
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

<!-- If statements for PIN. -->
{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
		onclick={closeModal}
	>
		<!-- Modal container -->
		<div
			onclick={(event) => event.stopPropagation()}
			class="relative w-[90%] max-w-lg rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-200 transition-all sm:p-10"
		>
			<!-- Close icon -->
			<button
				onclick={closeModal}
				class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
				aria-label="Close modal"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
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
			</button>

			<!-- Title -->
			<h2 class="mb-2 text-center text-2xl font-bold text-gray-800 sm:text-3xl">
				🔐 Secure Access
			</h2>
			<p class="mb-6 text-center text-sm text-gray-500">Enter your password to reveal your PIN</p>

			<!-- Password input -->
			<input
				type="password"
				bind:value={password}
				placeholder="Your password"
				class="w-full rounded-xl border border-gray-300 px-5 py-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
			/>

			<!-- Action buttons -->
			<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
				<button
					onclick={submitPassword}
					class="w-full rounded-xl bg-blue-600 px-6 py-3 text-white shadow-md transition-all duration-200 hover:bg-blue-700 sm:w-auto"
				>
					Reveal PIN
				</button>
				<button
					onclick={closeModal}
					class="w-full rounded-xl bg-gray-300 px-6 py-3 text-gray-800 transition-all hover:bg-gray-400 sm:w-auto"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}
{#if showPinModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
		onclick={closePinModal}
	>
		<div
			onclick={(event) => event.stopPropagation()}
			class="relative w-[90%] max-w-lg rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-200 transition-all sm:p-10"
		>
			<!-- Close icon -->
			<button
				onclick={closePinModal}
				class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
				aria-label="Close modal"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
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
			</button>

			<!-- Title -->
			<h2 class="mb-2 text-center text-2xl font-bold text-gray-800 sm:text-3xl">🎉 Your PIN</h2>
			<p class="mb-6 text-center text-sm text-gray-500">Keep it private, don't share it</p>

			<!-- PIN display -->
			<div class="mb-4 flex justify-center">
				<span
					class="rounded-xl bg-gray-100 px-6 py-3 font-mono text-2xl tracking-widest text-gray-800 shadow-inner"
				>
					{decryptedPin}
				</span>
			</div>

			<!-- Close button -->
			<div class="mt-6 flex justify-center">
				<button
					onclick={closePinModal}
					class="rounded-xl bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}
{#if showErrorModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
		onclick={closeErrorModal}
	>
		<div
			onclick={(event) => event.stopPropagation()}
			class="relative w-[90%] max-w-md rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-200 transition-all sm:p-10"
		>
			<!-- Close icon -->
			<button
				onclick={closeErrorModal}
				class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
				aria-label="Close modal"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
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
			</button>

			<!-- Title -->
			<h2 class="mb-2 text-center text-2xl font-bold text-red-600 sm:text-3xl">❌ Access Denied</h2>
			<p class="mb-6 text-center text-sm text-gray-500">{errorMessage}</p>

			<!-- Close button -->
			<div class="flex justify-center">
				<button
					onclick={closeErrorModal}
					class="rounded-xl bg-red-600 px-6 py-3 text-white transition-all hover:bg-red-700"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}
<!-- Prompt Modal: Ask Yes/No -->
{#if showQRPrompt}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
		onclick={closeQRPrompt}
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="relative w-[90%] max-w-md rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-200 sm:p-10"
		>
			<!-- Close icon -->
			<button
				onclick={closeQRPrompt}
				class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
				aria-label="Close modal"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
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
			</button>

			<h2 class="mb-4 text-center text-xl font-semibold text-gray-800">Generate QR Code?</h2>
			<p class="mb-6 text-center text-gray-500">Do you want to generate a QR code now?</p>

			<div class="flex justify-center gap-4">
				<button
					onclick={confirmGenerateQR}
					class="rounded-xl bg-blue-600 px-6 py-3 text-white transition"
				>
					Yes
				</button>
				<button
					onclick={closeQRPrompt}
					class="rounded-xl bg-gray-300 px-6 py-3 text-gray-800 transition hover:bg-gray-400"
				>
					No
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- QR Image Modal -->
{#if showQRImage}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
		onclick={closeQRImageModal}
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="relative w-[90%] max-w-md rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-gray-200 sm:p-10"
		>
			<!-- Close icon -->
			<button
				onclick={closeQRImageModal}
				class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
				aria-label="Close modal"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
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
			</button>

			<h2 class="mb-4 text-center text-xl font-semibold text-gray-800">📷 Your QR Code</h2>

			{#if qrImageUrl}
				<img src={qrImageUrl} alt="QR Code" class="mx-auto max-w-xs" />
			{:else}
				<p class="text-center text-gray-500">Loading...</p>
			{/if}

			<div class="mt-6 flex justify-center">
				<button
					onclick={closeQRImageModal}
					class="rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}
{#if showErrorModalQR}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
		onclick={closeErrorModalQR}
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="relative w-[90%] max-w-md rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-red-300 sm:p-10"
		>
			<!-- Close icon -->
			<button
				onclick={closeErrorModalQR}
				class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
				aria-label="Close modal"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
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
			</button>

			<h2 class="mb-4 text-center text-xl font-semibold text-red-600">❌ Error</h2>
			<p class="mb-6 text-center text-gray-700">{errorMessageQR}</p>

			<div class="flex justify-center">
				<button
					onclick={closeErrorModalQR}
					class="rounded-xl bg-red-600 px-6 py-3 text-white transition hover:bg-red-700"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Transaction Form Design! -->

<!-- Modal -->
{#if showCardQRModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 backdrop-blur-sm"
		onclick={closeCardQRModal}
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="relative w-[95%] max-w-2xl rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-200"
		>
			<!-- Close -->
			<button
				onclick={closeCardQRModal}
				class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
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
			</button>

			<!-- Title -->
			<h2 class="mb-6 text-center text-xl font-semibold text-gray-800">
				Select <span class="font-bold text-indigo-600">payment</span> method
			</h2>

			<!-- Options -->
			<div class="mb-6 grid grid-cols-2 gap-4">
				<button
					type="button"
					class={`rounded-xl border-2 p-4 text-center shadow-md transition hover:border-blue-500 focus:outline-none ${
						selectedMethod === 'card' ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-200'
					}`}
					onclick={() => (selectedMethod = 'card')}
				>
					<img src="/card.png" alt="Card" class="mx-auto mb-2 h-10" />
					<p class="font-medium text-gray-700">Card</p>
				</button>

				<button
					type="button"
					class={`rounded-xl border-2 p-4 text-center shadow-md transition hover:border-blue-500 focus:outline-none ${
						selectedMethod === 'qr' ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-200'
					}`}
					onclick={() => {
						selectedMethod = 'qr';
						qrCodeUrl = null;
					}}
				>
					<img
						src={qrCodeUrl || '/qrcode.png'}
						alt="QR Code"
						class="mx-auto mb-2 h-10 object-contain"
					/>
					<p class="font-medium text-gray-700">QR Code</p>
				</button>
			</div>

			<!-- Card Form -->
			<!-- CARD FORM -->
			{#if selectedMethod === 'card'}
				<form class="space-y-4">
					<!-- Card Number -->
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Card Number</label>
						<input
							type="text"
							required
							bind:value={cardNumber}
							placeholder="1234 5678 9012 3456"
							class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>

					<!-- Username -->
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Recipient Username</label>
						<input
							type="text"
							bind:value={username}
							required
							placeholder="johndoe123"
							class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>

					<!-- PIN & Amount -->
					<div class="flex gap-4">
						<div class="w-1/2">
							<label class="mb-1 block text-sm font-medium text-gray-700">PIN</label>
							<input
								type="password"
								bind:value={pin}
								required
								class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
						<div class="w-1/2">
							<label class="mb-1 block text-sm font-medium text-gray-700">Amount</label>
							<input
								type="number"
								required
								bind:value={amount}
								placeholder="$0.00"
								class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
					</div>

					<!-- Categories -->
					<div>
						<label class="mb-2 block text-sm font-medium text-gray-700">Category</label>
						<div class="flex flex-wrap gap-3">
							{#each categories as category}
								<label class="flex items-center gap-2 text-sm text-gray-700">
									<input type="checkbox" bind:group={selectedCategories} value={category} />
									{category}
								</label>
							{/each}
						</div>
					</div>

					<!-- Message -->
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Message (optional)</label>
						<textarea
							bind:value={description}
							placeholder="Write your note (max 225 characters)"
							maxlength="225"
							class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						></textarea>
					</div>
				</form>

				<!-- Recent Transactions -->
				<div class="mt-6 rounded-lg border bg-gray-50 p-4 shadow-sm">
					<p class="mb-3 text-sm font-medium text-gray-700">Recent Sent Payments</p>
					<ul class="space-y-2 text-sm text-gray-600">
						{#each latestTransactions as tx}
							<li class="flex justify-between">
								<span>@{tx.recipient}</span>
								<span class="text-gray-500">-${tx.amount.toFixed(2)} • {tx.date}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- QR Upload Section -->
			{#if selectedMethod === 'qr'}
				<div class="mt-4 space-y-4">
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Upload QR Code</label>
						<input
							type="file"
							accept="image/*"
							onclick={() => (qrCodeUrl = null)}
							onchange={handleQRFileUpload}
							class="block w-full text-sm text-gray-700 file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
						/>
					</div>

					{#if qrCodeUrl}
						<div class="rounded border p-4 text-center">
							<p class="mb-2 text-sm text-gray-600">Preview</p>
							<img src={qrCodeUrl} alt="Uploaded QR" class="mx-auto h-32 rounded shadow" />
						</div>
					{/if}
				</div>
			{/if}

			<!-- Actions -->
			<div class="mt-6 flex justify-center gap-4">
				<button
					type="button"
					onclick={closeCardQRModal}
					class="rounded-lg bg-gray-200 px-5 py-2 text-sm text-gray-700 hover:bg-gray-300"
					>Cancel</button
				>
				<button
					type="submit"
					disabled={!selectedMethod}
					class="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-40"
					>Continue</button
				>
			</div>
		</div>
	</div>
{/if}

<!-- Add balance to your account -->

<!-- Modal -->
{#if showAddFundsModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		onclick={closeAddFundsModal}
	>
		<div
			onclick={(e) => e.stopPropagation()}
			class="relative w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-xl"
		>
			<!-- X Close Button -->
			<button
				type="button"
				onclick={closeAddFundsModal}
				class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
				aria-label="Close"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
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
			</button>

			<!-- Header -->
			<h2 class="mb-4 text-center text-xl font-semibold text-gray-800">
				Add Funds to Your Account
			</h2>

			<!-- Input -->
			<div class="mb-4">
				<label for="amount" class="mb-1 block text-sm font-medium text-gray-700">
					Amount (USD)
				</label>
				<input
					id="amount"
					type="number"
					placeholder="e.g. 100"
					bind:value={fundAmount}
					class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<!-- Actions -->
			<div class="mt-6 flex justify-end gap-3">
				<button
					onclick={closeAddFundsModal}
					class="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
				>
					Cancel
				</button>
				<button
					onclick={appendFunds}
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
				>
					Append
				</button>
			</div>
		</div>
	</div>
{/if}
