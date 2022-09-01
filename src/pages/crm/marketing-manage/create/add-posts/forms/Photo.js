import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
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
      <button className={stylesModule?.cancel} type="button" onClick={() => onDelete(photo)}>
        {/* <CloseOutlined onClick={() => onDelete(photo)} /> */}
      </button>
      

      {photo?.type === 'video' || photo?.src?.lastIndexOf('.mp4') !== -1 ? (
        <video controls width={300}>
          <source src={`${API_UPLOAD}${photo?.src}`} />
        </video>
      ) : (
        <img
          style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
          src={`${API_UPLOAD}${photo?.src}`}
          onClick={onClick ? handleClick : null}
          alt="img"
          role="presentation"
        />
      )}
    </div>
  );
};

export default Photo;
