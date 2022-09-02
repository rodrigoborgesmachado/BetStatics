import axios from "axios";

const api = axios.create({
    baseURL: 'https://api-football-v1.p.rapidapi.com/v3/',
    headers: {
    }
})

export default api;