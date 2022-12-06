export const getFieldErrors = (name: string, errors: any, touched: any) => {
  if (Object.keys(errors).length) {
    const error = touched[name] && errors[name]?.length > 0;
    const helperText = error ? errors[name] : " ";
    return { error, helperText };
  }
  return { error: false, helperText: " " };
};
