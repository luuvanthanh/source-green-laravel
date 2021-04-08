import { memo, useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Upload, Modal } from 'antd'
import { CloudUploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { useDispatch } from 'dva'

import Pane from '@/components/CommonComponent/Pane'

import { imageUploadProps } from '@/utils/upload'
import styles from './styles.module.scss'

const { beforeUpload, ...otherProps } = imageUploadProps

// / Dùng tạm api image của DEV ERP TRẦN
const API_URL = 'http://api-dev.erptran.projects.greenglobal.vn:11018/erptran'

const ImageUpload = memo((callback) => {
  const _mounted = useRef(false)
  const _mountedSet = (setFunction, value) => !!_mounted?.current && setFunction(value)

  const dispatch = useDispatch()
  const [images, setImages] = useState([]);
  const [showFullPreviewUrl, setShowFullPreviewUrl] = useState();

  const uploadAction = useCallback((file) => {
    dispatch({
      type: 'upload/UPLOAD',
      payload: file,
      callback: res => {
        if (res) {
          _mountedSet(setImages, prev => [...prev, {
            path: res?.path,
            name: file?.name
          }])
          callback && callback(res)
        }
      }
    })
  }, [])

  const uploadProps = useMemo(() => ({
    ...otherProps,
    beforeUpload: (file) => beforeUpload(file, uploadAction),
  }), [uploadAction])

  useEffect(() => {
    _mounted.current = true
    return () => (_mounted.current = false)
  }, [])

  return (
    <>
      <Modal
        visible={!!showFullPreviewUrl}
        title="Hình ảnh"
        footer={null}
        onCancel={() => setShowFullPreviewUrl()}
      >
        <img
          className={styles.fullImage}
          src={showFullPreviewUrl}
          alt="upload-image"
        />
      </Modal>

      <Pane className="row">
        {(images || []).map(({ path }, index) => (
          <Pane className="col-lg-3" key={index}>
            <Pane className={styles.imageWrapper}>
              <img
                className={styles.thumb}
                src={`${API_URL}/${path}`}
                alt="uploaded-image=thumb"
              />

              <Pane className={styles.actions}>
                <EyeOutlined
                  onClick={() => setShowFullPreviewUrl(`${API_URL}/${path}`)}
                />
                <DeleteOutlined
                  onClick={() => setImages(prev => prev.filter(image => image?.path !== path))}
                />
              </Pane>
            </Pane>
          </Pane>
        ))}

        <Pane className="col d-flex align-items-center">
          <Upload {...uploadProps} listType="picture-card">
            <CloudUploadOutlined />
          </Upload>
        </Pane>
      </Pane>
    </>
  )
})

export default ImageUpload
