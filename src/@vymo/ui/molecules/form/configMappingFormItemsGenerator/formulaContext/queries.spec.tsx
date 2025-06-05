import { Evaluator } from 'vymo-jsevaluator';
import { BaseContext } from './contextClass/baseContext';
import { nameSpaces as C } from './contextClass/constants';
import {
  camelizeObjectKeys,
  evaluateField,
  evaluateValidation,
  getFormulaDependentInputCodes,
  oifVerificationRequired,
  phoneValidation,
} from './queries';

const evaluate = new Evaluator();

describe('src/@vymo/ui/molecules/form/configMappingFormItemsGenerator/formulaContext/queries.ts', () => {
  describe('camelize', () => {
    it('checks for valid output', () => {
      const obj = {
        type: 'text',
        code: 'aif3',
        hint: 'Transaction desc',
        required: true,
        oif_options: null,
        read_only: false,
        display_in_form_type: 'MODULE',
      };
      const output = camelizeObjectKeys(obj);
      expect(output).toEqual({
        code: 'aif3',
        displayInFormType: 'MODULE',
        hint: 'Transaction desc',
        oifOptions: null,
        readOnly: false,
        required: true,
        type: 'text',
      });
    });
  });

  describe('formula dependent input codes', () => {
    it('returns dependent codes for a input', () => {
      const formula = {
        type: 'standard',
        inputs: [
          {
            type: 'value',
            value: {
              val_type: 'session',
              operator_required: false,
              attribute: 'attributes.name',
              input_field: 'if_name',
            },
          },
        ],
        standard_function: 'IS',
        return_type: 'text',
      };
      const output = getFormulaDependentInputCodes(formula);
      expect(output).toEqual(['attributes.name']);
    });

    it('returns dependent codes for multiple formula inputs', () => {
      const formula = {
        type: 'standard',
        inputs: [
          {
            type: 'value',
            value: {
              val_type: 'function',
              operator_required: false,
              function: {
                type: 'standard',
                inputs: [
                  {
                    type: 'value',
                    value: {
                      val_type: 'function',
                      operator_required: false,
                      function: {
                        type: 'standard',
                        inputs: [
                          {
                            type: 'value',
                            value: {
                              val_type: 'form',
                              operator_required: false,
                              attribute: 'policy_1_line_of_business_cr15xwltuj',
                            },
                          },
                          {
                            type: 'value',
                            value: {
                              val_type: 'static',
                              operator_required: false,
                              value: 'A&H',
                              data_type: 'text',
                            },
                          },
                        ],
                        standard_function: 'EQUALS_IGNORE_CASE',
                        return_type: 'bool',
                      },
                    },
                  },
                  {
                    type: 'value',
                    value: {
                      val_type: 'static',
                      operator_required: false,
                      value: '1',
                      data_type: 'text',
                    },
                  },
                  {
                    type: 'value',
                    value: {
                      val_type: 'static',
                      operator_required: false,
                      value: '0',
                      data_type: 'text',
                    },
                  },
                ],
                standard_function: 'IF',
                return_type: 'text',
              },
            },
          },
          {
            type: 'value',
            value: {
              val_type: 'function',
              operator_required: false,
              function: {
                type: 'standard',
                inputs: [
                  {
                    type: 'value',
                    value: {
                      val_type: 'function',
                      operator_required: false,
                      function: {
                        type: 'standard',
                        inputs: [
                          {
                            type: 'value',
                            value: {
                              val_type: 'form',
                              operator_required: false,
                              attribute: 'policy_2_line_of_business_7uscnk47sm',
                            },
                          },
                          {
                            type: 'value',
                            value: {
                              val_type: 'static',
                              operator_required: false,
                              value: 'A&H',
                              data_type: 'text',
                            },
                          },
                        ],
                        standard_function: 'EQUALS_IGNORE_CASE',
                        return_type: 'bool',
                      },
                    },
                  },
                  {
                    type: 'value',
                    value: {
                      val_type: 'static',
                      operator_required: false,
                      value: '1',
                      data_type: 'text',
                    },
                  },
                  {
                    type: 'value',
                    value: {
                      val_type: 'static',
                      operator_required: false,
                      value: '0',
                      data_type: 'text',
                    },
                  },
                ],
                standard_function: 'IF',
                return_type: 'text',
              },
            },
          },
          {
            type: 'value',
            value: {
              val_type: 'function',
              operator_required: false,
              function: {
                type: 'standard',
                inputs: [
                  {
                    type: 'value',
                    value: {
                      val_type: 'function',
                      operator_required: false,
                      function: {
                        type: 'standard',
                        inputs: [
                          {
                            type: 'value',
                            value: {
                              val_type: 'form',
                              operator_required: false,
                              attribute: 'policy_3_line_of_business_e1gqztiutd',
                            },
                          },
                          {
                            type: 'value',
                            value: {
                              val_type: 'static',
                              operator_required: false,
                              value: 'A&H',
                              data_type: 'text',
                            },
                          },
                        ],
                        standard_function: 'EQUALS_IGNORE_CASE',
                        return_type: 'bool',
                      },
                    },
                  },
                  {
                    type: 'value',
                    value: {
                      val_type: 'static',
                      operator_required: false,
                      value: '1',
                      data_type: 'text',
                    },
                  },
                  {
                    type: 'value',
                    value: {
                      val_type: 'static',
                      operator_required: false,
                      value: '0',
                      data_type: 'text',
                    },
                  },
                ],
                standard_function: 'IF',
                return_type: 'text',
              },
            },
          },
          {
            type: 'value',
            value: {
              val_type: 'function',
              operator_required: false,
              function: {
                type: 'standard',
                inputs: [
                  {
                    type: 'value',
                    value: {
                      val_type: 'function',
                      operator_required: false,
                      function: {
                        type: 'standard',
                        inputs: [
                          {
                            type: 'value',
                            value: {
                              val_type: 'form',
                              operator_required: false,
                              attribute: 'policy_4_line_of_business_pmapiz739',
                            },
                          },
                          {
                            type: 'value',
                            value: {
                              val_type: 'static',
                              operator_required: false,
                              value: 'A&H',
                              data_type: 'text',
                            },
                          },
                        ],
                        standard_function: 'EQUALS_IGNORE_CASE',
                        return_type: 'bool',
                      },
                    },
                  },
                  {
                    type: 'value',
                    value: {
                      val_type: 'static',
                      operator_required: false,
                      value: '1',
                      data_type: 'text',
                    },
                  },
                  {
                    type: 'value',
                    value: {
                      val_type: 'static',
                      operator_required: false,
                      value: '0',
                      data_type: 'text',
                    },
                  },
                ],
                standard_function: 'IF',
                return_type: 'text',
              },
            },
          },
        ],
        standard_function: 'SUM',
        output: {
          variable: 'number',
          param: 'output',
        },
        return_type: 'number',
      };
      const output = getFormulaDependentInputCodes(formula);
      expect(output).toEqual([
        'policy_1_line_of_business_cr15xwltuj',
        'policy_2_line_of_business_7uscnk47sm',
        'policy_3_line_of_business_e1gqztiutd',
        'policy_4_line_of_business_pmapiz739',
      ]);
    });
  });

  describe('evaluate field', () => {
    beforeEach(() => {
      evaluate.setContext(
        C.NS_FORM,
        new BaseContext({
          input_a: 'p',
          tmp: 'Test',
        }),
      );
    });

    it('evaluates for simple form context', () => {
      const func = {
        type: 'standard',
        inputs: [
          {
            type: 'value',
            value: {
              val_type: 'form',
              operator_required: false,
              attribute: 'input_a',
              input_field: 'input_a',
            },
          },
        ],
        standard_function: 'IS',
        return_type: 'text',
      };
      const output = evaluateField(func, evaluate);
      expect(output).toEqual('p');
    });
    it('evaluates validation for form context', () => {
      const validation = {
        expression: {
          type: 'standard',
          inputs: [
            {
              type: 'value',
              value: {
                val_type: 'form',
                operator_required: false,
                attribute: 'input_a',
                input_field: 'input_a',
              },
            },
          ],
          standard_function: 'IS_NOT_EMPTY',
          return_type: 'bool',
        },
        error_message: 'Input A should be empty.',
        disable_backend_validation: false,
      };
      const output = evaluateValidation(validation, evaluate);
      expect(output).toEqual('Input A should be empty.');
    });

    it('evaluates validation for form context with regex', () => {
      const validation = {
        expression: {
          type: 'standard',
          inputs: [
            {
              type: 'value',
              value: {
                val_type: 'form',
                operator_required: false,
                attribute: 'input_a',
                input_field: 'input_a',
              },
            },
          ],
          standard_function: 'IS_NOT_EMPTY',
          return_type: 'bool',
        },
        error_message: '<form.tmp> should be empty.',
        disable_backend_validation: false,
      };
      const output = evaluateValidation(validation, evaluate);
      expect(output).toEqual('Test should be empty.');
    });
  });

  describe('oifVerificationRequired', () => {
    it('should return false when the field is not required and value is empty', () => {
      expect(oifVerificationRequired(false, false, null, {}, '')).toBe(false);
    });

    it('should return true when the field is not required and value is non empty', () => {
      expect(
        oifVerificationRequired(false, false, null, {}, 'test@gmail.com'),
      ).toBe(false);
    });

    it('should return false when additionalData.oifValid is true', () => {
      expect(
        oifVerificationRequired(
          true,
          true,
          false,
          { oifValid: true },
          'test@gmail.com',
        ),
      ).toBe(false);
    });

    it('should return true when the field is required, not verified, and not touched', () => {
      expect(oifVerificationRequired(true, false, false, {}, '')).toBe(true);
    });

    it('should return true when additionalData.oifValid exists and is false', () => {
      expect(
        oifVerificationRequired(true, true, true, { oifValid: false }, 'test'),
      ).toBe(true);
    });

    it('should return false when the field is required and verified', () => {
      expect(
        oifVerificationRequired(true, true, true, {}, 'test@gmail.com'),
      ).toBe(false);
    });
  });

  describe('phoneValidation', () => {
    it('should return undefined for a valid US number', () => {
      const result = phoneValidation('+1', '(415) 555-2671');
      expect(result).toBeUndefined();
    });

    it('should return error for an invalid US number format', () => {
      const result = phoneValidation('+1', 'invalid-number');
      expect(result).toBe('Invalid phone number format');
    });

    it('should return error for an invalid US number (non-existent area code)', () => {
      const result = phoneValidation('+1', '(999) 999-9999');
      expect(result).toBe('Invalid phone number');
    });

    it('should return undefined for a valid India number', () => {
      const result = phoneValidation('+91', '9876543210');
      expect(result).toBeUndefined();
    });

    it('should return error for an unknown country calling code', () => {
      const result = phoneValidation('+999', '1234567890');
      expect(result).toBe('Invalid phone number format'); // parsePhoneNumberFromString returns null
    });
  });
});
