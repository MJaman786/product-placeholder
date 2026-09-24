export const HEADER_WITH_JSON = () => ({
    "Content-Type": "application/json"
})

export const HEADER_WITH_TOKEN = (token: string | null) => ({
    ...(token && { authorization: `Bearer ${token}` })
});
