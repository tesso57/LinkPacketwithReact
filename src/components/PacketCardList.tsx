import React, { FC,useState ,useContext} from 'react';
import PacketCard from './PacketCard';
import { Packet,User } from '../utils/types';
import styles from './PacketCardList.module.scss';
import { AuthContext } from '../utils/auth/AuthProvider';
import {db} from '../firebase'
import YesNoDialog from './Layout/YesNoDialog'


const PacketCardList: FC<{ packets: Packet[] }> = ({ packets }) => {
    const [deleteTarget, setDeleteTarget] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const {currentUser,currentUserRef,setCurrentUser} = useContext(AuthContext);
    const deletePackets = async () => {
            if (deleteTarget === '' || currentUserRef === undefined || currentUser === null || setCurrentUser === undefined) return;
            //パケットを消す
            const docRef = db.collection('packets').doc(deleteTarget);
            await docRef.delete().catch((err) => console.log(err));
            //ユーザーのパケットレフを消す
            const deletedUserRefs = currentUser.packetRefs.filter((val) => (!val.isEqual(docRef)));
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
        <>
        <YesNoDialog msg={'パケットを削除しますか？'} isOpen={isDialogOpen} doYes={deletePackets}
                         doNo={() => setIsDialogOpen(false)}/>
        <div className={styles.Container}>
            {packets.map((packet) => <PacketCard key={packet.id} packet={packet} setDeleteTarget={setDeleteTarget} setIsDialogOpen={setIsDialogOpen}/>)}
        </div>
        </>
    );
}



export default PacketCardList;
