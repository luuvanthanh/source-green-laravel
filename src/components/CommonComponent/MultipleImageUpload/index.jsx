import { memo, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Upload, Modal } from 'antd';
import { CloudUploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'dva';
import { get } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';

import { imageUploadProps } from '@/utils/upload';
import styles from './styles.module.scss';

const { beforeUpload, ...otherProps } = imageUploadProps;

const ImageUpload = memo(({ callback, removeFiles, files }) => {
  const _mounted = useRef(false);
  const _mountedSet = (setFunction, value) => !!_mounted?.current && setFunction(value);

  const dispatch = useDispatch();
  const [images, setImages] = useState(files);
  const [showFullPreviewUrl, setShowFullPreviewUrl] = useState();

  const uploadAction = useCallback((file) => {
    dispatch({
      type: 'upload/UPLOAD',
      payload: file,
      callback: (res) => {
        if (res) {
          _mountedSet(setImages, (prev) => [...prev, get(res, 'results[0].fileInfo.url')]);
          callback && callback(get(res, 'results[0].fileInfo.url'));
        }
      },
    });
  }, []);

  const uploadProps = useMemo(
    () => ({
      ...otherProps,
      multiple: true,
      beforeUpload: (file) => beforeUpload(file),
      customRequest({ file }) {
        const allowImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 2 ** 20;
        const { type, size } = file;

        if (!allowImageTypes.includes(type)) {
          return;
        }

        if (size > maxSize) {
          return;
        }

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
    _mountedSet(setImages, files);
  }, [files]);

  return (
    <>
      <Modal
        visible={!!showFullPreviewUrl}
        title="Hình ảnh"
        footer={null}
        onCancel={() => setShowFullPreviewUrl()}
      >
        <img className={styles.fullImage} src={showFullPreviewUrl} alt="upload-image" />
      </Modal>

      <Pane className="row">
        {(images || []).map((item, index) => (
          <Pane className="col-lg-3" key={index}>
            <Pane className={styles.imageWrapper}>
              <img
                className={styles.thumb}
                src={`${API_UPLOAD}/${item}`}
                alt="uploaded-image=thumb"
              />

              <Pane className={styles.actions}>
                <EyeOutlined onClick={() => setShowFullPreviewUrl(`${API_UPLOAD}/${item}`)} />
                <DeleteOutlined
                  onClick={() => {
                    setImages((prev) => prev.filter((image) => image !== item));
                    removeFiles && removeFiles(images.filter((image) => image !== item));
                  }}
                />
              </Pane>
            </Pane>
          </Pane>
        ))}

        <Pane className="mt-4 col d-flex align-items-center">
          <Upload {...uploadProps} listType="picture-card">
            <CloudUploadOutlined />
          </Upload>
        </Pane>
      </Pane>
    </>
  );
});

export default ImageUpload;
