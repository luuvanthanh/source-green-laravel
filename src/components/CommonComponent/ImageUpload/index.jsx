import { memo, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Upload, Modal } from 'antd';
import { CloudUploadOutlined, EyeOutlined } from '@ant-design/icons';
import { useDispatch } from 'dva';
import PropTypes from "prop-types";

import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';

import { imageUploadProps } from '@/utils/upload';
import { isEmpty, get } from 'lodash';
import styles from './styles.module.scss';

const { beforeUpload, ...otherProps } = imageUploadProps;

const ImageUpload = memo(({ callback, fileImage }) => {
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) => !!mounted?.current && setFunction(value);

  const dispatch = useDispatch();
  const [image, setImage] = useState();
  const [showFullPreview, setShowFullPreview] = useState(false);

  const uploadAction = useCallback((file) => {
    dispatch({
      type: 'upload/UPLOAD',
      payload: file,
      callback: (res) => {
        if (!isEmpty(res.results)) {
          mountedSet(setImage, {
            path: get(res, 'results[0].fileInfo.url'),
            name: get(res, 'results[0].fileInfo.name'),
          });
          callback(get(res, 'results[0]'));
        }
      },
    });
  }, []);

  const uploadProps = useMemo(
    () => ({
      ...otherProps,
      customRequest({ file }) {
        if(beforeUpload(file)) uploadAction(file);
      },
    }),
    [uploadAction],
  );

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (fileImage) {
      mountedSet(setImage, { path: fileImage });
    }
  }, [fileImage]);

  const imageUrl = useMemo(() => `${API_UPLOAD}/${image?.path}`, [image]);

  return (
    <>
      <Modal
        visible={showFullPreview}
        title="Hình ảnh"
        footer={null}
        onCancel={() => setShowFullPreview(false)}
      >
        <img className={styles.fullImage} src={imageUrl} alt="upload-img" />
      </Modal>
      <Pane>
        {image?.path ? (
          <Pane className={styles.imageWrapper}>
            <img className={styles.thumb} src={imageUrl} alt="upload-img-thumb" />

            <Pane className={styles.actions}>
              <EyeOutlined className={styles.preview} onClick={() => setShowFullPreview(true)} />
              <Upload {...uploadProps}>
                <CloudUploadOutlined />
              </Upload>
            </Pane>
          </Pane>
        ) : (
          <Upload {...uploadProps}>
            <Button color="success" ghost>
              <CloudUploadOutlined /> Tải lên
            </Button>
          </Upload>
        )}
      </Pane>
    </>
  );
});

export default ImageUpload;

ImageUpload.propTypes = {
  callback: PropTypes.func,
  fileImage: PropTypes.any,
};

ImageUpload.defaultProps = {
  callback: () => {},
  fileImage: "",
};
