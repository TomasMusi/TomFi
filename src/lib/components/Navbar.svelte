<script lang="ts">
	import { goto } from '$app/navigation';

	let isOpen = false;

	export let data: {
		user: {
			id: number;
			email: string;
			Name: string;
			user_profile_picture: string;
		};
		logged: boolean;
	};

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function Logout() {
		goto('/api/logout');
	}
</script>

<nav class="border-t-4 border-blue-600 bg-white px-6 py-4 shadow-sm">
	<div class="mx-auto flex max-w-7xl items-center justify-between">
		<!-- Left: Logo -->
		<div class="flex items-center space-x-2">
			<div class="rounded-lg bg-blue-600 p-2 text-white shadow-sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
					/>
				</svg>
			</div>
			<span
				class="bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-xl font-bold text-transparent"
			>
				TomFi
			</span>
		</div>

		<!-- Center: Menu -->
		<div class="hidden space-x-8 font-medium text-gray-700 md:flex">
			<a href="#" class="transition-colors hover:text-blue-700">Products</a>
			<a href="#" class="transition-colors hover:text-blue-700">Solutions</a>
			<a href="#" class="transition-colors hover:text-blue-700">Resources</a>
			<a href="#" class="transition-colors hover:text-blue-700">Pricing</a>
		</div>

		<!-- Right: Auth or Profile Dropdown -->
		<div class="flex items-center space-x-4">
			{#if data.logged}
				<!-- Profile Picture with Dropdown -->
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
			{:else}
				<!-- Only show when not logged -->
				<button
					class="cursor-pointer font-medium text-gray-700 transition-colors hover:text-blue-700"
				>
					<a href="/login">Log in</a>
				</button>
				<button
					class="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-blue-700"
				>
					<a href="/register">Sign up</a>
				</button>
			{/if}
		</div>
	</div>
</nav>
