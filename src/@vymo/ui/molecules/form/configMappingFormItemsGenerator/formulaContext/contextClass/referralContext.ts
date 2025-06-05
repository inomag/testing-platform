import _ from 'lodash';

export class ReferralContext {
  referral: {
    [key: string]: any;
  };

  constructor() {
    this.referral = {};
  }

  get(attribute: string, ...path): string | object {
    const element = this.referral;
    return (
      _.get(element, path[0]).get(`inputs_map.${attribute}`) ||
      _.get(element, path[0]).get(attribute)
    );
  }

  setContext(fieldCode: string, leadContext: any) {
    this.referral[fieldCode] = leadContext;
  }
}
