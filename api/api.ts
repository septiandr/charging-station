import { api, endPoint } from "@/config/config";
import axios from "axios";
import { Alert } from "react-native";

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


export const getChargingStation = async () => {
    try {
        const { data } = await axios.get(`https://671583f6b6d5d53a2c0e.appwrite.global/list-charging`)

        console.log("🚀 ~ getChargingStation ~ data:", data)
        if (data?.code === 200) {
            return data.data;
        }

        throw new Error(data?.message || 'Unexpected response');

    } catch (error) {
        console.log('Error fetching charging stations:', error);
        return null;
    }
};
export const login = async (request: { password: string, email: string }) => {
    try {
        const response = await axios.post(`${endPoint}${api.login}`, request);

        if (response?.data?.code === 200) {
            return response?.data;
        }

        throw new Error(response?.data?.message || 'Unexpected response');

    } catch (error) {
        console.error('Error fetching charging stations:', error);
        return null;
    }
};
export const register = async (request: { password: string, email: string, name:string }) => {
    try {
        const response = await axios.post(`${endPoint}${api.register}`, request);

        console.log("🚀 ~ register ~ response:", response)
        if (response?.data?.code === 200) {
            return response?.data;
        }

        throw new Error(response?.data?.message || 'Unexpected response');

    } catch (error) {
        console.error('Error fetching charging stations:', error);
        return null;
    }
};
export const addCar = async (request: { user_id: string, car_data: string }) => {
    try {
        const response = await axios.post(`${endPoint}${api.addUserCar}`, request);

        if (response?.data?.code === 200) {
            return response?.data;
        }

        throw new Error(response?.data?.message || 'Unexpected response');

    } catch (error) {
        console.error('Error fetching charging stations:', error);
        return null;
    }
};
export const getUserCar = async (request: { user_id: string}) => {
    try {
        const response = await axios.post(`${endPoint}/get-user-car`, request);

        if (response?.data?.code === 200) {
            return response?.data;
        }

        throw new Error(response?.data?.message || 'Unexpected response');

    } catch (error) {
        console.error('Error fetching charging stations:', error);
        return null;
    }
};
export const deleteCar = async (request: { id: string}) => {
    try {
        const response = await axios.post(`${endPoint}/delete-user-car`, request);

        if (response?.data?.code === 200) {
            return response?.data;
        }

        throw new Error(response?.data?.message || 'Unexpected response');

    } catch (error) {
        console.log('Error fetching charging stations:', error);
        return null;
    }
};
export const addToFavorite = async (request: { user_id: string, data_station:string}) => {
    try {
        const response = await axios.post(`${endPoint}/add-favorite`, request);

        if (response?.data?.code === 200) {
            return response?.data;
        }

        throw new Error(response?.data?.message || 'Unexpected response');

    } catch (error) {
        console.log('Error fetching charging stations:', error);
        return null;
    }
};
export const getFavoriteByid = async (request: { user_id:string}) => {
    try {
        const response = await axios.post(`${endPoint}/get-favorite`, request);

        if (response?.data?.code === 200) {
            return response?.data;
        }

        throw new Error(response?.data?.message || 'Unexpected response');

    } catch (error) {
        console.log('Error fetching charging stations:', error);
        return null;
    }
};
export const deleteFavorite = async (request: { id:string}) => {
    try {
        const response = await axios.post(`${endPoint}/delete-user-favorite`, request);

        console.log("🚀 ~ deleteFavorite ~ response:", response)
        if (response?.data?.code === 200) {
            return response?.data;
        }

        throw new Error(response?.data?.message || 'Unexpected response');

    } catch (error) {
        console.log('Error fetching charging stations:', error);
        return null;
    }
};

