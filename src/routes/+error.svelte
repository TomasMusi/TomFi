<script lang="ts">
	import { goto } from '$app/navigation';

	function goHome() {
		goto('/');
	}
</script>

<section
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4"
>
	<div class="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
		<h1 class="mb-4 text-4xl font-bold text-blue-700">Oops!</h1>
		<p class="mb-6 text-lg text-gray-700">
			Something went wrong. This page doesn't exist or an unexpected error occurred.
		</p>

		<button
			onclick={goHome}
			class="cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-blue-700"
		>
			Go back home
		</button>
	</div>
</section>
