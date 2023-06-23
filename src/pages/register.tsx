import useAuth, { ProtectRoute } from "@auth";
import Loader from "@component/Loader/Loader";
import SnackbarAlert from "@component/SnackbarAlert/SnackbarAlert";
import Auth from "@layout/Auth";
import { AlertColor, SnackbarCloseReason } from "@mui/material";
import { ValidateEmail } from "@util";
import { useTranslation } from "locale/translator";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";

const Register = () => {
  const { isAuthenticated, register } = useAuth();
  const router = useRouter();
  const { translate } = useTranslation();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const handleChangeName = () => (event: ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);
  const handleChangeEmail = () => (event: ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);
  const handleChangePassword = () => (event: ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);
  const handleChangePasswordConfirm =
    () => (event: ChangeEvent<HTMLInputElement>) =>
      setPasswordConfirm(event.target.value);
  const handleSubmit = async () => {
    if (name === "") {
      openSnackbar("warning", "Name is required");
    } else if (email === "") {
      openSnackbar("warning", "Email is required");
    } else if (!ValidateEmail(email)) {
      openSnackbar("warning", "Please enter a valid email");
    } else if (password === "" || passwordConfirm === "") {
      openSnackbar("warning", "Password and password confirmation is required");
    } else if (password !== passwordConfirm) {
      openSnackbar(
        "warning",
        "Password and password confirmation are not the same"
      );
    } else if (password.length < 8) {
      openSnackbar("warning", "Minimum password length is 8 characters");
    } else {
      setLoadingLogin(true);
      const result = await register(name.trim(), email.trim(), password.trim());
      if (result.success) {
        openSnackbar(
          "success",
          `Registration is successful, you will be redirected to login page`
        );
        setLoadingLogin(false);
        setTimeout(() => {
          router.push("/login");
        }, 5000);
      } else {
        openSnackbar("warning", result.message);
        setLoadingLogin(false);
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
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                <div className="flex-auto px-4 lg:px-10 py-10">
                  <form>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="input-name"
                      >
                        {translate("name")}
                      </label>
                      <input
                        id="input-name"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder={translate("name")}
                        value={name}
                        onChange={handleChangeName()}
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="input-email"
                      >
                        Email
                      </label>
                      <input
                        id="input-email"
                        type="email"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Email"
                        value={email}
                        onChange={handleChangeEmail()}
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="input-password"
                      >
                        {translate("password")}
                      </label>
                      <input
                        id="input-password"
                        type="password"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder={translate("password")}
                        value={password}
                        onChange={handleChangePassword()}
                      />
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
                        type="password"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder={translate("passwordConfirm")}
                        value={passwordConfirm}
                        onChange={handleChangePasswordConfirm()}
                      />
                    </div>

                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          id="customCheckLogin"
                          type="checkbox"
                          className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                        />
                        <span className="ml-2 text-sm font-semibold text-blueGray-600">
                          I agree with the{" "}
                          <a
                            href="#pablo"
                            className="text-lightBlue-500"
                            onClick={(e) => e.preventDefault()}
                          >
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>

                    <div className="text-center mt-6">
                      <button
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="button"
                        onClick={handleSubmit}
                      >
                        {loadingLogin
                          ? "Loading..."
                          : translate("registerButtonText")}
                      </button>
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

export default ProtectRoute(Register, true);
