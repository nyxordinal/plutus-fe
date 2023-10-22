import useAuth, { ProtectRoute } from "@auth";
import Loader from "@component/Loader/Loader";
import SnackbarAlert from "@component/SnackbarAlert/SnackbarAlert";
import Auth from "@layout/Auth";
import { AlertColor, SnackbarCloseReason } from "@mui/material";
import { resetPassword } from "@service/password.service";
import { useTranslation } from "locale/translator";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

const ResetPasswordPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { translate } = useTranslation();
  const query = router.query;
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  useEffect(() => {
    if (!query["email"] || !query["reset-token"]) {
      router.push("/password/forgot");
    }
  }, [query]);

  const handleChangePassword = () => (event: ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);
  const handleChangePasswordConfirm =
    () => (event: ChangeEvent<HTMLInputElement>) =>
      setPasswordConfirm(event.target.value);
  const handleSubmit = async () => {
    if (!query["email"] || !query["reset-token"]) {
      openSnackbar(
        "error",
        "Something is wrong, please reopen the password reset link in your email"
      );
    } else if (password === "" || passwordConfirm === "") {
      openSnackbar(
        "warning",
        "Password and password confirmation are required"
      );
    } else if (password !== passwordConfirm) {
      openSnackbar(
        "warning",
        "Password and password confirmation are not the same"
      );
    } else if (password.length < 8) {
      openSnackbar("warning", "Minimum password length is 8 characters");
    } else {
      setLoading(true);
      const result = await resetPassword(
        query["email"] as string,
        query["reset-token"] as string,
        password
      );
      if (result.success) {
        openSnackbar(
          "success",
          "Reset password success, you will be redirected to login page"
        );
        setLoading(false);
        setTimeout(() => {
          router.push("/login");
        }, 5000);
      } else {
        setLoading(false);
        openSnackbar("error", result.message);
      }
    }
  };
  const openSnackbar = (type: AlertColor, message: string) => {
    setMessage(message);
    setSeverity(type);
    setOpen(true);
  };
  const handleClose = (
    event: React.SyntheticEvent<any> | Event,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  return isAuthenticated ? (
    <Loader />
  ) : (
    <Auth>
      <>
        <SnackbarAlert
          open={open}
          message={msg}
          severity={severity}
          onHandleClose={handleClose}
        />
        <div className="container mx-auto px-4 h-full">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                <div className="flex-auto px-4 lg:px-10 py-10">
                  <form>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="input-password"
                      >
                        {translate("password")}
                      </label>
                      <input
                        id="input-password"
                        type={showPassword ? "text" : "password"}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder={translate("password")}
                        value={password}
                        onChange={handleChangePassword()}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? "Hide" : "Show"} Password
                      </button>
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="input-password-confirm"
                      >
                        {translate("passwordConfirm")}
                      </label>
                      <input
                        id="input-password-confirm"
                        type={showPasswordConfirm ? "text" : "password"}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder={translate("passwordConfirm")}
                        value={passwordConfirm}
                        onChange={handleChangePasswordConfirm()}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordConfirmVisibility}
                      >
                        {showPasswordConfirm ? "Hide" : "Show"} Password
                      </button>
                    </div>

                    <div className="text-center mt-6">
                      {loading ? (
                        <Loader isFullHeightScreen={false} />
                      ) : (
                        <button
                          className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                          type="button"
                          onClick={handleSubmit}
                        >
                          {translate("resetPasswordBtn")}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Auth>
  );
};

export default ProtectRoute(ResetPasswordPage, true);
