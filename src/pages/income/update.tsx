import useAuth, { ProtectRoute } from "@auth";
import FooterAdmin from "@component/Footers/FooterAdmin";
import Loader from "@component/Loader/Loader";
import AdminNavbar from "@component/Navbars/AdminNavbar";
import Sidebar from "@component/Sidebar/Sidebar";
import SnackbarAlert from "@component/SnackbarAlert/SnackbarAlert";
import { TableItem } from "@interface/entity.interface";
import { AlertColor, SnackbarCloseReason } from "@mui/material";
import { updateIncome } from "@service/income.service";
import { formatDateSimple, useLocalStorage } from "@util";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { setIncomeMessage } from "redux/general";
import { useAppDispatch } from "redux/hooks";

const Update = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [updateData, setUpdateData] = useLocalStorage<TableItem>(
    "updateDataIncome",
    {
      id: 0,
      name: "",
      type: 0,
      price: 0,
      date: new Date(),
    }
  );
  const [source, setSource] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  useEffect(() => {
    setSource(updateData.name);
    setAmount(updateData.price);
    setDate(new Date(updateData.date));
  }, []);

  const handleSubmit = () => {
    const update = async () => {
      const result = await updateIncome({
        id: updateData.id,
        source,
        amount,
        date,
      });
      if (result.success) {
        openSnackbar("success", "Update income success");
        setUpdateData({
          id: 0,
          name: "",
          type: 0,
          price: 0,
          date: new Date(),
        });
        dispatch(setIncomeMessage(result.message));
        setTimeout(() => {
          router.push("/income");
        }, 3000);
      } else openSnackbar("error", result.message);
    };
    update();
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
  const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSource(event.target.value);
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    isNaN(parseInt(event.target.value, 10))
      ? setAmount(0)
      : setAmount(parseInt(event.target.value, 10));
  };
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDate(new Date(event.target.value));

  return !isAuthenticated ? (
    <Loader />
  ) : (
    <>
      <SnackbarAlert
        open={open}
        message={msg}
        severity={severity}
        onHandleClose={handleClose}
      />
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar name={"update income"} customUrl={"/income/update"} />
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12">
          <div className="px-4 md:px-10 mx-auto w-full">
            <div className="lg:w-6/12 xl:w-3/12 px-4 mb-3">
              <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
                Source
              </h6>
              <input
                className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                type="text"
                value={source}
                onChange={handleSourceChange}
              />
            </div>
            <div className="lg:w-6/12 xl:w-3/12 px-4 mb-3">
              <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
                Income Type
              </h6>
              <select
                className="px-3 py-3 text-blueGray-600 relative bg-white bg-white rounded text-sm w-full"
                name="income-type"
                disabled
              ></select>
            </div>
            <div className="lg:w-6/12 xl:w-3/12 px-4 mb-3">
              <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
                Amount
              </h6>
              <input
                className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                type="number"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
            <div className="lg:w-6/12 xl:w-3/12 px-4 mb-8">
              <h6 className="text-xl font-normal leading-normal mt-0 mb-2 text-white">
                Income Date
              </h6>
              <input
                className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                type="date"
                value={formatDateSimple(date)}
                onChange={handleDateChange}
              />
            </div>
            <div className="lg:w-6/12 xl:w-3/12 px-4">
              <button
                className="bg-white text-blueGray-800 active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                Update Income
              </button>
            </div>
          </div>
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

export default ProtectRoute(Update);
