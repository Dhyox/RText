import { useEffect, useState } from 'react';

// Variabel global yang disediakan oleh environment Canvas untuk Firebase (Tidak digunakan dalam implementasi ini)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Ganti alert bawaan dengan fungsi untuk menampilkan pesan di UI (sesuai instruksi)
const useMessage = () => {
  const [message, setMessage] = useState(null);
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };
  return [message, showMessage];
};

// Fungsi untuk memformat tanggal
const formatTimestamp = (date) => {
    // Menggunakan opsi bahasa Indonesia untuk format yang jelas
    // Default locale: 'en-US'
    return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false // Menggunakan format 24 jam
    }).format(date);
};


export default function Home() {
  const [text, setText] = useState('');
  // State baru untuk menyimpan timestamp terakhir disimpan
  const [lastUpdated, setLastUpdated] = useState('Belum pernah disimpan');
  
  const [loading, setLoading] = useState(true);
  const [isSimpanActive, setIsSimpanActive] = useState(false);
  const [isLoadActive, setIsLoadActive] = useState(false);
  const [message, showMessage] = useMessage();


  // --- FUNGSI LOAD DENGAN PANGGILAN API BARU ---
  const loadText = async () => {
    setLoading(true);
    try {
      // Panggil endpoint API yang di-host oleh load.js
      const response = await fetch('/api/load', {
        method: 'GET',
        // Penting: Nonaktifkan cache untuk memastikan selalu mendapatkan data terbaru
        headers: { 'Cache-Control': 'no-cache' } 
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mengambil properti 'text' dari respons JSON
      const loadedText = data.text || 'Teks awal. Mulai mengetik di sini!';
      
      // Mengambil properti 'timestamp' atau 'lastUpdated' dari respons JSON
      // data.lastUpdated digunakan untuk mengatasi format data.json Anda
      // data.timestamp digunakan untuk format yang digunakan oleh fungsi saveText
      const loadedTimestamp = data.lastUpdated || data.timestamp; 

      setText(loadedText);
      
      // Jika timestamp dimuat dari API, gunakan itu. Jika tidak, tetap gunakan default.
      if (loadedTimestamp) {
        setLastUpdated(formatTimestamp(new Date(loadedTimestamp)));
      } else {
        setLastUpdated('Data dimuat, tetapi tidak ada info waktu simpan.');
      }
      
      showMessage('Text Loaded');
    } catch (error) {
      console.error("Error loading text from API:", error);
      // Fallback ke teks default jika gagal memuat
      setText('Gagal memuat teks dari GitHub. Mulai mengetik di sini!'); 
      setLastUpdated('Gagal memuat info waktu simpan.');
      showMessage('Failed load text', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadText();
  }, []);

  // --- FUNGSI SAVE DENGAN PANGGILAN API BARU ---
  const saveText = async () => {
    setLoading(true);
    try {
        // Buat timestamp saat ini
        const now = new Date();
        const timestampString = now.toISOString(); // Format ISO untuk penyimpanan

        // Panggil endpoint API yang di-host oleh save.js
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            // Kirim teks dan timestamp saat ini sebagai JSON. 
            // Menggunakan kunci 'lastUpdated' untuk konsistensi dengan data.json Anda
            body: JSON.stringify({ 
                text: text,
                lastUpdated: timestampString 
            }), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Save API Error Detail:", errorData);
            throw new Error(`Gagal menyimpan. Status: ${response.status}. Detail: ${errorData.error || 'Unknown error'}`);
        }
        
        // Update state local setelah berhasil disimpan
        setLastUpdated(formatTimestamp(now));
        showMessage('Text Saved!');
    } catch (error) {
        console.error("Error saving text to API:", error);
        showMessage(`Gagal menyimpan: ${error.message.substring(0, 50)}...`, 'error');
    } finally {
        setLoading(false);
    }
  };

  const styles = {
    container: {
      fontFamily: '"Inter", sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      // Mengaktifkan kembali pemusatan horizontal secara tegas untuk semua item
      alignItems: 'center', 
      backgroundColor: '#181818', // Background utama
      padding: '2rem 1rem', // Padding responsif
      width: '100%', // Pastikan kontainer mengambil lebar penuh
      
      // --- PERBAIKAN SCROLL BAR ---
      // Mencegah scroll horizontal (yang sering terjadi karena padding/margin)
      overflowX: 'hidden', 
      // Memastikan padding tidak menyebabkan overflow di luar lebar 100%
      boxSizing: 'border-box',
      // ----------------------------
    },
    // GANTI styles.main menjadi styles.card dengan gaya neumorphic
    card: {
      maxWidth: '700px',
      width: '75%',
      // **PERBAIKAN BARU**: Hapus flexGrow dan tambahkan margin vertikal
      margin: '2rem auto', // Margin atas dan bawah 2rem, horizontal auto untuk pemusatan
      padding: '2rem',
      borderRadius: '1.5rem',
      backgroundColor: '#212121', // Background yang sama dengan tombol
      // Shadow Neumorphic
      boxShadow: '8px 8px 16px #000, -8px -8px 16px #333333',
      
      // --- PERBAIKAN PENTING UNTUK TEXTAREA ---
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch', // Memastikan elemen anak (textarea) mengisi lebar penuh (di dalam padding card)
      // ----------------------------------------
    },
    title: {
      color: '#ffffffff',
      fontSize: '2.5rem', 
      fontWeight: '800', 
      marginBottom: '1rem', // Kurangi margin
      textAlign: 'center',
      letterSpacing: '0.1em', 
      textShadow: '0 4px 8px rgba(0, 0, 0, 0.5), 0 -4px 8px rgba(47, 47, 47, 0.2)',
      transition: 'all 0.3s ease',
    },
    // Gaya untuk timestamp
    timestamp: {
        color: '#aaaaaa',
        textAlign: 'center',
        fontSize: '0.9rem',
        marginBottom: '2rem', // Tambahkan margin bawah untuk memisahkan dari textarea
    },
    // Sesuaikan textarea untuk efek cekung
    textarea: {
      // --- PERUBAHAN PENTING ---
      padding: '1rem',
      fontSize: '1rem',
      borderRadius: '0.5rem',
      border: 'none', // Hapus border
      marginBottom: '1rem',
      resize: 'vertical',
      backgroundColor: '#181818', // Samakan dengan background container luar untuk ilusi cekung
      color: '#ffffff',
      // Inner shadow untuk efek cekung
      boxShadow: 'inset 4px 4px 8px #000, inset -4px -4px 8px #333333',
      // Tambahkan ini untuk memastikan lebar dihitung secara benar
      boxSizing: 'border-box', 
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap', // Pastikan responsif
    },
    // Gaya Tombol dari UIVERSE (Neumorphic Dark)
    newButton: {
      color: '#fff',
      padding: '0.7em 1.7em', 
      fontSize: '18px',
      borderRadius: '0.5em',
      background: '#212121',
      border: '1px solid #212121',
      transition: 'all 0.3s',
      boxShadow: '6px 6px 12px #000, -6px -6px 12px #2f2f2f',
      cursor: 'pointer',
      outline: 'none', 
    },
    // Gaya Tombol untuk State :ACTIVE (Tekan)
    newButtonActive: {
      color: '#666',
      boxShadow: 'inset 4px 4px 12px #000, inset -4px -4px 12px #1f1f1f',
      background: '#212121', 
    },
    footer: {
      textAlign: 'center',
      fontSize: '0.9rem',
      color: '#6c757d',
      marginTop: '2rem',
      borderTop: '1px solid #2c2c2c', // Sesuaikan warna border footer
      paddingTop: '1rem',
      width: '100%', // Pastikan footer mengambil lebar penuh
    },
    messageBox: {
        position: 'fixed',
        top: '1rem',
        right: '',
        backgroundColor: (message && message.type === 'error') ? '#dc3545' : '#4caf50',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        opacity: message ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
    }
  };

  return (
    <div style={styles.container}>
      {/* Kotak Pesan */}
      <div style={styles.messageBox}>
        {message ? message.text : ''}
      </div>

      {/* Terapkan styles.card ke elemen utama */}
      <main style={styles.card}>
        <h1 style={styles.title}>Text Space</h1>
        
        {/* Tambahkan Timestamp di bawah judul */}
        <p style={styles.timestamp}>
            Last Updated: <strong>{lastUpdated}</strong>
        </p>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: '#ffffffff' }}>Loading...</p>
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
              {/* TOMBOL LOAD */}
              <button
                style={{ 
                    ...styles.newButton, 
                    background: '#5c636a', // Sedikit ubah warna untuk tombol 'Load'
                    border: '1px solid #5c636a',
                    ...(isLoadActive ? styles.newButtonActive : {}) 
                }}
                onClick={loadText}
                disabled={loading}
                onMouseDown={() => setIsLoadActive(true)}
                onMouseUp={() => setIsLoadActive(false)}
                onMouseLeave={() => setIsLoadActive(false)}
              >
                {loading ? 'Loading...' : 'Load'}
              </button>
              {/* TOMBOL SIMPAN */}
              <button
                style={{ 
                    ...styles.newButton, 
                    ...(isSimpanActive ? styles.newButtonActive : {}) ,
                    background: '#007bff', // Warna menonjol untuk Simpan
                    border: '1px solid #007bff',
                }}
                onClick={saveText}
                onMouseDown={() => setIsSimpanActive(true)}
                onMouseUp={() => setIsSimpanActive(false)}
                onMouseLeave={() => setIsSimpanActive(false)}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </>
        )}
      </main>
      <footer style={styles.footer}>
        "Made with React & Love" -Dhyox 
      </footer>
    </div>
  );
}
