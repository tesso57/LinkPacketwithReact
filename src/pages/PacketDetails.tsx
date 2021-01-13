import React, {useEffect, useState} from 'react'
import {RouteComponentProps} from "react-router";
import {db, firebase} from '../firebase';
import {Packet, User} from "../utils/types";
import {Button, Container, Icon, List, ListItem, ListItemText, Paper} from "@material-ui/core";
import {inspect} from "util";
import styles from './PacketDetails.module.scss';

type UrlProps = {} & RouteComponentProps<{ packetId: string }>

const PacketDetails: React.FC<UrlProps> = (props) => {
    const [packet, setPacket] = useState<Packet | undefined>(undefined);
    useEffect(() => {
        if (props.match.params.packetId === undefined) return;
        const docRef = db.collection('packets').doc(props.match.params.packetId);
        docRef.get().then(doc => {
            if (doc.exists) {
                console.log(doc.data());
                setPacket(doc.data() as Packet)
            } else {
                console.log("not found");
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
            {/*<Button variant={"contained"}>hoge</Button>*/}
        </Container>
    </>)
};

export default PacketDetails;
