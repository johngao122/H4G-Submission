export const formatDateForAPI = (date: string): string => {
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
