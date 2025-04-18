<script lang="ts">
	import { openEditAccountSheet } from '$features/accounts/components/edit-account-sheet';

	interface Props {
		account: string;
		accountId: string;
	}

	let { account, accountId }: Props = $props();
</script>

<button
	class="flex items-center cursor-pointer hover:underline"
	onclick={() => {
		openEditAccountSheet(accountId);
	}}
>
	{account}
</button>
