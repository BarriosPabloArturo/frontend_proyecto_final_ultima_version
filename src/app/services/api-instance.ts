import axios from 'axios';

const api = axios.create({
  //this is the base URL for the API requests
  //it is the URL of the backend server where the API is hosted
  // it would prevent us to repeat the URL in every request
  //it is a good practice to use a base URL for the API requests
  //this is what services are for
  //services are used to make API requests in Angular
  baseURL: 'https://backend-proyecto-final-ultima-version-1.onrender.com/api',
});

// Interceptor para agregar el token
api.interceptors.request.use((config) => {
  //the token is stored in the local storage after the user logs in
  //it is used to authenticate the user in the backend
  const token = localStorage.getItem('token');
  //if the token exists, it is added to the headers of the request
  //this way, the backend can verify the token and authenticate the user
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Interceptor para manejar tokens inválidos o vencidos
//if the token is invalid or expired, the backend will return an error message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    //this is an optional chain of interceptors that can be used to handle errors globally
    //if the error is related to the token, we can handle it here
    const msg = error.response?.data?.msg;
    if (msg === 'Token no valido') {
      // If the token is invalid, we can remove it from local storage
      //this will remove the token from the local storage so that it is not used in future
      localStorage.removeItem('token');
      // Redirect to login page if the token is invalid
      //this will redirect the user to the login page if the token is invalid or expired
      window.location.href = '/login';
    }
    // If the error is not related to the token, we can handle it here
    // For example, we can show an error message to the user
    return Promise.reject(error);
  }
);
//export the instance of axios so that it can be used in other parts of the application
//this instance of axios can be used to make API requests
export default api;
