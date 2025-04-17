<script lang="ts">
	interface Props {
		account: string;
		accountId: string;
	}

	let { account, accountId }: Props = $props();
</script>

<button
	class="flex items-center cursor-pointer hover:underline"
	onclick={() => {
		// TODO: open sheet
		console.log(accountId);
	}}
>
	{account}
</button>
