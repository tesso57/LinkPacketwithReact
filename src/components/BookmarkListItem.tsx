import React, { FC, useState, useEffect } from 'react';
import { Paper, ListItem, ListItemText, IconButton, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { URL } from '../utils/types/index';
import EditBookmark from './EditBookmark';
import styles from './BookmarkListItem.module.scss';

type Props = {
  url: URL,
  index?: number,
  editable?: boolean,
  onChange?: (index: number, newUrl: URL) => void,
  save?: () => void,
  deleteUrl?: (index: number) => void
};

const useWindowDimensions = () => {
 
  const getWindowDimensions = () => {
    const { innerWidth: width } = window;
    return width;
  }
 
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  useEffect(() => {
    const onResize = () => {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return windowDimensions;
};

const onClickItem = (link: string) => () => window.location.replace(link);

const head = (width: number, str: string) => {
  const val = (width > 1025) ? 100 : Math.floor(100 / 1025 * width);
  const headSubstr = str.substr(0, val);
  const result = new Array<string>();
  let pos = 0;
  const toNumbers: number[] = headSubstr.split('').map(char => {
      if (char.match(/[ -~]/)) return 1;
      else return 2;
  });
  if (toNumbers.reduce((sum, num) => sum += num, 0) < val) return headSubstr;
  toNumbers.forEach((num, index) => {
      pos += num;
      if (pos <= val) result.push(headSubstr[index])
  });
  return result.join('') + '...';
};

const BookmarkListItem: FC<Props> = (props) => {
  const [editFlag, setEditFlag] = useState<boolean>(false);
  const [editAlert, setEditAlert] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string>(props.url.title);
  const [url, setUrl] = useState<string>(props.url.link);
  const changeTitle = (newTitle: string) => setTitle(newTitle);
  const changeUrl = (newUrl: string) => setUrl(newUrl);
  const add = () => {
    const newUrl: URL = { link: url, title: title };
    const re = /https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+/g;
    if(newUrl.link === "" || newUrl.link.match(re) === null) {
      setEditAlert("URLが有効ではありません");
      return;
    }
    if(newUrl.title === "") {
      const takeDomein = /^https?:\/{2,}(.*?)(?:\/|\?|#|$)/g;
      const res = newUrl.link.match(takeDomein);
      if(res !== null && res.length > 0) newUrl.title = res[0].replace(/^https?:\/\//g, '').replace(/\/$/g, '');
      else newUrl.title = "untitled";
    }
    if(props.index !== undefined && props.onChange !== undefined) props.onChange(props.index, newUrl);
    setEditFlag(false);
    if(props.save !== undefined) props.save();
  };
  const cancel = () => {
    setEditFlag(false);
    if(title !== props.url.title) setTitle(props.url.title);
    if(url !== props.url.link) setUrl(props.url.link);
  };
  const deleteButton = () => {
    if(props.index !== undefined && props.deleteUrl !== undefined) props.deleteUrl(props.index);
  };
  const width = useWindowDimensions();

  if(editFlag) return <EditBookmark url={props.url} changeTitle={changeTitle} changeUrl={changeUrl} add={add} cancel={cancel} editAlert={editAlert} />;

  if(props.editable) return (
    <Paper elevation={2}>
      <ListItem className={styles.List}>
        <ListItemText primary={title} secondary={head(width, url)} />
        { props.editable ? (<>
          <Tooltip title="Edit" placement="top">
            <IconButton aria-label="Edit" onClick={() => setEditFlag(true)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="top">
            <IconButton aria-label="Delete" onClick={deleteButton}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          </>): <></>
        }
      </ListItem>
    </Paper>
  );

  return (
    <Paper elevation={2}>
      <ListItem className={styles.List} button>
        <ListItemText primary={title} secondary={head(width, url)} onClick={onClickItem(url)}/>
        { props.editable ? (<>
          <Tooltip title="Edit" placement="top">
            <IconButton aria-label="Edit" onClick={() => setEditFlag(true)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="top">
            <IconButton aria-label="Delete" onClick={deleteButton}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          </>): <></>
        }
      </ListItem>
    </Paper>
  );
};

BookmarkListItem.defaultProps = { editable: false };

export default BookmarkListItem;