import React from 'react';
import styles from './page-container.module.css'


const pageContainer:React.FC = ({children}) => {
    return(
            <main className={styles.container}>
                {children}
            </main>
    )
}

export default pageContainer