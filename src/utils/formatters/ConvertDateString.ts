export const convertDateString = (value: string, withTime?: boolean) => {
    if (withTime) {
        const myDate = new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
        return myDate;
    }
    const myDate = new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
    return myDate;
}
