import React, { FC } from 'react';
import { Paper, TextField, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const AddBookmark: FC<{ changeTitle: (newTitle: string) => void, changeUrl: (newUrl: string) => void, add: () => void }> = ({ changeTitle, changeUrl, add }) => {
  return (
    <Paper elevation={4}>
      <IconButton aria-label="add new bookmark" onClick={add}>
        <AddIcon />
      </IconButton>
      <TextField type="text" placeholder="Bookmark Title" onChange={(e) => changeTitle(e.target.value)} />
      <TextField type="text" placeholder="Bookmark URL" onChange={(e) => changeUrl(e.target.value)} />
    </Paper>
  );
};

export default AddBookmark;