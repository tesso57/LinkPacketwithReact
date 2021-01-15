import React, {useEffect, useState} from 'react'
import {Packet} from "../utils/types";
import {db} from "../firebase";
import PacketCardList from "../components/PacketCardList";
import PageContainer from '../components/Layout/PageContainer';


const View: React.FC = () => {
  const [packets, setPackets] = useState<Packet[] | undefined>(undefined);

  useEffect(() => {
    const tempPackets = new Array<Packet>();
      db.collection('packets').get().then(snapshot =>
        snapshot.forEach(doc => tempPackets.push(doc.data() as Packet))
      ).then(() => setPackets(tempPackets))
    }, []);
  return (
    <PageContainer>
      <PacketCardList packets={packets ?? new Array<Packet>()}/>
    </PageContainer>
  );
};

export default View;
