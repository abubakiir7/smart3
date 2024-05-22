import * as otpGenerator from 'otp-generator';

export function generateOTP(n: number): number {
  return +otpGenerator.generate(n, {
    digits: true,
    specialChars: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
  });
}