import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../utils/auth/AuthProvider';
import {Toolbar, Button, IconButton} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import styles from './Header.module.scss';
import titleURL from '../../assets/title.png';
import {useHistory, useLocation} from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import YesNoDialog from './YesNoDialog'

const StyledButton = withStyles({
    root: {
        margin: "0 0 0 auto",
        color: "white",
        backgroundColor: "#F6B40D",
        borderRadius: "1.125rem",
    }
})(Button);

const Header: React.FC = () => {
    const {currentUser, login, logout} = useContext(AuthContext)
    const history = useHistory();
    const location = useLocation();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const ITEM_HEIGHT = 48;
    const options = [
        'トップページ',
        'マイページ',
    ];

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (path: string) => () => {
        if (path === 'needsignin') {
            login();
            return
        }
        setAnchorEl(null);
        history.push(path);
    };

    const createPathFromOption = (option: string) => {
        if (option === 'トップページ') return '/';
        if (option === 'マイページ') {
            if(currentUser === null) return 'needsignin';
             return `/users/${currentUser.id}`;
        } else return ''
    };

    useEffect(() => {
    }, [location]);

    const logoutAndGoTop = (callback: () => void) => () => {
        callback();
        setIsDialogOpen(false);
        history.push('/');
    };
    return (
        <>
            <YesNoDialog msg={'サインアウトしますか？'} isOpen={isDialogOpen} doYes={logoutAndGoTop(logout)}
                         doNo={() => setIsDialogOpen(false)}/>
            <Toolbar className={styles.Header}>
                <div>
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose('')}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '20ch',
                            },
                        }}
                    >
                        {options.map((option) => (
                            <MenuItem key={option} selected={option === 'Pyxis'}
                                      onClick={handleClose(createPathFromOption(option))}>
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
                <img className={styles.HeaderTitle} src={titleURL} alt="title" onClick={() => history.push('/')}/>
                <div className={styles.RightActionContainer}>
                    {
                        (currentUser === null) ?
                            <StyledButton className={styles.HeaderButton} variant="contained" onClick={login}
                                          disableElevation>SIGNIN</StyledButton> :
                            (history.location.pathname.includes(`users/${currentUser.id}`)) ?
                                <StyledButton className={styles.HeaderButton} variant="contained"
                                              onClick={() => setIsDialogOpen(true)}
                                              disableElevation>SIGNOUT</StyledButton> :
                                <IconButton onClick={() => history.push(`/users/${currentUser.id}`)}>
                                    <img src={currentUser.photoUrl || ""} alt="user-icon"
                                         className={styles.HeaderIcon}/>
                                </IconButton>
                    }
                </div>
            </Toolbar>
        </>
    );
};


export default Header;
