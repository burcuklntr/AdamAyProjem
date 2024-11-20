import React from "react";
import { oranlar, _months , packageAverages } from "../pages/Home";

const Tabloscreen = () => {
  return (
    <div className="overflow-x-auto mb-4 mt-4 shadow-2xl rounded-3xl bg-white">
      <table className="min-w-full max-w-[1200px] w-full text-black border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left text-purple-700">
              İş Paketleri
            </th>
            {_months.map((month, index) => (
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
            <td className="py-2 px-4 border-t">İlk Ay: {_months[0]}</td>
            <td className="py-2 px-4 border-t" colSpan={_months.length - 1}>
              Son Ay: {_months[_months.length - 1]}
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-t" colSpan={_months.length}>
              Toplam İş Paketi Sayısı: {Object.keys(oranlar).length}
            </td>
          </tr>
        </tfoot>
      </table>
      <div>
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
      </div>




    </div>
  );
};

export default Tabloscreen;
