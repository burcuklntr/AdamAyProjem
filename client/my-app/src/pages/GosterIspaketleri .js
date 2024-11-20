import React from "react";

const GosterIspaketleri = ({ gosterilenIspaketleri }) => (
  <div className="space-y-8 w-full">
    {gosterilenIspaketleri.map((paket, paketIndex) => (
      <div
        key={paketIndex}
        className="overflow-x-auto border border-black  shadow-md rounded-lg p-4 bg-white"
      >
        <div className="flex justify-between items-center mb-4 ">
          {/* İş Paketi adı en solda */}
          <h3 className="text-xl font-semibold text-gray-800 ">{paket.isim}</h3>

          {/* Tarihler en sağda */}
          <div className="text-right text-gray-600 text-lg flex gap-4">
            <div>{paket.girisTarihi || "Belirtilmemiş"}</div>
            <div>{paket.cikisTarihi || "Belirtilmemiş"}</div>
          </div>
        </div>

        {/* Personel bilgileri tablosu aşağıda */}
        <table className="min-w-full   rounded-lg shadow-lg overflow-hidden">
          <thead>
            <tr className=" border-b-2 border-gray-400 text-vlack">
              <th className="py-4 px-6  bg-gray-200 text-left">
                Personel Adı Soyadı
              </th>
              <th className="py-4 px-4 bg-gray-200 text-left">A/A</th>
              <th className="py-4 px-4 bg-gray-200 text-left">Süre (ay)</th>
              <th className="py-4 px-4 bg-gray-200 text-left">Ne girilecek</th>
              <th className="py-4 px-4 bg-gray-200 text-left">Ne girilecek</th>
            </tr>
          </thead>
          <tbody>
            {paket.personeller.map((personel, personelIndex) => (
              <tr
                key={personelIndex}
                className=" rounded-xl border-b-4 transition duration-200"
              >
                <td className="py-3 px-5 ">
                  <div className="flex flex-col   font-semibold">
                    <span className="text-xl mb-4">
                      {personel.isim} {personel.soyisim}
                    </span>
                    <div className="flex gap-4  text-gray-600">
                      <span>{personel.tarih}</span> -
                      <span>{personel.cikisTarihi || "Belirtilmemiş"}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5 ">{/* A/A kısmı boş kalacak */}</td>
                <td className="py-3 px-5  ">
                  {(() => {
                    const startDate = new Date(personel.tarih);
                    const endDate = new Date(
                      personel.cikisTarihi || new Date()
                    );
                    const toplamGun = Math.floor(
                      (endDate - startDate) / (1000 * 60 * 60 * 24)
                    );

                    // Toplam gün sayısını 30'a böl ve ondalıklı sayı olarak döndür
                    const toplamAy = (toplamGun / 30).toFixed(2);
                    return toplamAy; // Parantezsiz ondalıklı değer döndür
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
);

export default GosterIspaketleri;
