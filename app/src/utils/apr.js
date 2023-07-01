export const calculateAPR = (input, output, duration) => {
  if (!input || !output || !duration) return 0;
  return (((output - input) * 365 * 100) / (input * duration)).toFixed(2);
};

export const calculateRepayment = (input, apr, duration) => {
  if (!input || !apr || !duration) return 0;
  return (+input + (apr * input * duration) / (365 * 100)).toFixed(2);
};
