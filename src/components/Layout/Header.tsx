import React, { FC, useContext } from 'react';
import { AuthContext } from '../../utils/auth/AuthProvider';
import { Toolbar, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from './Header.module.scss';
import titleURL from '../../assets/title.png';

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
  return (
    <Toolbar className={styles.Header}>
      <img className={styles.HeaderTitle} src={titleURL} alt="title"></img>
      {(user === null) ? <StyledButton className={styles.HeaderButton} variant="contained" onClick={login} disableElevation>SIGNIN</StyledButton> : <img className={styles.HeaderIcon} src={user.photoUrl || ""} alt="user-icon"></img>}
    </Toolbar>
  );
};


export default Header;