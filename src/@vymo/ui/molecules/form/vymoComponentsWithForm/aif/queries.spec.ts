import { generateRandomCode, getConfigToAppend } from './queries';

describe('src/@vymo/ui/molecules/form/vymoComponentsWithForm/aif/queries.ts', () => {
  describe('generateRandomCode', () => {
    it('should return a string', () => {
      const result = generateRandomCode();
      expect(typeof result).toBe('string');
    });

    it('should generate a string with alphanumeric characters', () => {
      const result = generateRandomCode();
      expect(result).toMatch(/^[a-z0-9]+$/);
    });

    it('should generate different codes on consecutive calls', () => {
      const code1 = generateRandomCode();
      const code2 = generateRandomCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe('getConfigToAppend', () => {
    it('should generate a configuration object with unique codes', () => {
      const groupFields = [
        { code: 'field1', name: 'Field 1' },
        { code: 'field2', name: 'Field 2' },
      ];
      const groupTitle = 'Test Group';
      const code = 'testCode';

      const [configAppend] = getConfigToAppend(groupFields, groupTitle, code);

      expect(configAppend).toHaveProperty('type', 'group');
      expect(configAppend).toHaveProperty('parentCode', code);
      expect(configAppend).toHaveProperty('groupTitle', groupTitle);
      expect(configAppend).toHaveProperty('children');

      const { children } = configAppend;
      expect(children).toHaveLength(2);

      children.forEach((child, index) => {
        const originalCode = groupFields[index].code;
        expect(child.code).toMatch(new RegExp(`^${code}_.+_${originalCode}$`));
      });
    });

    it('should generate different codes on consecutive calls', () => {
      const groupFields = [
        { code: 'field1', name: 'Field 1' },
        { code: 'field2', name: 'Field 2' },
      ];
      const groupTitle = 'Test Group';
      const code = 'testCode';

      const [config1] = getConfigToAppend(groupFields, groupTitle, code);
      const [config2] = getConfigToAppend(groupFields, groupTitle, code);

      expect(config1.code).not.toBe(config2.code);

      config1.children.forEach((child, index) => {
        expect(child.code).not.toBe(config2.children[index].code);
      });
    });
  });
});
