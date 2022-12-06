import { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkLoggedCall, loginCall, signupCall, updateProfileCall } from "../api/auth";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout_, selectAuthUser, setAuthUser } from "../redux/slices/authSlice";
import { setSnackMessage } from "../redux/slices/snackMessageSlice";
import { deleteCookie, getCookie, setCookie } from "../helpers/cookies";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useAppSelector(selectAuthUser);

  const login = async (username: string, password: string) => {
    loginCall(username, password)
      .then((response) => {
        console.log(response.data);
        const { access, username, id } = response.data;
        setCookie("token", access, 7);
        const user = { username, id };
        setCookie("user", JSON.stringify(user), 7);
        dispatch(
          setAuthUser({
            token: access,
            username,
            id,
          })
        );
        dispatch(
          setSnackMessage({
            text: "Welcome back!",
            severity: "success",
          })
        );
        setSearchParams({ auth: "" });
      })
      .catch((err) => {
        dispatch(
          setSnackMessage({
            text: "Sorry, invalid credentials!",
            severity: "error",
          })
        );
      });
  };

  const loginWithToken = async () => {
    try {
      const { username, id } = await checkLoggedCall();
      dispatch(
        setAuthUser({
          token: getCookie("token"),
          username,
          id,
        })
      );
    } catch (err) {}
  };

  const logout = async () => {
    dispatch(logout_());
    deleteCookie("token");
    deleteCookie("username");
    deleteCookie("id");
    dispatch(
      setSnackMessage({
        text: "Logged out successfully",
        severity: "info",
      })
    );
    navigate("/");
  };

  const signup = async (
    username: string,
    password: string,
    confirmation: string
  ) => {
    if (password !== confirmation) {
      dispatch(
        setSnackMessage({
          text: "Password and confirmation must be the same",
          severity: "error",
        })
      );
    }
    signupCall(username, password)
      .then((response) => {
        const { id, username, access } = response.data;
        setCookie("username", username);
        setCookie("id", id);
        setCookie("token", access);
        dispatch(
          setAuthUser({
            token: access,
            username,
            id,
          })
        );
        dispatch(
          setSnackMessage({
            text: "Welcome!",
            severity: "success",
          })
        );
        setSearchParams({ auth: "" });
      })
      .catch((err) => {
        dispatch(
          setSnackMessage({
            text: err.response.data,
            severity: "error",
          })
        );
      });
  };

  const updateProfile = (body: any) => {
    updateProfileCall(body, id as number)
    .then(response => {
      console.log(response.data);
      const { username, id } = response.data;
      dispatch(setAuthUser({
        username,
        id,
        token: getCookie("token"),
      }));
      setCookie("username", username);
      dispatch(setSnackMessage({
        text: "Updated successfully",
        severity: "info",
      }));
    })
    .catch(err => {
      console.log(err.response);
      dispatch(setSnackMessage({
        text: err.response.data,
        severity: "error",
      }));
    })
  }

  return { login, loginWithToken, signup, logout, updateProfile };
};
