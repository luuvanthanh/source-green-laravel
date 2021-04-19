import { memo, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Upload, Modal } from 'antd';
import { CloudUploadOutlined, EyeOutlined } from '@ant-design/icons';
import { useDispatch } from 'dva';

import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';

import { imageUploadProps } from '@/utils/upload';
import styles from './styles.module.scss';
import { isEmpty, get } from 'lodash';

const { beforeUpload, ...otherProps } = imageUploadProps;

const ImageUpload = memo(({ callback, fileImage }) => {
  const _mounted = useRef(false);
  const _mountedSet = (setFunction, value) => !!_mounted?.current && setFunction(value);

  const dispatch = useDispatch();
  const [image, setImage] = useState();
  const [showFullPreview, setShowFullPreview] = useState(false);

  const uploadAction = useCallback((file) => {
    dispatch({
      type: 'upload/UPLOAD',
      payload: file,
      callback: (res) => {
        if (!isEmpty(res.results)) {
          _mountedSet(setImage, {
            path: get(res, 'results[0].fileInfo.url'),
            name: get(res, 'results[0].fileInfo.name'),
          });
          callback && callback(get(res, 'results[0]'));
        }
      },
    });
  }, []);

  const uploadProps = useMemo(
    () => ({
      ...otherProps,
      beforeUpload: (file) => beforeUpload(file),
      customRequest({ file }) {
        uploadAction(file);
      },
    }),
    [uploadAction],
  );

  useEffect(() => {
    _mounted.current = true;
    return () => (_mounted.current = false);
  }, []);

  useEffect(() => {
    if (fileImage) {
      _mountedSet(setImage, { path: fileImage });
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
        <img className={styles.fullImage} src={imageUrl} alt="upload-image" />
      </Modal>
      <Pane>
        {image?.path ? (
          <Pane className={styles.imageWrapper}>
            <img className={styles.thumb} src={imageUrl} alt="upload-image-thumb" />

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
