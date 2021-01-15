import React, { FC,useState ,useContext} from 'react';
import PacketCard from './PacketCard';
import { Packet,User } from '../utils/types';
import styles from './PacketCardList.module.scss';
import { AuthContext } from '../utils/auth/AuthProvider';
import {db} from '../firebase'

const PacketCardList: FC<{ packets: Packet[] }> = ({ packets }) => {
    const [deleteTarget, setDeleteTarget] = useState<string>('');
    const {currentUser,currentUserRef,setCurrentUser} = useContext(AuthContext);
    const deletePackets = async () => {
            if (deleteTarget !== '' || currentUserRef === undefined || currentUser === null || setCurrentUser === undefined) return;
            console.log(deleteTarget)
            //パケットを消す
            const docRef = db.collection('packets').doc(deleteTarget);
            await docRef.delete();
            //ユーザーのパケットレフを消す
            const deletedUserRefs = currentUser.packetRefs.filter((val) => (!val.isEqual(docRef)));
            console.log(deletedUserRefs)
            //ユーザーㇾプをアップデート
            await currentUserRef.update({
                packetRefs : deletedUserRefs
            })
            //カレントユーザーをアップデート
            const newCurrentUser: User = {
                        id : currentUser.id,
                        packetRefs : deletedUserRefs,
                        subscribePacketRefs: currentUser.subscribePacketRefs,
                        displayName: currentUser.displayName,
                        photoUrl: currentUser.photoUrl
                    }
            setCurrentUser(newCurrentUser);
    
            window.location.reload();
          };
    return (
        <div className={styles.Container}>{packets.map((packet) => <PacketCard key={packet.id} packet={packet} setDeleteTarget={setDeleteTarget}/>)}</div>
    );
}



export default PacketCardList;
