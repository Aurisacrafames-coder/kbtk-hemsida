import { useState } from 'react';
import {
  CLUB_SWISH_NUMBER,
  CLUB_SWISH_NUMBER_DISPLAY,
  copyText,
} from './lib/swish';

type SwishPaymentPanelProps = {
  purpose: string;
  amount?: number | null;
  message: string;
  checkboxName: string;
  checkboxLabel: string;
  requireAmountField?: boolean;
};

export function SwishPaymentPanel({
  purpose,
  amount,
  message,
  checkboxName,
  checkboxLabel,
  requireAmountField = false,
}: SwishPaymentPanelProps) {
  const [copiedField, setCopiedField] = useState<'number' | 'message' | null>(null);

  async function handleCopy(field: 'number' | 'message', value: string) {
    const ok = await copyText(value);
    if (!ok) return;
    setCopiedField(field);
    window.setTimeout(() => setCopiedField(null), 2000);
  }

  return (
    <section className="swish-flow" aria-labelledby="swish-flow-title">
      <h3 id="swish-flow-title">Betala med Swish innan du skickar in</h3>
      <p className="swish-flow-lead">
        Anmälan behandlas när klubben ser betalningen på Swish. Följ stegen nedan i ordning.
      </p>

      <ol className="swish-flow-steps">
        <li>
          <span className="swish-step-title">Swisha till klubben</span>
          <div className="swish-copy-row">
            <strong>{CLUB_SWISH_NUMBER_DISPLAY}</strong>
            <button
              type="button"
              className="swish-copy-button"
              onClick={() => void handleCopy('number', CLUB_SWISH_NUMBER)}
            >
              {copiedField === 'number' ? 'Kopierat' : 'Kopiera nummer'}
            </button>
          </div>
          {amount ? (
            <p className="swish-step-note">
              Belopp: <strong>{amount.toLocaleString('sv-SE')} kr</strong>
            </p>
          ) : null}
        </li>

        <li>
          <span className="swish-step-title">Skriv detta i Swish-meddelandet</span>
          <div className="swish-copy-row">
            <code className="swish-message-preview">{message || purpose}</code>
            <button
              type="button"
              className="swish-copy-button"
              onClick={() => void handleCopy('message', message || purpose)}
            >
              {copiedField === 'message' ? 'Kopierat' : 'Kopiera text'}
            </button>
          </div>
          <p className="swish-step-note">Använd samma text så att klubben kan matcha betalningen.</p>
        </li>

        <li>
          <span className="swish-step-title">Bekräfta och skicka formuläret</span>
          {requireAmountField ? (
            <label className="swish-amount-field">
              Belopp du swishat (kr)
              <input
                name="swish_amount"
                type="number"
                min={1}
                step={1}
                required
                inputMode="numeric"
                placeholder="T.ex. 200"
              />
            </label>
          ) : null}
          <label className="checkbox-row swish-confirm-row">
            <input type="checkbox" name={checkboxName} required />
            <span>{checkboxLabel}</span>
          </label>
        </li>
      </ol>
    </section>
  );
}
