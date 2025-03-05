export const datesLastMonth = () => {
    let startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);

    let endOfLastMonth = new Date(startOfLastMonth);
    endOfLastMonth.setMonth(endOfLastMonth.getMonth() + 1);
    endOfLastMonth.setDate(0);
    endOfLastMonth.setHours(23, 59, 59, 999);

    return { startOfLastMonth, endOfLastMonth };
}