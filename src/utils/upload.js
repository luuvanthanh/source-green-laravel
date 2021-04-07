import { message } from 'antd';

const allowImageTypes = ['image/jpeg', 'image/png'];

const warningType = 'Định dạng hình ảnh thuộc loại .JPG, .PNG';

const maxSize = 5 * 2 ** 20; // 5 mB

const warningSize = 'Dung lượng hình ảnh nhỏ hơn 5MB';

export const imageUploadProps = {
  beforeUpload: (file) => {
    const { type, size } = file;

    if (!allowImageTypes.includes(type)) {
      return message.error(warningType);
    }

    if (size > maxSize) {
      return message.error(warningSize);
    }

    return null;
  },
  showUploadList: false,
  fileList: [],
};
