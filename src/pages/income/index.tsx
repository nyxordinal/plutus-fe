import useAuth, { ProtectRoute } from '@auth';
import IncomeTable from '@components/IncomeTable';
import Layout from '@components/layout';
import Loader from '@components/loader';
import { TABLE_ROW_PER_PAGE_OPTION } from '@interface/constant';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { getAllIncomes } from '@services/income.service';
import { Fragment, useEffect, useState } from 'react';
import { getIncomeMsgState } from 'redux/general';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { getIncomeState, setIncome } from 'redux/income';

const IncomePage = () => {
    const { isAuthenticated } = useAuth()

    const dispatch = useAppDispatch()
    const incomes = useAppSelector(getIncomeState)
    const updateAlertMsg = useAppSelector(getIncomeMsgState)

    const [totalData, setTotalData] = useState<number>(0);
    const [loadingPage, setLoadingPage] = useState<boolean>(true)
    const [loadingData, setLoadingData] = useState<boolean>(true)
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(TABLE_ROW_PER_PAGE_OPTION[0]);

    const fetchData = async (page: number) => {
        setLoadingData(true)
        const { incomeData, totalData } = await getAllIncomes(page, rowsPerPage)
        if (incomeData.length < 1 && totalData == 0 && page > 0) {
            setPage(0)
        }
        dispatch(setIncome(incomeData))
        setTotalData(totalData)
        setLoadingData(false)
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchData(page + 1)
            if (loadingPage) setLoadingPage(false)
        }
    }, [isAuthenticated, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        fetchData(newPage + 1)
        setPage(newPage)
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <Layout>
            <Fragment>
                <Typography variant="h4" gutterBottom>Income Page</Typography>
                <div style={{ height: 800, width: '100%' }}>
                    {loadingPage ? (
                        <CircularProgress />
                    ) : (
                        <Fragment>
                            <IncomeTable
                                updateAlertMsg={updateAlertMsg}
                                totalData={totalData}
                                incomes={incomes}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                loadingData={loadingData}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                                handleRefreshData={fetchData}
                            />
                        </Fragment>
                    )}
                </div>
            </Fragment>
        </Layout>
    );
}

export default ProtectRoute(IncomePage)