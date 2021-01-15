import React, { useEffect, useState} from 'react';
import { Button, Dialog, DialogTitle, DialogActions} from '@material-ui/core';

const YesNoDialog: React.FC<{ msg: string, isOpen: boolean, doYes: () => void, doNo: () => void }>
    = ({msg, isOpen, doYes, doNo}) => {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(isOpen)
    }, [isOpen])

    return (
        <div>
            <Dialog
                open={open}
                keepMounted
                onClose={() => doNo()}
                aria-labelledby="common-dialog-title"
                aria-describedby="common-dialog-description"
            >
                <DialogTitle>
                    {msg}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => doNo()} style={{ color:`#F6B40D` }}>
                        No
                    </Button>
                    <Button onClick={() => doYes()} variant="contained" style={{ color:`#fff`,backgroundColor:`#F6B40D` }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default YesNoDialog;