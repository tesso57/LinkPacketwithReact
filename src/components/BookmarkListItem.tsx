import React, { FC, useState } from 'react';
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

const onClickItem = (link: string) => () => window.location.replace(link);

const BookmarkListItem: FC<Props> = (props) => {
  const [editFlag, setEditFlag] = useState<boolean>(false);
  const changeTitle = (newTitle: string) => {
    props.url.title = newTitle;
    if(props.index !== undefined && props.onChange !== undefined) props.onChange(props.index, props.url);
  };
  const changeUrl = (newUrl: string) => {
    props.url.link = newUrl;
    if(props.index !== undefined && props.onChange !== undefined) props.onChange(props.index, props.url);
  };
  const add = () => setEditFlag(false);
  const deleteButton = () => {
    if(props.index !== undefined && props.deleteUrl !== undefined) props.deleteUrl(props.index);
  };

  if(editFlag) return <EditBookmark url={props.url} changeTitle={changeTitle} changeUrl={changeUrl} add={add} />;

  return (
    <Paper elevation={2}>
      <ListItem className={styles.List} button>
        <ListItemText primary={props.url.title} secondary={props.url.link} onClick={onClickItem(props.url.link)}/>
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