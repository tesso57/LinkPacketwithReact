import React from 'react';
import styles from './page-container.module.css'

type Props = {
    children?: React.ReactNode
}

const pageContainer:React.FC<Props> = (props) =>{
    return(
        <>
            <main className={styles.container}>{props.children}</main>
        </>
    )
}

export default pageContainer