import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				'placeholder:text-muted-foreground flex field-sizing-content min-h-24 w-full rounded-lg border border-border/50 bg-background/5 px-4 py-3 text-base shadow-sm backdrop-blur-md transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
				'focus-visible:border-primary/50 focus-visible:ring-ring/30 focus-visible:ring-[4px] focus-visible:bg-background/10',
				'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
