import { TABLE_ROW_PER_PAGE_OPTION } from '@interface/constant';
import { Order } from '@interface/dto.interface';
import { Expense } from '@interface/entity.interface';
import { EXPENSE_TYPE } from '@interface/enum';
import { CircularProgress } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Alert, Color } from '@material-ui/lab';
import { deleteBulkExpense } from '@services/expense.service';
import { currencyFormatter, formatDateSimple, useLocalStorage } from '@util';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string | Date }, b: { [key in Key]: number | string | Date }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface ExpenseTableHeadProps {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Expense) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Expense;
    label: string;
    numeric: boolean;
}

const headCells: HeadCell[] = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'price', numeric: true, disablePadding: false, label: 'Price' },
    { id: 'date', numeric: true, disablePadding: false, label: 'Date' },
    { id: 'typeId', numeric: true, disablePadding: false, label: 'Type' },
];

function ExpenseTableHead(props: ExpenseTableHeadProps) {
    const {
        classes,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort
    } = props;

    const createSortHandler = (property: keyof Expense) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };


    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === 'light'
                ? {
                    color: theme.palette.secondary.main,
                    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                }
                : {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.secondary.dark,
                },
        title: {
            flex: '1 1 100%',
        },
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }),
);

interface ExpenseTableToolbarProps {
    selected: number[],
    selectedExpenses: Expense[],
    onOpenSnackbar: (type: Color, message: string) => void
    onRefreshData: (page: number, turnOffLoading: boolean) => Promise<void>
    setSelectedItems: Dispatch<SetStateAction<number[]>>
}

const ExpenseTableToolbar = (props: ExpenseTableToolbarProps) => {
    const classes = useToolbarStyles();
    const {
        selected,
        selectedExpenses,
        onOpenSnackbar,
        onRefreshData,
        setSelectedItems } = props;
    const router = useRouter()
    const [updateData, setUpdateData] = useLocalStorage<Expense>('updateDataExpense', {
        id: 0,
        name: "",
        typeId: 0,
        price: 0,
        date: new Date(),
    })
    const numSelected = selected.length;

    const handleAddClick = () => {
        router.push('/expense/create')
    }
    const handleEditClick = () => {
        if (numSelected > 1) {
            onOpenSnackbar('error', 'please only choose 1 row when editing')
        } else {
            setUpdateData(selectedExpenses[0])
            router.push('/expense/update')
        }
    }
    const handleDeleteClick = async () => {
        const result = await deleteBulkExpense(selected)
        if (result.success) {
            await onRefreshData(1, false)
            setSelectedItems([])
            onOpenSnackbar('success', 'Delete expenses success')
        }
        else onOpenSnackbar('error', `Delete expenses failed, ${result.message}`)
    }

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Plutus
                </Typography>
            )}
            {numSelected > 0 ? (
                <Fragment>
                    <Tooltip title="Edit">
                        <IconButton aria-label="edit" onClick={handleEditClick}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete" onClick={handleDeleteClick}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Fragment>
            ) : (
                <Tooltip title="Add New Expense">
                    <IconButton aria-label="add expense" onClick={handleAddClick}>
                        <AddBoxIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 750,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
        loadingIndicator: {
            marginLeft: '50%',
            left: '-20',
        }
    }),
);

type ExpenseTableProps = {
    updateAlertMsg: string
    totalData: number
    expenses: Expense[]
    page: number
    rowsPerPage: number
    loadingData: boolean
    handleChangePage: (event: unknown, newPage: number) => void
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleRefreshData: (page: number, turnOffLoading: boolean) => Promise<void>
}

export const ExpenseTable = (props: ExpenseTableProps) => {
    const classes = useStyles()
    const {
        updateAlertMsg,
        totalData,
        expenses,
        page,
        rowsPerPage,
        loadingData,
        handleChangePage,
        handleChangeRowsPerPage,
        handleRefreshData
    } = props

    const [open, setOpen] = useState<boolean>(false);
    const [msg, setMessage] = useState<string>('');
    const [severity, setSeverity] = useState<Color>('success');
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<keyof Expense>('date');
    const [selected, setSelected] = useState<number[]>([]);
    const [selectedExpenses, setSelectedExpenses] = useState<Expense[]>([]);
    const [dense, setDense] = useState(false);

    useEffect(() => {
        if (updateAlertMsg != undefined && updateAlertMsg.length != 0)
            openSnackbar('success', updateAlertMsg)
    }, [updateAlertMsg]);
    const isSelected = (id: number) => selected.indexOf(id) !== -1;
    const openSnackbar = (type: Color, message: string) => {
        setMessage(message)
        setSeverity(type)
        setOpen(true)
    }
    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Expense) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = expenses.map((n) => n.id);
            setSelected(newSelecteds);
            setSelectedExpenses(expenses)
            return;
        }
        setSelected([]);
    };
    const handleRowClick = (event: React.MouseEvent<unknown>, expense: Expense) => {
        const selectedIndex = selected.indexOf(expense.id);
        let newSelected: number[] = [];
        let newSelectedExpenses: Expense[] = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, expense.id);
            newSelectedExpenses = newSelectedExpenses.concat(selectedExpenses, expense);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            newSelectedExpenses = newSelectedExpenses.concat(selectedExpenses.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            newSelectedExpenses = newSelectedExpenses.concat(selectedExpenses.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
            newSelectedExpenses = newSelectedExpenses.concat(
                selectedExpenses.slice(0, selectedIndex),
                selectedExpenses.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
        setSelectedExpenses(newSelectedExpenses);
    };
    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };
    const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Fragment>
            <Paper className={classes.paper}>
                <ExpenseTableToolbar
                    selected={selected}
                    selectedExpenses={selectedExpenses}
                    onOpenSnackbar={openSnackbar}
                    onRefreshData={handleRefreshData}
                    setSelectedItems={setSelected}
                />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <ExpenseTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={expenses.length}
                        />
                        <TableBody>
                            {loadingData
                                ? <TableRow>
                                    <TableCell colSpan={5}>
                                        <CircularProgress className={classes.loadingIndicator} />
                                    </TableCell>
                                </TableRow>
                                : stableSort(expenses, getComparator(order, orderBy))
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `expense-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleRowClick(event, row)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </TableCell>
                                                <TableCell component="th" id={labelId} scope="row" padding="none">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="right">{currencyFormatter.format(row.price)}</TableCell>
                                                <TableCell align="right">{formatDateSimple(row.date)}</TableCell>
                                                <TableCell align="right">{EXPENSE_TYPE[row.typeId]}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={TABLE_ROW_PER_PAGE_OPTION}
                    component="div"
                    count={totalData}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
            <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={severity}>
                    {msg}
                </Alert>
            </Snackbar>
        </Fragment>
    )
}

export default ExpenseTable