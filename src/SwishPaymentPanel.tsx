import { useState } from 'react';
import {
  CLUB_SWISH_NUMBER,
  CLUB_SWISH_NUMBER_DISPLAY,
  SWISH_MESSAGE_MAX_LENGTH,
  copyText,
} from './lib/swish';

export type SwishFeeLine = {
  label: string;
  amountSek: number;
};

type SwishPaymentPanelProps = {
  purpose: string;
  amount?: number | null;
  message: string;
  checkboxName: string;
  checkboxLabel: string;
  requireAmountField?: boolean;
  /** `after_trial` = betalning efter provträning, inte före inskick. */
  timing?: 'before_submit' | 'after_trial';
  feeBreakdown?: SwishFeeLine[];
  feeNote?: string;
};

export function SwishPaymentPanel({
  purpose,
  amount,
  message,
  checkboxName,
  checkboxLabel,
  requireAmountField = false,
  timing = 'before_submit',
  feeBreakdown,
  feeNote,
}: SwishPaymentPanelProps) {
  const [copiedField, setCopiedField] = useState<'number' | 'message' | null>(null);
  const afterTrial = timing === 'after_trial';

  async function handleCopy(field: 'number' | 'message', value: string) {
    const ok = await copyText(value);
    if (!ok) return;
    setCopiedField(field);
    window.setTimeout(() => setCopiedField(null), 2000);
  }

  return (
    <section className="swish-flow" aria-labelledby="swish-flow-title">
      <h3 id="swish-flow-title">
        {afterTrial
          ? 'Så swishar du medlems- och träningsavgiften'
          : 'Betala med Swish innan du skickar in'}
      </h3>
      <p className="swish-flow-lead">
        {afterTrial
          ? 'Du swishar inte nu. Om du vill fortsätta efter provträningen gör du det senast inom en vecka.'
          : 'Anmälan behandlas när klubben ser betalningen på Swish. Följ stegen nedan i ordning.'}
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
          {feeBreakdown && feeBreakdown.length > 0 ? (
            <ul className="swish-fee-breakdown">
              {feeBreakdown.map((line) => (
                <li key={line.label}>
                  {line.label}: <strong>{line.amountSek.toLocaleString('sv-SE')} kr</strong>
                </li>
              ))}
            </ul>
          ) : null}
          {amount ? (
            <p className="swish-fee-total">
              Totalt att swisha: <strong>{amount.toLocaleString('sv-SE')} kr</strong>
            </p>
          ) : null}
          {!amount && feeNote ? <p className="swish-step-note">{feeNote}</p> : null}
          {!feeBreakdown?.length && amount && !afterTrial ? (
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
          <p className="swish-step-note">
            Använd samma text så att klubben kan matcha betalningen. Max{' '}
            {SWISH_MESSAGE_MAX_LENGTH} tecken i Swish.
          </p>
        </li>

        <li>
          <span className="swish-step-title">
            {afterTrial ? 'Bekräfta och skicka intresseanmälan' : 'Bekräfta och skicka formuläret'}
          </span>
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
