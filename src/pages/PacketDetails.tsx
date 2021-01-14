import React, {useEffect, useState} from 'react'
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
    const handleCloseTip = (i: number): void => {
        if (openTips === undefined) return;
        const tmpOpenTips = openTips;
        tmpOpenTips[i] = false;
        setOpenTips(tmpOpenTips);
    };

    const handleClickButton = (i: number): void => {
        if (openTips === undefined) return;
        const tmpOpenTips = openTips;
        tmpOpenTips[i] = true;
        setOpenTips(tmpOpenTips);
    };

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
        const tmpOpenTips = new Array<boolean>();
        packet?.urls.forEach(_ => tmpOpenTips.push(false));
        setOpenTips(tmpOpenTips)
    }, [props.match.params.packetId, history]);

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
            {/*<Button variant={"contained"}>hoge</Button>*/}
        </Container>
    </>)
};

export default PacketDetails;
