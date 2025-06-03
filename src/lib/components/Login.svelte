<script lang="ts">
	import { goto } from '$app/navigation';
	import { showError, showSucess } from '$lib/alerts';
	import type { LoginSchemaType } from '$lib/zodtypes';

	let pass: string = '';
	let email: string = '';

	async function SendLoginRequest(): Promise<void> {
		if (pass.length <= 4) {
			showError('Password must be atleast 5 characters long!');
		}

		if (!email) {
			showError('You must enter an email!');
		}

		const getLoginData: LoginSchemaType = {
			email: email,
			password: pass
		};

		const reponse = await fetch('/api/login', {
			method: 'POST',
			body: JSON.stringify(getLoginData),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (!reponse.ok) {
			showError('Error! couldnt find a account! ');
		} else {
			showSucess('Login was sucessfull!');
			goto('/dashboard');
		}
	}

	let showPassword: boolean = false;

	function togglePassword(): void {
		showPassword = !showPassword;
	}
</script>

<section
	class="flex h-full min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4"
>
	<section class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
		<h2 class="mb-6 text-center text-3xl font-bold text-blue-700">Welcome Back</h2>

		<div class="space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
				<input
					bind:value={email}
					type="email"
					id="email"
					name="email"
					required
					class="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-gray-700">Password</label>
				<div class="relative">
					<input
						type={showPassword ? 'text' : 'password'}
						id="password"
						bind:value={pass}
						name="password"
						required
						class="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
					<button
						type="button"
						class="absolute inset-y-0 flex items-center px-3 text-gray-500 hover:text-blue-600"
						tabindex="-1"
					>
						{#if showPassword}
							<!-- Eye Off Icon -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M3.707 3.293a1 1 0 010 1.414l16 16a1 1 0 01-1.414 1.414l-2.778-2.778A9.953 9.953 0 0112 21c-4.477 0-8.268-2.943-9.542-7a9.987 9.987 0 014.622-5.857L3.707 4.707a1 1 0 011.414-1.414l16 16z"
								/>
								<path d="M15.879 14.121L9.88 8.121a3 3 0 104.243 4.243z" />
							</svg>
						{:else}
							<!-- Eye Icon -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M12 5c-4.477 0-8.268 2.943-9.542 7 1.274 4.057 5.065 7 9.542 7s8.268-2.943 9.542-7c-1.274-4.057-5.065-7-9.542-7zm0 12a5 5 0 110-10 5 5 0 010 10z"
								/>
								<path d="M12 10a2 2 0 100 4 2 2 0 000-4z" />
							</svg>
						{/if}
					</button>
				</div>
			</div>

			<div class="text-right text-sm">
				<a href="#" class="text-blue-600 hover:text-blue-800">Forgot your password?</a>
			</div>

			<button
				onclick={SendLoginRequest}
				type="submit"
				class="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-blue-700"
			>
				Log In
			</button>
		</div>

		<p class="mt-6 text-center text-sm text-gray-600">
			Don't have an account?
			<a href="/register" class="font-medium text-blue-600 hover:text-blue-800">Register</a>
		</p>
	</section>
</section>
