import { Transform } from "class-transformer";
var BigNumber = require("bignumber.js");

const cleanObject = (obj) => {
  for (var propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ""
    ) {
      delete obj[propName];
    }
  }
  return obj;
};

const generateReferralCode = () => {
  let random = Math.random().toString(36).slice(2);
  return random.toUpperCase();
};

const fixedCustom = (value: number, decimal: number) => {
  debugger;
  let x = new BigNumber(value);
  let power = Math.pow(10, decimal);
  let multipleOfTen = x.multipliedBy(power);
  multipleOfTen = new BigNumber(Math.floor(multipleOfTen));
  let fixed = multipleOfTen.dividedBy(power);
  return Number(fixed);
};

export const toDecimals = (
  number: string | number | bigint,
  decimals: number
) => {
  let x = new BigNumber(number);
  let power = Math.pow(10, decimals);
  let result = x.multipliedBy(power);
  let resultFixed = result.toFixed(0);
  return resultFixed;
};

const countDecimals = (number) => {
  if (Math.floor(number) === number) return 0; // Check if the number is an integer
  const decimalPart = number.toString().split(".")[1]; // Get the part after the decimal
  return decimalPart ? decimalPart.length : 0;
};

export const generateUUID = (): string => {
  return crypto.randomUUID();
};

export const uuidToNumber = (uuid): number => {
  const numberReturn = parseInt(uuid.replace(/-/g, "").slice(0, 8), 16);
  return numberReturn;
};

export { cleanObject, generateReferralCode, fixedCustom, countDecimals };
