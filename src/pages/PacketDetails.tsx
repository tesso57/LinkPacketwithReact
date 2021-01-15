import React, {useEffect, useState} from 'react'
import {RouteComponentProps} from "react-router";
import {db} from '../firebase';
import {Packet,URL,User} from "../utils/types";
import {Container, IconButton, List, ListItem, ListItemText, Paper, Tooltip} from "@material-ui/core";
import styles from './PacketDetails.module.scss';
import {useHistory} from "react-router-dom";
import AssignmentIcon from '@material-ui/icons/Assignment';
import CopyToClipBoard from 'react-copy-to-clipboard';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import PageContainer from "../components/Layout/PageContainer"
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

const getFaviconUrl = (url: string) => {
    if (url === '') return '';
    const deletedHead =
        url.replace('https://', '').replace('http://', '');
    const index = deletedHead.indexOf('/');
    const serviceUrl = deletedHead.substring(0, index);
    return `http://www.google.com/s2/favicons?domain=${serviceUrl}`
};
const onClickItem = (link: string) => () => window.open(link, '_blank');
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

const formatDate = (date :Date) => (
    `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日に更新`
)

type Props = {
    url : URL;
    key : number;
}

const Bookmark :React.FC<Props> = (props) => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <Paper elevation={2}>
            <ListItem key={props.key} className={styles.list} button>
                
                {
                     (getFaviconUrl(props.url.link) !== '') &&
                    <ListItemAvatar>
                        <Avatar alt="Favicon" src={getFaviconUrl(props.url.link)} />
                    </ListItemAvatar>
                }
                <ListItemText primary={head10(props.url.title)} 
                             secondary={head10(props.url.link)}
                             primaryTypographyProps={{ style: { wordWrap: `break-word` }}}
                             secondaryTypographyProps={{ style: { wordWrap: `break-word` }}}
                             onClick={onClickItem(props.url.link)}/>
                <ListItemSecondaryAction>
                    <ClickAwayListener onClickAway={() => setOpen(false)}>
                        <div >
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
                                    <CopyToClipBoard text={props.url.link} >
                                        <IconButton
                                            onClick={ () => setOpen(true)}
                                            edge="end"
                                        >
                                            <AssignmentIcon />
                                        </IconButton>
                                    </CopyToClipBoard>
                            </Tooltip>
                        </div>
                    </ClickAwayListener>
                </ListItemSecondaryAction>
            </ListItem>
        </Paper>
    )
}

type UrlProps = {} & RouteComponentProps<{ packetId: string }>

const PacketDetails: React.FC<UrlProps> = (props) => {
    const [packet, setPacket] = useState<Packet | undefined>(undefined);
    const [user, setUser] = useState<User | undefined>(undefined);
    const history = useHistory();


    useEffect(() => {
        if (props.match.params.packetId === undefined) return;
        const docRef = db.collection('packets').doc(props.match.params.packetId);
        docRef.get().then(doc => {
            if (doc.exists) {
                const tmpPacket = doc.data() as Packet
                setPacket(tmpPacket)
                tmpPacket.userRef.get().then((userDoc) => {
                    if(userDoc.exists){
                        setUser(userDoc.data() as User)
                    }
                })
            } else {
                history.push('/')
            }
        })
    }, [props.match.params.packetId, history]);

    return (
        <PageContainer>
          <Container maxWidth={"md"}>
              
              {
                  user !== undefined && user.photoUrl !== null && 
                  <div className={styles.userDataContainer}>
                      <div className={styles.userNameContainer}>
                        <Button href={`/users/${user.id}`}>
                            <Avatar alt="user" src={user.photoUrl} style={{marginRight:`1.5rem`}}/>
                            <span className={styles.userName}>{user.displayName}</span> 
                        </Button>
                      </div>
                    <span className={styles.date}>{formatDate(packet?.postedDate.toDate())}</span>
                  </div>
              }
              <h2>
                  {packet?.title}
              </h2>
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
