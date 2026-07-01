import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const sources = [
  {
    url: 'https://kungalvsbtk.se/wp-content/uploads/2022/07/UDY9DVKw-4.png',
    file: 'kbtk-logo.png',
  },
  {
    url: 'https://kungalvsbtk.se/wp-content/uploads/2022/07/cropped-UDY9DVKw-4-192x192.png',
    file: 'favicon.png',
  },
];

for (const { url, file } of sources) {
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Failed ${url}: ${res.status}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(publicDir, file), buf);
  console.log(`Saved ${file} (${buf.length} bytes)`);
}
