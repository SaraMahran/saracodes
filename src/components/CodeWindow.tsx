import { Fragment, useMemo, useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import type { CodeSnippet, CodeValue } from '@/data/types';
import { useTypedCount } from '@/hooks/useTypedCount';

type TokenKind = 'keyword' | 'className' | 'property' | 'operator' | 'string' | 'boolean' | 'plain';

interface Token {
  text: string;
  kind: TokenKind;
}

interface TypedToken extends Token {
  visible: string;
  hidden: string;
  /** The typing caret sits right after this token's visible text. */
  caret: boolean;
}

// Syntax colors use only the three accents plus text/muted.
const tokenClasses: Record<TokenKind, string> = {
  keyword: 'text-secondary',
  className: 'text-primary',
  property: 'text-text',
  operator: 'text-muted',
  string: 'text-tertiary',
  boolean: 'text-secondary',
  plain: 'text-muted',
};

function valueTokens(value: CodeValue): Token[] {
  if (typeof value === 'boolean') return [{ text: value ? 'True' : 'False', kind: 'boolean' }];
  if (typeof value === 'string') return [{ text: `"${value}"`, kind: 'string' }];
  return [
    { text: '[', kind: 'operator' },
    ...value.flatMap((item, index): Token[] => [
      ...(index > 0 ? [{ text: ', ', kind: 'operator' as const }] : []),
      { text: `"${item}"`, kind: 'string' },
    ]),
    { text: ']', kind: 'operator' },
  ];
}

function buildLines(snippet: CodeSnippet): Token[][] {
  return [
    [
      { text: 'class', kind: 'keyword' },
      { text: ' ', kind: 'plain' },
      { text: snippet.className, kind: 'className' },
      { text: ':', kind: 'operator' },
    ],
    ...snippet.fields.map((field): Token[] => [
      { text: '    ', kind: 'plain' },
      { text: field.name, kind: 'property' },
      { text: ' = ', kind: 'operator' },
      ...valueTokens(field.value),
    ]),
  ];
}

/** Splits every token into typed and untyped text for the first `typed` characters. */
function applyTyping(lines: Token[][], typed: number): TypedToken[][] {
  let remaining = typed;
  let caretPlaced = false;

  const result = lines.map((line) =>
    line.map((token) => {
      const count = Math.max(0, Math.min(token.text.length, remaining));
      remaining -= token.text.length;
      const hidden = token.text.slice(count);
      const caret = !caretPlaced && hidden.length > 0;
      if (caret) caretPlaced = true;
      return { ...token, visible: token.text.slice(0, count), hidden, caret };
    }),
  );

  // Fully typed: rest the caret at the end of the last line.
  const lastLine = result[result.length - 1];
  if (!caretPlaced && lastLine?.length) lastLine[lastLine.length - 1].caret = true;
  return result;
}

const Caret = () => (
  <span
    aria-hidden="true"
    className="ml-px inline-block h-[1.15em] w-[0.55em] translate-y-[0.2em] bg-primary motion-safe:animate-blink"
  />
);

/**
 * macOS-style editor card that types out a syntax-highlighted Python snippet once, when it first
 * scrolls into view. Untyped characters stay in the layout (invisible) so the card never resizes.
 * Decorative for screen readers, which get `snippet.label` instead.
 */
export function CodeWindow({ snippet }: { snippet: CodeSnippet }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  const lines = useMemo(() => buildLines(snippet), [snippet]);
  const total = useMemo(
    () => lines.flat().reduce((sum, token) => sum + token.text.length, 0),
    [lines],
  );
  const typed = useTypedCount(total, { start: inView, enabled: !reduced });
  const typedLines = applyTyping(lines, typed);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={snippet.label}
      className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-secondary" />
        <span className="h-3 w-3 rounded-full bg-tertiary" />
        <span className="h-3 w-3 rounded-full bg-primary" />
        <span className="ml-3 font-mono text-xs text-muted">{snippet.fileName}</span>
      </div>

      {/* Lines never wrap; the area scrolls horizontally only as a fallback. */}
      <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-relaxed xl:text-[14px]">
        {typedLines.map((line, lineIndex) => (
          <div key={lineIndex} className="flex gap-4">
            <span className="w-5 shrink-0 select-none text-right text-muted">{lineIndex + 1}</span>
            <code className="whitespace-pre">
              {line.map((token, tokenIndex) => (
                <Fragment key={tokenIndex}>
                  <span className={tokenClasses[token.kind]}>{token.visible}</span>
                  {token.caret && <Caret />}
                  {token.hidden && <span className="invisible">{token.hidden}</span>}
                </Fragment>
              ))}
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
}
