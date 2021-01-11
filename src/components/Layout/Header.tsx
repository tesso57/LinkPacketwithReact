import React, { FC } from 'react';
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

export const Header: FC = () => {
  return (
    <Toolbar className={styles.Header}>
      <img className={styles.HeaderTitle} src={titleURL} alt="title"></img>
      <StyledButton className={styles.HeaderButton} variant="contained" disableElevation>SIGNIN</StyledButton>
    </Toolbar>
  );
};