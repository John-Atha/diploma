import { Button, Grid, Stack, TextField } from "@mui/material";
import { Field, Form, Formik } from "formik";
import { UpdatePasswordValidationSchema } from "../../helpers/FormValidationSchema";
import { getFieldErrors } from "../../helpers/getFieldErrors";
import { useAuth } from "../../hooks/useAuth";

export const UpdatePasswordForm = () => {
  const { updateProfile } = useAuth();
  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmation: "",
  };

  const submit = (values: any) => {
    updateProfile(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={UpdatePasswordValidationSchema}
      onSubmit={submit}
    >
      {({ touched, errors }) => (
        <Form style={{ maxWidth: 600 }}>
          <Stack spacing={2}>
            <Field
              as={TextField}
              name="currentPassword"
              label="Current Password"
              {...getFieldErrors("currentPassword", errors, touched)}
              type="password"
            />
            <Field
              as={TextField}
              name="newPassword"
              label="New Password"
              {...getFieldErrors("newPassword", errors, touched)}
              type="password"
            />
            <Field
              as={TextField}
              name="confirmation"
              label="Confirmation"
              {...getFieldErrors("confirmation", errors, touched)}
              type="password"
            />
            <Grid container justifyContent="flex-start">
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Grid>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
