import { memo, useRef } from 'react'
import { Form, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import moment from 'moment'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import FormItem from '@/components/CommonComponent/FormItem'

import variables from '@/utils/variables'
import styles from '@/assets/styles/Common/information.module.scss'

const mockData = {
  createTime: '2021/3/15 10:30',
  id: 'GN01',
  title: 'Bé vận động',
  images: [
    'https://picsum.photos/300/200',
    'https://picsum.photos/300/200',
  ],
  parents: [{
    name: 'Nguyễn Anh'
  }],
  student: {
    name: 'Su beo'
  },
  position: {
    name: 'Lake view'
  },
  class: {
    name: 'Preschool'
  },
  employee: {
    name: 'Lê Thị Vân',
    position: 'Cơ sở 1'
  }
}

const Index = memo(() => {
  const formRef = useRef()

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title="Chi tiết ghi nhận" />
      <Pane className="row" style={{ marginBottom: 20 }}>
        <Pane className="col">
          <Heading type="page-title">Chi tiết ghi nhận</Heading>
        </Pane>
      </Pane>

      <Pane className="card">
        <Pane className="border-bottom" style={{ padding: 20 }}>
          <Pane style={{ marginBottom: 10 }}>
            <Heading type="form-sub-title">
              {moment(mockData?.createTime).format(variables.DATE_FORMAT.DATE_TIME_VI)}
            </Heading>
          </Pane>
          <Pane style={{ marginBottom: 10 }}>
            <Heading type="form-sub-title">
              Mã ID: {mockData?.id}
            </Heading>
          </Pane>
          <Pane style={{ marginBottom: 20 }}>
            <Heading type="page-title">{mockData?.title}</Heading>
          </Pane>

          <Pane className="row">
            {mockData?.images.map((url, index) => (
              <Pane className="col-lg-2" key={index}>
                <img
                  className="d-block w-100"
                  src={url}
                  alt={`student-image-${index}`}
                />
              </Pane>
            ))}
          </Pane>
        </Pane>

        <Pane className="border-bottom" style={{ padding: 20 }}>
          <Pane className="row">
            <Pane className="col-lg-3">
              <label className={styles.infoLabel}>Phụ huynh</label>
              <Pane className={styles.userInformation}>
                <Avatar shape="square" size={50} icon={<UserOutlined />} />
                <Pane>
                  <h3>{mockData?.parents[0].name}</h3>
                </Pane>
              </Pane>
            </Pane>
            <Pane className="col-lg-3">
              <label className={styles.infoLabel}>Học sinh</label>
              <Pane className={styles.userInformation}>
                <Avatar shape="square" size={50} icon={<UserOutlined />} />
                <Pane>
                  <h3>{mockData?.student.name}</h3>
                </Pane>
              </Pane>
            </Pane>
            <Pane className="col-lg-3">
              <label className={styles.infoLabel}>Cơ sở</label>
              <Pane className="d-flex align-items-center">
                <span className={styles.circleIcon}>
                  <span className={'icon-school'} />
                </span>
                <span className={styles.infoText}>{mockData?.position?.name}</span>
              </Pane>
            </Pane>
            <Pane className="col-lg-3">
              <label className={styles.infoLabel}>Lớp</label>
              <Pane className="d-flex align-items-center">
                <span className={styles.circleIcon}>
                  <span className={'icon-open-book'} />
                </span>
                <span className={styles.infoText}>{mockData?.class?.name}</span>
              </Pane>
            </Pane>
          </Pane>
        </Pane>

        <Pane className="border-bottom" style={{ padding: 20 }}>
          <Pane className="row">
            <Pane className="col-lg-3">
              <label className={styles.infoLabel}>Nhân viên</label>
              <Pane className={styles.userInformation}>
                <Avatar shape="square" size={50} icon={<UserOutlined />} />
                <Pane>
                  <h3>{mockData?.employee?.name}</h3>
                  <p>{mockData?.employee?.position}</p>
                </Pane>
              </Pane>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    </Pane >
  )
})

export default Index
