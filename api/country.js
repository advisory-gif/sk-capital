// Vercel adds this two-letter, IP-derived country header at its edge.
// No IP address or location is returned to the browser or stored by this handler.
// https://vercel.com/docs/headers/request-headers#x-vercel-ip-country
export default function handler(request, response) {
  response.setHeader('Cache-Control', 'private, no-store, max-age=0');
  response.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  const rawCountry = request.headers['x-vercel-ip-country'];
  const country = typeof rawCountry === 'string' && /^[A-Z]{2}$/i.test(rawCountry) ? rawCountry.toUpperCase() : null;
  return response.status(200).json({ country });
}
