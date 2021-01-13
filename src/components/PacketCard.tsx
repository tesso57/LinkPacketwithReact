import React, {FC, Suspense, useEffect, useState} from 'react';
import {Button, Card, CardActionArea, CardHeader, CardMedia, Icon, IconButton} from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import {Packet} from '../utils/types';
import styles from './PacketCard.module.scss';
import {useHistory} from "react-router-dom";

const createTwitterUrl = (url: string) => {
    const shareText = 'おすすめのパケットを共有します！';
    const hashTag = 'linkpacket';
    return `https://twitter.com/intent/tweet?text=${shareText + '%0a'}&url=${url}&hashtags=${hashTag}`
};

const onClickShareButton = (packetId: string) => () => {
    const link = 'https://link-packet.web.app/packet' + packetId;
    const twitterUrl = createTwitterUrl(link);
    window.location.replace(twitterUrl);
};

const getFaviconUrl = (url: string) => {
    console.log(url);
    const deletedHead =
        url.replace('https://', '').replace('http://', '');
    const index = deletedHead.indexOf('/');
    const serviceUrl = deletedHead.substring(0, index);
    console.log(serviceUrl);
    return `http://www.google.com/s2/favicons?domain=${serviceUrl}`
}

const PacketCard: FC<{ packet: Packet }> = ({packet}) => {
    const history = useHistory();
    const [faviconUrls, setFaviconUrls] = useState<string[] | undefined>(undefined);
    useEffect(() => {
        console.log('effecting!!')
        const tempFaviconUrls = new Array<string>();
        packet.urls.forEach(url => tempFaviconUrls.push(getFaviconUrl(url.link)));
        setFaviconUrls(tempFaviconUrls);
    }, [history, faviconUrls]);
    return (
        <Card className={styles.Card}>
            <CardActionArea component="div" disableRipple>
                <Button onClick={() => history.push(`/packet/${packet.id}`)}>
                    <CardHeader
                        title={packet.title}
                        action={
                            <IconButton onClick={onClickShareButton(packet.id)}>
                                <ShareIcon/>
                            </IconButton>
                        }
                    />
                </Button>
                {
                    faviconUrls?.map((url, i) => {
                        <img key={i} src={url}/>
                    })
                }
                {/*<CardMedia className={styles.OGPImage} component="img"*/}
                {/*           image={getFaviconUrl(packet.urls[0].link)} title="ogp image"*/}
                {/*           onClick={() => history.push(`/packet/${packet.id}`)}/>*/}
            </CardActionArea>
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
    <Suspense fallback={<LoadingCard packet={packet}/>}>
        <PacketCard packet={packet}/>
    </Suspense>
);

export default PacketCardWithSuspence;
