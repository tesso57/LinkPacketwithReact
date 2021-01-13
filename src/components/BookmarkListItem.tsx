import React, { FC } from 'react';
import { Paper, ListItem, ListItemText } from '@material-ui/core';
import { URL } from '../utils/types/url';
import styles from './BookmarkListItem.module.scss';

const onClickItem = (link: string) => () => window.location.replace(link);

const BookmarkListItem: FC<{ url: URL }> = ({ url }) => (
  <Paper elevation={2}>
    <ListItem className={styles.List} button>
      <ListItemText primary={url.title} secondary={url.link} onClick={onClickItem(url.link)}/>
    </ListItem>
  </Paper>
);

export default BookmarkListItem;