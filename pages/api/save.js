export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // === PERUBAHAN UTAMA: Ekstrak 'lastUpdated' selain 'text' ===
    const { text, lastUpdated } = req.body; 
    
    // Serialisasi kedua field (text dan lastUpdated) ke dalam base64
    const contentToSave = { text, lastUpdated };
    const content = Buffer.from(JSON.stringify(contentToSave)).toString('base64');
    const endUrl = process.env.ENDPOINT_URL;
    const token = process.env.GITHUB_TOKEN;

    // Ambil SHA dari file data.json di GitHub
    const shaRes = await fetch(`${endUrl}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const shaData = await shaRes.json();
    console.log("🔍 SHA RESPONSE:", shaData);

    // Periksa jika file ditemukan dan SHA valid
    if (!shaData.sha) {
        // Jika file tidak ada, SHA akan undefined. Coba tangani sebagai error atau inisiasi.
        // Dalam kasus API save/update, kita harus memiliki SHA.
        // Jika status response SHA tidak 200, berarti ada masalah (token, repo, atau file tidak ada).
        if (!shaRes.ok && shaRes.status === 404) {
             return res.status(500).json({ error: "File data.json tidak ditemukan di repositori.", detail: "Pastikan file data.json ada dan token memiliki izin." });
        }
        return res.status(500).json({ error: "Gagal mendapatkan SHA dari GitHub", detail: shaData });
    }

    // Update file data.json
    const response = await fetch(`${endUrl}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "update text and timestamp", // Pesan commit yang lebih deskriptif
        content,
        sha: shaData.sha
      })
    });
    
    const resJson = await response.json();
    console.log("📦 SAVE RESPONSE:", resJson);

    if (response.ok) {
      res.status(200).json({ message: "Saved successfully" });
    } else {
      res.status(500).json({ 
        error: "GitHub API Save Failed", 
        detail: resJson.message || resJson,
        status: response.status
      });
    }
  } catch (err) {
    console.error("🔥 FATAL ERROR:", err);
    res.status(500).json({ error: "Failed to save text", detail: err.message });
  }
}
