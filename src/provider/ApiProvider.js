import React, {useEffect, useState} from "react";
import axios from 'axios';
import cogoToast from 'cogo-toast';

export const ApiContext = React.createContext({})
axios.defaults.baseURL=process.env.REACT_APP_API_URL;
axios.defaults.headers.common.Authorization = null
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default function ApiProvider(props){
    const [test, setTest] = useState('TEST');
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.interceptors.response.use((resp) => {
            return Promise.resolve(resp);

        }, error => {
            const { response } = error
            if (response) {
                cogoToast.error(response.data.error.message);
            }else{
                cogoToast.error('Invalid Error');
            }

            return Promise.reject(error);
        })
    },[])

    useEffect(() => {
        if(localStorage.getItem('userData')){
            setUser(JSON.parse(localStorage.getItem('userData')));
        }
    },[])

    useEffect(() => {
        localStorage.setItem('userData',JSON.stringify(user));
    },[user])


    return (
        <ApiContext.Provider value={{user, setUser}}>
            {props.children}
        </ApiContext.Provider>
    )
}