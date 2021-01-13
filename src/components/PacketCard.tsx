import React, { FC, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardMedia, IconButton, CardActionArea } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import { Packet } from '../utils/types/packet';
import styles from './PacketCard.module.scss';

let imgCache: string | null = null;

const getOGPImage = (url: string) => {
  if(imgCache !== null) return imgCache;

  const promise = fetch(url)
    .then((res) => res.text())
    .then((text) => {
      const el = new DOMParser().parseFromString(text, 'text/html');
      const headEls = el.head.children;
      // eslint-disable-next-line
      Array.from(headEls).map((v) => {
        const prop = v.getAttribute('property');
          if (prop === 'og:image'){
            console.log(v.getAttribute('content'));
            imgCache =  v.getAttribute('content');
          }
      });
    });

  throw promise;
}

const PacketCard: FC<{ packet: Packet }> = ({ packet }) => {
  const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
  const img = getOGPImage(CORS_PROXY + packet.urls[0].link); // 'https://qiita.com/ksyunnnn/items/bfe2b9c568e97bb6b494' WIP

  return (
    <Card className={styles.Card}>
      <CardActionArea component="div" disableRipple>
        <Link to={"/packet/" + packet.id}>
          <CardHeader
            title={packet.title}
            action={
              <IconButton>
                <a href="//twitter.com/share" data-url={"/packet/" + packet.id} data-lang="ja">
                  <ShareIcon />
                </a>
              </IconButton>
            }
          />
          <CardMedia className={styles.OGPImage} component="img" image={img} title="ogp image" />
        </Link>
      </CardActionArea>
    </Card>
  );
};

const LoadingCard: FC<{ packet: Packet }> = ({ packet }) => (
  <Card className={styles.Card}>
      <CardHeader
        title={packet.title}
        action={
          <IconButton>
            <a href="//twitter.com/share" data-url={"/packet/" + packet.id} data-lang="ja">
              <ShareIcon />
            </a>
          </IconButton>
        }
      />
      <p>image loading...</p>
    </Card>
);

const PacketCardWithSuspence: FC<{ packet: Packet }> = ({ packet }) => (
  <Suspense fallback={<LoadingCard packet={packet} />}>
    <PacketCard packet={packet} />
  </Suspense>
);

export default PacketCardWithSuspence;