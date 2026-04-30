export default async function handler(req, res) {
  const { type, ...params } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  // Ensure type is valid
  if (type !== 'weather' && type !== 'forecast') {
    return res.status(400).json({ error: 'Invalid weather endpoint type' });
  }

  const url = new URL(`https://api.openweathermap.org/data/2.5/${type}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value as string);
  }
  url.searchParams.append('appid', apiKey);
  url.searchParams.append('units', 'imperial'); // Force imperial for consistency

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Weather Proxy Error:', error);
    return res.status(500).json({ error: 'Failed to fetch from OpenWeatherMap' });
  }
}
