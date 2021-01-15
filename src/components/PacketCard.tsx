import React, {FC, Suspense, useEffect, useState} from 'react';
import ShareIcon from '@material-ui/icons/Share';
import {Packet} from '../utils/types';
import styles from './PacketCard.module.scss';
import {useHistory} from "react-router-dom";
import {MoreHoriz} from "@material-ui/icons";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IconButton, List, ListItem, ListItemText, Paper, Tooltip} from "@material-ui/core";


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
    const head20 = str.substr(0, 20);
    const result = new Array<string>();
    let pos = 0;
    const toNumbers: number[] = head20.split('').map(char => {
        if (char.match(/[ -~]/)) return 1;
        else return 2;
    });
    if (toNumbers.reduce((sum, num) => sum += num, 0) < 20) return head20;
    toNumbers.forEach((num, index) => {
        pos += num;
        if (pos <= 20) result.push(head20[index])
    });
    return result.join('') + '...';
};


const PacketCard: FC<{ packet: Packet }> = ({packet}) => {
    const history = useHistory();
    const [faviconUrls, setFaviconUrls] = useState<string[] | undefined>(undefined);
    useEffect(() => {
        const tempFaviconUrls = new Array<string>();
        packet.urls.forEach(url => tempFaviconUrls.push(getFaviconUrl(url.link)));
        setFaviconUrls(tempFaviconUrls);
    }, [history, packet.urls]);
    return (
        // <Card className={styles.Card}>
        //     <CardActionArea component="div" disableRipple onClick={() => history.push(`/packet/${packet.id}`)}>
        //     <CardHeader
        //         className={styles.CardHeader}
        //         title={head10(packet.title)}
        //         titleTypographyProps={{variant: 'h6'}}
        //         action={
        //             <CardActions disableSpacing>
        //                 <IconButton aria-label="settings">
        //                     <MoreVertIcon />
        //                 </IconButton>
        //             </CardActions>
        //             }
        //     />
        //         <CardContent>
        //             {
        //                 faviconUrls?.map((url, i) => (
        //                         (url !== '' && i < 8) && <img key={i} src={url} alt={"favicon"} width={'25px'} height={'25px'}/>
        //                     )
        //                 )
        //             }
        //             {
        //                 faviconUrls !== undefined && faviconUrls?.length > 9 && <MoreHoriz/>
        //             }
        //         </CardContent>
        //     </CardActionArea>
        //     <CardActions disableSpacing>
        //         <IconButton className={styles.IconButtonPosition} onClick={onClickShareButton(packet.id)}>
        //                 <ShareIcon/>
        //         </IconButton>
        //     </CardActions>
        // </Card>
        

        <Paper elevation={2}>
            <ListItem className={styles.list} button>
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
