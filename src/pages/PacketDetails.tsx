import React, {useEffect, useState} from 'react'
import {RouteComponentProps} from "react-router";
import {db} from '../firebase';
import {Packet} from "../utils/types";
import { Container, List, ListItem, ListItemText, Paper} from "@material-ui/core";
import styles from './PacketDetails.module.scss';
import {useHistory} from "react-router-dom";
import PageContainer from "../components/Layout/PageContainer"

type UrlProps = {} & RouteComponentProps<{ packetId: string }>

const onClickItem = (link: string) => () => window.location.replace(link);

const PacketDetails: React.FC<UrlProps> = (props) => {
    const [packet, setPacket] = useState<Packet | undefined>(undefined);
    const history = useHistory();
    useEffect(() => {
        if (props.match.params.packetId === undefined) return;
        const docRef = db.collection('packets').doc(props.match.params.packetId);
        docRef.get().then(doc => {
            if (doc.exists) {
                setPacket(doc.data() as Packet)
            } else {
                history.push('/')
            }
        })
    }, [props.match.params.packetId, history]);

    return (
        <PageContainer>
            <Container maxWidth={"md"}>
                <h3>
                    {packet?.title}
                </h3>
                <List component={"nav"} className={styles.listContainer}>
                    {
                        packet !== undefined && 

                        packet.urls.map((url, i) => (
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
        </PageContainer>
    )
};

export default PacketDetails;
