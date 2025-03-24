import type { z } from 'zod';
import type { SuperForm } from 'sveltekit-superforms';
import type { categoryFormSchema } from '../schemas';

export type CategoryFormValues = SuperForm<z.infer<typeof categoryFormSchema>>;

export { default as CategoryForm } from './category-form.svelte';
export { default as CategorySheet } from './category-sheet.svelte';
