import React, { FC } from 'react';
import PacketCard from './PacketCard';
import { Packet } from '../utils/types/packet';
import styles from './BookmarkCardList.module.scss';

const BookmarkCardList: FC<{ packets: Packet[] }> = ({ packets }) => (
    <div className={styles.Container}>{packets.map((packet) => <PacketCard title={packet.title} url="" />)}</div>
);

export default BookmarkCardList;