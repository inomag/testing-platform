import { getInputFromChildren } from './queries';

describe('getInputFromChildren', () => {
  it('should return the input element at the specified index', () => {
    const inputRef: any = {
      current: {
        children: [
          {
            querySelector: jest.fn().mockReturnValue(null),
          },
          {
            querySelector: jest.fn().mockReturnValue({
              tagName: 'INPUT',
            }),
          },
        ],
      },
    };

    const input = getInputFromChildren(inputRef, 1);
    expect(input?.tagName).toBe('INPUT');
  });

  it('should return null if the input element is not found', () => {
    const inputRef: any = {
      current: {
        children: [
          {
            querySelector: jest.fn().mockReturnValue(null),
          },
          {
            querySelector: jest.fn().mockReturnValue(null),
          },
        ],
      },
    };

    const input = getInputFromChildren(inputRef, 1);
    expect(input).toBeNull();
  });

  it('should return null if the inputRef is null', () => {
    const inputRef = {
      current: null,
    };

    const input = getInputFromChildren(inputRef, 1);
    expect(input).toBeNull();
  });
});
