import axios from "axios";
import { HEADER_WITH_JSON } from "./Headers";
import { useAuthStore } from "../../store/Auth/useAuthStore";
import showToast from "./ShowToast";
import type { ApiResponse, MakeRequestTypes } from "../../types/MakeRequest";

// DummyJSON base URL — can be overridden via .env VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://dummyjson.com";

/**
 * Central HTTP utility.
 *
 * DummyJSON returns data *directly* at the response root (e.g. `{ products: [...], total: 194 }`),
 * NOT nested inside a `data` key. We normalise this by returning `{ data: response.data }` so all
 * callers can consistently do `res?.data?.products`.
 */
export default async function makeRequest<T>({
    pathname,
    method = 'GET',
    token = false,
    params,
    values,
    showMessage = false,
    show_error_message = false,
    isFormData = false,
}: MakeRequestTypes): Promise<ApiResponse<T> | undefined> {

    try {
        const TOKEN = useAuthStore.getState().token;

        // GET and DELETE don't carry a request body
        const requestData = method === 'GET' || method === 'DELETE' ? undefined : values;

        const response = await axios({
            method,
            url: `${API_BASE_URL}${pathname}`,
            params: params ? { ...params } : undefined,
            headers: {
                ...(token && TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
                ...(!isFormData && HEADER_WITH_JSON()),
            },
            data: requestData,
            withCredentials: false,
        });

        // Normalise: wrap the flat DummyJSON payload in our { data } shape
        const normalised: ApiResponse<T> = {
            data: response.data as T,
            success: true,
        };

        if (showMessage && normalised.message) {
            showToast({ msg: normalised.message, type: 'success' });
        }

        return normalised;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const statusCode = error.response.status;
            const errorData = error.response.data;
            const msg: string = errorData?.message ?? error.message ?? 'An error occurred';

            if (statusCode === 401) {
                showToast({ msg: "Your session has expired. Please log in again.", type: 'error' });
                useAuthStore.getState().logout();
                window.location.href = "/login";
                return undefined;
            }

            if (show_error_message || showMessage) {
                showToast({ msg, type: 'error' });
            }

            return { data: errorData as T, success: false, message: msg };
        }

        // Network / no response
        showToast({ msg: 'Network error, please try again.', type: 'error' });
        return undefined;
    }
}
