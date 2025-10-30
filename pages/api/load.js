export default async function handler(req, res) {
  try {
    const token = process.env.GITHUB_TOKEN;
    const response = await fetch(
      "https://api.github.com/repos/dhyox/RText/contents/data.json",
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      }
    );
    const data = await response.json();
    const text = JSON.parse(Buffer.from(data.content, 'base64').toString());
    
    // 🔥 Stop all levels of cache
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json(text);
  } catch (err) {
    console.error("LOAD API ERROR:", err);
    res.status(500).json({ error: "Failed to load from GitHub API" });
  }
}
