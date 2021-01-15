import React, { FC } from 'react';
import PacketCard from './PacketCard';
import { Packet } from '../utils/types/packet';
import styles from './PacketCardList.module.scss';

const PacketCardList: FC<{ packets: Packet[] }> = ({ packets }) => (
    <div className={styles.Container}>{packets.map((packet) => <PacketCard key={packet.id} packet={packet} />)}</div>
);


export default PacketCardList;
