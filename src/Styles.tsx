import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
    appBar: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(610)]: {
            width: 610,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(610)]: {
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
// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;