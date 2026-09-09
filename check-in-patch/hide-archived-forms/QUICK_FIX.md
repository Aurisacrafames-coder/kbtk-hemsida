# Snabbfix (sök/ersätt)

I kbtk-checkin, sök efter (eller motsvarande med andra variabelnamn):

```ts
.filter((e) => statusFilter === 'all' || e.status === statusFilter)
```

eller i byggd/minifierad form:

```js
.filter(e=>"all"===o||e.status===o)
```

Ersätt med:

```ts
.filter((e) =>
  statusFilter === 'all' ? e.status !== 'archived' : e.status === statusFilter,
)
```

Byt också option-texten `Alla` → `Aktiva` på statusfiltret i samma panel.
