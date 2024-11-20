import { ChevronRightIcon } from "@heroicons/react/24/solid";
import React, { useState, useEffect } from "react";
import { Home } from "./Home";
import GosterIspaketleri from "../pages/GosterIspaketleri ";

const Frontend = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [gosterilenIspaketleri, setGosterilenIspaketleri] = useState(() => {
    // localStorage
    const savedData = localStorage.getItem("gosterilenIspaketleri");
    return savedData ? JSON.parse(savedData) : [];
  });

  // değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("gosterilenIspaketleri", JSON.stringify(gosterilenIspaketleri));
    setActiveComponent("hesapla");
  }, [gosterilenIspaketleri]);

  const handleHesaplaClick = () => {
    setActiveComponent("hesapla");
  };

  const handleGosterClick = () => {
    setActiveComponent("goster");
  };

  const HesaplaComponent = () => {
    return (
      <Home
        gosterilenIspaketleri={gosterilenIspaketleri}
        setGosterilenIspaketleri={setGosterilenIspaketleri}
      />
    );
  };

  const GosterComponent = () => {
    return <GosterIspaketleri gosterilenIspaketleri={gosterilenIspaketleri} />;
  };

  return (
    <div className="flex min-h-screen">
      {/* Sol Panel */}
      <div className="w-3/12 bg-indigo-950 flex flex-col justify-start items-center p-4">
        <button
          onClick={handleHesaplaClick}
          className="mb-4 p-2  text-white rounded flex items-center"
        >
          Hesapla
          <ChevronRightIcon className="ml-2 w-5 h-5" />
        </button>
        <button
          onClick={handleGosterClick}
          className="p-2  text-white rounded flex items-center"
        >
          Göster
          <ChevronRightIcon className="ml-2 w-5 h-5" />
        </button>
      </div>

      {/* Sağ Panel */}
      <div className="w-9/12 p-4">
        {activeComponent === "hesapla" && <HesaplaComponent />}
        {activeComponent === "goster" && <GosterComponent />}
      </div>
      
    </div>
  );
};

export default Frontend;
