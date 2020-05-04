import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
        "display": 'flex',
        "flex-direction": 'column',
        "margin": 0,
        "padding": 0,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(610 + theme.spacing(2) * 2)]: {
            width: 610,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(610 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(5),
            marginBottom: theme.spacing(5),
            padding: theme.spacing(3),
        },
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginLeft: theme.spacing(0.5),
    },
    heading: {
        marginLeft: theme.spacing(0.5),
    },
    spacing: {
        marginTop: theme.spacing(1),
    }
}));
export default useStyles;