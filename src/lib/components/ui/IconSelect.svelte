<script module>
	export type Option = {
		value: string;
		label: string;
		icon?: Snippet<[]>;
	};
</script>

<script lang="ts">
	import { setContext, type Snippet } from 'svelte';

	let {
		value = $bindable(),
		placeholder = 'Select an option',
		onselect,
		children,
		class: className = '',
		optionClass,
		iconOnly = false,
		isOpen = $bindable(false),
		selectIcon,
		showDefaultSelectIcon = true
	}: {
		value: string;
		placeholder?: string;
		children: Snippet<[]>;
		onselect: (value: string) => void;
		class?: string;
		optionClass?: string;
		iconOnly?: boolean;
		isOpen?: boolean;
		selectIcon?: Snippet<[]>;
		showDefaultSelectIcon?: boolean;
	} = $props();

	let options: Option[] = $state([]);
	setContext('options', options);

	let selectElement: HTMLDivElement | undefined = $state(undefined);

	const selectedLabel = $derived.by(() => {
		const selectedOption = options.find((opt) => opt.value === value);
		return selectedOption ? selectedOption.label : placeholder;
	});

	const selectedIcon = $derived.by(() => {
		const selectedOption = options.find((opt) => opt.value === value);
		return selectedOption ? selectedOption.icon : null;
	});

	const hasWidthClass = $derived(className.split(' ').some((x) => x.startsWith('w-')));

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleSelect(optionValue: string) {
		value = optionValue;
		onselect?.(optionValue);
		isOpen = false;
	}

	$effect(() => {
		if (!isOpen) return;
		const handleClickOutside = (event: MouseEvent) => {
			if (selectElement && !selectElement.contains(event.target as Node)) {
				isOpen = false;
			}
		};
		setTimeout(() => {
			document.addEventListener('click', handleClickOutside, true);
		}, 0);

		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	});
</script>

{@render children()}

{#snippet selectButton()}
	<button
		class={[
			'flex w-full cursor-pointer items-center rounded-md border border-white/20 bg-gradient-to-br from-[#363636] to-[#262626] py-2.5 text-left text-base text-white transition-all duration-200 hover:bg-accent/10 hover:text-[#ff8a65] focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none',
			iconOnly && !isOpen ? 'justify-center px-2.5' : 'justify-between px-3',
			optionClass
		]}
		onclick={toggleDropdown}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
	>
		<div class="flex flex-grow items-center overflow-hidden">
			{#if selectedIcon}
				<span class="inline-flex flex-shrink-0 items-center text-white/80">
					{@render selectedIcon()}
				</span>
			{:else if selectIcon}
				<span class="inline-flex flex-shrink-0 items-center text-white/80">
					{@render selectIcon()}
				</span>
			{/if}
			<span
				class={[
					'ml-2 flex-grow overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-200 ease-in-out',
					iconOnly && !isOpen ? 'max-w-0 opacity-0' : 'mr-2 max-w-full opacity-100'
				]}
			>
				{selectedLabel}
			</span>
		</div>

		<span class="inline-flex flex-shrink-0 items-center text-white/80">
			<svg
				class="transition-transform duration-200 ease-in-out {isOpen ? 'rotate-180' : ''}"
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
		</span>
	</button>
{/snippet}

{#snippet optionItem(option: Option)}
	<li
		role="option"
		aria-selected={value === option.value}
		onclick={() => handleSelect(option.value)}
		onkeydown={(e) => {
			if (e.key === 'Enter') handleSelect(option.value);
		}}
		tabindex="0"
		class={[
			'flex cursor-pointer items-center gap-2 px-3 py-2.5 text-white transition-colors hover:bg-accent/10 hover:text-[#ff8a65] focus:bg-accent/10 focus:text-accent focus:outline-none',
			value === option.value
				? 'bg-accent/20 text-accent shadow-[inset_0_0_0_2px_rgba(255,101,66,0.3)]'
				: '',
			optionClass
		]}
	>
		{#if option.icon}
			<span class="inline-flex items-center">{@render option.icon()}</span>
		{:else if selectIcon}
			<span class="inline-flex items-center" class:opacity-0={!showDefaultSelectIcon}
				>{@render selectIcon()}</span
			>
		{/if}
		{option.label}
	</li>
{/snippet}

<div
	class={[
		'relative font-sans transition-all duration-200 ease-in-out',
		className,
		!hasWidthClass && !(iconOnly && !isOpen) ? 'w-fit' : '', // Default width
		iconOnly && !isOpen ? 'w-fit' : '' // Collapsed iconOnly width
	]}
	bind:this={selectElement}
>
	{@render selectButton()}

	{#if isOpen}
		<ul
			class="ring-opacity-5 absolute top-full right-0 left-0 z-50 mt-1 max-h-48 list-none overflow-y-auto rounded-md border border-white/10 bg-[#363636] p-1 shadow-lg ring-1 ring-black"
			role="listbox"
		>
			{#each options as option (option.value)}
				{@render optionItem(option)}
			{/each}
		</ul>
	{/if}
</div>
