<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';

	import { m } from '$lib/paraglide/messages.js';
	import { setLocale, type Locale, getLocale } from '$lib/paraglide/runtime';
	import MaterialSymbolsMenuRounded from '~icons/material-symbols/menu-rounded';
	import MaterialSymbolsCloseRounded from '~icons/material-symbols/close-rounded';
	import MaterialSymbolsLogoutRounded from '~icons/material-symbols/logout-rounded';
	import MaterialSymbolsSettingsRounded from '~icons/material-symbols/settings-rounded';
	import MaterialSymbolsTranslateRounded from '~icons/material-symbols/translate-rounded';
	import MaterialSymbolsAdminPanelSettingsRounded from '~icons/material-symbols/admin-panel-settings-rounded';
	import IconDiscord from '~icons/simple-icons/discord';
	import IconGithub from '~icons/simple-icons/github';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import Switch from '$lib/components/ui/Switch.svelte';
	import { settings } from '$lib/settings.svelte';
	import type { LayoutProps } from './$types';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { SITE_CANONICAL_HOST, SAROASIS_URL_EN, SAROASIS_URL_ZH } from '$lib/consts';
	import GameSelect from './GameSelect.svelte';

	let { data, children }: LayoutProps = $props();

	const navigation = [
		{ href: '/news', label: m.news },
		{ href: '/events', label: m.events },
		{ href: '/teams', label: m.teams },
		{ href: '/players', label: m.players },
		{ href: '/community', label: m.community }
	] as const;

	const locales: Record<Locale, string> = {
		en: 'English',
		ja: '日本語',
		zh: '简体中文',
		'zh-tw': '繁體中文'
		// es: 'Español',
		// ko: '한국어',
		// 'pt-br': 'Português',
		// de: 'Deutsch',
		// fr: 'Français',
		// ru: 'Русский',
		// vi: 'Tiếng Việt',
		// id: 'Bahasa Indonesia',
		// 'uk-ua': 'Українська'
	};

	let locale = $state(getLocale());
	let mobileMenuOpen = $state(false);
	let userMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function toggleUserMenu() {
		userMenuOpen = !userMenuOpen;
	}

	// Close user menu when clicking outside
	function clickOutside(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			if (!node.contains(event.target as Node)) {
				userMenuOpen = false;
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	function isActive(href: string) {
		return page.url.pathname === href;
	}

	let pageTitle = $derived(page.data.metadata?.title || `FTLemon – ${m.title_description()}`);
	let pageDescription = $derived(page.data.metadata?.description || m.about_tagline());
</script>

<svelte:head>
	<!-- Basic HTML Metadata -->
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta name="keywords" content="LemonTV, Strinova, Esports, News, Community, Tournaments" />
	<link rel="canonical" href={`${SITE_CANONICAL_HOST}${page.url.pathname}`} />

	<!-- Open Graph -->
	<meta property="og:site_name" content="LemonTV" />
	<meta property="og:url" content={`${SITE_CANONICAL_HOST}${page.url.pathname}`} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<!-- TODO: Generate og:image for sub pages such as Team / Player -->
	<meta property="og:image" content="https://lemontv.win/screenshot.png" />

	<!-- Twitter Card -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:title" content={pageTitle} />
	<meta property="twitter:description" content={pageDescription} />
	<meta property="twitter:creator" content="@mkpoli" />
	<meta property="twitter:image" content="https://lemontv.win/screenshot.png" />
	<meta property="twitter:url" content={`${SITE_CANONICAL_HOST}${page.url.pathname}`} />

	<!-- Schema.org Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'LemonTV',
		url: SITE_CANONICAL_HOST,
		description: m.about_tagline()
	})}</script>`}
</svelte:head>

<div class="flex min-h-dvh flex-col">
	<header
		class="relative flex items-center justify-between border-b-1 border-white/20 bg-gradient-to-br from-[#363636] to-[#262626] px-4 py-4"
	>
		<div class="absolute inset-0 hidden items-center justify-center md:flex">
			<nav class="flex flex-1 items-center justify-center gap-1">
				{#each navigation as { href, label }}
					<a
						{href}
						class={[
							'rounded-md px-4 py-2 transition-all duration-200',
							isActive(href)
								? 'bg-[#ff6542]/20 font-semibold shadow-[inset_0_0_0_2px_rgba(255,101,66,0.3)]'
								: 'hover:scale-105 hover:bg-[#ff6542]/10 hover:text-[#ff8a65]',
							'focus:bg-[#ff6542]/10 focus:text-[#ff6542] focus:ring-2 focus:ring-[#ff6542] focus:outline-none'
						]}>{label()}</a
					>
				{/each}
			</nav>
		</div>

		<div class="flex items-center gap-4">
			<a
				href="/"
				class="flex items-center gap-2 text-2xl font-bold transition-colors duration-300 hover:text-[#ff6542]"
			>
				<img src="/favicon-96x96.png" alt="LemonTV" class="h-10 w-10" />
				LemonTV
			</a>
			<GameSelect signedIn={!!data.user} />
		</div>

		<button class="md:hidden" onclick={toggleMobileMenu}>
			{#if mobileMenuOpen}
				<MaterialSymbolsCloseRounded class="h-8 w-8" />
			{:else}
				<MaterialSymbolsMenuRounded class="h-8 w-8" />
			{/if}
		</button>

		{#if data.user}
			<div class="user-menu relative hidden md:block">
				<button
					onclick={toggleUserMenu}
					class="flex cursor-pointer items-center gap-2 rounded-full bg-[#ff6542]/10 p-1 hover:bg-[#ff6542]/25"
				>
					<UserAvatar email={data.user.email} class="h-8 w-8" />
				</button>
				{#if userMenuOpen}
					<div
						class="ring-opacity-5 absolute right-0 z-50 mt-2 w-48 rounded-md border border-white/10 bg-[#363636] py-1 shadow-lg ring-1 ring-black"
						use:clickOutside
					>
						<div class="border-b border-white/10 px-4 py-2">
							<p class="text-sm font-medium">{data.user.username}</p>
						</div>
						<a
							href="/profile"
							class="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[#ff6542]/10 hover:text-[#ff8a65]"
						>
							<MaterialSymbolsSettingsRounded class="h-5 w-5" />
							{m.profile_settings()}
						</a>
						{#if ['admin', 'editor'].some((role) => data.user?.roles.includes(role))}
							<a
								href="/admin"
								class="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[#ff6542]/10 hover:text-[#ff8a65]"
							>
								<MaterialSymbolsAdminPanelSettingsRounded class="h-5 w-5" />
								{m.admin_panel()}
							</a>
						{/if}
						<div
							class="flex cursor-pointer items-center gap-2 px-4 py-1 text-sm transition-colors hover:bg-[#ff6542]/10 hover:text-[#ff8a65]"
						>
							<MaterialSymbolsTranslateRounded class="h-5 w-5" />
							<select
								class="w-full rounded-md border-1 border-white/30 bg-[#262626] px-4 py-1 text-sm"
								onchange={({ currentTarget }) => {
									setLocale(currentTarget.value as Locale);
								}}
								bind:value={locale}
							>
								{#each Object.entries(locales) as [locale, label]}
									<option value={locale}>{label}</option>
								{/each}
							</select>
						</div>
						<div class="flex items-center px-4 py-2 hover:bg-[#ff6542]/10">
							<Switch label={m.spoiler_mode()} bind:checked={settings.spoilerMode} />
						</div>
						<hr class="border-white/10" />
						<button
							type="submit"
							class="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-[#ff6542]/10 hover:text-[#ff8a65]"
							onclick={async () => {
								await fetch('/auth/logout', {
									method: 'POST',
									credentials: 'include'
								});
								// Refresh the page to update the UI
								await goto('/', { replaceState: true, invalidateAll: true });
							}}
						>
							<MaterialSymbolsLogoutRounded class="h-5 w-5" />
							{m.sign_out()}
						</button>
					</div>
				{/if}
			</div>
		{:else}
			<div class="hidden items-center gap-2 md:flex">
				<div class="flex items-center gap-2">
					<MaterialSymbolsTranslateRounded class="h-6 w-6" />
					<select
						class="rounded-md border-white/30 bg-[#262626] py-1 pr-7 pl-3"
						onchange={({ currentTarget }) => {
							setLocale(currentTarget.value as Locale);
						}}
						bind:value={locale}
					>
						{#each Object.entries(locales) as [locale, label]}
							<option value={locale}>{label}</option>
						{/each}
					</select>
				</div>
				<a
					href={data.authURL}
					class="rounded-md border-1 border-[#ff6542] bg-[#ff6542]/10 px-4 py-1 text-[#ff6542] transition-colors duration-300 hover:bg-[#ff6542]/20"
					>{m.sign_in()}</a
				>
			</div>
		{/if}
	</header>

	{#if mobileMenuOpen}
		<nav
			class="flex flex-col border-b-1 border-white/20 bg-gradient-to-br from-[#363636] to-[#262626] px-3 py-4 md:hidden"
		>
			{#each navigation as { href, label }}
				<a
					{href}
					class={[
						'rounded-md px-3 py-2 text-lg transition-all duration-200',
						isActive(href)
							? 'bg-[#ff6542]/20 text-[#ff6542] shadow-[inset_0_0_0_2px_rgba(255,101,66,0.3)]'
							: 'hover:scale-105 hover:bg-[#ff6542]/10 hover:text-[#ff8a65]',
						'focus:bg-[#ff6542]/10 focus:text-[#ff6542] focus:ring-2 focus:ring-[#ff6542] focus:outline-none'
					]}
					onclick={toggleMobileMenu}>{label()}</a
				>
			{/each}
			{#if data.user}
				<div class="mt-4 border-t border-white/10 pt-4">
					<div class="mb-4 flex items-center gap-2">
						<UserAvatar email={data.user.email} class="h-8 w-8" />
						<span class="text-lg font-medium">{data.user.username}</span>
					</div>
					<div class="flex flex-col gap-1.5 pl-4">
						<a
							href="/profile"
							class="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-[#ff6542]/10 hover:text-[#ff8a65]"
							onclick={toggleMobileMenu}
						>
							<MaterialSymbolsSettingsRounded class="h-5 w-5" />
							{m.profile_settings()}
						</a>
						{#if ['admin', 'editor'].some((role) => data.user?.roles.includes(role))}
							<a
								href="/admin"
								class="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-[#ff6542]/10 hover:text-[#ff8a65]"
								onclick={toggleMobileMenu}
							>
								<MaterialSymbolsAdminPanelSettingsRounded class="h-5 w-5" />
								{m.admin_panel()}
							</a>
						{/if}
						<div
							class="flex items-center gap-2 rounded-md px-3 py-1 text-sm transition-colors hover:bg-[#ff6542]/10 hover:text-[#ff8a65]"
						>
							<MaterialSymbolsTranslateRounded class="h-5 w-5" />
							<select
								class="w-full rounded-md border-1 border-white/30 bg-[#262626] px-4 py-1 text-sm"
								onchange={({ currentTarget }) => {
									setLocale(currentTarget.value as Locale);
								}}
								bind:value={locale}
							>
								{#each Object.entries(locales) as [locale, label]}
									<option value={locale}>{label}</option>
								{/each}
							</select>
						</div>
						<div
							class="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-[#ff6542]/10 hover:text-[#ff8a65]"
						>
							<Switch label={m.spoiler_mode()} bind:checked={settings.spoilerMode} />
						</div>
						<hr class="border-white/10" />
						<form method="post" action="/?/logout" use:enhance>
							<button
								type="submit"
								class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-[#ff6542]/10 hover:text-[#ff8a65]"
								onclick={toggleMobileMenu}
							>
								<MaterialSymbolsLogoutRounded class="h-5 w-5" />
								{m.sign_out()}
							</button>
						</form>
					</div>
				</div>
			{:else}
				<div class="mb-4">
					<div class="flex items-center gap-2">
						<MaterialSymbolsTranslateRounded class="h-6 w-6" />
						<select
							class="w-full rounded-md bg-[#262626] px-4 py-2"
							onchange={({ currentTarget }) => {
								setLocale(currentTarget.value as Locale);
							}}
							bind:value={locale}
						>
							{#each Object.entries(locales) as [locale, label]}
								<option value={locale}>{label}</option>
							{/each}
						</select>
					</div>
					<div class="mt-4 border-t border-white/10 pt-4"></div>
					<div class="mt-2 flex items-center gap-2">
						<Switch label={m.spoiler_mode()} bind:checked={settings.spoilerMode} />
					</div>
					<a
						href={data.authURL}
						class="flex w-full cursor-pointer items-center justify-center rounded-md border-1 border-[#ff6542] bg-[#ff6542]/10 px-4 py-2 text-lg text-[#ff6542] transition-colors duration-300 hover:bg-[#ff6542]/20"
						onclick={toggleMobileMenu}>{m.sign_in()}</a
					>
				</div>
			{/if}
		</nav>
	{/if}

	<main class="mb-4 flex-1">
		{@render children()}
	</main>

	<footer
		class="mt-4 border-t-1 border-white/20 bg-gradient-to-br from-[#363636] to-[#262626] px-3 py-8 text-center"
	>
		<div class="mx-auto max-w-2xl">
			<p class="mb-4 text-lg">
				© 2025 <a
					href="/about"
					class="text-[#ff6542] transition-colors duration-100 hover:text-[#ff9e42] hover:underline"
					>LemonTV</a
				>
			</p>
			<p class="mb-4 text-sm text-white/60">
				{@html m.footer_fan_made({
					linkStart: `<a href="/about#team" class="underline hover:text-[#ff6542]/80 transition-colors duration-300" target="_blank">`,
					linkEnd: `</a>`
				})}
			</p>
			<div class="mb-4 flex justify-center gap-4">
				<a
					href="https://discord.gg/mY8DMatXM4"
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#ff6542] transition-colors duration-300 hover:text-[#ff9e42]"
				>
					<IconDiscord class="h-6 w-6" />
				</a>
				<a
					href="https://github.com/LemonTV-win/LemonTV-FT"
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#ff6542] transition-colors duration-300 hover:text-[#ff9e42]"
				>
					<IconGithub class="h-6 w-6" />
				</a>
			</div>
			<p class="text-xs text-[rgba(250,250,250,0.6)]">
				{@html m.footer_trademark({
					fate_trigger: `<a href="https://fatetrigger.com/" class="underline hover:text-[#ff6542]/80 transition-colors duration-300" target="_blank">Fate Trigger</a>`,
					saroasis: `<a href="${['zh', 'zh-tw'].includes(getLocale()) ? SAROASIS_URL_ZH : SAROASIS_URL_EN}" class="underline hover:text-[#ff6542]/80 transition-colors duration-300" target="_blank">${m.Saroasis()}</a>`
				})}
			</p>
		</div>
	</footer>
</div>
