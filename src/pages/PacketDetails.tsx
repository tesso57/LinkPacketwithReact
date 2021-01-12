import React, {useEffect, useState} from 'react'
import {RouteComponentProps} from "react-router";
import {db, firebase} from '../firebase';
import {Packet, Tag, User} from "../utils/types";

type UrlProps = {} & RouteComponentProps<{ uid: string }>

const PacketDetails: React.FC<UrlProps> = (props) => {
    const [packet, setPacket] = useState<Packet | undefined>(undefined);
    useEffect(() => {
        console.log('rendering...');
//        if (props.match.params.uid === undefined) return;
        console.log('defined' + props.match.params.uid);
        const docRef = db.collection('packets').doc('QNTSF87b1D3HEfMwhgHk');
        const doc = docRef.get().then(doc => {
            console.log('in doc');
            if (doc.exists) {
                console.log(doc.data());
                setPacket(doc.data() as Packet)
            } else {
                console.log("not found");
            }
        })
    }, [props.match.params.uid]);
    return (<>
        <div>
            {packet?.title}
        </div>
    </>)
};

export default PacketDetails;
