import React, { useEffect, useState, useContext } from 'react'
import { RouteComponentProps } from "react-router";
import { useHistory } from "react-router-dom";
import { db, firebase } from "../firebase";
import { User,Packet } from '../utils/types';
import { AuthContext } from '../utils/auth/AuthProvider'
import styles from './Users.module.scss'
import PageContainer from '../components/Layout/PageContainer'
import PacketCardList from '../components/PacketCardList';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

type urlProps = {} & RouteComponentProps<{userId : string}>;

const Users : React.FC<urlProps> = (props) => {
    const {currentUser,setCurrentUser, currentUserRef} = useContext(AuthContext);
    const history = useHistory();
    const [user, setUser] = useState<User | undefined>(undefined);
    const [ownPackets, setOwnPackets] = useState<Packet[] | undefined>(undefined);
    const [subscribePackets, setSubscribePackets] = useState<Packet[] | undefined>(undefined);
    const [nonOwnPacketFlag, setNonOwnPacketFlag] = useState<boolean>(false);
    const [nonSubscribePacketFlag, setNonSubscribePacketFlag] = useState<boolean>(false);

    useEffect(() => {
        const docRef = db.collection('users').doc(props.match.params.userId);
        docRef.get().then((doc) => {
            if(doc.exists){
                //Userを取得
                const tmpUser = doc.data() as User
                setUser(tmpUser);

                //自分のPacketを取得
                let tmpOwnPackets : Packet[] = [];
                Promise.all(tmpUser.packetRefs.map(
                    async packet => {
                        const packetRef = await packet.get()
                        const packetData = packetRef.data() as Packet
                        tmpOwnPackets.push(packetData)
                    }
                )).then(() => {
                    setOwnPackets(tmpOwnPackets)
                    if(tmpOwnPackets.length === 0){
                        setNonOwnPacketFlag(true)
                    }
                })

                //サブスクライブしたPacketを取得
                let tmpSubscribePackets : Packet[] = [];
                Promise.all(tmpUser.subscribePacketRefs.map(
                    async packet => {
                        const packetRef = await packet.get()
                        const packetData = packetRef.data() as Packet
                        tmpSubscribePackets.push(packetData)
                    }
                )).then(() => {
                    setSubscribePackets(tmpSubscribePackets)
                    if(tmpSubscribePackets.length === 0){
                        setNonSubscribePacketFlag(true)
                    }
                })

            }else{
                history.push('/')
            }
        })
    },[history, props.match.params.userId])

    const createButton = () => {
        console.log('render');
        //新規bookmarkを発行
        if (currentUserRef === undefined || currentUser === null || setCurrentUser === undefined) return
        //packetDataを新既発行
        const initPacketData : Packet = {
            id : '',
            userRef : currentUserRef,
            urls: [],
            title: '無題のパケット',
            postedDate: firebase.firestore.Timestamp.fromDate(new Date())
        }
        
        db.collection('packets').add(initPacketData).then((docRef) => {
            //userをupdate
            const packetRef = db.collection('packcets').doc(docRef.id);
            currentUserRef.update({
                packetRefs : [...currentUser.packetRefs, packetRef]
            })
            //dbをupdate
            db.collection('packets').doc(docRef.id).update({
                id : docRef.id
            })
            const newCurrentUser: User = {
                id : currentUser.id,
                packetRefs : [...currentUser.packetRefs,packetRef],
                subscribePacketRefs: currentUser.subscribePacketRefs,
                displayName: currentUser.displayName,
                photoUrl: currentUser.photoUrl
            }
            setCurrentUser(newCurrentUser);
            history.push(`/edit/${docRef.id}`)
        })
    }

    return(
        <PageContainer>
            <div className={styles.userContainer}>
                {user !== undefined &&    
                    <>
                        <img className={styles.icon} src={user.photoUrl || ""} alt={'user Icon'}/>
                        <span className={styles.username}>{user.displayName}</span>
                    </>
                 }
            </div>
            <div>
                {
                    ownPackets !== undefined &&
                    <>
                        <h1 className={styles.title}>パケット</h1>
                        <PacketCardList packets={ownPackets}/>
                    </>
                }
                { nonOwnPacketFlag &&
                        <h2 className={styles.tips}>パケットを作成しましょう！</h2>
                }
                    
                {
                    (subscribePackets !== undefined && !nonSubscribePacketFlag) &&
                    <>
                        <h1 className={styles.title}>リンクしたパケット</h1>
                        <PacketCardList packets={subscribePackets}/>
                    </>
                }
            </div>
            <div className={styles.createButton}>
                <IconButton onClick={createButton}>
                    <AddIcon style={{ fontSize: 100,color:`#fff`,backgroundColor:`#F6B40D`,borderRadius:`50%`}} />
                </IconButton>
            </div>
        </PageContainer>
    )
}

export default Users;
