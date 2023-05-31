import useAuth from "@auth";
import {
    AppBar, Button, Container,
    CssBaseline,
    Divider,
    Drawer, IconButton,
    List,
    ListItem,
    Toolbar,
    Typography
} from "@material-ui/core";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Theme, createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from "react";

type PropType = {
    children: JSX.Element
}

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
    }),
);

const Layout = (props: PropType) => {
    const { logout } = useAuth()
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Container maxWidth="xl" disableGutters={true}>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Plutus
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <Divider />
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
                        <Link href="/setting" passHref>
                            <ListItem button key='setting'>
                                <ListItemIcon><SettingsIcon /></ListItemIcon>
                                <ListItemText primary="Setting" />
                            </ListItem>
                        </Link>
                        <ListItem button key='income'>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={logout}
                                startIcon={<ExitToAppIcon />}
                            >
                                Logout
                            </Button>
                        </ListItem>
                    </List>
                </Drawer>
                <main className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}>
                    <div className={classes.drawerHeader} />
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