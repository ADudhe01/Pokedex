import React from "react";
import Pokedex from "./Pokedex";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <div className="pokeball-icon">⚡</div>
            <h1 className="app-title">Pokédex</h1>
          </div>
          <p className="app-subtitle">Discover and explore the world of Pokémon</p>
        </div>
      </header>
      <main className="main-content">
        <Pokedex />
      </main>
    </div>
  );
}

export default App;
