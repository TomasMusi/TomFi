<script lang="ts">
	import { goto } from '$app/navigation';
	import { showError, showSucess } from '$lib/alerts';
	import type { registerSchemaType } from '$lib/zodtypes';

	let pass1: string = '';
	let pass2: string = '';
	let email: string = '';
	let name: string = '';

	async function SendRegisterRequest(): Promise<void> {
		if (!email || !name || !pass1 || !pass2) {
			showError('You must enter something!');
		}

		if (pass1 !== pass2) {
			showError('Passwords dont match!');
		}

		const getRegisterData: registerSchemaType = {
			email: email,
			name: name,
			password: pass1
		};

		const reponse = await fetch('/api/register', {
			method: 'POST',
			body: JSON.stringify(getRegisterData),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (!reponse.ok) {
			showError('Error! Couldnt create an account ');
		} else {
			showSucess('register was sucesfull!');
			goto('/login');
		}
	}
</script>

<section
	class="flex h-full min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4"
>
	<section class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
		<h2 class="mb-6 text-center text-3xl font-bold text-blue-700">Create an Account</h2>
		<div class="space-y-4">
			<div>
				<label for="fullname" class="block text-sm font-medium text-gray-700">Full Name</label>
				<input
					type="text"
					bind:value={name}
					id="fullname"
					name="fullname"
					required
					class="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
				<input
					type="email"
					bind:value={email}
					id="email"
					name="email"
					required
					class="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
				<input
					type="password"
					bind:value={pass1}
					id="password"
					name="password"
					required
					class="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<div>
				<label for="confirm_password" class="block text-sm font-medium text-gray-700"
					>Confirm Password</label
				>
				<input
					type="password"
					bind:value={pass2}
					id="confirm_password"
					name="confirm_password"
					required
					class="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<button
				onclick={SendRegisterRequest}
				type="submit"
				class="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-blue-700"
			>
				Register
			</button>
			<p class="mt-6 text-center text-sm text-gray-600">
				Already have an account?
				<a href="/login" class="font-medium text-blue-600 hover:text-blue-800">Sign in</a>
			</p>
		</div>
	</section>
</section>
