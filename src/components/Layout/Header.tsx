import React, { useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../utils/auth/AuthProvider';
import {Toolbar, Button, IconButton} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import styles from './Header.module.scss';
import titleURL from '../../assets/title.png';
import {useHistory, useLocation} from 'react-router-dom';
import YesNoDialog from './YesNoDialog'

const StyledButton = withStyles({
    root: {
        margin: "0 0 0 auto",
        color: "white",
        backgroundColor: "#F6B40D",
        borderRadius: "1.125rem",
    }
})(Button);

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
