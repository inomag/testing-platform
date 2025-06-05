import localStorageService from 'src/localStorage';
import {
  clearCurrentUser,
  getCurrentUser,
  getCurrentUserInfo,
  getOtpConfig,
  getRequestId,
  getUserInfo,
  setCurrentUser,
  setCurrentUserInfo,
  updateCurrentUser,
} from './queries';
import { UserInfo } from './types';

describe('getUserInfo', () => {
  afterEach(() => {
    localStorageService.delete('1234567890');
  });

  it('should return null if the phone number is null', () => {
    const userInfo = getUserInfo(null);
    expect(userInfo).toBeNull();
  });

  it('should return null if the phone number is not found in local storage', () => {
    const phoneNumber = '1234567890';
    localStorageService.delete(phoneNumber);

    const userInfo = getUserInfo(phoneNumber);
    expect(userInfo).toBeNull();
  });

  it('should return the user info associated with the phone number', () => {
    const phoneNumber = '1234567890';
    const expectedUserInfo: UserInfo = {
      requestId: 'abc123',
      backOff: 5000,
      userid: '1234567890',
      countryCode: '+1',
    };
    localStorageService.set(phoneNumber, expectedUserInfo);

    const userInfo = getUserInfo(phoneNumber);
    expect(userInfo).toEqual(expectedUserInfo);
  });
});
describe('getRequestId', () => {
  afterEach(() => {
    localStorageService.delete('1234567890');
  });

  it('should return undefined if the user is null', () => {
    const requestId = getRequestId(null);
    expect(requestId).toBeUndefined();
  });

  it('should return undefined if the user info does not have a requestId', () => {
    const phoneNumber = '1234567890';
    const userInfo: UserInfo = {
      backOff: 5000,
      userid: phoneNumber,
      countryCode: '+1',
    };
    localStorageService.set(phoneNumber, userInfo);

    const requestId = getRequestId(phoneNumber);
    expect(requestId).toBeUndefined();
  });

  it('should return the requestId of the user info', () => {
    const phoneNumber = '1234567890';
    const userInfo: UserInfo = {
      requestId: 'abc123',
      backOff: 5000,
      userid: phoneNumber,
      countryCode: '+1',
    };
    localStorageService.set(phoneNumber, userInfo);

    const requestId = getRequestId(phoneNumber);
    expect(requestId).toEqual(userInfo.requestId);
  });
});

describe('setCurrentUser', () => {
  afterEach(() => {
    localStorageService.delete('currUser');
  });

  it('should set the current user in local storage', () => {
    const phoneNumber = '1234567890';
    setCurrentUser(phoneNumber);

    const currUser = localStorageService.get<string>('currUser');
    expect(currUser).toEqual(phoneNumber);
  });
});

describe('getCurrentUser', () => {
  afterEach(() => {
    localStorageService.delete('currUser');
  });

  it('should return null if the current user is not set', () => {
    const currUser = getCurrentUser();
    expect(currUser).toBeNull();
  });

  it('should return the current user if it is set', () => {
    const phoneNumber = '1234567890';
    localStorageService.set('currUser', phoneNumber);

    const currUser = getCurrentUser();
    expect(currUser).toEqual(phoneNumber);
  });
});

describe('getCurrentUserInfo', () => {
  afterEach(() => {
    localStorageService.delete('1234567890');
    localStorageService.delete('currUser');
  });

  it('should return null if the current user is not set', () => {
    const userInfo = getCurrentUserInfo();
    expect(userInfo).toBeNull();
  });

  it('should return null if the user info is not found in local storage', () => {
    const phoneNumber = '1234567890';
    localStorageService.set('currUser', phoneNumber);
    localStorageService.delete(phoneNumber);

    const userInfo = getCurrentUserInfo();
    expect(userInfo).toBeNull();
  });

  it('should return the user info associated with the current user', () => {
    const phoneNumber = '1234567890';
    const expectedUserInfo: UserInfo = {
      requestId: 'abc123',
      backOff: 5000,
      userid: phoneNumber,
      countryCode: '+1',
    };
    localStorageService.set('currUser', phoneNumber);
    localStorageService.set(phoneNumber, expectedUserInfo);

    const userInfo = getCurrentUserInfo();
    expect(userInfo).toEqual(expectedUserInfo);
  });
});

