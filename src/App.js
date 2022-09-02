import { useState } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import api from './services/api.js';
import {toast} from 'react-toastify';
import { display } from "@mui/system";

function App() {
  const[ano, setAno] = useState(2022);
  const[paises, setPaises] = useState(['Brazil', 'England', 'France', 'Germany', 'Italy', 'Portugal', 'Spain', 'Turkey']);
  const[pais, setPais] = useState('');
  const[liga, setLiga] = useState('');
  const[ligas, setLigas] = useState([]);
  const[times, setTimes] = useState([]);
  const[time, setTime] = useState('');
  const[objTime, setObjTime] = useState(null);

  const handleChangePais = (event) => {
    setPais(event.target.value);
    setTime([]);
    if(event.target.value!= -1){
      BuscaLigas(event.target.value);
    }
  };

  const handleChangeLiga = (event) => {
    setLiga(event.target.value);
    if(event.target.value!= -1){
      BuscaTimes(event.target.value);
    }
  };

  const handleChangeTime = (event) => {
    setTime(event.target.value);
    BuscaDadosTime(event.target.value)
  };

  async function BuscaLigas(pais){
    await api.get('leagues?country=' + pais)
    .then((result) => {
      setLigas(result.data.response);
    })
    .catch(() => {
      toast.warn('Erro ao buscar as ligas');
    })
  }

  async function BuscaTimes(liga){
    await api.get(`teams?league=${liga}&season=${ano}`)
    .then((result) => {
      setTimes(result.data.response);
    })
    .catch(() => {
      toast.warn('Erro ao buscar os times');
    })
  }

  async function BuscaDadosTime(time){
    await api.get(`teams/statistics?league=${liga}&season=${ano}&team=${time}`)
    .then((result) => {
      setObjTime(result.data.response);
      document.getElementById('filtro').style.display = 'none';
      document.getElementById('dados').style.display = 'inline';
    })
    .catch(() => {
      toast.warn('Erro ao buscar as ligas');
    })
  }

  function novaBusca(){
    document.getElementById('filtro').style.display = 'inline';
    document.getElementById('dados').style.display = 'none';
  }

  return (
    <div className="App">
      <div className="informacoes">
        <div className="titulo">
          <a href="/"><h2>Bet Statistics</h2></a>
        </div>
        <div className="filtros" id="filtro">
        <br/>
          <Box className="boxField" sx={{ minWidth: 120 }}>
            <FormControl className="campoSelecao">
              <InputLabel id="pais-label">País</InputLabel>
              <Select
                id="paises"
                value={pais}
                label="País"
                onChange={handleChangePais}
              >
                <MenuItem value={-1}>-</MenuItem>
                {
                  paises.map((item) => {
                    return(
                      <MenuItem value={item} key={item}>{item}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </Box>
          <br/>
          <div className="temporada">
            <h4>Temporada</h4>
            <input type='number' value={ano} onChange={(e) =>{setAno(e.target.value)}}/>
          </div>
          <br/>
          <br/>
          <Box className="boxField" sx={{ minWidth: 120 }}>
            <FormControl className="campoSelecao">
              <InputLabel id="liga-label">Liga</InputLabel>
              <Select
                id="ligas"
                value={liga}
                label="Liga"
                onChange={handleChangeLiga}
              >
                <MenuItem value={-1}>-</MenuItem>
                {
                  ligas.map((item) => {
                    return(
                      <MenuItem value={item.league.id} key={item.league.id}>{item.league.name}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </Box>
          <br/>
          <Box className="boxField" sx={{ minWidth: 120 }}>
            <FormControl className="campoSelecao">
              <InputLabel id="time-label">Time</InputLabel>
              <Select
                id="times"
                value={time}
                label="Time"
                onChange={handleChangeTime}
              >
                <MenuItem value={-1}>-</MenuItem>
                {
                  times.map((item) => {
                    return(
                      <MenuItem value={item.team.id} key={item.team.id}>{item.team.name}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </Box>
        </div>
        <br/>
        <br/>
          <div className="dadostime" id="dados" style={{display:'none'}}>
            <hr/>
            <h2>
              <img src={objTime?.team?.logo}></img> 
              <br/>
              {objTime?.team?.name}
            </h2>
            <h3>
              Liga: {objTime?.league?.name}
            </h3>
            <br/>
            <h3>
            Jogos: 
            </h3>
            <div className="Jogos">
              Total: {objTime?.fixtures?.played?.total}
              <br/>
              Jogos em casa: {objTime?.fixtures?.played?.home}
              <br/>
              Jogos fora: {objTime?.fixtures?.played?.away}
              <br/>
              <br/>
              Vitórias: {objTime?.fixtures?.wins?.total}
              <br/>
              Vitórias em casa: {objTime?.fixtures?.wins?.home}
              <br/>
              Vitórias fora: {objTime?.fixtures?.wins?.away}
              <br/>
              <br/>
              Empates: {objTime?.fixtures?.draws?.total}
              <br/>
              Empates em casa: {objTime?.fixtures?.draws?.home}
              <br/>
              Empates fora: {objTime?.fixtures?.draws?.away}
              <br/>
              <br/>
              Derrotas: {objTime?.fixtures?.draws?.total}
              <br/>
              Derrotas em casa: {objTime?.fixtures?.draws?.home}
              <br/>
              Derrotas fora: {objTime?.fixtures?.draws?.away}
            </div>
            <br/>
            <h3>
            Gols: 
            </h3>
            <div className="Gols">
              Feitos
              <br/>
              Total de gols feitos: {objTime?.goals?.for?.total?.total} | Média: {objTime?.goals?.for?.average?.total}
              <br/>
              Total de gols feitos em casa: {objTime?.goals?.for?.total?.home} | Média: {objTime?.goals?.for?.average?.home}
              <br/>
              Total de gols feitos fora: {objTime?.goals?.for?.total?.away} | Média: {objTime?.goals?.for?.average?.away}
              <br/>
              <div className="Gols">
                Minuto:
                <br/>
                00-15 minutos: {objTime?.goals?.for?.minute["0-15"]?.total} | Chance: {objTime?.goals?.for?.minute["0-15"]?.percentage}
                <br/>
                16-30 minutos: {objTime?.goals?.for?.minute["16-30"]?.total} | Chance: {objTime?.goals?.for?.minute["16-30"]?.percentage}
                <br/>
                31-45 minutos: {objTime?.goals?.for?.minute["31-45"]?.total} | Chance: {objTime?.goals?.for?.minute["31-45"]?.percentage}
                <br/>
                46-60 minutos: {objTime?.goals?.for?.minute["46-60"]?.total} | Chance: {objTime?.goals?.for?.minute["46-60"]?.percentage}
                <br/>
                61-75 minutos: {objTime?.goals?.for?.minute["61-75"]?.total} | Chance: {objTime?.goals?.for?.minute["61-75"]?.percentage}
                <br/>
                76-90 minutos: {objTime?.goals?.for?.minute["76-90"]?.total} | Chance: {objTime?.goals?.for?.minute["76-90"]?.percentage}
                <br/>
                91-105 minutos: {objTime?.goals?.for?.minute["91-105"]?.total} | Chance: {objTime?.goals?.for?.minute["91-105"]?.percentage}
                <br/>
                106-120 minutos: {objTime?.goals?.for?.minute["106-120"]?.total} | Chance: {objTime?.goals?.for?.minute["106-120"]?.percentage}
              </div>
              <br/>
              Levados
              <br/>
              Total de gols levados: {objTime?.goals?.against?.total?.total} | Média: {objTime?.goals?.against?.average?.total}
              <br/>
              Total de gols levados em casa: {objTime?.goals?.against?.total?.home} | Média: {objTime?.goals?.against?.average?.home}
              <br/>
              Total de gols levados fora: {objTime?.goals?.against?.total?.away} | Média: {objTime?.goals?.against?.average?.away}
              <br/>
              <div className="Gols">
                Minuto:
                <br/>
                00-15 minutos: {objTime?.goals?.against?.minute["0-15"]?.total} | Chance: {objTime?.goals?.against?.minute["0-15"]?.percentage}
                <br/>
                16-30 minutos: {objTime?.goals?.against?.minute["16-30"]?.total} | Chance: {objTime?.goals?.against?.minute["16-30"]?.percentage}
                <br/>
                31-45 minutos: {objTime?.goals?.against?.minute["31-45"]?.total} | Chance: {objTime?.goals?.against?.minute["31-45"]?.percentage}
                <br/>
                46-60 minutos: {objTime?.goals?.against?.minute["46-60"]?.total} | Chance: {objTime?.goals?.against?.minute["46-60"]?.percentage}
                <br/>
                61-75 minutos: {objTime?.goals?.against?.minute["61-75"]?.total} | Chance: {objTime?.goals?.against?.minute["61-75"]?.percentage}
                <br/>
                76-90 minutos: {objTime?.goals?.against?.minute["76-90"]?.total} | Chance: {objTime?.goals?.against?.minute["76-90"]?.percentage}
                <br/>
                91-105 minutos: {objTime?.goals?.against?.minute["91-105"]?.total} | Chance: {objTime?.goals?.against?.minute["91-105"]?.percentage}
                <br/>
                106-120 minutos: {objTime?.goals?.against?.minute["106-120"]?.total} | Chance: {objTime?.goals?.against?.minute["106-120"]?.percentage}
              </div>
            </div>
            <h3>
              Penaltis:
            </h3>
            <div className="Gols">
                Scored: {objTime?.penalty?.scored?.total} | Chance: {objTime?.penalty?.scored?.percentage}
                Missed: {objTime?.penalty?.missed?.total} | Chance: {objTime?.penalty?.missed?.percentage}
            </div>
            <br/>
            <br/>
            <h3>
              Cartões:
            </h3>
            <div className="Gols">
                Amarelo: 
                <div className="Gols">
                  00-15 minutos: {objTime?.cards?.yellow["0-15"]?.total} | Chance: {objTime?.cards?.yellow["0-15"]?.percentage}
                  <br/>
                  16-30 minutos: {objTime?.cards?.yellow["16-30"]?.total} | Chance: {objTime?.cards?.yellow["16-30"]?.percentage}
                  <br/>
                  31-45 minutos: {objTime?.cards?.yellow["31-45"]?.total} | Chance: {objTime?.cards?.yellow["31-45"]?.percentage}
                  <br/>
                  46-60 minutos: {objTime?.cards?.yellow["46-60"]?.total} | Chance: {objTime?.cards?.yellow["46-60"]?.percentage}
                  <br/>
                  61-75 minutos: {objTime?.cards?.yellow["61-75"]?.total} | Chance: {objTime?.cards?.yellow["61-75"]?.percentage}
                  <br/>
                  76-90 minutos: {objTime?.cards?.yellow["76-90"]?.total} | Chance: {objTime?.cards?.yellow["76-90"]?.percentage}
                  <br/>
                  91-105 minutos: {objTime?.cards?.yellow["91-105"]?.total} | Chance: {objTime?.cards?.yellow["91-105"]?.percentage}
                  <br/>
                  106-120 minutos: {objTime?.cards?.yellow["106-120"]?.total} | Chance: {objTime?.cards?.yellow["106-120"]?.percentage}
                </div>
                Vermelho: 
                <div className="Gols">
                  00-15 minutos: {objTime?.cards?.red["0-15"]?.total} | Chance: {objTime?.cards?.red["0-15"]?.percentage}
                  <br/>
                  16-30 minutos: {objTime?.cards?.red["16-30"]?.total} | Chance: {objTime?.cards?.red["16-30"]?.percentage}
                  <br/>
                  31-45 minutos: {objTime?.cards?.red["31-45"]?.total} | Chance: {objTime?.cards?.red["31-45"]?.percentage}
                  <br/>
                  46-60 minutos: {objTime?.cards?.red["46-60"]?.total} | Chance: {objTime?.cards?.red["46-60"]?.percentage}
                  <br/>
                  61-75 minutos: {objTime?.cards?.red["61-75"]?.total} | Chance: {objTime?.cards?.red["61-75"]?.percentage}
                  <br/>
                  76-90 minutos: {objTime?.cards?.red["76-90"]?.total} | Chance: {objTime?.cards?.red["76-90"]?.percentage}
                  <br/>
                  91-105 minutos: {objTime?.cards?.red["91-105"]?.total} | Chance: {objTime?.cards?.red["91-105"]?.percentage}
                  <br/>
                  106-120 minutos: {objTime?.cards?.red["106-120"]?.total} | Chance: {objTime?.cards?.red["106-120"]?.percentage}
                </div>
            </div>
            <button onClick={novaBusca}>Fazer nova busca</button>
          </div>
      </div>
    </div>
  );
}

export default App;
