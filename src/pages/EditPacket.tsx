import React, { FC, useState, useEffect, useContext } from 'react';
import { RouteComponentProps } from "react-router";
import { useHistory, Link } from "react-router-dom";
import { db } from "../firebase";
import { Button } from '@material-ui/core';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import BookmarkList from '../components/BookmarkList';
import PageContainer from '../components/Layout/PageContainer';
import { Packet } from '../utils/types/index';
import { AuthContext } from '../utils/auth/AuthProvider';

type urlProps = {} & RouteComponentProps<{packetId : string}>;

const EditPacket: FC<urlProps> = (props) => {
  const packetId = props.match.params.packetId;
  const history = useHistory();
  const [packet, setPacket] = useState<Packet | undefined>(undefined);
  const auth = useContext(AuthContext);

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
      <Link to={"/users/" + auth.currentUser?.id}>
        <Button size="large" startIcon={<KeyboardReturnIcon />}>マイページに戻る</Button>
      </Link>
      { (packet !== undefined) ? <BookmarkList packet={packet} save={save} onChange={setPacket} editable /> : <></> }
    </PageContainer>
  );
};

export default EditPacket;