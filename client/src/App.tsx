import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import SongPage from "./pages/SongPage.tsx";
import DataPage from "./pages/DataPage.tsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route className="main-page" path="/" element={<Main />} />
        <Route className="song-page" path="/song_page" element={<SongPage />} />
        <Route className="data-page" path="/data_page" element={<DataPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
