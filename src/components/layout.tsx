import {
    AppBar,
    Collapse,
    Container,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    makeStyles,
    Toolbar,
    Typography
} from "@material-ui/core";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AddIcon from '@material-ui/icons/Add';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from "react";

type PropType = {
    children: JSX.Element
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        border: '1px solid black'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));


const Layout = (props: PropType) => {
    const classes = useStyles();
    const [openExpense, setOpenExpense] = useState(false);
    const [openIncome, setOpenIncome] = useState(false);

    const handleClickExpense = () => {
        setOpenExpense(!openExpense);
    };
    const handleClickIncome = () => {
        setOpenIncome(!openIncome);
    };

    return (
        <Container maxWidth="xl" disableGutters={true}>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            Plutus
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <List>
                            <Link href="/" passHref>
                                <ListItem button key='Home'>
                                    <ListItemIcon><HomeIcon /></ListItemIcon>
                                    <ListItemText primary='Home' />
                                </ListItem>
                            </Link>
                            <ListItem button onClick={handleClickExpense}>
                                <ListItemIcon>
                                    <AttachMoneyIcon />
                                </ListItemIcon>
                                <ListItemText primary="Expense" />
                                {openExpense ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={openExpense} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <Link href="expense" passHref>
                                        <ListItem button className={classes.nested}>
                                            <ListItemIcon>
                                                <ListIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="All Expense" />
                                        </ListItem>
                                    </Link>
                                    <Link href="/expense/create" passHref>
                                        <ListItem button className={classes.nested}>
                                            <ListItemIcon>
                                                <AddIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Create Expense" />
                                        </ListItem>
                                    </Link>
                                </List>
                            </Collapse>
                            <ListItem button onClick={handleClickIncome}>
                                <ListItemIcon>
                                    <AccountBalanceWalletIcon />
                                </ListItemIcon>
                                <ListItemText primary="Income" />
                                {openIncome ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={openIncome} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <Link href="/income" passHref>
                                        <ListItem button className={classes.nested}>
                                            <ListItemIcon>
                                                <ListIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="All Income" />
                                        </ListItem>
                                    </Link>
                                    <Link href="/income/create" passHref>
                                        <ListItem button className={classes.nested}>
                                            <ListItemIcon>
                                                <AddIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Create Income" />
                                        </ListItem>
                                    </Link>
                                </List>
                            </Collapse>
                        </List>
                    </div>
                </Drawer>
                <main className={classes.content}>
                    <Toolbar />
                    {props.children}
                </main>
            </div>

        </Container>
    )
}

Layout.propTypes = {
    children: PropTypes.element.isRequired
}

export default Layout