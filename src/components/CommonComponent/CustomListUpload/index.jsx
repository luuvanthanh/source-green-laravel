import React from 'react';
import { Image } from 'antd';
import { last } from 'lodash';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const allowTypesFile = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
const allowTypesImage = ['jpeg', 'jpg', 'png'];
export default function Index({ data, remove }) {
  const filterFiles = () => {
    let images = [];
    let files = [];
    data.forEach((item) => {
      if (allowTypesFile.includes(last(item.name.split('.')))) {
        files = [...files, item];
      }
      if (allowTypesImage.includes(last(item.name.split('.')))) {
        images = [...images, item];
      }
    });
    return [
      {
        images,
      },
      {
        files,
      },
    ];
  };

  return (
    <>
      {filterFiles().map((file, index) => {
        if (file.images) {
          return (
            <div
              className={classnames(
                styles.listUpload,
                'd-flex',
                'flex-wrap',
                styles['image-group'],
                'mt20',
              )}
              key={index}
            >
              <Image.PreviewGroup>
                {file.images.map((item, index) => (
                  <Image
                    width={105}
                    height={105}
                    src={item.url ? `${API_UPLOAD}${item.url}` : '/default-upload.png'}
                    key={index}
                    preview={{
                      maskClassName: 'customize-mask',
                      mask: (
                        <>
                          <span
                            className={styles.icon}
                            role="presentation"
                            onClick={(event) => {
                              event.stopPropagation();
                              remove(item);
                            }}
                          >
                            <span className="icon-close-circle" />
                          </span>
                        </>
                      ),
                    }}
                  />
                ))}
              </Image.PreviewGroup>
            </div>
          );
        }
        return (
          <div className={classnames(styles['files-container'], 'mt10')} key={index}>
            {file.files &&
              file.files.map((item) => (
                <div className={styles.item} key={item.id}>
                  <a href={`${API_UPLOAD}${item.url}`} target="_blank" rel="noreferrer">
                    {item.name}
                  </a>
                  <span
                    className="icon-cross"
                    role="presentation"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(item);
                    }}
                  />
                </div>
              ))}
          </div>
        );
      })}
    </>
  );
}

Index.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  remove: PropTypes.func,
};

Index.defaultProps = {
  data: [],
  remove: () => { },
};

Index.displayName = 'Button';
