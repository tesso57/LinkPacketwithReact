import React, {useEffect, useState} from 'react'
import {Packet} from "../utils/types";
import {db} from "../firebase";
import PacketCardList from "../components/PacketCardList";
import PageContainer from '../components/Layout/PageContainer';
import styles from './View.module.scss'

const View: React.FC = () => {
  const [packets, setPackets] = useState<Packet[] | undefined>(undefined);

  useEffect(() => {
    const tempPackets = new Array<Packet>();
      db.collection('packets').orderBy('postedDate', 'desc').limit(18).get().then(snapshot =>
        snapshot.forEach(doc => tempPackets.push(doc.data() as Packet))
      ).then(() => setPackets(tempPackets))
    }, []);
  return (
    <PageContainer>
      <h1 className={styles.title}>最近のパケット</h1>
      <PacketCardList packets={packets ?? new Array<Packet>()}/>
    </PageContainer>
  );
};

export default View;
