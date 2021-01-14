import React, { useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../utils/auth/AuthProvider';
import {Toolbar, Button, IconButton, Dialog, DialogTitle, DialogActions} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import styles from './Header.module.scss';
import titleURL from '../../assets/title.png';
import {useHistory, useLocation} from 'react-router-dom';

const StyledButton = withStyles({
    root: {
        margin: "0 0 0 auto",
        color: "white",
        backgroundColor: "#F6B40D",
        borderRadius: "1.125rem",
    }
})(Button);

const YesNoDialog: React.FunctionComponent<{ msg: string, isOpen: boolean, doYes: () => void, doNo: () => void }>
    = ({msg, isOpen, doYes, doNo}) => {

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        setOpen(isOpen)
    }, [isOpen])

    return (
        <div>
            <Dialog
                open={open}
                keepMounted
                onClose={() => doNo()}
                aria-labelledby="common-dialog-title"
                aria-describedby="common-dialog-description"
            >
                <DialogTitle>
                    {msg}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => doNo()} style={{ color:`#F6B40D` }}>
                        No
                    </Button>
                    <Button onClick={() => doYes()} variant="contained" style={{ color:`#fff`,backgroundColor:`#F6B40D` }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

const Header: React.FC = () => {
    const {currentUser,login,logout} = useContext(AuthContext)
    const history = useHistory();
    const location = useLocation();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        console.log("render")
    }, [location]);

    const logoutAndGoTop = (callback: () => void) => () => {
        callback();
        setIsDialogOpen(false);
        history.push('/');
    };
    return (
        <>
            <YesNoDialog msg={'サインアウトしますか？'} isOpen={isDialogOpen} doYes={logoutAndGoTop(logout)}
                         doNo={() => setIsDialogOpen(false)}/>
            <Toolbar className={styles.Header}>
                <img className={styles.HeaderTitle} src={titleURL} alt="title" onClick={() => history.push('/')}/>
                <div className={styles.RightActionContainer}>
                {
                    (currentUser === null) ?
                        <StyledButton className={styles.HeaderButton} variant="contained" onClick={login}
                                      disableElevation>SIGNIN</StyledButton> :
                        (history.location.pathname.includes(`users/${currentUser.id}`)) ?
                            <StyledButton className={styles.HeaderButton} variant="contained"
                                          onClick={() => setIsDialogOpen(true)}
                                          disableElevation>SIGNOUT</StyledButton> :
                            <IconButton onClick={() => history.push(`users/${currentUser.id}`)} >
                                <img src={currentUser.photoUrl || ""} alt="user-icon" className={styles.HeaderIcon}/>
                            </IconButton>
                }
                </div>
            </Toolbar>
        </>
    );
};


export default Header;
