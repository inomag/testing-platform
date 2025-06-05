import { getSifgValueForSelect, getValueBasedOnOutputType } from './queries';

const options = [
  { code: 'branch__outbound_call', name: 'Outgoing Call - (Branch001)' },
  { code: 'branch__x51yeazrti', name: 'Group A - (Branch001)' },
  { code: 'abcd__inbound_call', name: 'Incoming Call - (ABCD)' },
];

describe('src/@vymo/ui/molecules/form/vymoComponentsWithForm/sifg/queries.ts', () => {
  describe('getSifgValueForSelect', () => {
    it('should return correct code if returnCode is true', () => {
      const value = getSifgValueForSelect('abcd__inbound_call', options, {
        returnCode: true,
      });
      expect(value).toEqual('abcd__inbound_call');
    });

    it('should return correct code if returnCode is undefined or false', () => {
      const value = getSifgValueForSelect('Incoming Call - (ABCD)', options);
      expect(value).toEqual('abcd__inbound_call');

      const value1 = getSifgValueForSelect('Incoming Call - (ABCD)', options);
      expect(value1).toEqual('abcd__inbound_call');
    });

    it('should return correct code if output json is true', () => {
      const value = getSifgValueForSelect(
        JSON.stringify({
          code: 'abcd__inbound_call',
          name: 'Incoming Call - (ABCD)',
        }),
        options,
        { json: true },
      );
      expect(value).toEqual('abcd__inbound_call');
    });
  });

  describe('getValueBasedOnOutputType', () => {
    it('should return option code if returnCode is true', () => {
      const value = getValueBasedOnOutputType([options[0]], false, {
        returnCode: true,
      });
      expect(value).toEqual('branch__outbound_call');
    });

    it('should return option name if returnName is false or undefined', () => {
      const value = getValueBasedOnOutputType([options[0]], false, {
        returnCode: false,
      });
      expect(value).toEqual('Outgoing Call - (Branch001)');

      const value1 = getValueBasedOnOutputType([options[0]], false, undefined);
      expect(value1).toEqual('Outgoing Call - (Branch001)');
    });

    it('should return stringify option code and name if json is true', () => {
      const value = getValueBasedOnOutputType([options[0]], false, {
        json: true,
      });
      expect(value).toEqual(
        JSON.stringify({
          code: 'branch__outbound_call',
          name: 'Outgoing Call - (Branch001)',
        }),
      );

      const value1 = getValueBasedOnOutputType([options[0]], false, {
        json: true,
        returnCode: true,
      });
      expect(value1).toEqual(
        JSON.stringify({
          code: 'branch__outbound_call',
          name: 'Outgoing Call - (Branch001)',
        }),
      );
    });
  });
});
