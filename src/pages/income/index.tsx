import useAuth, { ProtectRoute } from '@auth';
import IncomeTable from '@components/IncomeTable';
import Layout from '@components/layout';
import Loader from '@components/loader';
import { TABLE_ROW_PER_PAGE_OPTION } from '@interface/constant';
import { Income } from '@interface/entity.interface';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { getAllIncomes } from '@services/income.service';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

const IncomePage = () => {
    const { isAuthenticated } = useAuth()
    const router = useRouter()

    const [updateAlertMsg, setUpdateAlertMsg] = useState<string>('');
    const [totalData, setTotalData] = useState<number>(0);
    const [incomes, setIncomes] = useState<Income[]>([])
    const [loadingPage, setLoadingPage] = useState<boolean>(true)
    const [loadingData, setLoadingData] = useState<boolean>(true)
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(TABLE_ROW_PER_PAGE_OPTION[0]);

    const fetchData = async (page: number, turnOffLoadingData = false) => {
        const { incomeData, totalData } = await getAllIncomes(page, rowsPerPage)
        if (incomeData.length < 1 && totalData == 0 && page > 0) {
            setPage(0)
        }
        setIncomes(incomeData)
        setTotalData(totalData)
        if (turnOffLoadingData) setLoadingData(false)
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchData(page + 1, true)
            if (router.query.msg != undefined && router.query.msg?.length != 0)
                setUpdateAlertMsg(router.query.msg as string)
            setLoadingPage(false)
        }
    }, [isAuthenticated]);

    useEffect(() => {
        setLoadingData(true)
        fetchData(page + 1, true)
    }, [rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setLoadingData(true)
        fetchData(newPage + 1, true)
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