import { message } from 'antd';

const allowImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

const warningType = 'Định dạng hình ảnh thuộc loại .JPG, .PNG';

const maxSize = 5 * 2 ** 20; // 5 mB

const warningSize = 'Dung lượng hình ảnh nhỏ hơn 5MB';

export const imageUploadProps = {
  beforeUpload: (file) => {
    const { type, size } = file;

    if (!allowImageTypes.includes(type)) {
      message.error(warningType);
      return null;
    }

    if (size > maxSize) {
      message.error(warningSize);
      return null;
    }

    return file;
  },
  showUploadList: false,
  fileList: [],
};
