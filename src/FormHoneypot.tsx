/**
 * Osynligt fält som bots ofta fyller i. Riktiga användare ser det inte.
 * Måste heta `website` (matchar check-in honeypot).
 */
export function FormHoneypot() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      <label htmlFor="website">
        Webbplats
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );
}
