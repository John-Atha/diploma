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
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getFieldErrors } from "../../helpers/getFieldErrors";
import { SignupValidationSchema } from "../../helpers/FormValidationSchema";

interface SignupFormProps {
  onClose: () => void;
  showLoginDialog: () => void;
}
export const SignupForm = ({ onClose, showLoginDialog }: SignupFormProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { signup } = useAuth();
  const initialValues = {
    username: "",
    password: "",
    confirmation: "",
  };

  const handleSubmit = (values: any) => {
    signup(values.username, values.password, values.confirmation);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={SignupValidationSchema}
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
            <Field
              as={TextField}
              name="confirmation"
              label="Confirmation"
              type="password"
              {...getFieldErrors("confirmation", errors, touched)}
            />
            <Grid container justifyContent="center">
              <Grid item>
                <Button type="submit" variant="contained">
                  Signup
                </Button>
              </Grid>
              <Grid item xs={12} marginTop={1} />
              <Button
                onClick={showLoginDialog}
                style={{ color: theme.palette.primary.main }}
              >
                Already have an account?
              </Button>
            </Grid>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
