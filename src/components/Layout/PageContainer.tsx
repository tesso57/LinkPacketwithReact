import React from 'react';
import styles from './page-container.module.css'


const pageContainer: React.FC = (props) => {
    return(
            <main className={styles.container}>
                {props.children}
            </main>
    )
}

export default pageContainer