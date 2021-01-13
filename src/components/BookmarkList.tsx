import React, { FC, useState } from 'react';
import { Container, List, TextField, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import { withStyles } from '@material-ui/core/styles';
import { Packet, URL } from '../utils/types/index';
import BookmarkListItem from './BookmarkListItem';
import AddBookmark from './AddBookmark';
import styles from './BookmarkList.module.scss';

type Props = {
  packet: Packet,
  editable?: boolean,
  onChange?: React.Dispatch<React.SetStateAction<Packet | undefined>>,
  save?: () => void,
};

const StyledTextField = withStyles({
  root: {
    width: "60%",
    margin: "5rem auto",
    display: "flex",
  }
})(TextField);

const BookmarkList: FC<Props> = (props: Props) => {
  const onChange = (newTitle: string) => {
    const newPacket: Packet = props.packet;
    newPacket.title = newTitle;
    if(props.onChange !== undefined) props.onChange(newPacket);
  };
  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [addFlag, setAddFlag] = useState<boolean>(false);
  const add = () => {
    setAddFlag(false);
    const newUrl: URL = { link: url, title: title };
    const newPacket: Packet = props.packet;
    newPacket.urls.push(newUrl);
    if(props.onChange !== undefined) props.onChange(newPacket);
  };
  const changeTitle = (newTitle: string) => setTitle(newTitle);
  const changeUrl = (newUrl: string) => setUrl(newUrl);
  return (
    <Container maxWidth="lg">
        { props.editable ? 
          <div>
            <StyledTextField id="title" type="text" onChange={(e) => onChange(e.target.value)} defaultValue={(props.packet !== undefined) ? (props.packet.title === "") ? "Packet Title" : props.packet.title : "Packet Title"}/>
            <IconButton aria-label="add" onClick={() => { setAddFlag(true); setTitle(''); setUrl(''); }}>
              <AddIcon />
            </IconButton>
            <IconButton aria-label="save" onClick={(props.save !== undefined) ? props.save : () => {}}>
              <SaveIcon />
            </IconButton>
          </div> :
          <h3>{ props.packet?.title }</h3>
        }
        <List component="nav" className={styles.Container}>
            { props.packet?.urls.map((url) => <BookmarkListItem key={url.link} url={url} />) }
            { addFlag ? <AddBookmark changeTitle={changeTitle} changeUrl={changeUrl} add={add} /> : <></> }
        </List>
    </Container>
  );
};

BookmarkList.defaultProps = { editable: false };

export default BookmarkList;