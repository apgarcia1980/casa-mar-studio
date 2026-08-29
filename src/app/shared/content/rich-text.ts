export type RichTextBlock =
  | { readonly kind: 'paragraph'; readonly text: string }
  | { readonly kind: 'heading'; readonly level: 2 | 3; readonly text: string }
  | { readonly kind: 'quote'; readonly text: string; readonly attribution?: string };

export interface RichTextDocument {
  readonly blocks: readonly RichTextBlock[];
}
