import React, { useState } from 'react';

function JobPackageForm() {
  const [formData, setFormData] = useState({
    packageName: '',
    firstName: '',
    lastName: '',
    startDate: '',
    endDate: ''
  });

  const [records, setRecords] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Veriyi tabloya ekle
    setRecords([...records, formData]);

    // Formu sıfırla
    setFormData({
      packageName: '',
      firstName: '',
      lastName: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">İş Paketleri Formu</h2>

        <form onSubmit={handleSubmit}>
          {/* İş Paketi Adı */}
          <div className="mb-4">
            <label htmlFor="packageName" className="block text-sm font-medium text-gray-700">
              İş Paketleri Adı
            </label>
            <input
              type="text"
              id="packageName"
              name="packageName"
              value={formData.packageName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Personel Adı */}
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Personel Adı
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Personel Soyadı */}
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Personel Soyadı
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Giriş Tarihi */}
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Giriş Tarihi
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Çıkış Tarihi */}
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Çıkış Tarihi
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>

      {/* Tablo */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Kayıtlar</h2>
        {records.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">İş Paketleri Adı</th>
                <th className="px-4 py-2">Personel Adı</th>
                <th className="px-4 py-2">Personel Soyadı</th>
                <th className="px-4 py-2">Giriş Tarihi</th>
                <th className="px-4 py-2">Çıkış Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index} className="bg-white border-b">
                  <td className="px-4 py-2">{record.packageName}</td>
                  <td className="px-4 py-2">{record.firstName}</td>
                  <td className="px-4 py-2">{record.lastName}</td>
                  <td className="px-4 py-2">{record.startDate}</td>
                  <td className="px-4 py-2">{record.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">Henüz kayıt yok.</p>
        )}
      </div>
    </div>
  );
}

export default JobPackageForm;
