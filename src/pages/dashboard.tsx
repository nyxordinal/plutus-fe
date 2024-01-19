import useAuth, { ProtectRoute } from "@auth";
import CardLineChartSummary from "@component/Cards/CardLineSummary";
import CardPageSummary from "@component/Cards/CardPageSummary";
import Loader from "@component/Loader/Loader";
import { TABLE_ROW_PER_PAGE_OPTION } from "@interface/constant";
import AdminDashboard from "@layout/AdminDashboard";
import { getExpenseSummary } from "@service/expense.service";
import { getIncomeSummary } from "@service/income.service";
import { useCurrency } from "currency";
import { useTranslation } from "locale/translator";
import { useEffect, useState } from "react";
import { getExpenseSummaryState, setExpenseSummary } from "redux/expense";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { getIncomeSummaryState, setIncomeSummary } from "redux/income";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();
  const { translate } = useTranslation();
  const { updateCurrency } = useCurrency();
  const expenseSummary = useAppSelector(getExpenseSummaryState).map((o) => ({
    ...o,
  }));
  const incomeSummary = useAppSelector(getIncomeSummaryState).map((o) => ({
    ...o,
  }));
  const [loading, setLoading] = useState(true);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [expenseAvg, setExpenseAvg] = useState(0);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [incomeAvg, setIncomeAvg] = useState(0);
  const [totalExpenseSummaryData, setTotalExpenseSummaryData] = useState<number>(0);
  const [expenseSummaryPage, setExpenseSummaryPage] = useState<number>(0);
  const [expenseSummaryRowsPerPage, setExpenseSummaryRowsPerPage] = useState<number>(
    TABLE_ROW_PER_PAGE_OPTION[1]
  );
  const [totalIncomeSummaryData, setTotalIncomeSummaryData] = useState<number>(0);
  const [incomeSummaryPage, setIncomeSummaryPage] = useState<number>(0);
  const [incomeSummaryRowsPerPage, setIncomeSummaryRowsPerPage] = useState<number>(
    TABLE_ROW_PER_PAGE_OPTION[1]
  );

  const fetchExpenseSummary = async (
    page: number,
    dataPerPage: number
  ) => {
    setLoading(true);
    const expensesData = await getExpenseSummary(page, dataPerPage);
    dispatch(setExpenseSummary(expensesData.data));
    setExpenseTotal(expensesData.total);
    setExpenseAvg(expensesData.average);
    setTotalExpenseSummaryData(expensesData.totalData)
    setLoading(false);
  };
  const handleChangeExpenseSummaryPage = (event: unknown, newPage: number) => {
    fetchExpenseSummary(newPage + 1, expenseSummaryRowsPerPage);
    setExpenseSummaryPage(newPage);
  };
  const handleChangeExpenseSummaryRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage: number = parseInt(event.target.value, 10)
    fetchExpenseSummary(1, newRowsPerPage);
    setExpenseSummaryPage(0);
    setExpenseSummaryRowsPerPage(newRowsPerPage);
  };

  const fetchIncomeSummary = async (
    page: number,
    dataPerPage: number
  ) => {
    setLoading(true);
    const incomesData = await getIncomeSummary(page, dataPerPage);
    dispatch(setIncomeSummary(incomesData.data));
    setIncomeTotal(incomesData.total);
    setIncomeAvg(incomesData.average);
    setTotalIncomeSummaryData(incomesData.totalData)
    setLoading(false);
  };
  const handleChangeIncomeSummaryPage = (event: unknown, newPage: number) => {
    fetchIncomeSummary(newPage + 1, incomeSummaryRowsPerPage);
    setIncomeSummaryPage(newPage);
  };
  const handleChangeIncomeSummaryRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage: number = parseInt(event.target.value, 10)
    fetchIncomeSummary(1, newRowsPerPage);
    setIncomeSummaryPage(0);
    setIncomeSummaryRowsPerPage(newRowsPerPage);
  };

  useEffect(() => {
    const fetchData = async () => {
      updateCurrency(user.currency);
      const expensesData = await getExpenseSummary(expenseSummaryPage, expenseSummaryRowsPerPage);
      const incomesData = await getIncomeSummary(incomeSummaryPage, incomeSummaryRowsPerPage);
      dispatch(setExpenseSummary(expensesData.data));
      dispatch(setIncomeSummary(incomesData.data));
      setExpenseTotal(expensesData.total);
      setExpenseAvg(expensesData.average);
      setTotalExpenseSummaryData(expensesData.totalData)
      setTotalIncomeSummaryData(incomesData.totalData)
      setIncomeTotal(incomesData.total);
      setIncomeAvg(incomesData.average);
      setLoading(false);
    };
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  return !isAuthenticated ? (
    <Loader />
  ) : (
    <AdminDashboard
      expenseTotal={expenseTotal}
      expenseAverage={expenseAvg}
      incomeTotal={incomeTotal}
      incomeAverage={incomeAvg}
    >
      <>
        {loading ? (
          <Loader isFullHeightScreen={false} />
        ) : (
          <div className="flex flex-wrap">
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
              <CardLineChartSummary
                id={"expense-chart"}
                title={translate("expense")}
                data={expenseSummary}
              />
            </div>
            <div className="w-full xl:w-6/12 px-4">
              <CardLineChartSummary
                id={"income-chart"}
                title={translate("income")}
                data={incomeSummary}
              />
            </div>
          </div>
        )}
        <div className="flex flex-wrap mt-4">
          <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
            <CardPageSummary
              title={translate("expenseSummary")}
              seeAllUrl="/expense"
              data={expenseSummary}
              totalData={totalExpenseSummaryData}
              page={expenseSummaryPage}
              rowsPerPage={expenseSummaryRowsPerPage}
              handleChangePage={handleChangeExpenseSummaryPage}
              handleChangeRowsPerPage={handleChangeExpenseSummaryRowsPerPage}
            />
          </div>
          <div className="w-full xl:w-6/12 px-4">
            <CardPageSummary
              title={translate("incomeSummary")}
              seeAllUrl="/income"
              data={incomeSummary}
              totalData={totalIncomeSummaryData}
              page={incomeSummaryPage}
              rowsPerPage={incomeSummaryRowsPerPage}
              handleChangePage={handleChangeIncomeSummaryPage}
              handleChangeRowsPerPage={handleChangeIncomeSummaryRowsPerPage}
            />
          </div>
        </div>
      </>
    </AdminDashboard>
  );
};

export default ProtectRoute(Dashboard);
