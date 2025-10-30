
import { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const loadText = async () => {
    setLoading(true);
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
      resize: 'vertical'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem'
    },
    button: {
      padding: '0.5rem 1.5rem',
      fontSize: '1rem',
      borderRadius: '0.3rem',
      border: '1px solid transparent',
      backgroundColor: '#181818ff',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
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
          <p style={{ textAlign: 'center' }}>Memuat...</p>
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
              <button style={styles.button}onClick={saveText}>Simpan</button>
              <button
                style={{ ...styles.button, backgroundColor: '#6c757d' }}
                onClick={loadText}
                disabled={loading}
              >
                {loading ? 'Memuat...' : 'Load'}
              </button>
            </div>
          </>
        )}
      </main>
      {/* <footer style={styles.footer}>
        Dibuat oleh <strong> D </strong> 
      </footer> */}
    </div>
  );
}
