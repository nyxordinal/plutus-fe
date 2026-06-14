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
            className="px-4 md:px-10 mx-auto w-full"
          >
            {children}
            <div className="lg:w-6/12 xl:w-3/12 px-4">
              <button
                className="bg-white text-blueGray-800 active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={20} /> : submitLabel}
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
