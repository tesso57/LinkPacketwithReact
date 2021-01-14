import React, {FC, useContext, useEffect} from 'react';
import {AuthContext} from '../../utils/auth/AuthProvider';
import {Toolbar, Button, IconButton} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import styles from './Header.module.scss';
import titleURL from '../../assets/title.png';
import {useHistory} from 'react-router-dom';

const StyledButton = withStyles({
    root: {
        margin: "0 0 0 auto",
        color: "white",
        backgroundColor: "#F6B40D",
        borderRadius: "1.125rem",
    }
})(Button);

const Header: FC = () => {
    const auth = useContext(AuthContext);
    const user = auth.currentUser;
    const login = auth.login;
    const logout = auth.logout;
    const history = useHistory();
    useEffect(() => {
    }, [history]);
    return (
        <Toolbar className={styles.Header}>
            <img className={styles.HeaderTitle} src={titleURL} alt="title" onClick={() => history.push('/')}/>
            {
                (user === null) ?
                    <StyledButton className={styles.HeaderButton} variant="contained" onClick={login}
                                  disableElevation>SIGNIN</StyledButton> :
                    (history.location.pathname.includes(user.id)) ? <StyledButton className={styles.HeaderButton} variant="contained" onClick={logout}
                                           disableElevation>SIGNOUT</StyledButton> :
                        <IconButton onClick={() => history.push(`users/${user?.id}`)} className={styles.HeaderIcon}>
                            <img src={user.photoUrl || ""} alt="user-icon" className={styles.HeaderIcon}/>
                        </IconButton>
            }
        </Toolbar>
    );
};


export default Header;
