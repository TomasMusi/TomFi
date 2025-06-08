<script lang="ts">
	let showAddFundsModal = false;
	let fundAmount = '';

	function openAddFundsModal() {
		showAddFundsModal = true;
	}

	function closeAddFundsModal() {
		showAddFundsModal = false;
		fundAmount = '';
	}

	function appendFunds() {
		// Implement logic to process fundAmount
		alert(`Appending $${fundAmount} to your account.`);
		closeAddFundsModal();
	}
</script>

<!-- Trigger Button -->
<div class="mt-6 flex justify-center">
	<button
		onclick={openAddFundsModal}
		class="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
	>
		Add Funds
	</button>
</div>

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
