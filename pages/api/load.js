export default async function handler(req, res) {
  try {
    const endUrl = process.env.ENDPOINT_URL;
    const token = process.env.GITHUB_TOKEN;
    const response = await fetch(
      `${endUrl}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch file. Status: ${response.status}. Detail: ${errorData.message || 'Unknown API error'}`);
    }
    
    const data = await response.json();
    
    // data.content adalah base64 string. Kita parse base64 itu kembali menjadi objek JSON.
    // Objek ini sekarang dijamin memiliki { text, lastUpdated } karena save.js sudah diperbaiki.
    const parsedContent = JSON.parse(Buffer.from(data.content, 'base64').toString());
    
    // 🔥 Stop all levels of cache
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Mengembalikan objek penuh: { text: "...", lastUpdated: "..." }
    res.status(200).json(parsedContent);
  } catch (err) {
    console.error("LOAD API ERROR:", err);
    res.status(500).json({ error: "Failed to load from GitHub API", detail: err.message });
  }
}
