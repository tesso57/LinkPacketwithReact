import React, { FC } from 'react';
import { Paper, ListItem, ListItemText, TextField, IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { URL } from '../utils/types/url';

type Props = {
    url?: URL,
    changeTitle: (newTitle: string) => void,
    changeUrl: (newUrl: string) => void,
    add: () => void
};

const EditBookmark: FC<Props> = (props) => (
  <Paper elevation={4}>
    <ListItem>
      <ListItemText
        primary={
          <TextField type="text" placeholder="Bookmark title" defaultValue={props.url?.title} onChange={(e) => props.changeTitle(e.target.value)} size="medium" />
        }
        secondary={
          <TextField type="text" placeholder="Bookmark URL" defaultValue={props.url?.link} onChange={(e) => props.changeUrl(e.target.value)} size="medium" />
        }
      />
      <Tooltip title="Add this">
        <IconButton aria-label="add new bookmark" onClick={props.add}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    </ListItem>
  </Paper>
);


export default EditBookmark;