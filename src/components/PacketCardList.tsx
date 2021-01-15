import React, { FC } from 'react';
import PacketCard from './PacketCard';
import { Packet } from '../utils/types/packet';
import styles from './PacketCardList.module.scss';
import List from '@material-ui/core/List';

const PacketCardList: FC<{ packets: Packet[] }> = ({ packets }) => (
    <List className={styles.Container}>{packets.map((packet) => <PacketCard key={packet.id} packet={packet} />)}</List>
);


export default PacketCardList;
