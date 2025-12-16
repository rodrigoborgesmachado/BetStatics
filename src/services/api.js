import axios from "axios";

const api = axios.create({
    baseURL: 'https://v3.football.api-sports.io/',
    headers: {
        'x-rapidapi-key':'942af62036fd0f1ded5f4cbf15eb955d'
    }
})

export default api;