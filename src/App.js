import { useState } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import api from './services/api.js';
import { toast } from 'react-toastify';

function App() {
  const [ano, setAno] = useState(new Date().getFullYear());
  const [paises] = useState(['Brazil', 'England', 'France', 'Germany', 'Italy', 'Portugal', 'Spain', 'Turkey']);
  const [pais, setPais] = useState('');
  const [liga, setLiga] = useState('');
  const [ligas, setLigas] = useState([]);
  const [times, setTimes] = useState([]);
  const [time, setTime] = useState('');
  const [objTime, setObjTime] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const minuteWindows = [
    { key: '0-15', label: '00-15' },
    { key: '16-30', label: '16-30' },
    { key: '31-45', label: '31-45' },
    { key: '46-60', label: '46-60' },
    { key: '61-75', label: '61-75' },
    { key: '76-90', label: '76-90' },
    { key: '91-105', label: '91-105' },
    { key: '106-120', label: '106-120' }
  ];

  const selectMenuProps = {
    PaperProps: {
      sx: {
        bgcolor: 'var(--panel)',
        border: '1px solid var(--border)',
        color: 'var(--text)'
      }
    }
  };

  const handleChangePais = (event) => {
    const selected = event.target.value;
    setPais(selected);
    setLiga('');
    setTime('');
    setShowResults(false);

    if (selected && selected !== -1) {
      BuscaLigas(selected);
    } else {
      setLigas([]);
    }
  };

  const handleChangeLiga = (event) => {
    const selected = event.target.value;
    setLiga(selected);
    setTime('');
    setShowResults(false);

    if (selected && selected !== -1) {
      BuscaTimes(selected);
    } else {
      setTimes([]);
    }
  };

  const handleChangeTime = (event) => {
    const selected = event.target.value;
    setTime(selected);

    if (selected && selected !== -1) {
      BuscaDadosTime(selected);
    }
  };

  async function BuscaLigas(paisSelecionado) {
    try {
      const result = await api.get(`leagues?country=${paisSelecionado}`);
      setLigas(result.data.response);
    } catch (error) {
      toast.warn('Erro ao buscar as ligas');
    }
  }

  async function BuscaTimes(ligaSelecionada) {
    try {
      const result = await api.get(`teams?league=${ligaSelecionada}&season=${ano}`);
      setTimes(result.data.response);
    } catch (error) {
      toast.warn('Erro ao buscar os times');
    }
  }

  async function BuscaDadosTime(timeSelecionado) {
    try {
      const result = await api.get(`teams/statistics?league=${liga}&season=${ano}&team=${timeSelecionado}`);
      setObjTime(result.data.response);
      setShowResults(true);
    } catch (error) {
      toast.warn('Erro ao buscar as estatisticas');
    }
  }

  function novaBusca() {
    setObjTime(null);
    setShowResults(false);
    setTime('');
  }

  return (
    <div className="App">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="hero">
        <div>
          <p className="eyebrow">Football insights</p>
          <h1>Bet Statistics</h1>
          <div className="hero-actions">
            <span className="pill ghost">Temporada ativa {ano}</span>
            {showResults && (
              <button className="button ghost" onClick={novaBusca}>
                Resetar visao
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="content-grid">
        <section className="panel filtros">
          <div className="panel-header">
            <p className="eyebrow">Filtrar</p>
            <h3>Monte seu cenario</h3>
            <p className="muted">Pais -> Liga -> Time. Tudo em poucos cliques.</p>
          </div>

          <div className="field-stack">
            <Box className="boxField" sx={{ minWidth: 120 }}>
              <FormControl className="campoSelecao" fullWidth variant="outlined" size="small">
                <InputLabel id="pais-label">Pais</InputLabel>
                <Select
                  id="paises"
                  labelId="pais-label"
                  value={pais}
                  label="Pais"
                  onChange={handleChangePais}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value={-1}>Selecione</MenuItem>
                  {paises.map((item) => (
                    <MenuItem value={item} key={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <div className="temporada field">
              <label htmlFor="ano">Temporada</label>
              <input
                id="ano"
                type="number"
                min="2005"
                max="2099"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />
            </div>

            <Box className="boxField" sx={{ minWidth: 120 }}>
              <FormControl className="campoSelecao" fullWidth variant="outlined" size="small">
                <InputLabel id="liga-label">Liga</InputLabel>
                <Select
                  id="ligas"
                  labelId="liga-label"
                  value={liga}
                  label="Liga"
                  onChange={handleChangeLiga}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value={-1}>Selecione</MenuItem>
                  {ligas.map((item) => (
                    <MenuItem value={item.league.id} key={item.league.id}>{item.league.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box className="boxField" sx={{ minWidth: 120 }}>
              <FormControl className="campoSelecao" fullWidth variant="outlined" size="small">
                <InputLabel id="time-label">Time</InputLabel>
                <Select
                  id="times"
                  labelId="time-label"
                  value={time}
                  label="Time"
                  onChange={handleChangeTime}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value={-1}>Selecione</MenuItem>
                  {times.map((item) => (
                    <MenuItem value={item.team.id} key={item.team.id}>{item.team.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
        </section>

        <section className="panel stats">
          {!showResults || !objTime ? (
            <div className="empty-state">
              <p className="eyebrow">Nenhum time carregado</p>
              <h3>Selecione um pais, liga e time para ver numeros.</h3>
              <p className="muted">Os filtros a esquerda atualizam tudo em tempo real.</p>
            </div>
          ) : (
            <>
              <div className="team-header">
                <div className="team-brand">
                  {objTime?.team?.logo && <img src={objTime.team.logo} alt={objTime?.team?.name} />}
                  <div>
                    <p className="eyebrow">{objTime?.league?.name}</p>
                    <h2>{objTime?.team?.name}</h2>
                    <p className="muted">Temporada {ano}</p>
                  </div>
                </div>
                <button className="button" onClick={novaBusca}>Nova busca</button>
              </div>

              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-title">Jogos</div>
                  <div className="pill-row">
                    <div className="pill solid">
                      <span>Total</span>
                      <strong>{objTime?.fixtures?.played?.total ?? '-'}</strong>
                    </div>
                    <div className="pill">
                      <span>Casa</span>
                      <strong>{objTime?.fixtures?.played?.home ?? '-'}</strong>
                    </div>
                    <div className="pill">
                      <span>Fora</span>
                      <strong>{objTime?.fixtures?.played?.away ?? '-'}</strong>
                    </div>
                  </div>
                  <div className="stat-line">
                    <span>Vitorias</span>
                    <span>{objTime?.fixtures?.wins?.total ?? '-'}</span>
                    <span className="muted">Casa {objTime?.fixtures?.wins?.home ?? '-'} / Fora {objTime?.fixtures?.wins?.away ?? '-'}</span>
                  </div>
                  <div className="stat-line">
                    <span>Empates</span>
                    <span>{objTime?.fixtures?.draws?.total ?? '-'}</span>
                    <span className="muted">Casa {objTime?.fixtures?.draws?.home ?? '-'} / Fora {objTime?.fixtures?.draws?.away ?? '-'}</span>
                  </div>
                  <div className="stat-line">
                    <span>Derrotas</span>
                    <span>{objTime?.fixtures?.loses?.total ?? objTime?.fixtures?.losses?.total ?? '-'}</span>
                    <span className="muted">Casa {objTime?.fixtures?.loses?.home ?? objTime?.fixtures?.losses?.home ?? '-'} / Fora {objTime?.fixtures?.loses?.away ?? objTime?.fixtures?.losses?.away ?? '-'}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Gols marcados</div>
                  <div className="stat-line">
                    <span>Total</span>
                    <span>{objTime?.goals?.for?.total?.total ?? '-'}</span>
                    <span className="muted">Media {objTime?.goals?.for?.average?.total ?? '-'}</span>
                  </div>
                  <div className="stat-line">
                    <span>Casa</span>
                    <span>{objTime?.goals?.for?.total?.home ?? '-'}</span>
                    <span className="muted">Media {objTime?.goals?.for?.average?.home ?? '-'}</span>
                  </div>
                  <div className="stat-line">
                    <span>Fora</span>
                    <span>{objTime?.goals?.for?.total?.away ?? '-'}</span>
                    <span className="muted">Media {objTime?.goals?.for?.average?.away ?? '-'}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Gols sofridos</div>
                  <div className="stat-line">
                    <span>Total</span>
                    <span>{objTime?.goals?.against?.total?.total ?? '-'}</span>
                    <span className="muted">Media {objTime?.goals?.against?.average?.total ?? '-'}</span>
                  </div>
                  <div className="stat-line">
                    <span>Casa</span>
                    <span>{objTime?.goals?.against?.total?.home ?? '-'}</span>
                    <span className="muted">Media {objTime?.goals?.against?.average?.home ?? '-'}</span>
                  </div>
                  <div className="stat-line">
                    <span>Fora</span>
                    <span>{objTime?.goals?.against?.total?.away ?? '-'}</span>
                    <span className="muted">Media {objTime?.goals?.against?.average?.away ?? '-'}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Penaltis</div>
                  <div className="stat-line">
                    <span>Convertidos</span>
                    <span>{objTime?.penalty?.scored?.total ?? '-'}</span>
                    <span className="muted">{objTime?.penalty?.scored?.percentage ?? '-'}</span>
                  </div>
                  <div className="stat-line">
                    <span>Perdidos</span>
                    <span>{objTime?.penalty?.missed?.total ?? '-'}</span>
                    <span className="muted">{objTime?.penalty?.missed?.percentage ?? '-'}</span>
                  </div>
                </div>
              </div>

              <div className="stat-card wide">
                <div className="stat-title">Gols por minuto</div>
                <div className="minute-grid">
                  <div className="minute-header">
                    <span>Minuto</span>
                    <span>Marcados</span>
                    <span>Sofridos</span>
                  </div>
                  {minuteWindows.map((slot) => (
                    <div className="minute-row" key={slot.key}>
                      <span>{slot.label}</span>
                      <span>{objTime?.goals?.for?.minute?.[slot.key]?.total ?? '-'}</span>
                      <span>{objTime?.goals?.against?.minute?.[slot.key]?.total ?? '-'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="stat-card wide">
                <div className="stat-title">Cartoes</div>
                <div className="cards-grid">
                  <div>
                    <p className="muted">Amarelos</p>
                    {minuteWindows.map((slot) => (
                      <div className="stat-line compact" key={`yellow-${slot.key}`}>
                        <span>{slot.label}</span>
                        <span>{objTime?.cards?.yellow?.[slot.key]?.total ?? '-'}</span>
                        <span className="muted">{objTime?.cards?.yellow?.[slot.key]?.percentage ?? '-'}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="muted">Vermelhos</p>
                    {minuteWindows.map((slot) => (
                      <div className="stat-line compact" key={`red-${slot.key}`}>
                        <span>{slot.label}</span>
                        <span>{objTime?.cards?.red?.[slot.key]?.total ?? '-'}</span>
                        <span className="muted">{objTime?.cards?.red?.[slot.key]?.percentage ?? '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
