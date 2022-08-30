import React from 'react';
import {  CloseOutlined } from '@ant-design/icons';
import stylesModule from '../../../styles.module.scss';

const imgWithClick = { cursor: 'pointer' };

const Photo = ({ index, onClick, photo, hanDleDelete, margin, direction, top, left }) => {
  const imgStyle = { margin: margin };
  if (direction === 'column') {
    imgStyle.position = 'absolute';
    imgStyle.left = left;
    imgStyle.top = top;
  }

  const handleClick = (event) => {
    onClick(event, { photo, index });
  };

  const onDelete = (photo) => {
    hanDleDelete(photo);
  };

  return (
    <div className={stylesModule['item-img']}>
      <button className={stylesModule?.cancel} type="button" onClick={()=>onDelete(photo)}>
        <CloseOutlined />
      </button>
      <img
        style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
        {...photo}
        onClick={onClick ? handleClick : null}
        alt="img"
        role="presentation"
      />
    </div>
  );
};


export default Photo;
