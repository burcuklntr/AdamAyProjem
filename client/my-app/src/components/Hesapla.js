import React, { useState } from "react";
import axios from "axios";

const Hesapla = ({ gunSayisi }) => {
  const [input2, setInput2] = useState("");
  const [sonuc, setSonuc] = useState(null);
  const [error, setError] = useState("");
  const [islem, setIslem] = useState("add"); // Varsayılan işlem

  const handleHesapla = async () => {
    setError("");

    // input2'nin geçerli bir sayı olduğundan emin ol
    if (isNaN(input2) || input2.trim() === "") {
      setError("Geçerli bir ikinci sayı girin."); // Hata mesajı ayarlama
      return; // İşlemi durdur
    }

    try {
      const response = await axios.get(`http://localhost:5000/${islem}`, {
        params: {
          num1: gunSayisi, // gunSayisi burada kullanılıyor
          num2: input2,
        },
      });
      console.log("deneme");
      console.log(response.data.result);
      setSonuc(response.data.result); // Sonucu ayarla
    } catch (error) {
      console.error("Hata:", error);
      setError(
        error.response?.data?.error || "Bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Hesapla</h2>
      
      {/* Sayı 1 alanı */}
      <div className="flex items-center">
        <span className="font-semibold mr-2">Toplam iş paketi kaç gün:</span>
        <span className="border p-2">{gunSayisi}</span>
      </div>
      
      <input
        type="number"
        placeholder="Sayı 2"
        value={input2}
        onChange={(e) => setInput2(e.target.value)}
        className="border p-2 m-2"
      />
      <select
        value={islem}
        onChange={(e) => setIslem(e.target.value)}
        className="border p-2 m-2"
      >
        <option value="add">Topla</option>
        <option value="subtract">Çıkar</option>
        <option value="multiply">Çarp</option>
        <option value="divide">Böl</option>
      </select>
      <button
        onClick={handleHesapla}
        className="bg-blue-500 text-white p-2 m-2"
      >
        Hesapla
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {sonuc !== null && (
        <div className="mt-4">
          <h3 className="font-bold">
            1 iş paketinin arasındaki günlerin sayısı ve kullanıcının girdiği
            sayıya işlem yaptırır
          </h3>
          <p>{sonuc}</p>
        </div>
      )}
    </div>
  );
};

export default Hesapla;
