import * as Yup from "yup";

export const LoginValidationSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

export const SignupValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Required")
    .min(5, "Must be at least 5 characters long"),
  password: Yup.string().required("Required"),
  confirmation: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const GeneralInfoValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Required")
    .min(5, "Must be at least 5 characters long"),
});

export const UpdatePasswordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Required"),
  newPassword: Yup.string()
    .required("Required")
    .min(5, "Must be at least 5 characters long"),
  confirmation: Yup.string()
    .required("Required")
    .oneOf(
      [Yup.ref("newPassword"), null],
      "New password and confirmation must match"
    ),
});
