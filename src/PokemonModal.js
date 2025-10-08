import React from "react";

function formatDecimetersToMeters(dm) {
  if (dm == null) return "-";
  return `${(dm / 10).toFixed(1)} m`;
}

function formatHectogramsToKg(hg) {
  if (hg == null) return "-";
  return `${(hg / 10).toFixed(1)} kg`;
}

function getEnglishFlavorText(species) {
  const entries = species?.flavor_text_entries || [];
  const enEntry = entries.find((e) => e.language?.name === "en");
  return enEntry?.flavor_text?.replace(/\s+/g, " ") || null;
}

function calculateGenderRatio(genderRate) {
  if (genderRate == null || genderRate < 0) return { male: "—", female: "—" };
  // gender_rate is number of female out of 8; -1 means genderless
  const female = Math.round((genderRate / 8) * 100);
  const male = 100 - female;
  return { male: `${male}%`, female: `${female}%` };
}

function StatBar({ label, value, max = 255, color = "#667eea" }) {
  const width = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="stat-row">
      <div className="stat-label">{label}</div>
      <div className="stat-bar">
        <div className="stat-bar-fill" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export default function PokemonModal({ pokemon, species, isLoading, error, onClose, getTypeColor }) {
  if (!pokemon) return null;

  const primaryType = pokemon.types?.[0]?.type?.name;
  const accent = getTypeColor ? getTypeColor(primaryType) : "#667eea";
  const flavor = getEnglishFlavorText(species);
  const gender = calculateGenderRatio(species?.gender_rate);

  const sprites = [
    pokemon.sprites?.other?.["official-artwork"]?.front_default,
    pokemon.sprites?.front_default,
    pokemon.sprites?.back_default,
    pokemon.sprites?.front_shiny,
    pokemon.sprites?.back_shiny,
  ].filter(Boolean);

  const abilities = pokemon.abilities || [];
  const stats = pokemon.stats || [];
  const heldItems = pokemon.held_items || [];
  const moves = pokemon.moves || [];

  const eggGroups = species?.egg_groups?.map((g) => g.name) || [];
  const growthRate = species?.growth_rate?.name || null;
  const habitat = species?.habitat?.name || null;
  const shape = species?.shape?.name || null;
  const color = species?.color?.name || null;
  const captureRate = species?.capture_rate ?? null;
  const generation = species?.generation?.name || null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ borderTopColor: accent }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-number">#{String(pokemon.id).padStart(3, "0")}</div>
            <h2 className="modal-title">{pokemon.name?.[0]?.toUpperCase() + pokemon.name?.slice(1)}</h2>
            <div className="modal-types">
              {(pokemon.types || []).map((t, i) => (
                <span key={i} className="type-badge" style={{ backgroundColor: getTypeColor?.(t.type.name) }}>{t.type.name}</span>
              ))}
            </div>
          </div>
          <div className="modal-header-right">
            {sprites[0] && <img className="modal-artwork" src={sprites[0]} alt={pokemon.name} />}
          </div>
        </div>

        <div className="modal-body">
          {isLoading ? (
            <div className="modal-loading"><div className="loading-spinner" /> Loading details…</div>
          ) : error ? (
            <div className="modal-error">{error}</div>
          ) : (
            <>
              {flavor && <p className="modal-flavor">{flavor}</p>}

              <div className="detail-grid">
                <div className="detail-card">
                  <h3 className="detail-title">Profile</h3>
                  <div className="detail-list">
                    <div className="detail-item"><span>Height</span><span>{formatDecimetersToMeters(pokemon.height)}</span></div>
                    <div className="detail-item"><span>Weight</span><span>{formatHectogramsToKg(pokemon.weight)}</span></div>
                    {pokemon.base_experience != null && (
                      <div className="detail-item"><span>Base EXP</span><span>{pokemon.base_experience}</span></div>
                    )}
                    {eggGroups.length > 0 && (
                      <div className="detail-item"><span>Egg Groups</span><span>{eggGroups.join(", ")}</span></div>
                    )}
                    {growthRate && (
                      <div className="detail-item"><span>Growth Rate</span><span>{growthRate}</span></div>
                    )}
                    {habitat && (
                      <div className="detail-item"><span>Habitat</span><span>{habitat}</span></div>
                    )}
                    {shape && (
                      <div className="detail-item"><span>Shape</span><span>{shape}</span></div>
                    )}
                    {color && (
                      <div className="detail-item"><span>Color</span><span>{color}</span></div>
                    )}
                    {captureRate != null && (
                      <div className="detail-item"><span>Capture Rate</span><span>{captureRate}</span></div>
                    )}
                    {generation && (
                      <div className="detail-item"><span>Generation</span><span>{generation}</span></div>
                    )}
                    <div className="detail-item"><span>Gender Rate</span><span>♂ {gender.male} / ♀ {gender.female}</span></div>
                  </div>
                </div>

                <div className="detail-card">
                  <h3 className="detail-title">Abilities</h3>
                  <ul className="chip-list">
                    {abilities.map((a, i) => (
                      <li key={i} className="chip" title={a.is_hidden ? "Hidden ability" : "Ability"}>
                        {a.ability?.name}
                        {a.is_hidden && <span className="chip-tag">Hidden</span>}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detail-card">
                  <h3 className="detail-title">Base Stats</h3>
                  <div className="stats">
                    {stats.map((s, i) => (
                      <StatBar key={i} label={s.stat?.name} value={s.base_stat} color={accent} />
                    ))}
                  </div>
                </div>

                <div className="detail-card">
                  <h3 className="detail-title">Sprites</h3>
                  <div className="sprite-grid">
                    {sprites.map((src, i) => (
                      <img className="sprite-img" key={i} src={src} alt={`sprite-${i}`} />
                    ))}
                  </div>
                </div>

                <div className="detail-card">
                  <h3 className="detail-title">Held Items</h3>
                  {heldItems.length === 0 ? (
                    <div className="detail-empty">None</div>
                  ) : (
                    <ul className="chip-list">
                      {heldItems.map((item, i) => (
                        <li key={i} className="chip">{item.item?.name}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="detail-card">
                  <h3 className="detail-title">Moves</h3>
                  <div className="detail-subtitle">Total: {moves.length}</div>
                  <ul className="chip-list wrap">
                    {moves.slice(0, 20).map((m, i) => (
                      <li key={i} className="chip" title="Move">{m.move?.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


