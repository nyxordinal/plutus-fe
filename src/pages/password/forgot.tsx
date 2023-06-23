import useAuth, { ProtectRoute } from "@auth";
import Loader from "@component/Loader/Loader";
import SnackbarAlert from "@component/SnackbarAlert/SnackbarAlert";
import Auth from "@layout/Auth";
import { AlertColor, SnackbarCloseReason } from "@mui/material";
import { sendForgotPasswordEmail } from "@service/password.service";
import { ValidateEmail } from "@util";
import { useTranslation } from "locale/translator";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

const ForgotPasswordPage = () => {
  const { isAuthenticated } = useAuth();
  const { translate } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangeEmail = () => (event: ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);
  const handleSubmit = async () => {
    if (email === "") {
      openSnackbar("warning", "Email is required");
    } else if (!ValidateEmail(email)) {
      openSnackbar("warning", "Please enter a valid email");
    } else {
      setLoading(true);
      const result = await sendForgotPasswordEmail(email);
      result.success
        ? openSnackbar("success", result.message)
        : openSnackbar("error", result.message);
      setLoading(false);
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
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                <div className="flex-auto px-4 lg:px-10 py-10">
                  <form>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Email
                      </label>
                      <input
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleChangeEmail()}
                      />
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
                          {translate("sendResetPasswordEmailButton")}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
              <div className="flex flex-wrap mt-6 relative">
                <div className="w-1/2">
                  <Link href="/login">
                    <a href="#pablo" className="text-blueGray-200">
                      <small>{translate("backToLoginPageBtn")}</small>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Auth>
  );
};

export default ProtectRoute(ForgotPasswordPage, true);
