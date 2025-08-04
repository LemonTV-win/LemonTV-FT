<script lang="ts">
	let {
		label,
		checked = $bindable(false),
		disabled = false,
		id = undefined
	}: {
		label?: string;
		checked?: boolean;
		disabled?: boolean;
		id?: string;
	} = $props();

	let switchId = $derived(id || `switch-${Math.random().toString(36).substr(2, 9)}`);

	function toggleSwitch() {
		if (!disabled) {
			checked = !checked;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			toggleSwitch();
		}
	}
</script>

<div class="flex w-full items-center rounded-md transition-all duration-200 hover:text-[#ff8a65]">
	<button
		id={switchId}
		role="switch"
		aria-checked={checked}
		aria-required="false"
		aria-disabled={disabled}
		onclick={toggleSwitch}
		onkeydown={handleKeydown}
		class={[
			'peer inline-flex h-6 min-h-6 w-11 shrink-0 cursor-pointer items-center rounded-full px-0.5 transition-all duration-200',
			'focus-visible:ring-2 focus-visible:ring-[#ff6542] focus-visible:ring-offset-2 focus-visible:ring-offset-[#262626] focus-visible:outline-none',
			'disabled:cursor-not-allowed disabled:opacity-50',
			checked
				? 'bg-[#ff6542] shadow-[inset_0_0_0_2px_rgba(255,101,66,0.3)] hover:bg-[#472f2a] hover:shadow-[inset_0_0_0_2px_rgba(255,101,66,0.3)]'
				: 'bg-[#262626] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.05)] hover:bg-[#ff6542]/30 hover:shadow-[inset_0_0_0_2px_rgba(255,101,66,0.3)]'
		]}
		{disabled}
		type="button"
		aria-label={label}
	>
		<span
			class={[
				'pointer-events-none block size-5 shrink-0 rounded-full transition-transform duration-200',
				'bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]',
				checked ? 'translate-x-5' : 'translate-x-0'
			]}
		>
		</span>
	</button>

	{#if label}
		<label
			for={switchId}
			class={[
				'cursor-pointer px-2 text-sm font-medium select-none',
				disabled ? 'cursor-not-allowed text-white/50' : 'text-inherit'
			]}
		>
			{label}
		</label>
	{/if}
</div>
