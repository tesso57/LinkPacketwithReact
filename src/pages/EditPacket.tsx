import React, { FC, useState, useEffect } from 'react';
import { RouteComponentProps } from "react-router";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import BookmarkList from '../components/BookmarkList';
import PageContainer from '../components/Layout/PageContainer';
import { Packet } from '../utils/types/index';

type urlProps = {} & RouteComponentProps<{packetId : string}>;

const EditPacket: FC<urlProps> = (props) => {
  const packetId = props.match.params.packetId;
  const history = useHistory();
  const [packet, setPacket] = useState<Packet | undefined>(undefined);

  const save = async () => {
    if(packet === undefined) return;
    const docRef = db.collection('packets').doc(packetId);
    await docRef.update(packet);
  };

  useEffect(() => {
    const docRef = db.collection('packets').doc(packetId);
      docRef.get().then((doc) => {
        if(doc.exists) {
          const p = doc.data() as Packet;
          setPacket(p);
        }
        else {
          history.push('/')
        }
    });
  },[history, packetId]);

  return (
    <PageContainer>
      { (packet !== undefined) ? <BookmarkList packet={packet} save={save} onChange={setPacket} editable /> : <></> }
    </PageContainer>
  );
};

export default EditPacket;