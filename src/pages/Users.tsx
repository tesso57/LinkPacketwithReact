import React, { useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from "react-router";
import { useHistory } from "react-router-dom";
import { AuthContext } from '../utils/auth/AuthProvider';
import { db } from "../firebase";
import { User,Packet } from '../utils/types';

type urlProps = {} & RouteComponentProps<{userId : string}>;

const Users : React.FC<urlProps> = (props) => {
    const history = useHistory();
    const [packets, setPackets] = useState<Packet[] | undefined>(undefined);

    useEffect(() => {
        //packetを取得
        const docRef = db.collection('users').doc(props.match.params.userId);
        docRef.get().then((doc) => {
            if(doc.exists){
                const tmp = doc.data() as User
                let user  = tmp;
                // console.log(tmp);
                tmp.packetRefs.forEach( async packet => {
                    const packetData = await packet.get()
                    user.packetRefs = packetData.data()
                    console.log(packetData.data())
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