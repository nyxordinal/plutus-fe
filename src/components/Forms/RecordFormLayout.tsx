import FooterAdmin from "@component/Footers/FooterAdmin";
import Loader from "@component/Loader/Loader";
import AdminNavbar from "@component/Navbars/AdminNavbar";
import Sidebar from "@component/Sidebar/Sidebar";
import SnackbarAlert from "@component/SnackbarAlert/SnackbarAlert";
import { AlertColor, CircularProgress, SnackbarCloseReason } from "@mui/material";

type PropType = {
  isAuthenticated: boolean;
  navTitle: string;
  navUrl: string;
  submitLabel: string;
  isLoading: boolean;
  onSubmit: () => void;
  open: boolean;
  message: string;
  severity: AlertColor;
  onHandleClose: (
    event: React.SyntheticEvent<any> | Event,
    reason: SnackbarCloseReason
  ) => void;
  children: React.ReactNode;
};

const RecordFormLayout = ({
  isAuthenticated,
  navTitle,
  navUrl,
  submitLabel,
  isLoading,
  onSubmit,
  open,
  message,
  severity,
  onHandleClose,
  children,
}: PropType) => {
  if (!isAuthenticated) return <Loader />;

  return (
    <>
      <SnackbarAlert
        open={open}
        message={message}
        severity={severity}
        onHandleClose={onHandleClose}
      />
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar name={navTitle} customUrl={navUrl} />
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="px-4 md:px-10 mx-auto w-full max-w-4xl rounded-lg bg-white/10 p-4 md:p-8"
          >
            {children}
            <div className="w-full px-4 mt-2">
              <button
                className="w-full bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded-lg shadow-md hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={20} color="inherit" /> : submitLabel}
              </button>
            </div>
          </form>
        </div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4" />
          </div>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
};

export default RecordFormLayout;
