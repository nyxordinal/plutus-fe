import useAuth, { ProtectRoute } from "@auth";
import CardTableCustom from "@component/Cards/CardTableCustom";
import FooterAdmin from "@component/Footers/FooterAdmin";
import Loader from "@component/Loader/Loader";
import SearchBar from "@component/SearchBar/SearchBar";
import SnackbarAlert from "@component/SnackbarAlert/SnackbarAlert";
import { DEFAULT_EXPENSE_SEARCH_VALUES_NAME, TABLE_ROW_PER_PAGE_OPTION } from "@interface/constant";
import { GetAllIncomeServiceInterface } from "@interface/dto.interface";
import Admin from "@layout/Admin";
import { AlertColor, SnackbarCloseReason } from "@mui/material";
import { deleteBulkIncome, getAllIncomes } from "@service/income.service";
import { useTranslation } from "locale/translator";
import { useEffect, useState } from "react";
import { getIncomeMsgState, setIncomeMessage } from "redux/general";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { getIncomeState, setIncome } from "redux/income";

const IncomePage = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const incomes = useAppSelector(getIncomeState);
  const createUpdateMsg = useAppSelector(getIncomeMsgState);
  const { translate } = useTranslation();

  const [totalData, setTotalData] = useState<number>(0);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [source, setSource] = useState<string>(DEFAULT_EXPENSE_SEARCH_VALUES_NAME);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    TABLE_ROW_PER_PAGE_OPTION[1]
  );
  const [open, setOpen] = useState<boolean>(false);
  const [msg, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [filterChanged, setFilterChanged] = useState<boolean>(false);

  const fetchData = async (
    page: number,
    source?: string,
    startDate?: Date,
    endDate?: Date) => {
    setLoadingData(true);
    const param: GetAllIncomeServiceInterface = {
      page,
      dataPerPage: rowsPerPage,
    };
    if (source) {
      param.source = source;
    }
    if (startDate !== undefined && endDate !== undefined) {
      param.startDate = startDate;
      param.endDate = endDate;
    }
    const { incomeData, totalData } = await getAllIncomes(param);
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
  useEffect(() => {
    if (createUpdateMsg != undefined && createUpdateMsg.length != 0)
      openSnackbar("success", createUpdateMsg);
  }, [createUpdateMsg]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterChanged(true);
    setSource(event.target.value);
  };
  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterChanged(true);
    setStartDate(new Date(event.target.value));
  };
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterChanged(true);
    setEndDate(new Date(event.target.value));
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    fetchData(newPage + 1, source, startDate, endDate);
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
  const handleApplyFilter = () => {
    setPage(0);
    fetchData(page, source, startDate, endDate);
    setFilterChanged(false);
  };
  const handleClearFilter = () => {
    setFilterChanged(false);
    setPage(0);
    setSource("");
    setStartDate(undefined);
    setEndDate(undefined);
    fetchData(1);
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
    dispatch(setIncomeMessage(""));
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
        <SearchBar
          name={source}
          startDate={startDate}
          endDate={endDate}
          isFilterChanged={filterChanged}
          onNameChange={handleNameChange}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onApplyFilter={handleApplyFilter}
          onClearFilter={handleClearFilter}
        />
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
