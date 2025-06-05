<script lang="ts">
	let showModal = false;
	let password = '';

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		password = '';
	}

	async function submitPassword() {
		console.log('Entered password:', password);
		// TODO: Replace with actual API logic
		closeModal();
	}
</script>

<!-- Button to open modal -->
<div class="flex justify-center">
	<button
		onclick={openModal}
		class="rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95"
	>
		Show PIN
	</button>
</div>

<!-- Modal overlay -->
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
