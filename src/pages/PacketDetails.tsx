import React, {useEffect, useState, useCallback} from 'react'
import {RouteComponentProps} from "react-router";
import {db} from '../firebase';
import {Packet} from "../utils/types";
import {Container, IconButton, List, ListItem, ListItemText, Paper, Tooltip} from "@material-ui/core";
import styles from './PacketDetails.module.scss';
import {useHistory} from "react-router-dom";
import AssignmentIcon from '@material-ui/icons/Assignment';
import CopyToClipBoard from 'react-copy-to-clipboard';

type UrlProps = {} & RouteComponentProps<{ packetId: string }>

const onClickItem = (link: string) => () => window.location.replace(link);


const PacketDetails: React.FC<UrlProps> = (props) => {
    const [packet, setPacket] = useState<Packet | undefined>(undefined);
    const history = useHistory();
    const [openTips, setOpenTips] = useState<boolean[] | undefined>(undefined);

    const handleCloseTip = useCallback((i: number): void => {
        if (openTips === undefined) return;
        const tmpOpenTips = openTips;
        tmpOpenTips[i] = false;
        setOpenTips(tmpOpenTips);
    },[openTips]);

    const handleClickButton = useCallback((i: number): void => {
        if (openTips === undefined) return;
        const tmpOpenTips = openTips;
        tmpOpenTips[i] = true;
        setOpenTips(tmpOpenTips);
    },[openTips]);

    useEffect(() => {
        if (props.match.params.packetId === undefined) return;
        const docRef = db.collection('packets').doc(props.match.params.packetId);
        console.log("get packet")
        docRef.get().then(doc => {
            const data = doc.data() as Packet
            if (doc.exists && data !== undefined) {
                setPacket(data)
                const tmpOpenTips = new Array<boolean>();
                if(data?.urls !== undefined)
                    data.urls.forEach(_ => tmpOpenTips.push(false));
                setOpenTips(tmpOpenTips)
            } else {
                history.push('/')
            }
        })
    }, [props.match.params.packetId, history]);
    console.log("render")
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
                            <Tooltip
                                arrow
                                open={openTips && openTips[i]}
                                onClose={() => handleCloseTip(i)}
                                disableHoverListener
                                placement='top'
                                title='URL Copied!'
                            >
                                <CopyToClipBoard text={url.link}>
                                    <IconButton
                                        onClick={() => handleClickButton(i)}
                                    >
                                        <AssignmentIcon/>
                                    </IconButton>
                                </CopyToClipBoard>
                            </Tooltip>

                        </Paper>
                    ))
                }
            </List>
        </Container>
    </>)
};

export default PacketDetails;
