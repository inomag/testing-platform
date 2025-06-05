import { formatToLocalTime } from 'src/workspace/utils';
import { getCronData } from './queries';

// Mock the formatToLocalTime function
jest.mock('src/workspace/utils', () => ({
  formatToLocalTime: jest.fn(),
}));

describe('src/modules/dashboard/vmDetails/queries.spec.ts', () => {
  describe('getCronData', () => {
    beforeEach(() => {
      // Clear mock before each test
      jest.clearAllMocks();
    });

    it('should return formatted cron data when vmDetails has cron data', () => {
      // Mock formatToLocalTime implementation
      const mockDate = new Date('2025-01-01').toISOString();
      (formatToLocalTime as jest.Mock).mockImplementation(() => mockDate);

      const mockVmDetails = {
        cron: {
          cronCypressLastUpdate: '2025-01-01T00:00:00Z',
          cronFeatureUrlsLastUpdate: '2025-01-01T00:00:00Z',
          cronDeploymentLastUpdate: '2025-01-01T00:00:00Z',
          cronData: { foo: 'bar' },
        },
      };

      const result = getCronData(mockVmDetails);

      const expected = {
        cronCypressLastUpdate: mockDate,
        cronFeatureUrlsLastUpdate: mockDate?.toString(),
        cronDeploymentLastUpdate: mockDate,
        cronData: { foo: 'bar' },
      };

      expect(result).toEqual(expected);

      // Verify formatToLocalTime was called with correct arguments
      expect(formatToLocalTime).toHaveBeenCalledTimes(3);
      expect(formatToLocalTime).toHaveBeenCalledWith(
        mockVmDetails.cron.cronCypressLastUpdate,
      );
      expect(formatToLocalTime).toHaveBeenCalledWith(
        mockVmDetails.cron.cronFeatureUrlsLastUpdate,
      );
      expect(formatToLocalTime).toHaveBeenCalledWith(
        mockVmDetails.cron.cronDeploymentLastUpdate,
      );
    });

    it('should handle vmDetails with no cron data', () => {
      const mockVmDetails = {
        cron: null,
      };

      const result = getCronData(mockVmDetails);

      const expected = {
        cronCypressLastUpdate: undefined,
        cronFeatureUrlsLastUpdate: undefined,
        cronDeploymentLastUpdate: undefined,
        cronData: undefined,
      };

      expect(result).toEqual(expected);
    });

    it('should handle vmDetails with empty cron object', () => {
      const mockVmDetails = {
        cron: {},
      };

      const result = getCronData(mockVmDetails);

      const expected = {
        cronCypressLastUpdate: undefined,
        cronFeatureUrlsLastUpdate: undefined,
        cronDeploymentLastUpdate: undefined,
        cronData: undefined,
      };

      expect(result).toEqual(expected);
    });
  });
});
