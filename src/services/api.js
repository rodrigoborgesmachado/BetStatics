import axios from "axios";

const api = axios.create({
    baseURL: 'https://api-football-v1.p.rapidapi.com/v3/',
    headers: {
        'X-RapidAPI-Key':'fa71d63271msh520a2cdce2467ebp1e94bfjsn8f69f471dd90',
        'X-RapidAPI-Host':'api-football-v1.p.rapidapi.com'
    }
})

export default api;