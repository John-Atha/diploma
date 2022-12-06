import React, { useState } from "react";
import { GitHub } from "@mui/icons-material";
import {
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useAppDispatch } from "../../redux/hooks";
import { setSnackMessage } from "../../redux/slices/snackMessageSlice";
import { Field, Form, Formik } from "formik";
import { useAuth } from "../../hooks/useAuth";
import { LoginValidationSchema } from "../../helpers/FormValidationSchema";
import { getFieldErrors } from "../../helpers/getFieldErrors";

interface LoginFormProps {
  onClose: () => void;
  showSignupDialog: () => void;
}
export const LoginForm = ({ onClose, showSignupDialog }: LoginFormProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const initialValues = {
    username: "",
    password: "",
  };

  const { login } = useAuth();

  const handleSubmit = (values: any) => {
    login(values.username, values.password);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={LoginValidationSchema}
    >
      {({ errors, touched }) => (
        <Form>
          <Stack spacing={2} justifyContent="center" padding={3}>
            <Field
              as={TextField}
              name="username"
              label="Username"
              type="text"
              {...getFieldErrors("username", errors, touched)}
            />
            <Field
              as={TextField}
              name="password"
              label="Password"
              type="password"
              {...getFieldErrors("password", errors, touched)}
            />
            <Grid container justifyContent="center">
              <Grid item>
                <Button type="submit" variant="contained">
                  Login
                </Button>
              </Grid>
              <Grid item xs={12} marginTop={1} />
              <Button onClick={showSignupDialog}>First time here?</Button>
            </Grid>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
