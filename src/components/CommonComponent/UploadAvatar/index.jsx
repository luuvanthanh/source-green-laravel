import { memo, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Upload, Image } from 'antd';
import { CloudUploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'dva';
import { get } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';

import { imageUploadProps } from '@/utils/upload';
import { Helper } from '@/utils';

const { beforeUpload, ...otherProps } = imageUploadProps;

const ImageUpload = memo(({ callback, removeFiles, files }) => {
  const _mounted = useRef(false);
  const _mountedSet = (setFunction, value) => !!_mounted?.current && setFunction(value);

  const dispatch = useDispatch();
  const [images, setImages] = useState(files || []);

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
      beforeUpload: () => null,
      customRequest({ file }) {
        const allowImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
        const maxSize = 20 * 2 ** 20;
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
      <Pane className="row">
        <div className="pl10">
          <Image.PreviewGroup>
            {(images || []).map((item, index) => {
              if (Helper.isVideo(item)) {
                return (
                  <Image
                    width={105}
                    height={105}
                    src="/image-default.png"
                    key={index}
                    preview={{
                      maskClassName: 'customize-mask',
                      mask: (
                        <>
                          <EyeOutlined className="mr5" />
                          <DeleteOutlined
                            onClick={(event) => {
                              event.stopPropagation();
                              setImages((prev) => prev.filter((image) => image !== item));
                              removeFiles && removeFiles(images.filter((image) => image !== item));
                            }}
                          />
                        </>
                      ),
                    }}
                  />
                );
              }
              return (
                <div key={index} className="container-preview-image" style={{ backgroundImage: `url(${API_UPLOAD}${item})` }}>
                  <Image
                    width={102}
                    height={102}
                    src={`${API_UPLOAD}${item}`}
                    preview={{
                      maskClassName: 'customize-mask',
                      mask: (
                        <>
                          <EyeOutlined className="mr5" />
                          <DeleteOutlined
                            onClick={(event) => {
                              event.stopPropagation();
                              setImages((prev) => prev.filter((image) => image !== item));
                              removeFiles && removeFiles(images.filter((image) => image !== item));
                            }}
                          />
                        </>
                      ),
                    }}
                  />
                </div>
              );
            })}
          </Image.PreviewGroup>
        </div>

        <Pane className="col d-flex align-items-center">
          <Upload {...uploadProps} listType="picture-card">
            <CloudUploadOutlined />
          </Upload>
        </Pane>
      </Pane>
    </>
  );
});

export default ImageUpload;
