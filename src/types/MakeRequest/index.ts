export interface MakeRequestTypes {
    pathname: string;
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    values?: any;
    params?: Record<string, any>;
    showMessage?: boolean;
    show_error_message?: boolean;
    token?: boolean;
    isFormData?: boolean;
}

/**
 * ApiResponse wraps the Axios response data.
 *
 * DummyJSON returns data directly (not nested in a `data` key),
 * so `data` here refers to the full Axios response.data payload.
 * For DummyJSON: res.data is the product / products array directly.
 *
 * For structured APIs that wrap in { success, message, data }:
 * the `success` and `message` fields are used for toast messaging.
 */
export interface ApiResponse<T> {
    success?: boolean;
    statusCode?: number;
    message?: string;
    data: T;
    timestamp?: string;
}
