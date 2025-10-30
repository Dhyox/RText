import { useEffect, useState } from 'react';

// Variabel global yang disediakan oleh environment Canvas untuk Firebase
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Ganti alert bawaan dengan fungsi untuk menampilkan pesan di UI (sesuai instruksi)
const useMessage = () => {
  const [message, setMessage] = useState(null);
  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };
  return [message, showMessage];
};


export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSimpanActive, setIsSimpanActive] = useState(false);
  const [isLoadActive, setIsLoadActive] = useState(false);
  const [message, showMessage] = useMessage();


  // NOTE: Di lingkungan nyata, ini akan berinteraksi dengan API backend, 
  // bukan Firebase langsung. Kami mempertahankan struktur API call yang ada 
  // untuk simulasi sederhana.

  const loadText = async () => {
    // Karena kita tidak memiliki endpoint API yang sebenarnya di sini, 
    // kita akan menggunakan localStorage sebagai fallback untuk simulasi, 
    // sambil mempertahankan struktur async.
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const loadedText = localStorage.getItem('editorText') || 'Teks awal. Mulai mengetik di sini!';
      setText(loadedText);
      showMessage('Teks dimuat.');
    } catch (error) {
      console.error("Error loading text:", error);
      showMessage('Gagal memuat teks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadText();
  }, []);

  const saveText = async () => {
    // Simulasi penyimpanan ke API/database menggunakan localStorage
    try {
      localStorage.setItem('editorText', text);
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulasi latensi
      showMessage('Tersimpan!');
    } catch (error) {
      console.error("Error saving text:", error);
      showMessage('Gagal menyimpan.');
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
      width: '100%',
      // --- PERBAIKAN RESPONSIVITAS ---
      // **PERBAIKAN BARU**: Hapus flexGrow dan tambahkan margin vertikal
      margin: '2rem auto', // Margin atas dan bawah 2rem, horizontal auto untuk pemusatan
      // Hapus flexGrow: 1
      // Hapus minHeight: 0
      // ----------------------------------------

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
      marginBottom: '2rem', 
      textAlign: 'center',
      letterSpacing: '0.1em', 
      textShadow: '0 4px 8px rgba(0, 0, 0, 0.5), 0 -4px 8px rgba(47, 47, 47, 0.2)',
      transition: 'all 0.3s ease',
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
        right: '1rem',
        backgroundColor: '#4caf50',
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
        {message}
      </div>

      {/* Terapkan styles.card ke elemen utama */}
      <main style={styles.card}>
        <h1 style={styles.title}>D'Texts</h1>
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
                onMouseLeave={() => setIsLoadActive(false)}
              >
                Save
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
