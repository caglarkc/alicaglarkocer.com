import { Fragment } from 'react';
import { ArrowUpRight } from 'lucide-react';

import type { Block } from '@/lib/projects';

/** `kod` ve **kalın** işaretlemesini satır içinde çözer. */
function Inline({ text }: { text: string }) {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return (
    <>
      {tokens.map((token, index) => {
        if (token.length > 2 && token.startsWith('`') && token.endsWith('`')) {
          return <code key={index}>{token.slice(1, -1)}</code>;
        }

        if (token.length > 4 && token.startsWith('**') && token.endsWith('**')) {
          return <strong key={index}>{token.slice(2, -2)}</strong>;
        }

        return <Fragment key={index}>{token}</Fragment>;
      })}
    </>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'text':
      return (
        <>
          {block.body.map((paragraph, index) => (
            <p className="doc-p" key={index}>
              <Inline text={paragraph} />
            </p>
          ))}
        </>
      );

    case 'heading':
      return <h3 className="doc-h3">{block.text}</h3>;

    case 'list':
      return block.ordered
        ? (
          <ol className="doc-list doc-list--ordered">
            {block.items.map((item, index) => (
              <li key={index}>
                <Inline text={item} />
              </li>
            ))}
          </ol>
        )
        : (
          <ul className="doc-list">
            {block.items.map((item, index) => (
              <li key={index}>
                <Inline text={item} />
              </li>
            ))}
          </ul>
        );

    case 'table':
      return (
        <div className="doc-table-scroll">
          <table className="doc-table">
            <thead>
              <tr>
                {block.head.map((cell) => <th key={cell} scope="col">{cell}</th>)}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'code':
      return (
        <pre className="doc-code">
          <code>{block.code}</code>
        </pre>
      );

    case 'diagram':
      return (
        <pre className="doc-code doc-code--diagram">
          <code>{block.code}</code>
        </pre>
      );

    case 'quote':
      return (
        <blockquote className="doc-quote">
          <Inline text={block.body} />
        </blockquote>
      );

    case 'links':
      return (
        <ul className="doc-links">
          {block.items.map((item) => (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                <span>{item.label}</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
              {item.note ? <em> — {item.note}</em> : null}
            </li>
          ))}
        </ul>
      );
  }
}
