// place files you want to import through the `$lib` alias in this folder.
function rsplit(s: string, sep: string, maxsplit: number) {
	var split = s.split(sep);
	return maxsplit ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit)) : split;
}
