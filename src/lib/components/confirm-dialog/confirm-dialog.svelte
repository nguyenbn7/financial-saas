<script lang="ts">
	import { useConfirm } from '$lib/components/confirm-dialog';

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
		title?: string;
		description?: string;
	}

	const defaultTitle = 'Are you absolutely sure?';
	const defaultDescription =
		'This action cannot be undone. This will permanently delete your data.';

	let { title, description }: Props = $props();

	const {
		promise,
		title: titleFromConfirm,
		description: descriptionFromConfirm,
		handleConfirm,
		handleCancel
	} = useConfirm();

	const dialogTitle = $derived($titleFromConfirm || title || defaultTitle);
	const dialogDescription = $derived($descriptionFromConfirm || description || defaultDescription);
</script>

<AlertDialog open={$promise !== null}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>
				{dialogTitle}
			</AlertDialogTitle>
			<AlertDialogDescription>
				{dialogDescription}
			</AlertDialogDescription>
		</AlertDialogHeader>

		<AlertDialogFooter>
			<AlertDialogCancel onclick={handleCancel}>Cancel</AlertDialogCancel>
			<AlertDialogAction onclick={handleConfirm}>Continue</AlertDialogAction>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
