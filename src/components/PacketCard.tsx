import React, {FC, Suspense, useEffect, useState} from 'react';
import {Button, Card, CardActionArea, CardHeader, CardMedia, IconButton} from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import {Packet} from '../utils/types';
import styles from './PacketCard.module.scss';
import {useHistory} from "react-router-dom";


const PacketCard: FC<{ packet: Packet }> = ({packet}) => {
    const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
    const [img, setImg] = useState<string | undefined>(undefined);
    const [imgCache, setImgCache] = useState<string | undefined>(undefined);
    const history = useHistory();
    const getOGPImage = (url: string) => {
        if (imgCache !== null) return imgCache;

        throw fetch(url)
            .then((res) => res.text())
            .then((text) => {
                const el = new DOMParser().parseFromString(text, 'text/html');
                const headEls = el.head.children;
                // eslint-disable-next-line
                Array.from(headEls).map((v) => {
                    const prop = v.getAttribute('property');
                    if (prop === 'og:image') {
                        console.log(v.getAttribute('content'));
                        setImgCache(v.getAttribute('content')?? '');
                    }
                });
            });
    }
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
    useEffect(() => {
        // 'https://qiita.com/ksyunnnn/items/bfe2b9c568e97bb6b494' WIP
        console.log(img);
        setImg(getOGPImage(CORS_PROXY + packet.urls[0].link))
    }, [history, img, imgCache]);
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
                <CardMedia className={styles.OGPImage} component="img" image={img} title="ogp image"
                           onClick={() => history.push(`/packet/${packet.id}`)}/>
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
