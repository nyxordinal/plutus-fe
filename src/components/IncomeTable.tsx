import { TABLE_ROW_PER_PAGE_OPTION } from '@interface/constant';
import { Order } from '@interface/dto.interface';
import { Income } from '@interface/entity.interface';
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
import { deleteBulkIncome } from '@services/income.service';
import { currencyFormatter, formatDateSimple, useLocalStorage } from '@util';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { setIncomeMessage } from 'redux/general';
import { useAppDispatch } from 'redux/hooks';

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

interface IncomeTableHeadProps {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Income) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Income;
    label: string;
    numeric: boolean;
}

const headCells: HeadCell[] = [
    { id: 'source', numeric: false, disablePadding: true, label: 'Source' },
    { id: 'amount', numeric: true, disablePadding: false, label: 'Amount' },
    { id: 'date', numeric: true, disablePadding: false, label: 'Date' },
];

function IncomeTableHead(props: IncomeTableHeadProps) {
    const {
        classes,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort
    } = props;

    const createSortHandler = (property: keyof Income) => (event: React.MouseEvent<unknown>) => {
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

interface IncomeTableToolbarProps {
    selected: number[],
    selectedIncomes: Income[],
    onOpenSnackbar: (type: Color, message: string) => void
    onRefreshData: (page: number) => Promise<void>
    setSelectedItems: Dispatch<SetStateAction<number[]>>
}

const IncomeTableToolbar = (props: IncomeTableToolbarProps) => {
    const classes = useToolbarStyles();
    const {
        selected,
        selectedIncomes,
        onOpenSnackbar,
        onRefreshData,
        setSelectedItems } = props;
    const router = useRouter()
    const [updateData, setUpdateData] = useLocalStorage<Income>('updateDataIncome', {
        id: 0,
        source: "",
        amount: 0,
        date: new Date(),
    })
    const numSelected = selected.length;

    const handleAddClick = () => {
        router.push('/income/create')
    }
    const handleEditClick = () => {
        if (numSelected > 1) {
            onOpenSnackbar('error', 'please only choose 1 row when editing')
        } else {
            setUpdateData(selectedIncomes[0])
            router.push('/income/update')
        }
    }
    const handleDeleteClick = async () => {
        const result = await deleteBulkIncome(selected)
        if (result.success) {
            await onRefreshData(1)
            setSelectedItems([])
            onOpenSnackbar('success', 'Delete incomes success')
        }
        else onOpenSnackbar('error', `Delete incomes failed, ${result.message}`)
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
                <Tooltip title="Add New Income">
                    <IconButton aria-label="add income" onClick={handleAddClick}>
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

type IncomeTableProps = {
    updateAlertMsg: string
    totalData: number
    incomes: Income[]
    page: number
    rowsPerPage: number
    loadingData: boolean
    handleChangePage: (event: unknown, newPage: number) => void
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleRefreshData: (page: number) => Promise<void>
}

export const IncomeTable = (props: IncomeTableProps) => {
    const classes = useStyles()
    const {
        updateAlertMsg,
        totalData,
        incomes,
        page,
        rowsPerPage,
        loadingData,
        handleChangePage,
        handleChangeRowsPerPage,
        handleRefreshData
    } = props

    const dispatch = useAppDispatch()

    const [open, setOpen] = useState<boolean>(false);
    const [msg, setMessage] = useState<string>('');
    const [severity, setSeverity] = useState<Color>('success');
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<keyof Income>('date');
    const [selected, setSelected] = useState<number[]>([]);
    const [selectedIncomes, setSelectedIncomes] = useState<Income[]>([]);
    const [dense, setDense] = useState(true);

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
    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Income) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = incomes.map((n) => n.id);
            setSelected(newSelecteds);
            setSelectedIncomes(incomes)
            return;
        }
        setSelected([]);
    };
    const handleRowClick = (event: React.MouseEvent<unknown>, income: Income) => {
        const selectedIndex = selected.indexOf(income.id);
        let newSelected: number[] = [];
        let newSelectedIncomes: Income[] = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, income.id);
            newSelectedIncomes = newSelectedIncomes.concat(selectedIncomes, income);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            newSelectedIncomes = newSelectedIncomes.concat(selectedIncomes.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            newSelectedIncomes = newSelectedIncomes.concat(selectedIncomes.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
            newSelectedIncomes = newSelectedIncomes.concat(
                selectedIncomes.slice(0, selectedIndex),
                selectedIncomes.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
        setSelectedIncomes(newSelectedIncomes);
    };
    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };
    const handleCloseSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        dispatch(setIncomeMessage(''))
    };

    return (
        <Fragment>
            <Paper className={classes.paper}>
                <IncomeTableToolbar
                    selected={selected}
                    selectedIncomes={selectedIncomes}
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
                        <IncomeTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={incomes.length}
                        />
                        <TableBody>
                            {loadingData
                                ? <TableRow>
                                    <TableCell colSpan={5}>
                                        <CircularProgress className={classes.loadingIndicator} />
                                    </TableCell>
                                </TableRow>
                                : stableSort(incomes, getComparator(order, orderBy))
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `income-table-checkbox-${index}`;

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
                                                    {row.source}
                                                </TableCell>
                                                <TableCell align="right">{currencyFormatter.format(row.amount)}</TableCell>
                                                <TableCell align="right">{formatDateSimple(row.date)}</TableCell>
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

export default IncomeTable