import React from 'react';
import styles from './page-container.module.css'


const PageContainer:React.FC = ({children}) => {
    return(
            <main className={styles.container}>
                {children}
            </main>
    )
}

export default PageContainer