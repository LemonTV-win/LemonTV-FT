<script lang="ts">
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';

	let { data }: PageProps = $props();
</script>

{#if !data.user}
	<a href={data.authURL} class="login-button">Login with LemonTV</a>
{:else}
	<p class="flex items-center gap-2">
		Logged in as
		<UserAvatar email={data.user.email} />
		{data.user.username}
	</p>
	<button
		class="cursor-pointer rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
		onclick={async () => {
			await fetch('/auth/logout', {
				method: 'POST',
				credentials: 'include'
			});
			// Refresh the page to update the UI
			await goto('/', { replaceState: true, invalidateAll: true });
		}}
	>
		Logout
	</button>
{/if}

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
