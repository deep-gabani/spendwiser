import React from 'react';
import styles from '@/styles/Button.module.css';


const Button = ({ icon = null, text = null, onPress, buttonStyle = {}, buttonTextStyle = {}, showIconAfter = false }) => {

  return (
    <div className={styles.button} style={{ ...buttonStyle }} onClick={onPress}>
        {!showIconAfter && icon && icon}
        {text && <p className={styles.buttonText} style={{ ...buttonTextStyle }}>{text}</p>}
        {showIconAfter && icon && icon}
    </div>
  );

}


export default Button;
