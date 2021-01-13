import React, {useEffect, useState} from 'react'
import {Packet} from "../utils/types";
import {db} from "../firebase";
import {Container} from "@material-ui/core";
import PacketCardList from "../components/PacketCardList";


const View: React.FC = () => {
    const [packets, setPackets] = useState<Packet[] | undefined>(undefined);
    const japaneseDateStringFromDate = (date: Date) =>
        `${date.getMonth() + 1}月${date.getDate()}日`;

    useEffect(() => {
        const tempPackets = new Array<Packet>();
        db.collection('packets').get().then(snapshot =>
            snapshot.forEach(doc => tempPackets.push(doc.data() as Packet))
        ).then(() => setPackets(tempPackets))
    }, []);
    return (<>
        <Container maxWidth={'md'}>
            <h3>Packet Gallery</h3>
            <PacketCardList packets={packets ?? new Array<Packet>()}/>
        </Container>
    </>)
}

export default View;