describe('updateCurrentUser', () => {
  afterEach(() => {
    localStorageService.delete('1234567890');
    localStorageService.delete('currUser');
  });

  it('should not update the user info if the current user is not set', () => {
    const data: UserInfo = {
      requestId: 'abc123',
      backOff: 5000,
      userid: '1234567890',
      countryCode: '+1',
    };
    updateCurrentUser(data);

    const userInfo = localStorageService.get<UserInfo>('1234567890');
    expect(userInfo).toBeNull();
  });

  it('should update the user info with the new data', () => {
    const phoneNumber = '1234567890';
    const initialUserInfo: UserInfo = {
      requestId: 'abc123',
      backOff: 5000,
      userid: phoneNumber,
      countryCode: '+1',
    };
    localStorageService.set(phoneNumber, initialUserInfo);
    localStorageService.set('currUser', phoneNumber);

    const newData: UserInfo = {
      requestId: 'def456',
    };
    updateCurrentUser(newData);

    const expectedUserInfo: UserInfo = {
      requestId: 'def456',
      backOff: 5000,
      userid: phoneNumber,
      countryCode: '+1',
    };
    const userInfo = localStorageService.get<UserInfo>(phoneNumber);
    expect(userInfo).toEqual(expectedUserInfo);
  });

  it('should increment the backOff property if shouldIncrementBackoff is true', () => {
    const phoneNumber = '1234567890';
    const initialUserInfo: UserInfo = {
      requestId: 'abc123',
      backOff: 5000,
      userid: phoneNumber,
      countryCode: '+1',
    };
    localStorageService.set(phoneNumber, initialUserInfo);
    localStorageService.set('currUser', phoneNumber);

    const newData: UserInfo = {
      requestId: 'def456',
    };
    updateCurrentUser(newData, true);

    const expectedUserInfo: UserInfo = {
      requestId: 'def456',
      backOff: 5001,
      userid: phoneNumber,
      countryCode: '+1',
    };
    const userInfo = localStorageService.get<UserInfo>(phoneNumber);
    expect(userInfo).toEqual(expectedUserInfo);
  });
});

describe('setCurrentUserInfo', () => {
  afterEach(() => {
    localStorageService.delete('1234567890');
    localStorageService.delete('currUser');
  });

  it('should not set the user info if the current user is not set', () => {
    const userInfo: UserInfo = {
      requestId: 'abc123',
      backOff: 5000,
      userid: '1234567890',
      countryCode: '+1',
    };
    setCurrentUserInfo(userInfo);

    const currentUserInfo = localStorageService.get<UserInfo>('1234567890');
    expect(currentUserInfo).toBeNull();
  });

  it('should set the user info for the current user', () => {
    const phoneNumber = '1234567890';
    localStorageService.set('currUser', phoneNumber);

    const userInfo: UserInfo = {
      requestId: 'abc123',
      backOff: 5000,
      userid: phoneNumber,
      countryCode: '+1',
    };
    setCurrentUserInfo(userInfo);

    const currentUserInfo = localStorageService.get<UserInfo>(phoneNumber);
    expect(currentUserInfo).toEqual(userInfo);
  });
});

describe('clearCurrentUser', () => {
  afterEach(() => {
    localStorageService.delete('currUser');
  });

  it('should clear the current user from local storage', () => {
    const phoneNumber = '1234567890';
    localStorageService.set('currUser', phoneNumber);

    clearCurrentUser();

    const currUser = localStorageService.get<string>('currUser');
    expect(currUser).toBeNull();
  });
});

describe('getOtpConfig function', () => {
  it('should return correct config for a given otp response', () => {
    const otpConfig = {
      ttl: 6000,
      resendOTPConfig: {
        interval: 60,
        enabled: true,
        backoff: 0,
        max_tries: 5,
      },
      otp_length: 6,
    };
    const result = getOtpConfig(otpConfig);
    expect(result).toEqual({
      enabled: true,
      currentAttemp: 1,
      attempRemaining: 1,
      resendTime: 60,
      otpLength: 6,
    });
  });
});
