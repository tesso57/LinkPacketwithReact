import React, {useEffect, useState,useContext,useCallback} from 'react'
import {RouteComponentProps} from "react-router";
import {db} from '../firebase';
import { AuthContext } from '../utils/auth/AuthProvider';
import {Packet,URL,User} from "../utils/types";
import { IconButton, List, ListItem, ListItemText, Paper, Tooltip, Menu, MenuItem, Avatar,Button, ListItemAvatar,ListItemSecondaryAction,ClickAwayListener} from "@material-ui/core";
import styles from './PacketDetails.module.scss';
import {useHistory} from "react-router-dom";
import AssignmentIcon from '@material-ui/icons/Assignment';
import CopyToClipBoard from 'react-copy-to-clipboard';
import PageContainer from "../components/Layout/PageContainer"
import MoreVertIcon from '@material-ui/icons/MoreVert';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import TwitterIcon from '@material-ui/icons/Twitter';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import YesNoDialog from '../components/Layout/YesNoDialog'


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

const formatDate = (date :Date | undefined) => {
    if(date === undefined) return '';
    return    `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日に更新`
}

type Props = {
    url : URL;
    key : number;
}

const Bookmark :React.FC<Props> = (props) => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <Paper elevation={2} style={{marginLeft:`1rem`,marginRight:`1rem`}}>
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
    const history = useHistory();
    const [packet, setPacket] = useState<Packet | undefined>(undefined);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [anchor, setAnchor] = useState<HTMLAnchorElement | null>(null);
    const {currentUser,currentUserRef,setCurrentUser} = useContext(AuthContext);
    const [deleteTarget, setDeleteTarget] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const handleClick = (event?: React.BaseSyntheticEvent) => {
        if(event === undefined) return;
        setAnchor(event.currentTarget as HTMLAnchorElement);
    }

    const handleClose = () => {
        setAnchor(null);
    }

    const createTwitterUrl = (url: string) => {
        const shareText = `${packet?.title}`;
        const hashTag = 'linkpacket';
        return `https://twitter.com/intent/tweet?text=${shareText + '%0a'}&url=${url}&hashtags=${hashTag}`
    };

    const onClickShareButton = (packetId: string | undefined) => () => {
        if(packetId === undefined) return;
        const link = 'https://link-packet.web.app/packets/' + packetId;
        const twitterUrl = createTwitterUrl(link);
        window.open(twitterUrl, '_blank');
    };

    const checkSubscribed = useCallback((packetId : string) => {
        if(currentUser === null) return true;
        if(packetId.length < 19) return true;
        const packetRef = db.collection("packets").doc(packetId)
        return currentUser.subscribePacketRefs.filter((val) => (val.isEqual(packetRef))).length > 0
    },[currentUser]);

    const subscribePacket = async (packetId : string) => {
        if(currentUser === null || currentUserRef === undefined || packetId === '' || setCurrentUser === undefined) return
        if(packetId.length < 19) return
        const newSubscribePacketRef = db.collection('packets').doc(packetId);
        await currentUserRef.update({
            subscribePacketRefs : [...currentUser.subscribePacketRefs, newSubscribePacketRef]
        })
        //カレントユーザーをアップデート
        const newCurrentUser: User = {
            id : currentUser.id,
            packetRefs : currentUser.packetRefs,
            subscribePacketRefs: [...currentUser.subscribePacketRefs, newSubscribePacketRef],
            displayName: currentUser.displayName,
            photoUrl: currentUser.photoUrl
        }
        setCurrentUser(newCurrentUser);
    }

    const stopSubscribePacket = async (packetId : string) => {
        if(currentUser === null || currentUserRef === undefined || packetId === '' || setCurrentUser === undefined) return
        if(packetId.length < 19) return
        const stopSubscribePacketRef = db.collection('packets').doc(packetId);

        //ユーザーのパケットレフを消す
        const deletedSubscribeRefs = currentUser.subscribePacketRefs.filter((val) => (!val.isEqual(stopSubscribePacketRef)));
        await currentUserRef.update({
            subscribePacketRefs : deletedSubscribeRefs
        })
        //カレントユーザーをアップデート
        const newCurrentUser: User = {
            id : currentUser.id,
            packetRefs : currentUser.packetRefs,
            subscribePacketRefs: deletedSubscribeRefs,
            displayName: currentUser.displayName,
            photoUrl: currentUser.photoUrl
        }
        setCurrentUser(newCurrentUser);
    }
    const deletePackets = async () => {
        if (deleteTarget === '' || currentUserRef === undefined || currentUser === null || setCurrentUser === undefined) return;
        if(deleteTarget.length < 19) return
        //パケットを消す
        const docRef = db.collection('packets').doc(deleteTarget);
        await docRef.delete().catch((err) => console.log(err));
        //ユーザーのパケットレフを消す
        const deletedUserRefs = currentUser.packetRefs.filter((val) => (!val.isEqual(docRef)));
        //ユーザーㇾプをアップデート
        await currentUserRef.update({
            packetRefs : deletedUserRefs
        })
        //カレントユーザーをアップデート
        const newCurrentUser: User = {
            id : currentUser.id,
            packetRefs : deletedUserRefs,
            subscribePacketRefs: currentUser.subscribePacketRefs,
            displayName: currentUser.displayName,
            photoUrl: currentUser.photoUrl
        }
        setCurrentUser(newCurrentUser);
        window.location.reload();
    };

    useEffect(() => {
        if (props.match.params.packetId === undefined) return;
        if (props.match.params.packetId.length < 19) return;
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

    const Normal = {
        marginRight:`1rem`,
    }
    return (
        <PageContainer>
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
            <div　className={styles.titleContainer}>
                <h2 className={styles.title}>
                    {packet?.title}
                </h2>
                <IconButton aria-label="settings" style={{marginTop:`auto`,marginBottom:`auto`}} onClick={handleClick}>
                    <MoreVertIcon />
                </IconButton>

            </div>

            <List component={"nav"} className={styles.listContainer}>
                {
                    packet !== undefined &&
                    packet.urls.map((url, i) => (
                        <Bookmark url={url} key={i}/>
                    ))
                }

                <Menu
                    id="simple-menu"
                    anchorEl={anchor}
                    keepMounted
                    open={Boolean(anchor)}
                    onClose={handleClose}
                >
                    <CopyToClipBoard text={`https://link-packet.web.app/packets/${packet?.id}`} >
                        <MenuItem onClick={handleClose}>
                            <FileCopyIcon style={Normal} className={styles.gray}/> パケットのリンクをコピー
                        </MenuItem>
                    </CopyToClipBoard>
                    <MenuItem onClick={onClickShareButton(packet?.id)}>
                        <TwitterIcon style={Normal} className={styles.twitter}/>
                        <span className={styles.twitter}>tweet</span>
                    </MenuItem>
                    {
                        (packet !== undefined && user !== undefined && currentUser !== null && user.id === currentUser.id) &&
                        <>
                            <MenuItem onClick={() => history.push(`/edit/${packet.id}`)}>
                                <EditIcon style={Normal} className={styles.gray}/> パケットを編集
                            </MenuItem>
                            <MenuItem onClick={() =>
                            {
                                handleClose()
                                setDeleteTarget(packet.id)
                                setIsDialogOpen(true)
                            }}>
                                <DeleteIcon style={Normal} className={styles.warning}/>
                                <span className={styles.warning}>パケットを削除</span>
                            </MenuItem>
                        </>
                    }

                    {
                        (packet !== undefined && user !== undefined && currentUser !== null && user.id !== currentUser.id)?(
                            checkSubscribed(packet.id) ? (
                                <MenuItem onClick={() => stopSubscribePacket(packet.id)}>
                                    <BookmarkIcon style={Normal} className={styles.gray}/> リンクをやめる
                                </MenuItem>
                            ) : (
                                <MenuItem onClick={() => subscribePacket(packet.id)}>
                                    <BookmarkBorderIcon style={Normal} className={styles.gray}/> リンクする
                                </MenuItem>
                            )
                        ):(
                            <></>
                        )
                    }
                </Menu>
            </List>
            <YesNoDialog msg={'パケットを削除しますか？'} isOpen={isDialogOpen} doYes={deletePackets}
                         doNo={() => setIsDialogOpen(false)}/>
        </PageContainer>
    )
};

export default PacketDetails;
