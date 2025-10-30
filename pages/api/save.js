
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    const content = Buffer.from(JSON.stringify({ text })).toString('base64');
    const token = process.env.GITHUB_TOKEN;

    // Ambil SHA dari file data.json di GitHub
    const shaRes = await fetch("https://api.github.com/repos/dhyox/RText/contents/data.json", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const shaData = await shaRes.json();
    console.log("🔍 SHA RESPONSE:", shaData);

    if (!shaData.sha) {
      return res.status(500).json({ error: "Gagal mendapatkan SHA dari GitHub", detail: shaData });
    }

    // Update file data.json
    const response = await fetch("https://api.github.com/repos/dhyox/RText/contents/data.json", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "update text",
        content,
        sha: shaData.sha
      })
    });
    
    const resJson = await response.json();
    console.log("📦 SAVE RESPONSE:", resJson);

    if (response.ok) {
      res.status(200).json({ message: "Saved" });
    } else {
      res.status(500).json({ error: resJson });
    }
  } catch (err) {
    console.error("🔥 FATAL ERROR:", err);
    res.status(500).json({ error: "Failed to save text", detail: err.message });
  }
}
