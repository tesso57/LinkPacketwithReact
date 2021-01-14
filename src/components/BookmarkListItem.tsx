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
  const changeTitle = (newTitle: string) => {
    props.url.title = newTitle;
    if(props.index !== undefined && props.onChange !== undefined) props.onChange(props.index, props.url);
  };
  const changeUrl = (newUrl: string) => {
    props.url.link = newUrl;
    if(props.index !== undefined && props.onChange !== undefined) props.onChange(props.index, props.url);
  };
  const add = () => {
    const re = /https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+/g;
    if(props.url.link === "" || props.url.link.match(re) === null) {
      setEditAlert("URLが有効ではありません");
      return;
    }
    if(props.url.title === "") {
      const takeDomein = /^https?:\/{2,}(.*?)(?:\/|\?|#|$)/g;
      const res = props.url.link.match(takeDomein);
      if(res !== null && res.length > 0) props.url.title = res[0].replace(/^https?:\/\//g, '').replace(/\/$/g, '');
      else props.url.title = "untitled";
    }
    setEditFlag(false);
  };
  const deleteButton = () => {
    if(props.index !== undefined && props.deleteUrl !== undefined) props.deleteUrl(props.index);
  };
  const width = useWindowDimensions();

  if(editFlag) return <EditBookmark url={props.url} changeTitle={changeTitle} changeUrl={changeUrl} add={add} editAlert={editAlert} />;

  if(props.editable) return (
    <Paper elevation={2}>
      <ListItem className={styles.List}>
        <ListItemText primary={props.url.title} secondary={head(width, props.url.link)} />
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
        <ListItemText primary={props.url.title} secondary={head(width, props.url.link)} onClick={onClickItem(props.url.link)}/>
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