<script lang="ts">
	import '../app.css';
	import type { LayoutProps } from './$types';
	let { data, children }: LayoutProps = $props();
	import { goto } from '$app/navigation';

	import UserAvatar from '$lib/components/UserAvatar.svelte';
</script>

{@render children()}

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
