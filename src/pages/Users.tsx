import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from "react-router";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import { User,Packet } from '../utils/types';

type urlProps = {} & RouteComponentProps<{userId : string}>;

const Users : React.FC<urlProps> = (props) => {
    const history = useHistory();
    const [packets, setPackets] = useState<Packet[] | undefined>(undefined);

    useEffect(() => {
        //Userを取得
        const docRef = db.collection('users').doc(props.match.params.userId);
        docRef.get().then((doc) => {
            if(doc.exists){
                const tmp = doc.data() as User
                let tmpPackets : Packet[] = [];
                //Packetを取得
                Promise.all(tmp.packetRefs.map(
                    async packet => {
                        const packetRef = await packet.get()
                        const packetData = packetRef.data() as Packet
                        tmpPackets.push(packetData)
                    }
                )).then(() => {
                    setPackets(tmpPackets)
                })
            }else{
                history.push('/')
            }
        })
    },[history,props.match.params.userId])
    return(
        <></>
    )
}

export default Users;