import React from 'react';
import styles from './PageContainer.module.scss'


const PageContainer:React.FC = ({children}) => {
    return(
            <main className={styles.container}>
                {children}
            </main>
    )
}

export default PageContainer