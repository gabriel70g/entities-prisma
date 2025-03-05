import { datesLastMonth } from './datesLastMonth';

describe('datesLastMonth', () => {
    it('should return the correct start and end dates of the last month', () => {
        const { startOfLastMonth, endOfLastMonth } = datesLastMonth();

        const now = new Date();
        const expectedStartOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
        const expectedEndOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        expect(startOfLastMonth).toEqual(expectedStartOfLastMonth);
        expect(endOfLastMonth).toEqual(expectedEndOfLastMonth);
    });

    it('should handle year transition correctly', () => {
        const mockDate = new Date(2023, 0, 15); // January 15, 2023
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

        const { startOfLastMonth, endOfLastMonth } = datesLastMonth();

        const expectedStartOfLastMonth = new Date(2022, 11, 1, 0, 0, 0, 0); // December 1, 2022
        const expectedEndOfLastMonth = new Date(2022, 11, 31, 23, 59, 59, 999); // December 31, 2022

        expect(startOfLastMonth).toEqual(expectedStartOfLastMonth);
        expect(endOfLastMonth).toEqual(expectedEndOfLastMonth);

        jest.restoreAllMocks();
    });
});