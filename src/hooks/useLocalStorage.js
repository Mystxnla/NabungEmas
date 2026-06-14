import { useState, useEffect } from 'react';

/**
 * Custom Hook: useLocalStorage
 * 
 * Hook untuk menyimpan dan membaca data dari Local Storage.
 * Berfungsi seperti useState biasa, tetapi data tersimpan secara persisten.
 * 
 * @param {string} key - Kunci penyimpanan di Local Storage
 * @param {*} initialValue - Nilai awal jika belum ada data
 * @returns {[*, Function]} - [value, setValue]
 * 
 * Contoh penggunaan:
 * const [name, setName] = useLocalStorage('user_name', 'Tamu');
 */
const useLocalStorage = (key, initialValue) => {
  // State yang akan menyimpan nilai
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Coba ambil data dari Local Storage
      const item = window.localStorage.getItem(key);
      // Parse data jika ada, jika tidak gunakan initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Jika terjadi error, gunakan initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Simpan ke Local Storage setiap kali storedValue berubah
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
