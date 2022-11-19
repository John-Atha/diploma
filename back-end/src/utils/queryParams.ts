export const queryParamHandle = (param: number | string) => {
  if (isNaN(parseInt(param as string))) return param;
  return parseInt(param);
};
