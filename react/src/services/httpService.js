import axios from "axios"

axios.interceptors.response.use(null, error => {
    const expectedError = error.response 
        && error.response.status >= 400 
        && error.response.status < 500;

    if(!expectedError) {
        console.log('Logging the error', error)
    }

    if (error.response && error.response.status === 422) {
        return Promise.resolve(error.response);
    }

    return Promise.reject(error)
})

const setToken = (token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}` 
}

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    setToken,
}