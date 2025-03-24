<script lang="ts">
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import Logo from '$assets/logo.svg';
	import { page } from '$app/state';

	interface Props {
		title?: string;
		description?: string;
		image?: string;
	}

	let { title = 'Home', description = '', image = 'marketing.jpg' }: Props = $props();

	const siteName = PUBLIC_APP_NAME;
	let imageUrl = $derived(`${page.url.origin}/${image}`);
	let currentUrl = $derived(`${page.url.origin}${page.url.pathname}`);
</script>

<svelte:head>
	<link rel="shortcut icon" href={Logo} type="image/svg" />

	<title>{title} - {siteName}</title>
	<meta name="description" content={description} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:url" content={currentUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />

	<meta property="og:url" content={currentUrl} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:site_name" content={siteName} />

	{@html `<script type="application/ld+json">{
   "@context": "https://schema.org",
   "@type": "Website",
   "name": "${title} - ${siteName}",
   "url": ${currentUrl},
   "logo": ${imageUrl} }</script>`}

	<meta name="robots" content="noindex,nofollow" />
</svelte:head>
