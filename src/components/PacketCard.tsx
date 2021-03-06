import React, {FC, Suspense, useEffect, useState, useContext,useCallback} from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    Container,
    IconButton,
    Avatar,
    Button,
    Menu,
    MenuItem
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import {Packet,User} from '../utils/types';
import styles from './PacketCard.module.scss';
import {useHistory} from "react-router-dom";
import {MoreHoriz} from "@material-ui/icons";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TwitterIcon from '@material-ui/icons/Twitter';
import { AuthContext } from '../utils/auth/AuthProvider';
import CopyToClipBoard from 'react-copy-to-clipboard';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import { db } from "../firebase";

type Props = {
    packet : Packet;
    setDeleteTarget : React.Dispatch<React.SetStateAction<string>>;
    setIsDialogOpen : React.Dispatch<React.SetStateAction<boolean>>;
}

const PacketCard: FC<Props> = (props) => {
    const history = useHistory();
    const [faviconUrls, setFaviconUrls] = useState<string[] | undefined>(undefined);
    const [user,setUser] = useState<User |undefined>(undefined);
    const [anchor, setAnchor] = useState<HTMLAnchorElement | null>(null);
    const {currentUser,currentUserRef,setCurrentUser} = useContext(AuthContext);

    const handleClick = (event?: React.BaseSyntheticEvent) => {
        if(event === undefined) return;
        setAnchor(event.currentTarget as HTMLAnchorElement);
    }

    const handleClose = () => {
        setAnchor(null);
    }

    const checkSubscribed = useCallback((packetId : string) => {
        if(currentUser === null) return true;
        if(packetId.length < 19) return
        const packetRef = db.collection("packets").doc(packetId)
        return currentUser.subscribePacketRefs.filter((val) => (val.isEqual(packetRef))).length > 0
    },[currentUser]);

    const subscribePacket = async (packetId : string) => {
        if(currentUser === null || currentUserRef === undefined || packetId === '' || setCurrentUser === undefined) return
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

    const createTwitterUrl = (url: string) => {
        const shareText = `${props.packet.title}`;
        const hashTag = 'linkpacket';
        return `https://twitter.com/intent/tweet?text=${shareText + '%0a'}&url=${url}&hashtags=${hashTag}`
    };

    const onClickShareButton = (packetId: string) => () => {
        const link = 'https://link-packet.web.app/packets/' + packetId;
        const twitterUrl = createTwitterUrl(link);
        window.open(twitterUrl, '_blank');
    };

    const getFaviconUrl = (url: string) => {
        if (url === '') return '';
        const deletedHead =
            url.replace('https://', '').replace('http://', '');
        const index = deletedHead.indexOf('/');
        const serviceUrl = deletedHead.substring(0, index);
        return `http://www.google.com/s2/favicons?domain=${serviceUrl}`
    };

    const head10 = (str: string) => {
        const words = 15
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


    const getUserPhoto = (url : string | null) => (
        url === null ? '' : url
    )


    useEffect(() => {
        const tempFaviconUrls = new Array<string>();
        props.packet.urls.forEach(url => tempFaviconUrls.push(getFaviconUrl(url.link)));
        props.packet.userRef.get().then((doc) => {
            if(doc.exists){
                setUser(doc.data() as User)
            }
        })
        setFaviconUrls(tempFaviconUrls);
    }, [history, props.packet]);

    const Normal = {
        marginRight:`1rem`,
    }
    return (
        <Card>
                <CardHeader
                        avatar={
                                user !== undefined &&
                            <IconButton onClick={() => history.push(`/users/${user.id}`)}>
                                <Avatar alt="Favicon" src={getUserPhoto(user.photoUrl)} />
                            </IconButton>
                        }
                        className={styles.CardHeader}
                        title={
                            <Button  onClick={() => history.push(`/packets/${props.packet.id}`)} style={{textTransform:'none'}}>
                                <span className={styles.title}>{head10(props.packet.title)}</span>
                            </Button>
                            
                        }
                        titleTypographyProps={{variant: 'h6'}}
                        action={
                            <IconButton aria-label="settings" onClick={handleClick}>
                                <MoreVertIcon />
                            </IconButton>
                            
                        }
                    />
            <CardActionArea component="div" disableRipple onClick={() => history.push(`/packets/${props.packet.id}`)}>
                <CardContent>
                    <div className={styles.container}>
                    {
                        faviconUrls?.map((url, i) => (
                                (url !== '' && i < 8) && <img key={i} src={url} alt={"favicon"} width={'25px'} height={'25px'}/>
                            )
                        )
                    }
                    {
                        faviconUrls !== undefined && faviconUrls?.length > 9 && <MoreHoriz/>
                    }
                    </div>
                </CardContent>
            </CardActionArea>

            <Menu
                id="simple-menu"
                anchorEl={anchor}
                keepMounted
                open={Boolean(anchor)}
                onClose={handleClose}
                >
                <CopyToClipBoard text={`https://link-packet.web.app/packets/${props.packet.id}`} >
                    <MenuItem onClick={handleClose}>
                        <FileCopyIcon style={Normal} className={styles.gray}/> パケットのリンクをコピー 
                    </MenuItem>
                </CopyToClipBoard>
                <MenuItem onClick={onClickShareButton(props.packet.id)}> 
                    <TwitterIcon style={Normal} className={styles.twitter}/> 
                    <span className={styles.twitter}>tweet</span>
                </MenuItem>
                {
                    (user !== undefined && currentUser !== null && user.id === currentUser.id) &&
                    <>
                        <MenuItem onClick={() => history.push(`/edit/${props.packet.id}`)}>
                            <EditIcon style={Normal} className={styles.gray}/> パケットを編集 
                        </MenuItem>
                        <MenuItem onClick={() => 
                        {
                            handleClose()
                            props.setDeleteTarget(props.packet.id)
                            props.setIsDialogOpen(true)
                        }}> 
                            <DeleteIcon style={Normal} className={styles.warning}/>
                            <span className={styles.warning}>パケットを削除</span>
                        </MenuItem>
                    </>
                }

                {
                    (user !== undefined && currentUser !== null && user.id !== currentUser.id)?(
                        checkSubscribed(props.packet.id) ? (
                            <MenuItem onClick={() => stopSubscribePacket(props.packet.id)}>
                                <BookmarkIcon style={Normal} className={styles.gray}/> リンクをやめる
                            </MenuItem>
                            ) : (
                            <MenuItem onClick={() => subscribePacket(props.packet.id)}>
                                <BookmarkBorderIcon style={Normal} className={styles.gray}/> リンクする
                            </MenuItem>
                            )
                    ):(
                        <></>
                    )
                }
            </Menu>
        </Card>
    );
};

const LoadingCard: FC<{ packet: Packet }> = ({packet}) => (
    <Card className={styles.Card}>
        <CardHeader
            title={packet.title}
            action={
                <IconButton>
                </IconButton>
            }
        />
        <p>image loading...</p>
    </Card>
);

const PacketCardWithSuspence: FC<Props> = (props) => (
    <Container maxWidth={'md'}>
        <Suspense fallback={<LoadingCard packet={props.packet}/>}>
            <PacketCard {...props}/>
        </Suspense>
    </Container>
);

export default PacketCardWithSuspence;
