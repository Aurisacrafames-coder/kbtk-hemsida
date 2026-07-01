import { useEffect, useId, useRef, useState } from 'react';
import { FAQ_STARTER_QUESTIONS } from './lib/faq-knowledge';
import { searchFaq } from './lib/faq-search';

type ChatMessage = {
  id: string;
  role: 'bot' | 'user';
  text: string;
  link?: { label: string; href: string };
  suggestions?: string[];
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function starterMessage(): ChatMessage {
  return {
    id: 'welcome',
    role: 'bot',
    text: 'Hej! Jag hjälper dig hitta svar om träning, avgifter, provträning och annat på hemsidan. Ställ en fråga eller välj ett förslag nedan.',
    suggestions: FAQ_STARTER_QUESTIONS,
  };
}

function buildBotReply(query: string): ChatMessage {
  const result = searchFaq(query);

  if (result.confident && result.best) {
    return {
      id: createId(),
      role: 'bot',
      text: result.best.answer,
      link: result.best.link,
    };
  }

  if (result.entries.length > 0) {
    return {
      id: createId(),
      role: 'bot',
      text: 'Jag är inte helt säker, men det här kan vara relevant:',
      suggestions: result.entries.map((entry) => entry.question),
    };
  }

  return {
    id: createId(),
    role: 'bot',
    text: 'Jag hittar inget bra svar på det. Prova att formulera om frågan, eller kontakta klubben så hjälper vi dig vidare.',
    link: { label: 'Kontaktformulär', href: '/form/kontakt' },
    suggestions: FAQ_STARTER_QUESTIONS,
  };
}

export function FaqBot() {
  const panelId = useId();
  const inputId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage()]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, open]);

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      { id: createId(), role: 'user', text: trimmed },
      buildBotReply(trimmed),
    ]);
    setDraft('');
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    ask(draft);
  }

  return (
    <div className={`faq-bot${open ? ' faq-bot-open' : ''}`}>
      {open ? (
        <section
          className="faq-bot-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${panelId}-title`}
        >
          <header className="faq-bot-header">
            <div>
              <p className="faq-bot-eyebrow">KBTK hjälp</p>
              <h2 id={`${panelId}-title`}>Vanliga frågor</h2>
            </div>
            <button
              type="button"
              className="faq-bot-close"
              aria-label="Stäng hjälp"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>

          <div className="faq-bot-messages" ref={listRef} aria-live="polite">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`faq-bot-message faq-bot-message-${message.role}`}
              >
                <p>{message.text}</p>
                {message.link ? (
                  <a className="faq-bot-link" href={message.link.href}>
                    {message.link.label}
                  </a>
                ) : null}
                {message.suggestions ? (
                  <div className="faq-bot-suggestions">
                    {message.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="faq-bot-suggestion"
                        onClick={() => ask(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <form className="faq-bot-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor={inputId}>
              Ställ en fråga
            </label>
            <input
              id={inputId}
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="T.ex. vad kostar det att börja?"
              autoComplete="off"
            />
            <button type="submit" disabled={!draft.trim()}>
              Skicka
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="faq-bot-toggle"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Stäng hjälp' : 'Fråga KBTK'}
      </button>
    </div>
  );
}
