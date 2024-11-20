import React, { useState, useEffect } from "react";
import Tabloscreen from "../pages/Tabloscreen";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export var oranlar = {};
export var _months = [];
export var packageAverages = {};
export const Home = ({ gosterilenIspaketleri, setGosterilenIspaketleri }) => {
  oranlar = {};
  packageAverages = {};
  _months = [];
  const navigate = useNavigate();
  const calculateDayDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Tarihler arasında gün farkını hesapla
    const differenceInTime = end - start;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Milisaniyeyi gün birimine çevir
    return differenceInDays > 0 ? differenceInDays : 0; // Negatif gün farklarını 0 yap
  };

  const handleIspaketiGirisTarihiChange = (e, paketIndex) => {
    const { value } = e.target;
    setFormData((prevState) => {
      const updatedPaketler = [...prevState.ispaketleri];
      updatedPaketler[paketIndex].girisTarihi = value;

      // Giriş ve çıkış tarihi varsa gün farkını hesapla
      if (updatedPaketler[paketIndex].cikisTarihi) {
        updatedPaketler[paketIndex].gunFarki = calculateDayDifference(
          value,
          updatedPaketler[paketIndex].cikisTarihi
        );
      }

      return { ...prevState, ispaketleri: updatedPaketler };
    });
  };

  const handleIspaketiCikisTarihiChange = (e, paketIndex) => {
    const { value } = e.target;
    setFormData((prevState) => {
      const updatedPaketler = [...prevState.ispaketleri];
      updatedPaketler[paketIndex].cikisTarihi = value;

      // Giriş ve çıkış tarihi varsa gün farkını hesapla
      if (updatedPaketler[paketIndex].girisTarihi) {
        updatedPaketler[paketIndex].gunFarki = calculateDayDifference(
          updatedPaketler[paketIndex].girisTarihi,
          value
        );
      }

      return { ...prevState, ispaketleri: updatedPaketler };
    });
  };

  const [formData, setFormData] = useState({
    baslangic: "",
    bitis: "",
    toplam_paket: 1,
    ispaketleri: [{ isim: "", personeller: [] }],
  });
  const [hataMesaji, setHataMesaji] = useState("");
  //const [gosterilenIspaketleri, setGosterilenIspaketleri] = useState([]);

  const [gunSayisi, setGunSayisi] = useState("");

  // İki tarih arasındaki gün sayısını hesaplama
  const calculateMonthsBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [];

    // Eğer çıkış tarihi giriş tarihinden önceyse, çıkış tarihini giriş tarihiyle değiştir
    if (end < start) {
      end.setMonth(end.getMonth() + 1); // Çıkış ayını dahil et
    }

    // Yalnızca yılı ve ayı dikkate almak için günleri sıfırla
    start.setDate(1);
    end.setDate(1);

    while (start <= end) {
      // 'start < end' yerine 'start <= end' kullanarak son ayı da dahil edelim
      const month = `${start.getFullYear()} ${start.toLocaleString("default", {
        month: "long",
      })}`;
      if (!months.includes(month)) {
        months.push(month);
      }
      start.setMonth(start.getMonth() + 1);
    }

    return months;
  };

  const getCommonMonthsWithPackages = (packages) => {
    const _tumAylar = calculateMonthsBetween(
      formData.baslangic,
      formData.bitis
    );
    _months = _tumAylar;
    packages.forEach((p) => {
      const name = p.isim;
      oranlar[name] = new Array(_tumAylar.length).fill(0);
    });

    if (packages.length === 0) return {};

    const monthPackageMap = {};
    let firstMonth = null;
    let lastMonth = null;

    console.log("packages Basladi");
    console.log(packages);
    console.log("packages Bitti");

    packages.forEach((paket, paketIndex) => {
      const months = calculateMonthsBetween(
        paket.girisTarihi,
        paket.cikisTarihi
      );

      // İlk ve son ayları belirleme
      if (!firstMonth || new Date(paket.girisTarihi) < new Date(firstMonth)) {
        firstMonth = paket.girisTarihi;
      }
      if (!lastMonth || new Date(paket.cikisTarihi) > new Date(lastMonth)) {
        lastMonth = paket.cikisTarihi;
      }

      // Her ay için iş paketlerini kaydetme
      months.forEach((month) => {
        if (!monthPackageMap[month]) {
          monthPackageMap[month] = [];
        }
        monthPackageMap[month].push(`${paket.isim}`);
      });
    });
    console.log("tumAylar basladi");
    console.log(_tumAylar);
    console.log("tumAylar bitti");

    console.log("Oranlar Basladi");
    console.log(oranlar);
    console.log("Oranlar Bitti");

    console.log("monthPackageMap basladi");
    console.log(monthPackageMap);
    console.log("monthPackageMap Bitti");

    packages.forEach((p, index1) => {
      const months = calculateMonthsBetween(p.girisTarihi, p.cikisTarihi);
      oranlar[p.isim].forEach((ay, index) => {
        var sayi = 0;
        if (months.includes(_tumAylar[index])) {
          sayi = monthPackageMap[_tumAylar[index]].length;
          oranlar[p.isim][index] = 1 / sayi;
        } else {
          ay = 0;
        }
      });
    });

    console.log("Yeni Oranlar Basladi");
    console.log(oranlar);
    console.log("Yeni Oranlar Bitti");

    const commonMonths = {};
    Object.keys(monthPackageMap).forEach((month) => {
      if (monthPackageMap[month].length > 1) {
        commonMonths[month] = monthPackageMap[month];
      }
    });

    // Tüm ayları hesapla (ilk ve son tarihler arasında)
    const allMonths = calculateMonthsBetween(firstMonth, lastMonth);

    // Tüm verileri döndür
    return { commonMonths, firstMonth, lastMonth, allMonths };
  };

  // Ayların aynı olup olmadığını kontrol eden fonksiyon
  const areMonthsSame = (startDate, endDate) => {
    const months = calculateMonthsBetween(startDate, endDate);
    return months.length === 1 ? months[0] : null;
  };

  // aradaki aylar
  const result = getCommonMonthsWithPackages(gosterilenIspaketleri);
  // Örnek kullanım
  const startDate = "2024-01-15"; // Başlangıç tarihi
  const endDate = "2024-04-10"; // Bitiş tarihi

  const resultMonths = calculateMonthsBetween(startDate, endDate);

  const gunFull = (toplamGun) => {
    // Ay ve hafta olarak ifade etme
    let aySayisi = Math.floor(toplamGun / 30);
    let kalanGun = toplamGun % 30;

    let sonuc = "";
    if (aySayisi > 0) {
      sonuc += `${aySayisi} ay `;
    }
    if (kalanGun > 0) {
      sonuc += `${kalanGun} gün`;
    }

    // Gün sayısını ay cinsine çevirme
    const ayCinsinden = (toplamGun / 30).toFixed(2); // 2 ondalık basamak
    return `${ayCinsinden} (${sonuc.trim()})`;
  };

  // Örnek kullanım
  const toplamGun = calculateMonthsBetween("2024-10-01", "2024-10-09");
  console.log(gunFull(toplamGun)); // Çıktı: "0.27 (0 ay 8 gün)"

  useEffect(() => {
    if (formData.baslangic && formData.bitis) {
      const baslangicTarihi = new Date(formData.baslangic);
      const bitisTarihi = new Date(formData.bitis);

      // Tarihleri kontrol et
      if (isNaN(baslangicTarihi) || isNaN(bitisTarihi)) {
        console.error("Geçersiz tarih formatı");
        return;
      }

      // Tarihlerin saatlerini sıfırla
      baslangicTarihi.setHours(0, 0, 0, 0);
      bitisTarihi.setHours(0, 0, 0, 0);

      const fark = bitisTarihi - baslangicTarihi;
      const toplamGun = Math.ceil(fark / (1000 * 60 * 60 * 24)); // Gün sayısını hesapla

      // Elde edilen gün sayısını ay ve gün olarak ifade et
      if (toplamGun < 0) {
        console.error("Bitiş tarihi başlangıç tarihinden önce olamaz");
        return;
      }

      setGunSayisi(toplamGun); // Gün sayısını state'e ata
    }
  }, [formData.baslangic, formData.bitis]);

  const handleSoyisimChange = (e, paketIndex, personelIndex) => {
    const yeniSoyisim = e.target.value;
    const guncelIspaketi = [...formData.ispaketleri];
    guncelIspaketi[paketIndex].personeller[personelIndex].soyisim = yeniSoyisim;
    setFormData({ ...formData, ispaketleri: guncelIspaketi });
  };

  const handleCikisTarihiChange = (e, paketIndex, personelIndex) => {
    const yeniCikisTarihi = e.target.value;
    const guncelIspaketi = [...formData.ispaketleri];
    guncelIspaketi[paketIndex].personeller[personelIndex].cikisTarihi =
      yeniCikisTarihi;
    setFormData({ ...formData, ispaketleri: guncelIspaketi });
  };

  const handleToplamPaketChange = (e) => {
    const newToplamPaket = parseInt(e.target.value);
    const newIspaketleri = Array.from(
      { length: newToplamPaket },
      (_, index) => ({
        isim: "",
        personeller: [],
      })
    );
    setFormData({
      ...formData,
      toplam_paket: newToplamPaket,
      ispaketleri: newIspaketleri,
    });
  };

  const handleIspaketiChange = (e, paketIndex) => {
    const newIspaketleri = [...formData.ispaketleri];
    newIspaketleri[paketIndex].isim = e.target.value;
    setFormData({ ...formData, ispaketleri: newIspaketleri });
  };

  const handlePersonelEkle = (paketIndex) => {
    const newIspaketleri = [...formData.ispaketleri];

    // Eğer personeller dizisi tanımlı değilse oluştur
    if (!newIspaketleri[paketIndex].personeller) {
      newIspaketleri[paketIndex].personeller = [];
    }

    newIspaketleri[paketIndex].personeller.push({ isim: "", tarih: "" });
    setFormData({ ...formData, ispaketleri: newIspaketleri });
  };

  const handlePersonelChange = (e, paketIndex, personelIndex) => {
    const newIspaketleri = [...formData.ispaketleri];
    newIspaketleri[paketIndex].personeller[personelIndex].isim = e.target.value;
    setFormData({ ...formData, ispaketleri: newIspaketleri });
  };

  const handleTarihChange = (e, paketIndex, personelIndex) => {
    const newIspaketleri = [...formData.ispaketleri];
    newIspaketleri[paketIndex].personeller[personelIndex].tarih =
      e.target.value;
    setFormData({ ...formData, ispaketleri: newIspaketleri });
  };

  const handleKaydet = (paketIndex, personelIndex) => {
    const personel =
      formData.ispaketleri[paketIndex].personeller[personelIndex];
    toast.success(` ${personel.isim} ${personel.soyisim} kaydedildi`);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // 1. Toplam Ay tarihlerini alalım:
    const toplamAyBaslangicTarihi = new Date(formData.baslangic);
    const toplamAyBitisTarihi = new Date(formData.bitis);

    // 2. İş Paketlerinin giriş ve çıkış tarihlerini alalım:
    const ispaketleriGirisTarihleri = formData.ispaketleri.map(
      (paket) => new Date(paket.girisTarihi)
    );
    const ispaketleriCikisTarihleri = formData.ispaketleri.map(
      (paket) => new Date(paket.cikisTarihi)
    );

    // 3. İş paketi giriş tarihinin toplam ay tarihleri arasında olup olmadığını kontrol edelim:
    const isValidGirisTarihi = ispaketleriGirisTarihleri.every(
      (girisTarihi) => {
        return (
          girisTarihi >= toplamAyBaslangicTarihi &&
          girisTarihi <= toplamAyBitisTarihi
        );
      }
    );
    if (!isValidGirisTarihi) {
      // Toastify ile hata mesajı gösterimi
      toast.error(
        "İş Paketi Giriş Tarihi, Toplam Ay Başlangıç ve Bitiş Tarihi arasında olmalıdır!",
        {
          position: "top-right",
        }
      );
      return;
    }

    // 4. İş paketi çıkış tarihinin toplam ay tarihleri arasında olup olmadığını kontrol edelim:
    const isValidCikisTarihi = ispaketleriCikisTarihleri.every(
      (cikisTarihi) => {
        return (
          cikisTarihi >= toplamAyBaslangicTarihi &&
          cikisTarihi <= toplamAyBitisTarihi
        );
      }
    );

    if (!isValidCikisTarihi) {
      toast.error(
        "İş Paketi Çıkış Tarihi, Toplam Ay Başlangıç ve Bitiş Tarihi arasında olmalıdır!",
        {}
      );
      return;
    }

    // 5. Toplam Ay Tarihleri arasındaki geçerlilik kontrolü: (başlangıç tarihi < bitiş tarihi olmalı)
    if (toplamAyBitisTarihi <= toplamAyBaslangicTarihi) {
      toast.error(
        "Toplam ay bitiş tarihi, başlangıç tarihinden büyük olmalıdır!",
        {}
      );
      return;
    }

    // 6. Eğer tüm tarih kontrolleri geçerliyse, formu işleme alalım
    setGosterilenIspaketleri([...formData.ispaketleri]);
    toast.success("İş Paketleri başarıyla eklendi!", {});
  };

  Object.keys(oranlar).forEach((workPackage) => {
    const values = oranlar[workPackage].filter((value) => value > 0); // Sadece pozitif değerleri al
    const sum = values.reduce((acc, val) => acc + val, 0); // Toplamını hesapla
    const average = values.length > 0 ? sum / values.length : 0; // Kaç tane sayı varsa ona böl

    // Ortalamayı 2 ondalıklı kesme işlemi
    const truncatedAverage = Math.floor(average * 100) / 100; // 2 ondalık kes

    packageAverages[workPackage] = truncatedAverage.toFixed(2); // Ortalamayı kaydet
  });
  const DenemeTablo = () => {
    const months = calculateMonthsBetween(formData.baslangic, formData.bitis);

    return (
      <div className="overflow-x-auto mb-4 mt-4 shadow-2xl rounded-3xl bg-white">
        <table className="min-w-full max-w-[1200px] w-full text-black border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-purple-700">
                İş Paketleri
              </th>
              {months.map((month, index) => (
                <th
                  key={index}
                  className="py-2 px-4 border-b text-green-600 text-left"
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(oranlar).map((workPackage, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b text-pink-500">
                  {workPackage}
                </td>
                {oranlar[workPackage].map((value, i) => (
                  <td key={i} className="py-2 px-4 border-b text-orange-600">
                    {typeof value === "number" ? value.toFixed(2) : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="py-2 px-4 border-t">İlk Ay: {months[0]}</td>
              <td className="py-2 px-4 border-t" colSpan={months.length - 1}>
                Son Ay: {months[months.length - 1]}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-t" colSpan={months.length}>
                Toplam İş Paketi Sayısı: {Object.keys(oranlar).length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };
  return (
    <div className=" flex flex-col items-center justify-center min-h-screen">
      <div className=" p-4 mt-6 w-1/2 rounded-lg ">
        <h2 className="text-xl font-semibold mb-4 ">Kaç ay olduğunu girin</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/3 flex flex-col">
              <label className=" text-gray-700 whitespace-nowrap">
                Başlangıç Tarihi:
              </label>
              <input
                type="date"
                className="border border-gray-400 p-2 rounded w-full"
                value={formData.baslangic}
                onChange={(e) =>
                  setFormData({ ...formData, baslangic: e.target.value })
                }
                required
              />
            </div>

            <div className="w-1/3 flex flex-col">
              <label className=" text-gray-700 whitespace-nowrap">
                Bitiş Tarihi:
              </label>
              <input
                type="date"
                className="border border-gray-400 p-2 rounded w-full"
                value={formData.bitis}
                onChange={(e) =>
                  setFormData({ ...formData, bitis: e.target.value })
                }
                required
              />
            </div>

            <div className="w-1/3 flex flex-col">
              <label className=" text-gray-700 whitespace-nowrap">
                Toplam Paket Sayısı:
              </label>
              <input
                type="number"
                min="1"
                className="border border-gray-400 p-2 rounded w-full"
                value={formData.toplam_paket}
                onChange={handleToplamPaketChange}
                required
              />
            </div>
          </div>

          {/* Dinamik İş Paketi Giriş Alanları */}
          {formData.ispaketleri.map((paket, paketIndex) => (
            <div
              key={paketIndex}
              className="mb-4 border bg-slate-200 flex flex-col p-4 rounded"
            >
              <h3 className="font-semibold">İş Paketi {paketIndex + 1}</h3>

              {/* İş Paketi Adı */}
              <label className="block mb-1">İş Paketi Adı:</label>
              <input
                type="text"
                className="border border-gray-400 p-2 rounded w-full mb-4"
                value={paket.isim}
                onChange={(e) => handleIspaketiChange(e, paketIndex)}
                required
              />

              {/* İş Paketi Giriş Tarihi */}
              <div className="flex space-x-4 mb-4">
                <div className="w-1/2">
                  <label className="block mb-1">İş Paketi Giriş Tarihi:</label>
                  <input
                    type="date"
                    className="border border-gray-400 p-2 rounded w-full"
                    value={paket.girisTarihi}
                    onChange={(e) =>
                      handleIspaketiGirisTarihiChange(e, paketIndex)
                    }
                    required
                  />
                </div>

                <div className="w-1/2">
                  <label className="block mb-1">İş Paketi Çıkış Tarihi:</label>
                  <input
                    type="date"
                    className="border border-gray-400 p-2 rounded w-full"
                    value={paket.cikisTarihi}
                    onChange={(e) =>
                      handleIspaketiCikisTarihiChange(e, paketIndex)
                    }
                    required
                  />
                </div>
              </div>

              {/* Personel Girişi */}
              {paket.personeller.map((personel, personelIndex) => (
                <div key={personelIndex} className="flex flex-col mb-4">
                  <div className="flex space-x-4 mb-4">
                    <div className="flex flex-col w-1/2">
                      <label className="mb-1">Adı:</label>
                      <input
                        type="text"
                        className="border border-gray-400 p-2 rounded w-full"
                        placeholder="Personel Adı"
                        value={personel.isim}
                        onChange={(e) =>
                          handlePersonelChange(e, paketIndex, personelIndex)
                        }
                        required
                      />
                    </div>

                    <div className="flex flex-col w-1/2">
                      <label className="mb-1">Soyadı:</label>
                      <input
                        type="text"
                        className="border border-gray-400 p-2 rounded w-full"
                        placeholder="Personel Soyadı"
                        value={personel.soyisim}
                        onChange={(e) =>
                          handleSoyisimChange(e, paketIndex, personelIndex)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 mb-4">
                    <div className="w-1/2 flex flex-col">
                      <label className="mb-1">Giriş Tarihi:</label>
                      <input
                        type="date"
                        className="border border-gray-400 p-2 rounded w-full"
                        onChange={(e) =>
                          handleTarihChange(e, paketIndex, personelIndex)
                        }
                        required
                      />
                    </div>

                    <div className="w-1/2 flex flex-col">
                      <label className="mb-1">Çıkış Tarihi:</label>
                      <input
                        type="date"
                        className="border border-gray-400 p-2 rounded w-full"
                        placeholder="Çıkış Tarihi"
                        onChange={(e) =>
                          handleCikisTarihiChange(e, paketIndex, personelIndex)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-300 mt-2"
                onClick={() => handlePersonelEkle(paketIndex)}
              >
                Personel Ekle
              </button>
            </div>
          ))}
          {hataMesaji && (
            <div className="mb-4 text-red-500 font-semibold">{hataMesaji}</div>
          )}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-300"
            >
              Yeni İş Paketi Tamamla
            </button>
          </div>
        </form>
      </div>

      {/* İş Paketleri Tablosu */}
      {/* {gosterilenIspaketleri.length > 0 && (
        <div className="bg-slate-100 shadow-lg rounded-lg mt-8 w-full p-6">
          <div className="bg-white border border-gray-200 text-3xl font-semibold mb-6 text-gray-900 text-center rounded-lg shadow-sm p-6">
            <h2>Yüklenen İş Paketleri</h2>

            <div className="flex justify-end items-center text-black mt-4 space-x-4">
              <span className="text-lg font-semibold">
                Toplam iş paketinin Tarihi:
              </span>
              <div className="flex space-x-4 text-lg">
                <span>{formData.baslangic}</span>
                <span>{formData.bitis}</span>
              </div>
            </div>

            <div className="flex justify-end text-gray-600 mt-4">
              <span className="font-semibold text-lg mr-2">
                {" "}
                Toplam İş Paketinin Gün Sayısı:
              </span>
              <span className="text-lg">Ay {gunFull(gunSayisi)}</span>
            </div>
          </div>

          <div className="space-y-8">
            {gosterilenIspaketleri.map((paket, paketIndex) => (
              <div
                key={paketIndex}
                className="overflow-x-auto bg-white shadow-md rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {paket.isim}
                  </h3>
                  <div className="flex space-x-4 text-gray-600 text-lg">
                    <div>
                      <span className="font-semibold">Giriş Tarihi:</span>{" "}
                      {paket.girisTarihi || "Belirtilmemiş"}
                    </div>
                    <div>
                      <span className="font-semibold">Bitiş Tarihi:</span>{" "}
                      {paket.cikisTarihi || "Belirtilmemiş"}
                    </div>
                    <div>
                      <span className="font-semibold">
                        Bir İş Paketinin Gün Sayısı:
                      </span>{" "}
                      {paket.gunFarki || "Hesaplanmadı"}
                    </div>
                    <div>
                      <span className="font-semibold">Aylar:</span>{" "}
                      {calculateMonthsBetween(
                        paket.girisTarihi,
                        paket.cikisTarihi
                      )}
                    </div>
                  </div>
                </div>

                <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 text-gray-800">
                      <th className="py-3 px-5 border-b-2 text-left">
                        Personel Adı Soyadı
                      </th>
                      <th className="py-3 px-5 border-b-2 text-left">
                        Giriş Tarihi
                      </th>
                      <th className="py-3 px-5 border-b-2 text-left">
                        Çıkış Tarihi
                      </th>
                      <th className="py-3 px-5 border-b-2 text-left">
                        Aradaki Gün Sayısı
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paket.personeller.map((personel, personelIndex) => {
                      const daysBetween = calculateMonthsBetween(
                        personel.tarih,
                        personel.cikisTarihi
                      );

                      const months = calculateMonthsBetween(
                        personel.tarih,
                        personel.cikisTarihi
                      );

                      const sameMonth = areMonthsSame(
                        personel.tarih,
                        personel.cikisTarihi
                      );
                      const sameMonthNote = sameMonth ? ` (${sameMonth})` : "";

                      return (
                        <tr
                          key={personelIndex}
                          className="hover:bg-gray-50 text-left"
                        >
                          <td className="py-3 px-5 border-b">
                            {personel.isim} {personel.soyisim}
                          </td>
                          <td className="py-3 px-5 border-b">
                            {personel.tarih}
                          </td>
                          <td className="py-3 px-5 border-b">
                            {personel.cikisTarihi || "Belirtilmemiş"}
                          </td>
                          <td className="py-3 px-5 border-b">
                            {months.join(", ")}
                            {sameMonthNote} ({daysBetween} gün)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )} */}
      {/* <div>
        <DenemeTablo />
      </div> */}
      {/* <button
        onClick={() => {
          navigate("/table");
        }}
        className="bg-pink-400"
      >
        tıkla
      </button> */}
      {/* Ortalamalar tablosu */}
      {/* <div>
        <table className="min-w-full bg-white text-black mt-4 mb-4  rounded-3xl shadow-2xl">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">İş Paketleri</th>
              <th className="py-2 px-4 border-b">Ortalama</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(packageAverages).map((workPackage, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b text-pink-500">
                  {workPackage}
                </td>
                <td className="py-2 px-4 border-b text-orange-600">
                  {packageAverages[workPackage]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>{" "} */}
    </div>
  );
};
