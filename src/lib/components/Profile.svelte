<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { showError, showSucess } from '$lib/alerts';

	// 5 MB
	let MAX_IMAGE_SIZE: number = 5 * 1024 * 1024;
	let ALLOWED_TYPES: string[] = ['image/png', 'image/jpg', 'image/webp', 'image/jpeg'];

	let fileinput: HTMLInputElement;

	async function EditData(): Promise<void> {
		if (!fileinput?.files || !fileinput.files[0]) {
			showError('You didnt pick a Image');
			return;
		}

		if (fileinput.files[0].size >= MAX_IMAGE_SIZE) {
			showError('Image is too big.');
			return;
		}

		if (!ALLOWED_TYPES.includes(fileinput.files[0].type)) {
			showError('Image Doesnt have right format!');
			return;
		}

		const formdata: FormData = new FormData();
		formdata.append('image', fileinput.files[0]);

		const response: Response = await fetch('/api/SendData', {
			method: 'POST',
			body: formdata
		});

		if (!response.ok) {
			showError('Error on the side of the Server');
		} else {
			showSucess('Edit was sucesfull');
		}
	}

	export let data: {
		user: {
			id: number;
			email: string;
			Name: string;
			user_profile_picture: string;
		};
		decoded: any;
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

<!-- Full Page Container -->
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
				<a href="/dashboard/Wallet" class="px-4 py-2 hover:text-blue-600">Wallet</a>
				<a
					href="/dashboard/profile"
					class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow">Settings</a
				>
			</nav>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 space-y-6 overflow-y-auto bg-gray-50 p-6 sm:p-10">
			<div class="w-full max-w-full rounded-xl bg-white p-6 shadow-md">
				<h2 class="mb-6 text-center text-lg font-bold text-gray-800">Personal Information</h2>

				<form class="space-y-6">
					<!-- Profile Picture -->
					<div class="flex flex-col items-center justify-center gap-4">
						<label for="avatarUpload" class="cursor-pointer">
							<div
								class="h-32 w-32 overflow-hidden rounded-full ring-2 ring-blue-500 transition hover:opacity-90"
							>
								<img
									src={data.user.user_profile_picture}
									alt="Profile Picture"
									class="h-full w-full object-cover"
								/>
							</div>
						</label>
						<input id="avatarUpload" bind:this={fileinput} type="file" class="hidden" />
						<span class="text-sm text-gray-500">Click image to upload new picture</span>
					</div>

					<!-- Full Name -->
					<div>
						<label class="block text-sm font-medium text-gray-700">Full Name</label>
						<input
							type="text"
							value={data.user.Name}
							readonly
							class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm focus:outline-none"
						/>
					</div>

					<!-- Email -->
					<div>
						<label class="block text-sm font-medium text-gray-700">Email Address</label>
						<input
							type="email"
							value={data.user.email}
							class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>

					<!-- Phone Number -->
					<div>
						<label class="block text-sm font-medium text-gray-700">Phone Number</label>
						<input
							type="tel"
							placeholder="+1 123 456 7890"
							class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>

					<!-- Address -->
					<div>
						<label class="block text-sm font-medium text-gray-700">Address</label>
						<textarea
							placeholder="1234 Elm Street, Springfield, USA"
							rows="3"
							class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
						></textarea>
					</div>

					<!-- Date of Birth (readonly) -->
					<div>
						<label class="block text-sm font-medium text-gray-700">Date of Birth</label>
						<input
							type="date"
							value="1990-01-01"
							readonly
							class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm focus:outline-none"
						/>
					</div>

					<!-- Submit -->
					<div class="text-right">
						<button
							onclick={EditData}
							type="submit"
							class="rounded-lg bg-blue-600 px-6 py-2 text-white shadow hover:bg-blue-700"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</main>
	</div>
</div>
