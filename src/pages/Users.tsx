import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from "react-router";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import { User,Packet } from '../utils/types';
import styles from './Users.module.scss'
import PageContainer from '../components/Layout/PageContainer'
import PacketCardList from '../components/PacketCardList';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';

type urlProps = {} & RouteComponentProps<{userId : string}>;

const Users : React.FC<urlProps> = (props) => {
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
                        <h1 className={styles.title}>自分のパケット</h1>
                        <PacketCardList packets={ownPackets}/>
                    </>
                }
                { nonOwnPacketFlag &&
                    <>
                        <h2 className={styles.tips}>パケットを作成しましょう！</h2>
                    </>
                }
                    
                {
                    (subscribePackets !== undefined && !nonSubscribePacketFlag) &&
                    <>
                        <h1 className={styles.title}>いいねしたパケット</h1>
                        <PacketCardList packets={subscribePackets}/>
                    </>
                }
            </div>
            <IconButton >
                <AddCircleIcon style={{ fontSize: 100,color: `#F6B40D`}} />
            </IconButton>
        </PageContainer>
    )
}

export default Users;