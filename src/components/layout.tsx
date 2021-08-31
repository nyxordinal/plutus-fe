import useAuth from "@auth";
import {
    AppBar,
    Button, Container,
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
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import HomeIcon from '@material-ui/icons/Home';
import Link from 'next/link';
import PropTypes from 'prop-types';

type PropType = {
    children: JSX.Element
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerTitle: {
        flexGrow: 1,
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
    const { logout } = useAuth()
    const classes = useStyles();

    return (
        <Container maxWidth="xl" disableGutters={true}>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" noWrap className={classes.drawerTitle}>
                            Plutus
                        </Typography>
                        <Button color="inherit" onClick={logout}>Logout</Button>
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
                                <ListItem button key='home'>
                                    <ListItemIcon><HomeIcon /></ListItemIcon>
                                    <ListItemText primary='Home' />
                                </ListItem>
                            </Link>
                            <Link href="/expense" passHref>
                                <ListItem button key='expense'>
                                    <ListItemIcon><AttachMoneyIcon /></ListItemIcon>
                                    <ListItemText primary="Expense" />
                                </ListItem>
                            </Link>
                            <Link href="/income" passHref>
                                <ListItem button key='income'>
                                    <ListItemIcon><AccountBalanceWalletIcon /></ListItemIcon>
                                    <ListItemText primary="Income" />
                                </ListItem>
                            </Link>
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