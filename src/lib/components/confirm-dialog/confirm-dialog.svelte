<script lang="ts" module>
	const defaultTitle = 'Are you absolutely sure?';
	const defaultDescription =
		'This action cannot be undone. This will permanently delete your data.';
	const defaultAutoOpen = true;

	let promise: { resolve: (value: boolean) => void } | null = $state(null);

	let autoOpen = $state(defaultAutoOpen);
	var titleFromFunction = $state(defaultTitle);
	var descriptionFromFunction = $state(defaultDescription);

	type Options = {
		title?: string;
		description?: string;
		autoOpen?: boolean;
	};

	export async function confirm(
		options: Options = {
			title: defaultTitle,
			description: defaultDescription,
			autoOpen: true
		}
	) {
		titleFromFunction = options.title ?? defaultTitle;
		descriptionFromFunction = options.description ?? defaultDescription;
		autoOpen = options.autoOpen ?? defaultAutoOpen;

		return new Promise<boolean | null>((resolve, reject) => {
			promise = { resolve };
		});
	}
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

	let {
		open = $bindable(false),
		title = defaultTitle,
		description = defaultDescription
	}: Props = $props();

	const handleClose = () => {
		promise = null;
		autoOpen = false;
		open = false;
	};

	const handleConfirm = () => {
		promise?.resolve(true);
		handleClose();
	};

	const handleCancel = () => {
		promise?.resolve(false);
		handleClose();
	};

	let dialogTitle = $derived(titleFromFunction || title || defaultTitle);
	let dialogDescription = $derived(descriptionFromFunction || description || defaultDescription);

	$effect(() => {
		if (autoOpen && !open) open = true;
	});
</script>

<AlertDialog bind:open>
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
