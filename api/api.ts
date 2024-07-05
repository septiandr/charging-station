import axios from "axios";

export async function getDataFromOpenChargeMap() {
    const endpoint = 'https://api.openchargemap.io/v3/poi/?client=ocm.app.ionic.8.6.1&verbose=false&output=json&includecomments=true&maxresults=500&compact=true&boundingbox=(-15.643672615667683,103.34353043551516),(1.248513186507509,115.90827107059266)';
    const apiKey = '9bb03e5b-0fb2-4916-9b2b-26c6bd27a56a';
    
    try {
        const response = await axios.get(endpoint, {
            headers: {
                'x-api-key': apiKey
            }
        });
        
        if (response.status !== 200) {
            throw new Error('Gagal mendapatkan data dari API.');
        }
        
        const data = response.data;
        return data;
        
    } catch (error: any) {
        console.error('Error:', error.message);
        return null;
    }
}
