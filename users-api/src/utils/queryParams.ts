export const queryParamHandle = (param: number | string, forceAsString: boolean = false) => {
  if (forceAsString) return `${param}`;
  if (isNaN(parseInt(param as string))) return param;
  return parseInt(param as string);
};
