import React, { FC } from 'react';
import { Container, List } from '@material-ui/core';
import { Packet } from '../utils/types/packet';
import BookmarkListItem from './BookmarkListItem';
import styles from './BookmarkList.module.scss';

const BookmarkList: FC<{ packet: Packet }> = ({ packet }) => (
  <Container maxWidth="lg">
      <h3>{ packet?.title }</h3>
      <List component="nav" className={styles.Container}>
          { packet?.urls.map((url) => <BookmarkListItem url={url} />) }
      </List>
  </Container>
);

export default BookmarkList;