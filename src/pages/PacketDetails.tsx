import React, {useEffect, useState} from 'react'
import {RouteComponentProps} from "react-router";
import {db} from '../firebase';
import {Packet} from "../utils/types";
import { Container, List, ListItem, ListItemText, Paper} from "@material-ui/core";
import styles from './PacketDetails.module.scss';
import {useHistory} from "react-router-dom";

type UrlProps = {} & RouteComponentProps<{ packetId: string }>

const PacketDetails: React.FC<UrlProps> = (props) => {
    const history = useHistory();
    const [packet, setPacket] = useState<Packet | undefined>(undefined);
    useEffect(() => {
        if (props.match.params.packetId === undefined) return;
        const docRef = db.collection('packets').doc(props.match.params.packetId);
        docRef.get().then(doc => {
            if (doc.exists) {
                console.log(doc.data());
                setPacket(doc.data() as Packet)
            } else {
                history.push('/');
            }
        })
    }, [props.match.params.packetId]);

    const onClickItem = (link: string) => () => window.location.replace(link);

    return (<>
        <Container maxWidth={"md"}>
            <h3>
                {packet?.title}
            </h3>
            <List component={"nav"}>
                {
                    packet?.urls.map((url, i) => (
                        <Paper elevation={2}>
                            <ListItem key={i} className={styles.list} button>
                                <ListItemText primary={url.title} secondary={url.link}
                                              onClick={onClickItem(url.link)}/>
                            </ListItem>
                        </Paper>
                    ))
                }
            </List>
        </Container>
    </>)
};

export default PacketDetails;
