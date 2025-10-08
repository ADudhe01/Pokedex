import React, { useEffect, useState } from "react";
import PokemonModal from "./PokemonModal";

function Pokedex() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=1118&offset=0"
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon data');
        }
        
        const data = await response.json();

        const detailedData = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            if (!res.ok) {
              throw new Error(`Failed to fetch ${pokemon.name}`);
            }
            return res.json();
          })
        );

        setPokemonList(detailedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredPokemon = pokemonList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || p.types.some(t => t.type.name === selectedType);
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type) => {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return typeColors[type] || '#A8A878';
  };

  const getPokemonCardStyle = (pokemon) => {
    const primaryType = pokemon.types[0].type.name;
    const color = getTypeColor(primaryType);
    return {
      background: `linear-gradient(135deg, ${color}20, ${color}10)`,
      borderColor: color,
      borderWidth: '2px',
      borderStyle: 'solid'
    };
  };

  // Lock background scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [modalOpen]);

  const handleCardClick = async (pokemon) => {
    setSelectedPokemon(pokemon);
    setSelectedSpecies(null);
    setModalError(null);
    setModalLoading(true);
    setModalOpen(true);
    try {
      const speciesResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`
      );
      if (!speciesResponse.ok) {
        throw new Error("Failed to fetch species data");
      }
      const speciesData = await speciesResponse.json();
      setSelectedSpecies(speciesData);
    } catch (e) {
      setModalError(e.message);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPokemon(null);
    setSelectedSpecies(null);
    setModalError(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Pokédex...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p className="error-text">Failed to load Pokémon data: {error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="pokedex-container">
      <div className="search-section">
        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Search Pokémon by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
        
        <div className="filter-section">
          <label className="filter-label">Filter by type:</label>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="type-filter"
          >
            <option value="all">All Types</option>
            <option value="normal">Normal</option>
            <option value="fire">Fire</option>
            <option value="water">Water</option>
            <option value="electric">Electric</option>
            <option value="grass">Grass</option>
            <option value="ice">Ice</option>
            <option value="fighting">Fighting</option>
            <option value="poison">Poison</option>
            <option value="ground">Ground</option>
            <option value="flying">Flying</option>
            <option value="psychic">Psychic</option>
            <option value="bug">Bug</option>
            <option value="rock">Rock</option>
            <option value="ghost">Ghost</option>
            <option value="dragon">Dragon</option>
            <option value="dark">Dark</option>
            <option value="steel">Steel</option>
            <option value="fairy">Fairy</option>
          </select>
        </div>
      </div>

      <div className="results-info">
        <p className="results-count">
          {filteredPokemon.length} Pokémon found
        </p>
      </div>

      <div className="pokedex">
        {filteredPokemon.length > 0 ? (
          filteredPokemon.map((p) => (
            <div 
              key={p.id} 
              className="pokemon-card"
              style={getPokemonCardStyle(p)}
              onClick={() => handleCardClick(p)}
            >
              <div className="pokemon-image-container">
                <img 
                  src={p.sprites.other['official-artwork']?.front_default || p.sprites.front_default} 
                  alt={p.name}
                  className="pokemon-image"
                />
              </div>
              <div className="pokemon-info">
                <div className="pokemon-number">#{p.id.toString().padStart(3, '0')}</div>
                <h3 className="pokemon-name">
                  {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                </h3>
                <div className="pokemon-types">
                  {p.types.map((t, index) => (
                    <span 
                      key={index}
                      className="type-badge"
                      style={{ backgroundColor: getTypeColor(t.type.name) }}
                    >
                      {t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <p className="no-results-text">No Pokémon found!</p>
            <p className="no-results-subtext">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {modalOpen && selectedPokemon && (
        <PokemonModal 
          pokemon={selectedPokemon}
          species={selectedSpecies}
          isLoading={modalLoading}
          error={modalError}
          onClose={closeModal}
          getTypeColor={getTypeColor}
        />
      )}
    </div>
  );
}

export default Pokedex;
