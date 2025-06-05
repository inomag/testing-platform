import { createActor } from 'xstate';
import { getDatePickerScenario, getDateTimePickerMachine } from './queries';

describe('src/@vymo/ui/blocks/dateTime/dateTimeRangePicker/queries.ts', () => {
  describe('getDatePickerScenario', () => {
    it('should return the correct scenario and config for year picker', () => {
      const result = getDatePickerScenario('year');
      expect(result).toEqual({
        scenario: 'yearPicker',
        config: {
          dateSelectionAllowed: false,
          monthSelectionAllowed: false,
          quarterSelectionAllowed: false,
          yearSelectionAllowed: true,
        },
      });
    });

    it('should return the correct scenario and config for quarter picker', () => {
      const result = getDatePickerScenario('quarter');
      expect(result).toEqual({
        scenario: 'quarterPicker',
        config: {
          dateSelectionAllowed: false,
          monthSelectionAllowed: false,
          quarterSelectionAllowed: true,
          yearSelectionAllowed: true,
        },
      });
    });

    it('should return the correct scenario and config for month picker', () => {
      const result = getDatePickerScenario('month');
      expect(result).toEqual({
        scenario: 'monthPicker',
        config: {
          dateSelectionAllowed: false,
          monthSelectionAllowed: true,
          quarterSelectionAllowed: false,
          yearSelectionAllowed: true,
        },
      });
    });

    it('should return the correct scenario and config for date picker by default', () => {
      const result = getDatePickerScenario('unknown');
      expect(result).toEqual({
        scenario: 'datePicker',
        config: {
          dateSelectionAllowed: true,
          monthSelectionAllowed: true,
          quarterSelectionAllowed: false,
          yearSelectionAllowed: true,
        },
      });
    });
  });

  describe('getDateTimePickerMachine', () => {
    it('should initialize to datePicker state by default', () => {
      const machine = getDateTimePickerMachine(undefined);
      const service = createActor(machine).start();

      expect(service.getSnapshot().value).toBe('datePicker');
    });

    it('should transition to yearPicker from datePicker when HEADER_YEAR is sent and yearSelectionAllowed is true', () => {
      const machine = getDateTimePickerMachine('datePicker', {
        yearSelectionAllowed: true,
      });
      const service = createActor(machine).start();

      service.send({ type: 'HEADER_YEAR' });
      expect(service.getSnapshot().value).toBe('yearPicker');
    });

    it('should transition to monthPicker from datePicker when HEADER_MONTH is sent and monthSelectionAllowed is true', () => {
      const machine = getDateTimePickerMachine('datePicker', {
        monthSelectionAllowed: true,
      });
      const service = createActor(machine).start();

      service.send({ type: 'HEADER_MONTH' });
      expect(service.getSnapshot().value).toBe('monthPicker');
    });

    it('should not transition to yearPicker from datePicker when HEADER_YEAR is sent and yearSelectionAllowed is false', () => {
      const machine = getDateTimePickerMachine('datePicker', {
        yearSelectionAllowed: false,
      });
      const service = createActor(machine).start();

      service.send({ type: 'HEADER_YEAR' });
      expect(service.getSnapshot().value).toBe('datePicker');
    });

    it('should transition to monthPicker from yearPicker when CLICK is sent and monthSelectionAllowed is true', () => {
      const machine = getDateTimePickerMachine('yearPicker', {
        monthSelectionAllowed: true,
      });
      const service = createActor(machine).start();

      service.send({ type: 'CLICK' });
      expect(service.getSnapshot().value).toBe('monthPicker');
    });

    it('should not transition to monthPicker from yearPicker when CLICK is sent and monthSelectionAllowed is false', () => {
      const machine = getDateTimePickerMachine('yearPicker', {
        monthSelectionAllowed: false,
      });
      const service = createActor(machine).start();

      service.send({ type: 'CLICK' });
      expect(service.getSnapshot().value).toBe('yearPicker');
    });

    it('should transition to datePicker from monthPicker when CLICK is sent and dateSelectionAllowed is true', () => {
      const machine = getDateTimePickerMachine('monthPicker', {
        dateSelectionAllowed: true,
      });
      const service = createActor(machine).start();

      service.send({ type: 'CLICK' });
      expect(service.getSnapshot().value).toBe('datePicker');
    });

    it('should transition to yearPicker from monthPicker when HEADER_YEAR is sent and yearSelectionAllowed is true', () => {
      const machine = getDateTimePickerMachine('monthPicker', {
        yearSelectionAllowed: true,
      });
      const service = createActor(machine).start();

      service.send({ type: 'HEADER_YEAR' });
      expect(service.getSnapshot().value).toBe('yearPicker');
    });

    it('should initialize to the given scenario state', () => {
      const machine = getDateTimePickerMachine('monthPicker');
      const service = createActor(machine).start();
      expect(service.getSnapshot().value).toBe('monthPicker');
    });
  });
});
