<script lang="ts">
	let qrCode = '';
	let secret = '';
	let error = '';

	let verificationCode = '';
	let verificationStatus = '';

	async function WFA() {
		try {
			const response = await fetch('/api/2fa');
			const result = await response.json();

			if (result.success) {
				qrCode = result.qr;
				secret = result.secret;
			} else {
				error = 'Something went wrong while generating 2FA.';
			}
		} catch (err) {
			error = 'Network error.';
		}
	}

	async function verify2FA() {
		const response = await fetch('/api/verify_2fa', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token: verificationCode })
		});
		const result = await response.json();

		if (result.success) {
			verificationStatus = '✅ 2FA verified successfully!';
		} else {
			verificationStatus = '❌ Invalid code. Please try again.';
		}
	}
</script>

<h1 class="mb-4 text-xl font-bold">Two-Factor Authentication Setup</h1>

<button class="cursor-pointer rounded-md bg-red-400 px-4 py-2 text-white" onclick={WFA}>
	Click on me Daddy
</button>

{#if qrCode}
	<div class="mt-6">
		<p class="mb-2 text-sm text-gray-600">Scan this QR code using Google Authenticator:</p>
		<img src={qrCode} alt="2FA QR Code" class="h-48 w-48 rounded border shadow" />
		<p class="mt-2 text-sm text-gray-500">
			Or enter the code manually: <strong>{secret}</strong>
		</p>
	</div>
{/if}

{#if error}
	<p class="mt-4 font-semibold text-red-600">{error}</p>
{/if}

<!-- Show this after QR is generated -->
{#if qrCode}
	<!-- ... existing QR and secret display ... -->

	<div class="mt-6">
		<label class="mb-1 block text-sm font-medium text-gray-700">Enter 6-digit code</label>
		<input
			bind:value={verificationCode}
			class="w-full max-w-xs rounded border px-3 py-2 text-sm"
			placeholder="123456"
		/>
		<button
			onclick={verify2FA}
			class="mt-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
		>
			Verify Code
		</button>

		{#if verificationStatus}
			<p class="mt-2 text-sm font-medium">{verificationStatus}</p>
		{/if}
	</div>
{/if}
