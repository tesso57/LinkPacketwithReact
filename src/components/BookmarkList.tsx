import React, { FC, useState } from 'react';
import { Container, List, TextField, IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import { withStyles } from '@material-ui/core/styles';
import { Packet, URL } from '../utils/types/index';
import BookmarkListItem from './BookmarkListItem';
import EditBookmark from './EditBookmark';
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
  const [editAlert, setEditAlert] = useState<string | undefined>(undefined);
  const [packetAlert, setPacketAlert] = useState<string | undefined>(undefined);
  const add = () => {
    const newUrl: URL = { link: url, title: title };
    const re = /https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+/g;
    if(newUrl.link === "" || newUrl.link.match(re) !== null) {
      setEditAlert("URLが有効ではありません");
      return;
    }
    const newPacket: Packet = props.packet;
    newPacket.urls.push(newUrl);
    if(props.onChange !== undefined) props.onChange(newPacket);
    setAddFlag(false);
    setListItem(props.packet?.urls.map((url, i) => <BookmarkListItem key={url.link} url={url} index={i} onChange={mergeURL} deleteUrl={deleteUrl} editable />));
  };
  const changeTitle = (newTitle: string) => setTitle(newTitle);
  const changeUrl = (newUrl: string) => setUrl(newUrl);
  const mergeURL = (index: number, newUrl: URL) => {
    const newPacket: Packet = props.packet;
    newPacket.urls[index] = newUrl;
    if(props.onChange !== undefined) props.onChange(newPacket);
  };
  const deleteUrl = (index: number) => {
    const newPacket: Packet = props.packet;
    newPacket.urls.splice(index, 1);
    if(props.onChange !== undefined) props.onChange(newPacket);
    setListItem(props.packet?.urls.map((url, i) => <BookmarkListItem key={url.link} url={url} index={i} onChange={mergeURL} deleteUrl={deleteUrl} editable />));
  };
  const [listItem, setListItem] = useState<JSX.Element[]>(props.packet?.urls.map((url, i) => <BookmarkListItem key={url.link} url={url} index={i} onChange={mergeURL} deleteUrl={deleteUrl} editable />));
  return (
    <Container maxWidth="lg">
        { props.editable ? 
          <div>
            <StyledTextField id="title" type="text" onChange={(e) => onChange(e.target.value)} defaultValue={(props.packet !== undefined) ? (props.packet.title === "") ? "Packet Title" : props.packet.title : "Packet Title"}/>
            <Tooltip title="Add Bookmark" placement="top">
              <IconButton aria-label="add" onClick={() => { setAddFlag(true); setTitle(''); setUrl(''); }}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save Packet" placement="top">
              <IconButton aria-label="save" onClick={(props.save !== undefined) ? props.save : () => {}}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            {/* { (packetAlert !== undefined) ?  } */}
          </div> :
          <h3>{ props.packet?.title }</h3>
        }
        <List component="nav" className={styles.Container}>
            { listItem }
            { addFlag ? <EditBookmark changeTitle={changeTitle} changeUrl={changeUrl} add={add} /> : <></> }
        </List>
    </Container>
  );
};

BookmarkList.defaultProps = { editable: false };

export default BookmarkList;