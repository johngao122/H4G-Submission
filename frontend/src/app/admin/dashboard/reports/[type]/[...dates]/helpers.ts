export const formatDateForAPI = (date: string, end: boolean): string => {
    if (end) {
        const formattedDate = `${date}T23:59:59.999`;
        return formattedDate;
    }
    const formattedDate = `${date}T00:00:00.000`;
    return formattedDate;
};

export const isValidDateRange = (
    startDate: string,
    endDate: string
): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
};

export const calculateDateDifference = (
    startDate: string,
    endDate: string
): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
