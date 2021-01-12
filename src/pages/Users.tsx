import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from "react-router";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import { User,Packet } from '../utils/types';
import styles from './Users.module.scss'
import pageContainer from '../components/Layout/PageContainer'
import Header from '../components/Layout/Header'
import {AuthProvider} from '../utils/auth/AuthProvider'

type urlProps = {} & RouteComponentProps<{userId : string}>;

const Users : React.FC<urlProps> = (props) => {
    const history = useHistory();
    const [user, setUser] = useState<User | undefined>(undefined);
    const [ownPackets, setOwnPackets] = useState<Packet[] | undefined>(undefined);
    const [subscribePackets, setSubscribePackets] = useState<Packet[] | undefined>(undefined);

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
                })

            }else{
                history.push('/')
            }
        })
    },[history,props.match.params.userId])

    return(
        <AuthProvider>
            <pageContainer>
                
            </pageContainer>
        </AuthProvider>
        // <pageContainer>
        // <Header/>
        // {/* <div className={styles.userContainer}>
        //             {user !== undefined &&
        //                 <>
        //                     <img className={styles.icon} src={user.photoUrl || ""} alt={'user Icon'}/>
        //                     <span className={styles.username}>{user.displayName}</span>
        //                 </>
        //             }
        //         </div> */}
        // </pageContainer>
    )
}

export default Users;