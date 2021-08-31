import useAuth, { ProtectRoute } from '@auth';
import Layout from '@components/layout';
import Loader from '@components/loader';
import { Expense } from '@interface/entity.interface';
import { convertToExpenseType, EXPENSE_TYPE } from '@interface/enum';
import { CircularProgress, Paper, Snackbar, Typography } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';
import { createExpense, deleteExpense, getAllExpenses, updateExpense } from '@services/expense.service';
import MaterialTable, { Column } from 'material-table';
import { Fragment, useEffect, useState } from 'react';

type Type = {
    [name: string]: string
}
const generateTypeLookup = () => {
    const data: Type = {}
    for (let idx = 0; idx < Object.keys(EXPENSE_TYPE).length; idx++) {
        const type: any = EXPENSE_TYPE[idx];
        if (typeof type === 'string') {
            data[idx] = type
        }
    }
    return data
}
const typeLookup = generateTypeLookup()
const column: Column<Expense>[] = [
    {
        title: 'Name',
        field: 'name',
        type: 'string',
        filtering: false,
        validate: rowData => rowData.name === '' || rowData.name === undefined ? 'Name cannot be empty' : ''
    },
    {
        title: 'Price',
        field: 'price',
        type: 'numeric',
        filtering: false,
        validate: rowData => rowData.price === 0 || rowData.price === undefined ? 'Price cannot be empty or 0' : ''
    },
    {
        title: 'Date',
        field: 'date',
        type: 'date',
        validate: rowData => rowData.date === undefined ? 'Please choose an expense date' : ''
    },
    {
        title: 'Type',
        field: 'typeId',
        type: 'numeric',
        lookup: typeLookup,
        render: rowData => convertToExpenseType(rowData.typeId),
        validate: rowData => rowData.typeId === undefined ? 'Please choose an expense type' : ''
    }
]

const ExpensePage = () => {
    const { isAuthenticated } = useAuth()
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [open, setOpen] = useState<boolean>(false);
    const [msg, setMessage] = useState<string>('');
    const [severity, setSeverity] = useState<Color>('success');
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const expensesData = await getAllExpenses()
            setExpenses(expensesData)
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
                <Typography variant="h4" gutterBottom>Expense Page</Typography>
                <div style={{ height: 800, width: '100%' }}>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <MaterialTable
                            title=""
                            columns={column}
                            components={{
                                Container: (props) => (
                                    <Paper {...props} elevation={0} />
                                )
                            }}
                            data={expenses}
                            options={{
                                search: true,
                                filtering: true,
                                actionsColumnIndex: -1,
                                addRowPosition: 'first',
                            }}
                            editable={{
                                onRowAdd: (newData) =>
                                    new Promise<void>((resolve, reject) => {
                                        createExpense(newData).then(async (result) => {
                                            if (result.success) {
                                                const data = await getAllExpenses()
                                                setExpenses(data)
                                                openSnackbar('success', 'Add expense success')
                                                resolve()
                                            } else {
                                                openSnackbar('error', `Add expense failed, ${result.message}`)
                                                reject()
                                            }
                                        })
                                    }),
                                onRowUpdate: (newData, oldData) =>
                                    new Promise<void>((resolve, reject) => {
                                        if (oldData) {
                                            updateExpense(newData, oldData).then(
                                                (result) => {
                                                    if (result.success) {
                                                        const dataUpdate = [
                                                            ...expenses
                                                        ]
                                                        const oldRowData: any = oldData
                                                        const index: number = oldRowData.tableData.id
                                                        const newDataTypeId: any = newData.typeId
                                                        newData.typeId = parseInt(newDataTypeId)
                                                        dataUpdate[index] = newData
                                                        setExpenses([...dataUpdate])
                                                        openSnackbar('success', 'Update expense success')
                                                        resolve()
                                                    } else {
                                                        openSnackbar('error', `Update expense failed, ${result.message}`)
                                                        reject()
                                                    }
                                                }
                                            )
                                        }
                                    }),
                                onRowDelete: (oldData) =>
                                    new Promise<void>((resolve) => {
                                        deleteExpense(oldData).then((result) => {
                                            if (result.success) {
                                                const dataDelete = [...expenses]
                                                const oldRowData: any = oldData
                                                const index =
                                                    oldRowData.tableData.id
                                                dataDelete.splice(index, 1)
                                                setExpenses([...dataDelete])
                                                openSnackbar('success', 'Delete expense success')
                                            } else {
                                                openSnackbar('error', `Delet expense failed, ${result.message}`)
                                            }
                                            resolve()
                                        })
                                    })
                            }}
                        />
                    )}
                </div>
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity}>
                        {msg}
                    </Alert>
                </Snackbar>
            </Fragment>
        </Layout>
    );
}

export default ProtectRoute(ExpensePage)