import { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const loadText = async () => {
    setLoading(true);
    // Tambahkan delay kecil untuk demonstrasi loading
    await new Promise(resolve => setTimeout(resolve, 500)); 
    const res = await fetch('/api/load?ts=' + Date.now());
    const data = await res.json();
    setText(data.text || '');
    setLoading(false);
  };

  useEffect(() => {
    loadText();
  }, []);

  const saveText = async () => {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (res.ok) {
      alert('Tersimpan!');
    } else {
      alert('Gagal menyimpan.');
    }
  };

  // 1. TAMBAHKAN STATE UNTUK MELACAK TOMBOL YANG DITEKAN
  const [isSimpanActive, setIsSimpanActive] = useState(false);
  const [isLoadActive, setIsLoadActive] = useState(false);

  const styles = {
    container: {
      fontFamily: 'sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#181818ff',
      padding: '2rem'
    },
    main: {
      maxWidth: '700px',
      width: '100%',
      margin: '0 auto'
    },
    title: {
      color: '#ffffffff',
      fontSize: '2rem',
      fontWeight: '600',
      marginBottom: '1rem',
      textAlign: 'center'
    },
    textarea: {
      width: '100%',
      padding: '1rem',
      fontSize: '1rem',
      borderRadius: '0.3rem',
      border: '1px solid #1f1f1fff',
      marginBottom: '1rem',
      resize: 'vertical',
      backgroundColor: '#2c2c2c', // Sedikit perubahan untuk kontras
      color: '#ffffff'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem'
    },
    // 2. GAYA TOMBOL BARU DARI UIVERSE
    newButton: {
      color: '#fff',
      padding: '0.7em 1.7em', // Padding dari Uiverse
      fontSize: '18px',
      borderRadius: '0.5em',
      background: '#212121',
      border: '1px solid #212121',
      transition: 'all 0.3s',
      boxShadow: '6px 6px 12px #000, -6px -6px 12px #2f2f2f',
      cursor: 'pointer',
      // Reset properti yang mungkin diatur di tempat lain
      outline: 'none', 
    },
    // 3. GAYA TOMBOL BARU UNTUK STATE :ACTIVE (TEKAN)
    newButtonActive: {
      color: '#666',
      boxShadow: 'inset 4px 4px 12px #000, inset -4px -4px 12px #1f1f1f',
      background: '#212121', // Pastikan background tetap saat ditekan
    },
    footer: {
      textAlign: 'center',
      fontSize: '0.9rem',
      color: '#6c757d',
      marginTop: '2rem',
      borderTop: '1px solid #dee2e6',
      paddingTop: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <h1 style={styles.title}>RTeks</h1>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#ffffffff' }}>Memuat...</p>
        ) : (
          <>
            <textarea
              rows="10"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tulis sesuatu di sini..."
              style={styles.textarea}
            />
            <div style={styles.buttonGroup}>
              {/* TOMBOL SIMPAN */}
              <button
                // Terapkan gaya default tombol baru
                style={{ 
                    ...styles.newButton, 
                    // Terapkan gaya active jika isSimpanActive true
                    ...(isSimpanActive ? styles.newButtonActive : {}) 
                }}
                onClick={saveText}
                onMouseDown={() => setIsSimpanActive(true)}
                onMouseUp={() => setIsSimpanActive(false)}
                onMouseLeave={() => setIsSimpanActive(false)}
              >
                Simpan
              </button>
              
              {/* TOMBOL LOAD */}
              <button
                // Terapkan gaya default tombol baru
                style={{ 
                    ...styles.newButton, 
                    // Sedikit ubah warna untuk tombol 'Load' agar berbeda
                    background: '#6c757d', 
                    border: '1px solid #6c757d',
                    ...(isLoadActive ? styles.newButtonActive : {}) 
                }}
                onClick={loadText}
                disabled={loading}
                onMouseDown={() => setIsLoadActive(true)}
                onMouseUp={() => setIsLoadActive(false)}
                onMouseLeave={() => setIsLoadActive(false)}
              >
                {loading ? 'Memuat...' : 'Load'}
              </button>
            </div>
          </>
        )}
      </main>
      <footer style={styles.footer}>
        Dibuat dengan React & Cinta
      </footer>
    </div>
  );
}