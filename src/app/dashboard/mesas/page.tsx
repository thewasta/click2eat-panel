"use client"
import styles from './page.module.css'

interface IExampleComponent {
    comensales: number
}

function range(start: number, end: number): number[] {
    if (start === end) return [start];
    return Array.from({ length: end - start }, (_, index) => start + index);
}

const ExampleComponent = ({comensales}: IExampleComponent) => {
    let stylesContainer;
    if (comensales === 2) {
        stylesContainer = null;
    } else if (comensales % 4 === 0) {
        stylesContainer = `${styles.four}`;
    } else if (comensales % 6 === 0) {
        stylesContainer = `${styles.six}`;
    }
    return (
        <div className={`${styles.tableContainer} ${stylesContainer ?? ''}`}>
            <div className={styles.chairsContainer}>
                {
                    range(0, comensales / 2).map((value, index) => (
                        <div key={index} className={styles.chair}></div>
                    ))
                }
            </div>
            <div className={styles.table}>
                A1
            </div>
            <div className={`${styles.chairsContainer}`}>

                {
                    range(0, comensales / 2).map((value, index) => (
                        <div key={index} className={`${styles.chair} ${styles.chairBottom}`}></div>
                    ))
                }
            </div>
        </div>
    )
}
export default function TablePage() {
    return (
        <>
            <ExampleComponent comensales={2}/>
            <ExampleComponent comensales={4}/>
            <ExampleComponent comensales={4}/>
            <ExampleComponent comensales={6}/>
            <ExampleComponent comensales={2}/>
            <ExampleComponent comensales={4}/>
        </>
    );
}