<script lang="ts" module>
	let promise: { resolve: (value: boolean) => void } | null = $state(null);

	export const getConfirmation: () => Promise<boolean | null> = () =>
		new Promise((resolve, _) => {
			promise = { resolve };
		});
</script>

<script lang="ts">
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '$lib/components/ui/alert-dialog';

	interface Props {
		open?: boolean;
		title?: string;
		description?: string;
	}

	let { open = $bindable(false), title = '', description = '' }: Props = $props();

	const handleClose = () => {
		promise = null;
	};

	const handleConfirm = () => {
		promise?.resolve(true);
		handleClose();
		open = false;
	};

	const handleCancel = () => {
		promise?.resolve(false);
		handleClose();
	};
</script>

<AlertDialog bind:open>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>
				{title && title.length ? title : 'Are you absolutely sure?'}
			</AlertDialogTitle>
			<AlertDialogDescription>
				{description && description.length
					? description
					: 'This action cannot be undone. This will permanently delete your data.'}
			</AlertDialogDescription>
		</AlertDialogHeader>

		<AlertDialogFooter>
			<AlertDialogCancel onclick={handleCancel}>Cancel</AlertDialogCancel>
			<AlertDialogAction onclick={handleConfirm}>Continue</AlertDialogAction>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
