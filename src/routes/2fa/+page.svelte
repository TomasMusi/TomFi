<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { showError, showSucess } from '$lib/alerts';

	let token = '';
	let userId: string | null = null;

	onMount(() => {
		const url = new URL(window.location.href);
		userId = url.searchParams.get('userId');
	});

	async function verify2FA() {
		if (!token || token.length !== 6) {
			showError('Enter a valid 6-digit code!');
			return;
		}

		const res = await fetch('/api/login-2fa-verify', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ userId, token })
		});

		if (res.ok) {
			showSucess('2FA verified!');
			goto('/dashboard');
		} else {
			showError('Invalid 2FA code. Try again.');
		}
	}
</script>

<section
	class="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4"
>
	<section class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
		<h2 class="mb-6 text-center text-3xl font-bold text-blue-700">Two-Factor Authentication</h2>

		<p class="mb-4 text-center text-sm text-gray-600">
			Enter the 6-digit code from your authentication app.
		</p>

		<div class="space-y-4">
			<div>
				<label for="token" class="block text-sm font-medium text-gray-700">Authenticator Code</label
				>
				<input
					bind:value={token}
					type="text"
					id="token"
					maxlength="6"
					pattern="\d{6}"
					placeholder="123456"
					class="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-center text-lg tracking-widest placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<button
				onclick={verify2FA}
				class="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-blue-700"
			>
				Verify
			</button>
		</div>
	</section>
</section>
