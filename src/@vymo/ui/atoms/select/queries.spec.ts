import * as constants from './constants';
import { nestedOptionList } from './integration/data';
import {
  getExpandedOptions,
  getOpenNodeIds,
  getSearchResult,
  getUpdatedIndex,
} from './queries';

const flattenOptions = [
  {
    label: 'Branch001',
    value: 'branch',
    id: 'branch',
  },
  {
    label: 'Outgoing Call - (Branch001)',
    value: 'outbound_call',
    id: 'branch__outbound_call',
  },
  {
    label: 'Group A - (Branch001)',
    value: 'x51yeazrti',
    id: 'branch__x51yeazrti',
  },
  {
    label: 'ABCD',
    value: 'abcd',
    id: 'abcd',
  },
  {
    label: 'Line Chat Disposition - (ABCD)',
    value: 'lw_chat_disposition',
    id: 'abcd__lw_chat_disposition',
  },
  {
    label: 'Zoom - (ABCD)',
    value: 'zoom',
    id: 'abcd__zoom',
  },
  {
    label: 'Incoming Call - (ABCD)',
    value: 'inbound_call',
    id: 'abcd__inbound_call',
  },
  {
    label: 'O365 Calendar - (ABCD)',
    value: 'o365_calendar',
    id: 'abcd__o365_calendar',
  },
];

