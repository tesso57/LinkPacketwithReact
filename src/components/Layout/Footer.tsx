import React, { FC } from 'react';
import { Toolbar } from '@material-ui/core';
import styles from './Footer.module.scss';
import faviconURL from '../../favicon.png';

const Footer: FC = () => (
  <Toolbar className={styles.Footer}>
    <div className={styles.FooterElements}>
      <img className={styles.FooterImage} src={faviconURL} alt="favicon"></img>
      <p className={styles.FooterText}>© 2020LinkPacket</p>
    </div>
  </Toolbar>
);

export default Footer;