<script lang="ts">
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
</script>

<!-- Trigger -->
<div class="mt-6 flex justify-center">
	<button
		onclick={openCardQRModal}
		class="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:scale-105"
	>
		Choose Payment Method
	</button>
</div>

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
							bind:value={cardNumber}
							placeholder="1234 5678 9012 3456"
							class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>

					<!-- Username -->
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Recipient Username</label>
						<input
							type="text"
							bind:value={username}
							placeholder="e.g. johndoe123"
							class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>

					<!-- PIN & Amount -->
					<div class="flex gap-4">
						<div class="w-1/2">
							<label class="mb-1 block text-sm font-medium text-gray-700">PIN</label>
							<input
								type="password"
								bind:value={pin}
								class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
						<div class="w-1/2">
							<label class="mb-1 block text-sm font-medium text-gray-700">Amount</label>
							<input
								type="number"
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