describe('src/@vymo/ui/blocks/select/queries.ts', () => {
  describe('getSearchResult', () => {
    it('returns the correct search results when given valid input', () => {
      const result = getSearchResult(flattenOptions, 'Outgoing'); // Input search query 'apple'
      expect(result).toEqual([
        {
          id: 'branch__outbound_call',
          label: 'Outgoing Call - (Branch001)',
          searchWordDistance: 19,
          value: 'outbound_call',
        },
      ]);
    });

    it('returns whole array when given an empty search query', () => {
      const result = getSearchResult(flattenOptions, '');
      expect(result).toEqual([
        { id: 'abcd', label: 'ABCD', searchWordDistance: 4, value: 'abcd' },
        {
          id: 'branch',
          label: 'Branch001',
          searchWordDistance: 9,
          value: 'branch',
        },
        {
          id: 'abcd__zoom',
          label: 'Zoom - (ABCD)',
          searchWordDistance: 13,
          value: 'zoom',
        },
        {
          id: 'branch__x51yeazrti',
          label: 'Group A - (Branch001)',
          searchWordDistance: 21,
          value: 'x51yeazrti',
        },
        {
          id: 'abcd__inbound_call',
          label: 'Incoming Call - (ABCD)',
          searchWordDistance: 22,
          value: 'inbound_call',
        },
        {
          id: 'abcd__o365_calendar',
          label: 'O365 Calendar - (ABCD)',
          searchWordDistance: 22,
          value: 'o365_calendar',
        },
        {
          id: 'branch__outbound_call',
          label: 'Outgoing Call - (Branch001)',
          searchWordDistance: 27,
          value: 'outbound_call',
        },
        {
          id: 'abcd__lw_chat_disposition',
          label: 'Line Chat Disposition - (ABCD)',
          searchWordDistance: 30,
          value: 'lw_chat_disposition',
        },
      ]);
    });

    it('returns an empty array when given an invalid search query', () => {
      const result = getSearchResult(flattenOptions, 'xyz');
      expect(result).toEqual([]);
    });
  });

  describe('getOpenNodeIds', () => {
    it('should return an array of open node IDs', () => {
      const result = getOpenNodeIds(flattenOptions);
      expect(result).toEqual([
        'branch',
        'branch__outbound_call',
        'branch__x51yeazrti',
        'abcd',
        'abcd__lw_chat_disposition',
        'abcd__zoom',
        'abcd__inbound_call',
        'abcd__o365_calendar',
      ]);
    });

    it('should handle empty flattenOptions input', () => {
      const result = getOpenNodeIds([]);
      expect(result).toEqual([]);
    });

    it('should handle flattenOptions with null or undefined id', () => {
      const flattenOptionsWithNullId = [
        { id: 'branch__outbound_call', label: 'Option 1' },
        { id: null, label: 'Option 2' },
        { id: 'abcd', label: 'Option 3' },
      ] as any;
      const result = getOpenNodeIds(flattenOptionsWithNullId);
      expect(result).toEqual(['branch', 'branch__outbound_call', 'abcd']);
    });

    it('should handle flattenOptions with non-string id', () => {
      const flattenOptionsWithNonStringId = [
        { id: 'branch__outbound_call', label: 'Option 1' },
        { id: 2, label: 'Option 2' },
        { id: 'abcd', label: 'Option 3' },
      ] as any;
      const result = getOpenNodeIds(flattenOptionsWithNonStringId);
      expect(result).toEqual(['branch', 'branch__outbound_call', 2, 'abcd']);
    });
  });

  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('getExpandedOptions', () => {
    it('should return an empty array when called with an empty option list', () => {
      const result = getExpandedOptions([], []);
      expect(result).toEqual([]);
    });

    it('should return the same options when no nodes are open', () => {
      const result = getExpandedOptions([], nestedOptionList as any);
      expect(result).toEqual([
        {
          value: 'A',
          depth: 1,
          hasChildren: true,
          collapsed: true,
          id: 'A',
          editorProps: undefined,
          label: 'A',
        },
        {
          value: 'B',
          depth: 1,
          hasChildren: true,
          collapsed: true,
          id: 'B',
          editorProps: undefined,
          label: 'B',
        },
      ]);
    });

    it('should return all options when all nodes are open', () => {
      const result = getExpandedOptions(
        ['A', 'A__A-1', 'A__A-2', 'B', 'B__B-1', 'B__B-2'],
        nestedOptionList as any,
      );
      expect(result).toEqual([
        { collapsed: false, depth: 1, hasChildren: true, id: 'A', value: 'A' },
        {
          collapsed: false,
          depth: 2,
          hasChildren: true,
          id: 'A__A-1',
          value: 'A-1',
        },
        {
          collapsed: true,
          depth: 3,
          hasChildren: undefined,
          id: 'A__A-1__A-1-1',
          value: 'A-1-1',
        },
        {
          collapsed: true,
          depth: 3,
          hasChildren: undefined,
          id: 'A__A-1__A-1-2',
          value: 'A-1-2',
        },
        {
          collapsed: false,
          depth: 2,
          hasChildren: true,
          id: 'A__A-2',
          value: 'A-2',
        },
        {
          collapsed: true,
          depth: 3,
          hasChildren: undefined,
          id: 'A__A-2__A-2-1',
          value: 'A-2-1',
        },
        {
          collapsed: true,
          depth: 3,
          hasChildren: undefined,
          id: 'A__A-2__A-2-2',
          value: 'A-2-2',
        },
        { collapsed: false, depth: 1, hasChildren: true, id: 'B', value: 'B' },
        {
          collapsed: false,
          depth: 2,
          hasChildren: true,
          id: 'B__B-1',
          value: 'B-1',
        },
        {
          collapsed: true,
          depth: 3,
          hasChildren: undefined,
          id: 'B__B-1__B-1-1',
          value: 'B-1-1',
        },
        {
          collapsed: true,
          depth: 3,
          hasChildren: undefined,
          id: 'B__B-1__B-1-2',
          value: 'B-1-2',
        },
        {
          collapsed: false,
          depth: 2,
          hasChildren: true,
          id: 'B__B-2',
          value: 'B-2',
        },
        {
          collapsed: true,
          depth: 3,
          hasChildren: undefined,
          id: 'B__B-2__B-2-1',
          value: 'B-2-1',
        },
        {
          collapsed: true,
          depth: 3,
          hasChildren: undefined,
          id: 'B__B-2__B-2-2',
          value: 'B-2-2',
        },
      ]);
    });

    it('should return only top-level nodes when all nodes are collapsed', () => {
      const result = getExpandedOptions(['A', 'B'], nestedOptionList as any);
      expect(result).toEqual([
        { collapsed: false, depth: 1, hasChildren: true, id: 'A', value: 'A' },
        {
          collapsed: true,
          depth: 2,
          hasChildren: true,
          id: 'A__A-1',
          value: 'A-1',
        },
        {
          collapsed: true,
          depth: 2,
          hasChildren: true,
          id: 'A__A-2',
          value: 'A-2',
        },
        { collapsed: false, depth: 1, hasChildren: true, id: 'B', value: 'B' },
        {
          collapsed: true,
          depth: 2,
          hasChildren: true,
          id: 'B__B-1',
          value: 'B-1',
        },
        {
          collapsed: true,
          depth: 2,
          hasChildren: true,
          id: 'B__B-2',
          value: 'B-2',
        },
      ]);
    });

    it('should return the expected nodes when some nodes are open', () => {
      const result = getExpandedOptions(
        ['A', 'B__B-1'],
        nestedOptionList as any,
      );
      expect(result).toEqual([
        { collapsed: false, depth: 1, hasChildren: true, id: 'A', value: 'A' },
        {
          collapsed: true,
          depth: 2,
          hasChildren: true,
          id: 'A__A-1',
          value: 'A-1',
        },
        {
          collapsed: true,
          depth: 2,
          hasChildren: true,
          id: 'A__A-2',
          value: 'A-2',
        },
        { collapsed: true, depth: 1, hasChildren: true, id: 'B', value: 'B' },
      ]);
    });
  });

  describe('getUpdatedIndex', () => {
    it('ARROW_UP: selectedIndex is not at the minimum index', () => {
      const selectedIndex = 2;
      const type = constants.ARROW_UP;
      const optionsLength = 5;
      const expectedUpdatedIndex = selectedIndex - 1;

      const updatedIndex = getUpdatedIndex(selectedIndex, type, optionsLength);
      expect(updatedIndex).toEqual(expectedUpdatedIndex);
    });

    it('ARROW_UP: selectedIndex is at the minimum index', () => {
      const selectedIndex = 0;
      const type = constants.ARROW_UP;
      const optionsLength = 5;
      const expectedUpdatedIndex = optionsLength - 1; // Since selectedIndex === 0, the updatedIndex should be optionsLength - 1

      const updatedIndex = getUpdatedIndex(selectedIndex, type, optionsLength);
      expect(updatedIndex).toEqual(expectedUpdatedIndex);
    });

    it('ARROW_DOWN: selectedIndex is not at the maximum index', () => {
      const selectedIndex = 2;
      const type = constants.ARROW_DOWN;
      const optionsLength = 5;
      const expectedUpdatedIndex = selectedIndex + 1;

      const updatedIndex = getUpdatedIndex(selectedIndex, type, optionsLength);
      expect(updatedIndex).toEqual(expectedUpdatedIndex);
    });

    it('ARROW_DOWN: selectedIndex is at the maximum index', () => {
      const selectedIndex = 4;
      const type = constants.ARROW_DOWN;
      const optionsLength = 5;
      const expectedUpdatedIndex = 0; // Since selectedIndex === optionsLength - 1, the updatedIndex should be 0

      const updatedIndex = getUpdatedIndex(selectedIndex, type, optionsLength);
      expect(updatedIndex).toEqual(expectedUpdatedIndex);
    });
  });
});
