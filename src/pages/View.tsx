import React, {useEffect, useState} from 'react'
import {Packet} from "../utils/types";
import {db} from "../firebase";
import {Container} from "@material-ui/core";
import PacketCardList from "../components/PacketCardList";
import PageContainer from '../components/Layout/PageContainer';


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
      <Container maxWidth={'md'}>
        <h3>Packet Gallery</h3>
          <PacketCardList packets={packets ?? new Array<Packet>()}/>
      </Container>
    </PageContainer>
  );
};

export default View;
