import React from 'react';
import styles from '@/styles/TextBox.module.css';


const TextBox = ({ label = null, placeholder, onChange, value, textInputProps = {}, textInputStyle = {}, prependTextInputLabel = null }) => {

  return (
    <div className={styles.textBoxView}>
      {label && <p className={styles.label}>{label}</p>}
      <div className={styles.inputView}>
        {prependTextInputLabel && <p className={styles.prependedTextInputLabel}>{prependTextInputLabel}</p>}
        <input
          className={styles.input}
          style={{
            ...textInputStyle,
            borderLeftWidth: prependTextInputLabel ? 0 : 1
          }}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          value={value}
          {...textInputProps}
        />
      </div>
    </div>
  );
};


export default TextBox;