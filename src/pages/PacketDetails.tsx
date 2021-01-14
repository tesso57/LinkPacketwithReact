import React, {useEffect, useState} from 'react'
import {RouteComponentProps} from "react-router";
import {db} from '../firebase';
import {Packet,URL} from "../utils/types";
import {Container, IconButton, List, ListItem, ListItemText, Paper, Tooltip} from "@material-ui/core";
import styles from './PacketDetails.module.scss';
import {useHistory} from "react-router-dom";
import AssignmentIcon from '@material-ui/icons/Assignment';
import CopyToClipBoard from 'react-copy-to-clipboard';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import PageContainer from "../components/Layout/PageContainer"


const onClickItem = (link: string) => () => window.location.replace(link);
const head10 = (str: string) => {
    const words = 100
    const head20 = str.substr(0, words);
    const result = new Array<string>();
    let pos = 0;
    const toNumbers: number[] = head20.split('').map(char => {
        if (char.match(/[ -~]/)) return 1;
        else return 2;
    });
    if (toNumbers.reduce((sum, num) => sum += num, 0) < words) return head20;
    toNumbers.forEach((num, index) => {
        pos += num;
        if (pos <= words) result.push(head20[index])
    });
    return result.join('') + '...';
};

type Props = {
    url : URL;
    key : number;
}

const Bookmark :React.FC<Props> = (props) => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <Paper elevation={2}>
            <ListItem key={props.key} className={styles.list} button>
                ListItemText primary={head10(props.url.title)} 
                             secondary={head10(props.url.link)}
                             primaryTypographyProps={{ style: { wordWrap: `break-word` }}}
                             secondaryTypographyProps={{ style: { wordWrap: `break-word` }}}
                             onClick={onClickItem(props.url.link)}/>
            </ListItem>
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <div>
                        <Tooltip
                            PopperProps={{
                                disablePortal: true,
                        }}
                            arrow
                            open={open}
                            onClose={() => setOpen(false)}
                            placement='top'
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title='URL Copied!'
                        >
                            <CopyToClipBoard text={props.url.link}>
                                <IconButton
                                    onClick={ () => setOpen(true)}
                                >
                                    <AssignmentIcon/>
                                </IconButton>
                            </CopyToClipBoard>
                        </Tooltip>
                    </div>
                </ClickAwayListener>
        </Paper>
    )
}

type UrlProps = {} & RouteComponentProps<{ packetId: string }>

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
                  {packet !== undefined && 
                      packet.urls.map((url, i) => (
                          <Bookmark url={url} key={i}/>
                      ))
                  }
              </List>
           </Container>
         </PageContainer>
    )
};

export default PacketDetails;
