import React, { FC } from 'react';
import BookmarkCard from './BookmarkCard';
import styles from './BookmarkCardList.module.scss';

interface Card {
    title: string,
    description: string,
    url: string;
}

const BookmarkCardList: FC<{ cards: Card[] }> = ({ cards }) => (
    <div className={styles.Container}>{cards.map((card) => <BookmarkCard title={card.title} description={card.description} url={card.url} />)}</div>
);

export default BookmarkCardList;