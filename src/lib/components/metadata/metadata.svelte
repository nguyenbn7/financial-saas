<script lang="ts">
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import Logo from '$assets/logo.svg';
	import { page } from '$app/state';

	interface Props {
		title?: string;
		description?: string;
		image?: string;
		includeMeta?: boolean;
	}

	let {
		title,
		description,
		image = 'thumbnail.jpg',
		includeMeta: showMeta = false
	}: Props = $props();

	const { origin, pathname } = page.url;

	const SITE_NAME = $derived(PUBLIC_APP_NAME || 'Missing Site Name');

	const TITLE = $derived.by(() => {
		if (title) return `${title} - ${SITE_NAME}`;
		return SITE_NAME;
	});

	const IMAGE_META_URL = $derived(`${origin}/${image}`);
	const currentUrl = $derived(`${origin}${pathname}`);
</script>

<svelte:head>
	<link rel="shortcut icon" href={Logo} type="image/svg" />

	<title>{TITLE}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}

	{#if showMeta}
		<meta property="og:title" content={TITLE} />
		<meta property="og:type" content="Landing page" />
		<meta property="og:image" content={IMAGE_META_URL} />
		<meta property="og:url" content={currentUrl} />
		<meta property="og:image:alt" content={TITLE} />

		<!--  Non-Essential, But Recommended -->
		{#if description}
			<meta property="og:description" content={description} />
		{/if}
		<meta property="og:site_name" content={SITE_NAME} />

		{@html `<script type="application/ld+json">{
   "@context": "https://schema.org",
   "@type": "Website",
   "name": "${TITLE}",
   "url": ${currentUrl},
   "logo": ${IMAGE_META_URL} }</script>`}

		<meta name="robots" content="noindex,nofollow" />
	{/if}
</svelte:head>
