import { Button, Grid, Stack, TextField } from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { GeneralInfoValidationSchema } from "../../helpers/FormValidationSchema";
import { getFieldErrors } from "../../helpers/getFieldErrors";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../redux/hooks";
import { selectAuthUser } from "../../redux/slices/authSlice";

export const GeneralInfoForm = () => {
  const { username } = useAppSelector(selectAuthUser);
  const initialValues = { username };
  const { updateProfile } = useAuth();

  const submit = (values: any) => {
    updateProfile(values);
  };
  
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={GeneralInfoValidationSchema}
      onSubmit={submit}
    >
      {({ touched, errors }) => (
        <Form style={{ maxWidth: 600 }}>
          <Stack spacing={2}>
            <Field
              as={TextField}
              name="username"
              label="Username"
              {...getFieldErrors("username", errors, touched)}
            />
            <Grid container justifyContent="flex-start">
              <Button
                variant="contained"
                type="submit"
              >
                Submit
              </Button>
            </Grid>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
