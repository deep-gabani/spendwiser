import React from 'react';
import styles from '@/styles/TextView.module.css';


const TextView = ({ texts, viewStyle = {}, inline = true }) => {

  return (
    <div className={styles.view} style={{ ...viewStyle, flexDirection: inline ? 'row' : 'column' }}>
      {texts.map(text => {
        const label = text[0];
        const style = text.length > 1 ? text[1] : {};
        return (
          <p
            key={text}
            className={styles.text}
            style={{ ...style }}>{label}</p>
        );
      })}
    </div>
  );

}


export default TextView;
