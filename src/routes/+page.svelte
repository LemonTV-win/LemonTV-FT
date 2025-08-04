<script lang="ts">
	import type { PageProps } from './$types';
	import WelcomeHero from './WelcomeHero.svelte';

	let { data }: PageProps = $props();
</script>

{#if !data.user}
	<WelcomeHero signUpURL={data.authURL} />
{/if}
