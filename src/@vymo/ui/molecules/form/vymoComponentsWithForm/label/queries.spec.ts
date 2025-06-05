import { decodeMarkup } from './queries';

describe('src/@vymo/ui/molecules/currencyAndDecimal/queries.ts', () => {
  describe('decodeMarkup', () => {
    it('should extract href, target, and inner text from the anchor tag', () => {
      const hrefString =
        '<a href="https://example.com" target="_blank">Click Here</a>';
      const result = decodeMarkup(hrefString);

      expect(result[1]).toBe('https://example.com');
      expect(result[2]).toBe('target="_blank"');
      expect(result[3]).toBe('Click Here');
    });

    it('should extract href and inner text when no target attribute is present', () => {
      const hrefString = '<a href="https://example.com">Click Here</a>';
      const result = decodeMarkup(hrefString);

      expect(result[1]).toBe('https://example.com');
      expect(result[2]).toBeUndefined();
      expect(result[3]).toBe('Click Here');
    });

    it('should return undefined if no matches are found', () => {
      const hrefString = 'This is not a valid anchor tag';
      const result = decodeMarkup(hrefString);

      expect(result).toBeUndefined();
    });

    it('should return the first match if multiple anchor tags are present', () => {
      const hrefString =
        'Some text <a href="https://example1.com">Link 1</a> and <a href="https://example2.com">Link 2</a>';
      const result = decodeMarkup(hrefString);

      expect(result[1]).toBe('https://example1.com');
      expect(result[3]).toBe(
        'Link 1</a> and <a href="https://example2.com">Link 2',
      );
    });
  });
});
