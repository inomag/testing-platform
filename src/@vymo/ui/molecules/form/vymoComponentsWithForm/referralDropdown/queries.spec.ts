import {
  getReferralFilters as actualGetReferralFilters,
  getReferralDropdownParams,
} from './queries';

jest.mock('./queries', () => ({
  ...jest.requireActual('./queries'),
  getReferralFilters: jest.fn(),
}));

describe('src/@vymo/ui/molecules/currencyAndDecimal/queries.ts', () => {
  const mockedGetReferralFilters = jest.mocked(actualGetReferralFilters, true);

  describe('getReferralFilters', () => {
    it('should accumulate unique values for each filter path', () => {
      const customFilter = [
        { path: 'status', value: ['new'] },
        { path: 'status', value: ['in-progress'] },
        { path: 'priority', value: ['high'] },
        { path: 'status', value: ['new', 'completed'] },
      ];

      mockedGetReferralFilters.mockReturnValue({
        status: ['new', 'in-progress', 'completed'],
        priority: ['high'],
      });

      const result = actualGetReferralFilters(customFilter);

      expect(result).toEqual({
        status: ['new', 'in-progress', 'completed'],
        priority: ['high'],
      });
    });

    it('should return an empty object if customFilter is empty or undefined', () => {
      mockedGetReferralFilters.mockReturnValue({});

      expect(actualGetReferralFilters([])).toEqual({});
      expect(actualGetReferralFilters(undefined)).toEqual({});
    });

    it('should handle customFilter with duplicate values correctly', () => {
      const customFilter = [
        { path: 'status', value: ['new'] },
        { path: 'status', value: ['new', 'completed'] },
        { path: 'status', value: ['new', 'in-progress'] },
      ];

      mockedGetReferralFilters.mockReturnValue({
        status: ['new', 'completed', 'in-progress'],
      });

      const result = actualGetReferralFilters(customFilter);

      expect(result).toEqual({
        status: ['new', 'completed', 'in-progress'],
      });
    });

    it('should handle a single filter path with multiple values', () => {
      const customFilter = [
        { path: 'priority', value: ['high', 'medium'] },
        { path: 'priority', value: ['low'] },
      ];

      mockedGetReferralFilters.mockReturnValue({
        priority: ['high', 'medium', 'low'],
      });

      const result = actualGetReferralFilters(customFilter);

      expect(result).toEqual({
        priority: ['high', 'medium', 'low'],
      });
    });
  });

  describe('getReferralDropdownParams', () => {
    it('should return the correct params with all arguments provided', () => {
      const customFilter = [{ value: ['exampleValue'], path: 'examplePath' }];
      const source = 'exampleSource';
      const searchText = 'exampleSearchText';

      mockedGetReferralFilters.mockReturnValue({
        examplePath: ['exampleValue'],
      });

      const expectedParams = {
        filters: JSON.stringify({ examplePath: ['exampleValue'] }),
        source,
        search_text: searchText,
      };

      const result = getReferralDropdownParams(
        customFilter,
        source,
        searchText,
      );

      expect(result).toEqual(expectedParams);
    });

    it('should return the correct params without searchText', () => {
      const customFilter = [{ value: ['exampleValue'], path: 'examplePath' }];
      const source = 'exampleSource';

      mockedGetReferralFilters.mockReturnValue({
        examplePath: ['exampleValue'],
      });

      const expectedParams = {
        filters: JSON.stringify({ examplePath: ['exampleValue'] }),
        source,
        search_text: undefined,
      };

      const result = getReferralDropdownParams(customFilter, source);

      expect(result).toEqual(expectedParams);
    });
  });
});
