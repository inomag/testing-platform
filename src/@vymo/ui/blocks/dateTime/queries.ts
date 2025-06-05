import { createMachine } from 'xstate';

export const getDatePickerScenario = (picker) => {
  switch (picker) {
    case 'year':
      return {
        scenario: 'yearPicker',
        config: {
          dateSelectionAllowed: false,
          monthSelectionAllowed: false,
          quarterSelectionAllowed: false,
          yearSelectionAllowed: true,
        },
      };

    case 'quarter':
      return {
        scenario: 'quarterPicker',
        config: {
          dateSelectionAllowed: false,
          monthSelectionAllowed: false,
          quarterSelectionAllowed: true,
          yearSelectionAllowed: true,
        },
      };

    case 'month':
      return {
        scenario: 'monthPicker',
        config: {
          dateSelectionAllowed: false,
          monthSelectionAllowed: true,
          quarterSelectionAllowed: false,
          yearSelectionAllowed: true,
        },
      };

    default:
      return {
        scenario: 'datePicker',
        config: {
          dateSelectionAllowed: true,
          monthSelectionAllowed: true,
          quarterSelectionAllowed: false,
          yearSelectionAllowed: true,
        },
      };
  }
};

export const getDateTimePickerMachine = (scenario, config = {}) =>
  createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QQIYBcwBUCWBbMAdKhgArYDGA1mAE4DEAEgKICCAIkwEoD6AsgPIA5TAwDaABgC6iUAAcA9rGxps8gHYyQAD0QAmACwAOArsMBGXQFZxAdnGWzlywBoQATz0BOfQU+6AbFZW-iGO+gC+4a7EWHiEMWRUtIysHDwAmqycEtJIIApKKuqaOgg2uq4eCJae4r4BBjb6Zp42nu2R0eix+AS46mgAFonU9ADCADIAkmMA0jmaBcqqGnmlBsamFtZ2Dk6Vevo++g2WhudmAMz+npcRUSAxOL39akMjyczsXNyZLNlSRaKZbFNZ6MzGez6G7+ZrifxmXYHMqBAiIwKXNr6GwhQyeTqPbrPQgARwArt0aB96F80r8sgs8ksiqtQKVxMjxASnnECG4wCgqRRRnRJjN5oCmcCWSVwZDLNDPLCzPDEfZkTYzGYCP4cQYToETrp8Q8eb1+YLqaLpnNRGZcnJpStZQgOe5EFyCWp5BA4JozWAgYVnWCEABaIzIsOGGwEfTtdo1IxHJzcom8hLC2hBkGs7ReZEtbV+QJOTE2Jz6cT3LoYYl9AbDLM0HMy0O6jUKgg1Uy1Ry6cS6Fppuu88mU6mtkNsj3I86eAjiPyGfz2Tx4-yWXQjnqEC1CpItqXB0EzhDQnzeSyXS6Do7Y84a1cES6nKwnfSXdeRSJAA */
    id: 'dateTime',
    type: 'compound',
    initial: scenario ?? 'datePicker',
    context: config ?? {
      dateSelectionAllowed: true,
      monthSelectionAllowed: true,
      quarterSelectionAllowed: false,
      yearSelectionAllowed: true,
    },
    states: {
      datePicker: {
        on: {
          HEADER_MONTH: [
            {
              guard: ({ context }) => context.monthSelectionAllowed,
              target: 'monthPicker',
            },
          ],
          HEADER_YEAR: [
            {
              guard: ({ context }) => context.yearSelectionAllowed,
              target: 'yearPicker',
            },
          ],
        },
      },
      monthPicker: {
        on: {
          CLICK: [
            {
              guard: ({ context }) => context.dateSelectionAllowed,
              target: 'datePicker',
            },
          ],
          HEADER_YEAR: [
            {
              guard: ({ context }) => context.yearSelectionAllowed,
              target: 'yearPicker',
            },
          ],
        },
      },
      quarterPicker: {
        on: {
          HEADER_YEAR: 'yearPicker',
        },
      },
      yearPicker: {
        on: {
          CLICK: [
            {
              guard: ({ context }) => context.monthSelectionAllowed,
              target: 'monthPicker',
            },
            {
              guard: ({ context }) => context.quarterSelectionAllowed,
              target: 'quarterPicker',
            },
          ],
        },
      },
    },
  });
