import useAuth, { ProtectRoute } from '@auth';
import Layout from '@components/layout';
import Loader from '@components/loader';
import { Income } from '@interface/entity.interface';
import { CircularProgress, Paper, Snackbar, Typography } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';
import { createIncome, deleteIncome, getAllIncomes, updateIncome } from '@services/income.service';
import MaterialTable, { Column } from 'material-table';
import { Fragment, useEffect, useState } from 'react';

const column: Column<Income>[] = [
    {
        title: 'Source',
        field: 'source',
        type: 'string',
        filtering: false,
        validate: rowData => rowData.source === '' || rowData.source === undefined ? 'Source cannot be empty' : ''
    },
    {
        title: 'Amount',
        field: 'amount',
        type: 'numeric',
        filtering: false,
        validate: rowData => rowData.amount === 0 || rowData.amount === undefined ? 'Amount cannot be empty or 0' : ''
    },
    {
        title: 'Date',
        field: 'date',
        type: 'date',
        validate: rowData => rowData.date === undefined ? 'Please choose an income date' : ''
    },
]

const IncomePage = () => {
    const { isAuthenticated } = useAuth()
    const [incomes, setIncomes] = useState<Income[]>([])
    const [open, setOpen] = useState<boolean>(false);
    const [msg, setMessage] = useState<string>('');
    const [severity, setSeverity] = useState<Color>('success');
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const incomesData = await getAllIncomes()
            setIncomes(incomesData)
            setLoading(false)
        }
        if (isAuthenticated) fetchData()
    }, [isAuthenticated]);
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const openSnackbar = (type: Color, message: string) => {
        setMessage(message)
        setSeverity(type)
        setOpen(true)
    }

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <Layout>
            <Fragment>
                <Typography variant="h4" gutterBottom>Income Page</Typography>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <MaterialTable
                        title=""
                        columns={column}
                        components={{
                            // eslint-disable-next-line react/display-name
                            Container: (props) => (
                                <Paper {...props} elevation={0} />
                            )
                        }}
                        data={incomes}
                        options={{
                            search: true,
                            filtering: true,
                            actionsColumnIndex: -1,
                            addRowPosition: 'first',
                        }}
                        editable={{
                            onRowAdd: (newData) =>
                                new Promise<void>((resolve, reject) => {
                                    createIncome(newData).then(async (result) => {
                                        if (result.success) {
                                            const data = await getAllIncomes()
                                            setIncomes(data)
                                            openSnackbar('success', 'Add income success')
                                            resolve()
                                        } else {
                                            openSnackbar('error', `Add income failed, ${result.message}`)
                                            reject()
                                        }
                                    })
                                }),
                            onRowUpdate: (newData, oldData) =>
                                new Promise<void>((resolve, reject) => {
                                    if (oldData) {
                                        updateIncome(newData, oldData).then(
                                            (result) => {
                                                if (result.success) {
                                                    const dataUpdate = [
                                                        ...incomes
                                                    ]
                                                    const oldRowData: any = oldData
                                                    const index: number = oldRowData.tableData.id
                                                    dataUpdate[index] = newData
                                                    setIncomes([...dataUpdate])
                                                    openSnackbar('success', 'Update income success')
                                                    resolve()
                                                } else {
                                                    openSnackbar('error', `Update income failed, ${result.message}`)
                                                    reject()
                                                }
                                            }
                                        )
                                    }
                                }),
                            onRowDelete: (oldData) =>
                                new Promise<void>((resolve) => {
                                    deleteIncome(oldData).then((result) => {
                                        if (result.success) {
                                            const dataDelete = [...incomes]
                                            const oldRowData: any = oldData
                                            const index =
                                                oldRowData.tableData.id
                                            dataDelete.splice(index, 1)
                                            setIncomes([...dataDelete])
                                            openSnackbar('success', 'Delete income success')
                                        } else {
                                            openSnackbar('error', `Delet income failed, ${result.message}`)
                                        }
                                        resolve()
                                    })
                                })
                        }}
                    />
                )}
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity}>
                        {msg}
                    </Alert>
                </Snackbar>
            </Fragment>
        </Layout>
    );
}

export default ProtectRoute(IncomePage)