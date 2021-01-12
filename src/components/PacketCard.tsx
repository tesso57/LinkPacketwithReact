import React, { FC, Suspense } from 'react';
import { Card, CardHeader, CardMedia, IconButton } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import styles from './BookmarkCard.module.scss';

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

const PacketCard: FC<{ title: string, url: string }> = ({ title, url }) => {
  const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
  const img = getOGPImage(CORS_PROXY + url); // 'https://qiita.com/ksyunnnn/items/bfe2b9c568e97bb6b494' WIP

  return (
    <Card className={styles.Card}>
      <CardHeader
        title={title}
        action={
          <IconButton>
            <a href={url}>
              <ShareIcon />
            </a>
          </IconButton>
        }
      />
      <CardMedia className={styles.OGPImage} component="img" image={img} title="ogp image" />
    </Card>
  );
};

const LoadingCard: FC<{ title: string, url: string }> = ({ title, url }) => (
  <Card className={styles.Card}>
      <CardHeader
        title={title}
        action={
          <IconButton>
            <a href={url}>
              <ShareIcon />
            </a>
          </IconButton>
        }
      />
      <p>image loading...</p>
    </Card>
);

const PacketCardWithSuspence: FC<{ title: string, url: string }> = ({ title, url }) => (
  <Suspense fallback={<LoadingCard title={title} url={url} />}>
    <PacketCard title={title} url={url} />
  </Suspense>
);

export default PacketCardWithSuspence;