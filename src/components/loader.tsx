import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, useTheme } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    progress: {
        color: theme.palette.secondary.main,
        width: '6rem !important',
        height: '6rem !important'
    },
    center: {
        display: ' flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    }
}))

const Loader = () => {
    const theme = useTheme()
    const classes = useStyles(theme)
    return (
        <div className={classes.center}>
            <CircularProgress className={classes.progress} />
        </div>
    )
}

export default Loader