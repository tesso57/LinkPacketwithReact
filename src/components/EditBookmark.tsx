import React, { FC } from 'react';
import { Paper, ListItem, ListItemText, TextField, IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Alert } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import { URL } from '../utils/types/url';

type Props = {
  url?: URL,
  changeTitle: (newTitle: string) => void,
  changeUrl: (newUrl: string) => void,
  add: () => void,
  editAlert?: string,
};

const StyledTextField = withStyles({
  root: {
    width: "60%",
    margin: "2rem 0",
  }
})(TextField);

const EditBookmark: FC<Props> = (props) => (
  <Paper elevation={4}>
    { (props.editAlert !== undefined) ? <Alert severity="error">{props.editAlert}</Alert> : <></> }
    <ListItem>
      <ListItemText
        primary={
          <StyledTextField type="text" placeholder="Bookmark title" defaultValue={props.url?.title} onChange={(e) => props.changeTitle(e.target.value)} size="medium" />
        }
        secondary={
          <StyledTextField type="text" placeholder="Bookmark URL" defaultValue={props.url?.link} onChange={(e) => props.changeUrl(e.target.value)} size="medium" />
        }
      />
      <Tooltip title="Add">
        <IconButton aria-label="add new bookmark" onClick={props.add}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    </ListItem>
  </Paper>
);


export default EditBookmark;