import useAuth, { ProtectRoute } from "@auth";
import CardTableCustom from "@component/Cards/CardTableCustom";
import FooterAdmin from "@component/Footers/FooterAdmin";
import Loader from "@component/Loader/Loader";
import SnackbarAlert from "@component/SnackbarAlert/SnackbarAlert";
import { TABLE_ROW_PER_PAGE_OPTION } from "@interface/constant";
import Admin from "@layout/Admin";
import { AlertColor, SnackbarCloseReason } from "@mui/material";
import { deleteBulkIncome, getAllIncomes } from "@service/income.service";
import { useTranslation } from "locale/translator";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { getIncomeState, setIncome } from "redux/income";

const IncomePage = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const incomes = useAppSelector(getIncomeState);
  const { translate } = useTranslation()

  const [totalData, setTotalData] = useState<number>(0);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    TABLE_ROW_PER_PAGE_OPTION[1]
  );
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const fetchData = async (page: number) => {
    setLoadingData(true);
    const { incomeData, totalData } = await getAllIncomes(page, rowsPerPage);
    if (incomeData.length < 1 && totalData === 0 && page > 0) {
      setPage(0);
    }
    dispatch(setIncome(incomeData));
    setTotalData(totalData);
    setLoadingData(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(page + 1);
    }
  }, [isAuthenticated, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    fetchData(newPage + 1);
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const handleDeleteClick = async (rowIds: number[]) => {
    const result = await deleteBulkIncome(rowIds);
    if (result.success) {
      await fetchData(1);
      openSnackbar("success", "Delete incomes success");
    } else openSnackbar("error", `Delete incomes failed, ${result.message}`);
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

  return !isAuthenticated ? (
    <Loader />
  ) : (
    <Admin name={translate("income")} customUrl="/income">
      <>
        <SnackbarAlert
          open={open}
          message={msg}
          severity={severity}
          onHandleClose={handleClose}
        />
        {/* div for spaces between title and content */}
        <div className="relative bg-blueGray-800 md:pt-16 pb-32 pt-12" />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
              <CardTableCustom
                name={translate("income")}
                loadingTable={loadingData}
                createPageUrl={"/income/create"}
                updatePageUrl={"/income/update"}
                totalData={totalData}
                page={page}
                rowsPerPage={rowsPerPage}
                updateDataKey="updateDataIncome"
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleDeleteClick={handleDeleteClick}
                items={incomes}
              />
            </div>
          </div>
          <FooterAdmin />
        </div>
      </>
    </Admin>
  );
};

export default ProtectRoute(IncomePage);
