import React, { FC, useState, useEffect, useContext, Suspense, useCallback } from 'react';
import { RouteComponentProps } from "react-router";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import { Button } from '@material-ui/core';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import BookmarkList from '../components/BookmarkList';
import PageContainer from '../components/Layout/PageContainer';
import { Packet, User } from '../utils/types/index';
import { AuthContext } from '../utils/auth/AuthProvider';

type urlProps = {} & RouteComponentProps<{packetId : string}>;

const fetchPacket = (packetId: string) => {
  return db.collection('packets').doc(packetId).get()
}

type InfoType = {
  packet: Packet | undefined,
  packetOwner: User | undefined,
};

let infoCache: InfoType | undefined;

const getInfo = (packetId: string): InfoType => {
  if(infoCache !== undefined) return infoCache;

  const promise = fetchPacket(packetId).then((doc) => {
    if(doc.exists) {
      return doc.data() as Packet;
    }
    else {
      return undefined;
    }
  }).then((packet: Packet | undefined) => {
    if(packet !== undefined) {
      packet.userRef.get().then((doc) => {
        if(doc.exists) {
          infoCache = { packet: packet, packetOwner: doc.data() as User};
        }
        else {
          infoCache = { packet: packet, packetOwner: undefined}
        }
      });
    }
  });

  throw promise;
};

const DataLoading: FC = () => (
  <p>loading...</p>
);

const EditPacketPage: FC<urlProps> = (props) => {
  const packetId = props.match.params.packetId;
  const history = useHistory();
  const [packet, setPacket] = useState<Packet | undefined>(undefined);
  const [message, setMessage] = useState<string>('');
  const [packetErrorAlert, setPacketErrorAlert] = useState<string | undefined>(undefined);
  const [edited, setEdited] = useState<boolean>(false);
  const auth = useContext(AuthContext);
  const info: InfoType = getInfo(packetId);

  const save = async () => {
    if(packet === undefined) return;
    else if(packet.urls.length === 0) setPacketErrorAlert("No bookmarks have been added!");
    if(packetId.length < 19) return;
    setMessage("auto save in progress...");
    const docRef = db.collection('packets').doc(packetId);
    await docRef.update(packet);
    if(packet.urls.length !== 0) setPacketErrorAlert(undefined);
    setMessage("saved successfully!");
    setEdited(true);
  };
  const saveCallback = useCallback(save, [packet, packetId]);

  const goMyPage = async () => {
    if(!edited) {
      if(packetId.length < 19) return;
      const docRef = db.collection('packets').doc(packetId);
      const userPromise = auth.currentUserRef?.get().then(async (doc) => {
        if(doc.exists) {
          const user = doc.data() as User;
          user.packetRefs = user.packetRefs.filter((packetRef) => packetRef.id !== docRef.id);
          await auth.currentUserRef?.update(user);
          if(auth.setCurrentUser !== undefined) auth.setCurrentUser(user);
        }
      });
      const deletePromise = docRef.delete();
      await Promise.all([userPromise, deletePromise]);
    }
    await saveCallback();
    infoCache = undefined;
    history.push("/users/" + auth.currentUser?.id);
  };

  useEffect(() => {
    if(info.packet === undefined) history.push('/');
    else if(info.packetOwner === undefined || info.packetOwner.id !== auth.currentUser?.id) history.push('/packet/' + packetId);
    else {
      saveCallback();
      if(info.packet.urls.length !== 0) setEdited(true);
      if(packet === undefined) setPacket(info.packet);
    }
  }, [info, packet, packetId, auth.currentUser?.id, history, saveCallback]);

  return (
    <PageContainer>
      <Button size="large" startIcon={<KeyboardReturnIcon />} onClick={goMyPage}>マイページに戻る</Button>
      { (packet !== undefined) ? <BookmarkList packet={packet} save={saveCallback} message={message} onChange={setPacket} packetErrorAlert={packetErrorAlert} setPacketErrorAlert={setPacketErrorAlert} editable /> : <></> }
    </PageContainer>
  );
};

const EditPacket: FC<urlProps> = (props) => (
  <Suspense fallback={<DataLoading />}>
    <EditPacketPage {...props} />
  </Suspense>
)

export default EditPacket;