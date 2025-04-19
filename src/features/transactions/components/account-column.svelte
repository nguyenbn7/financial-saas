<script lang="ts">
	import { useEditAccount } from '$features/accounts/hooks/use-edit-account';

	interface Props {
		account: string;
		accountId: string;
	}

	let { account, accountId }: Props = $props();

	const { onOpen } = useEditAccount();
</script>

<button class="flex items-center cursor-pointer hover:underline" onclick={() => onOpen(accountId)}>
	{account}
</button>
