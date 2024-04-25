import axios from 'axios';
import AppConstants from '../../enums/app';
const axiosClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'content-type': 'application/json',
    },
});
interface ResponseData {
    token: string;
    // other properties
}
axiosClient.interceptors.request.use(async (config: any) => {
    const customHeaders: Record<string, unknown> = {};

    const accessToken = localStorage.getItem(AppConstants.ACCESS_TOKEN);
    if (accessToken) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        customHeaders.Authorization = `Bearer ${String(accessToken)}`;
    }

    return {
        ...config,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        headers: {
            ...customHeaders, // auto attach token
            ...config.headers, // but you can override for some requests
        },
    };
});

// const refreshAuthLogic = async (failedRequest: {
//     response: { config: { headers: { [x: string]: string } } };
// }) => {
//     const refreshToken = localStorage.getItem(AppConstants.REFRESH_TOKEN);
//     const accessToken = localStorage.getItem(AppConstants.ACCESS_TOKEN);
//     try {
//         const response = await axiosClient.get('/auth/refresh-token', {
//             headers: {
//                 refreshToken,
//                 Authorization: `Bearer ${String(accessToken)}`,
//             },
//             skipAuthRefresh: true,
//         } as AxiosAuthRefreshRequestConfig);
//         const { token } = response.data as ResponseData;
//         localStorage.setItem(AppConstants.ACCESS_TOKEN, token);
//         failedRequest.response.config.headers.Authorization = `Bearer ${String(
//             token,
//         )}`;
//         return await Promise.resolve();
//     } catch (error) {
//         localStorage.removeItem(AppConstants.REFRESH_TOKEN);
//         localStorage.removeItem(AppConstants.ACCESS_TOKEN);
//         return await Promise.reject(error);
//     }
// };

// createAuthRefreshInterceptor(axiosClient, refreshAuthLogic);

// HOW TO CALL EXTERNAL API

// const getExternalApi = () => {
//   const url = '/resource-name';
//   const config = {
//     baseURL: 'https://your-new-base-api-url.com/api',
//     headers: {
//       Authorization: 'your-new-token-to-use-in-new-api',
//     },
//   };

//   return axiosClient.get(url, config);
// };

export default axiosClient;
