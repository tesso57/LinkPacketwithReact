import React, {FC, Suspense, useEffect, useState} from 'react';
import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    Container,
    IconButton,
    Avatar,
    Button,
    Menu,
    MenuItem
} from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import {Packet,User} from '../utils/types';
import styles from './PacketCard.module.scss';
import {useHistory} from "react-router-dom";
import {MoreHoriz} from "@material-ui/icons";
import MoreVertIcon from '@material-ui/icons/MoreVert';

const createTwitterUrl = (url: string) => {
    const shareText = 'おすすめのパケットを共有します！';
    const hashTag = 'linkpacket';
    return `https://twitter.com/intent/tweet?text=${shareText + '%0a'}&url=${url}&hashtags=${hashTag}`
};

const onClickShareButton = (packetId: string) => () => {
    const link = 'https://link-packet.web.app/packet/' + packetId;
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


const PacketCard: FC<{ packet: Packet }> = ({packet}) => {
    const history = useHistory();
    const [faviconUrls, setFaviconUrls] = useState<string[] | undefined>(undefined);
    const [user,setUser] = useState<User |undefined>(undefined);
    const [anchor, setAnchor] = useState<any>(null);

    const handleClick = (event : any) => {
        setAnchor(event.currentTarget);
    }

    const handleClose = () => {
        setAnchor(null);
    }

    useEffect(() => {
        const tempFaviconUrls = new Array<string>();
        packet.urls.forEach(url => tempFaviconUrls.push(getFaviconUrl(url.link)));
        packet.userRef.get().then((doc) => {
            if(doc.exists){
                setUser(doc.data() as User)
            }
        })
        setFaviconUrls(tempFaviconUrls);
    }, [history, packet]);
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
                            <Button  onClick={() => history.push(`/packet/${packet.id}`)}>
                                <span className={styles.title}>{head10(packet.title)}</span>
                            </Button>
                            
                        }
                        titleTypographyProps={{variant: 'h6'}}
                        action={
                            <IconButton aria-label="settings" onClick={handleClick}>
                                <MoreVertIcon />
                            </IconButton>
                            
                        }
                    />
            <CardActionArea component="div" disableRipple onClick={() => history.push(`/packet/${packet.id}`)}>
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
                <MenuItem onClick={handleClose}>パケットを編集</MenuItem>
                <MenuItem onClick={handleClose}>パケットリンクをコピー</MenuItem>
                <MenuItem onClick={handleClose}>ツイート</MenuItem>
                <MenuItem onClick={handleClose}>パケット削除</MenuItem>
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

const PacketCardWithSuspence: FC<{ packet: Packet }> = ({packet}) => (
    <Container maxWidth={'md'}>
        <Suspense fallback={<LoadingCard packet={packet}/>}>
            <PacketCard packet={packet}/>
        </Suspense>
    </Container>
);

export default PacketCardWithSuspence;
