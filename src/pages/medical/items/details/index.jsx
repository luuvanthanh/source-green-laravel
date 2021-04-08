import { memo, useRef } from 'react'
import { Form, List, Avatar } from 'antd'
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
  title: 'Dặn thuốc 16/3/2021',
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
}

const statusMockData = [
  {
    date: '2021/3/15 10:50', actions: [
      'Nguyễn Văn A đã nhận thuốc và cho uống',
      'Nguyễn Văn A đã cho uống',
      'Ghi chú bé đã uống thuốc',
    ]
  },
  {
    date: '2021/3/15 10:51', actions: [
      'Nguyễn Văn A đã nhận thuốc và cho uống',
      'Nguyễn Văn A đã cho uống',
      'Ghi chú bé đã uống thuốc',
    ]
  },
]

const medicineData = {
  illnesses: 'Ho',
  time: '2021/3/16',
  storageLocation: 'Trong balo bé',
  medicines: [{
    name: 'Kháng sinh',
    unit: 'Viên',
    pillTimes: [
      {
        title: 'Trước ăn sáng',
        note: 'Uống 2 viên'
      },
      {
        title: 'Sau ăn trưa',
        note: 'Uống 2 viên'
      },
    ],
    note: '',
    images: [{}, {}],
  }],
}

const { Item: ListItem } = List

const Index = memo(() => {
  const formRef = useRef()

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title="Chi tiết y tế" />
      <Pane className="row" style={{ marginBottom: 20 }}>
        <Pane className="col">
          <Heading type="page-title">Chi tiết y tế</Heading>
        </Pane>
      </Pane>

      <Pane className="row">
        <Pane className="col-lg-6">
          <Pane className="card">
            <Pane className="border-bottom" style={{ padding: 20 }}>
              <Heading type="form-sub-title" style={{ marginBottom: 10 }}>
                {moment(mockData?.createTime).format(variables.DATE_FORMAT.DATE_TIME_VI)}
              </Heading>
              <Heading type="form-title">{mockData?.title}</Heading>
            </Pane>

            <Pane className="border-bottom" style={{ padding: 20 }}>
              <label className={styles.infoLabel}>Phụ huynh</label>
              <Pane className={styles.userInformation}>
                <Avatar shape="square" size={50} icon={<UserOutlined />} />
                <Pane>
                  <h3>{mockData?.parents[0].name}</h3>
                </Pane>
              </Pane>
            </Pane>

            <Pane className="border-bottom" style={{ padding: 20 }}>
              <label className={styles.infoLabel}>Học sinh</label>
              <Pane className={styles.userInformation}>
                <Avatar shape="square" size={50} icon={<UserOutlined />} />
                <Pane>
                  <h3>{mockData?.student.name}</h3>
                </Pane>
              </Pane>
            </Pane>

            <Pane className="border-bottom" style={{ padding: 20 }}>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <label className={styles.infoLabel}>Cơ sở</label>
                  <Pane className="d-flex align-items-center">
                    <span className={styles.circleIcon}>
                      <span className={'icon-school'} />
                    </span>
                    <span className={styles.infoText}>{mockData?.position?.name}</span>
                  </Pane>
                </Pane>

                <Pane className="col-lg-6">
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

            <Pane style={{ padding: 20 }}>
              <Form
                layout="vertical"
                ref={formRef}
              >
                <Pane className="row">
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Trạng thái nhận thuốc"
                      type={variables.SELECT}
                      data={[]}
                    />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Trạng thái cho uống"
                      type={variables.SELECT}
                      data={[]}
                    />
                  </Pane>

                  <Pane className="col-lg-12">
                    <FormItem
                      label="Ghi chú"
                      name="note"
                      type={variables.INPUT}
                    />
                  </Pane>

                  <Pane className="col-lg-12">
                    <Button
                      color="success"
                      style={{ marginLeft: 'auto' }}
                    >
                      Cập nhật
                    </Button>
                  </Pane>
                </Pane>
              </Form>
            </Pane>
          </Pane>

          <Pane className="card">
            <List
              dataSource={statusMockData}
              renderItem={({ date, actions }, index) => (
                <ListItem key={index} className={styles.listItem}>
                  <Pane style={{ padding: 20, width: '100%' }} className="row">
                    <Pane className="col-md-4">
                      <Heading type="form-sub-title" style={{ marginBottom: 10 }}>
                        {moment(date).format(variables.DATE_FORMAT.DATE_TIME_VI)}
                      </Heading>
                    </Pane>
                    <Pane className="col-md-8">
                      {actions.map((action, index) => (
                        <Pane key={index}>{action}</Pane>
                      ))}
                    </Pane>
                  </Pane>
                </ListItem>
              )}
            />
          </Pane>
        </Pane>

        <Pane className="col-lg-6">
          <Pane className="card">
            <Pane className="border-bottom" style={{ padding: 20 }}>
              <Heading type="form-title" style={{ marginBottom: 20 }}>Thông tin y tế</Heading>

              <Pane>
                <label className={styles.infoLabel}>Tên bệnh:</label>
                <span className={styles.infoText}>{medicineData?.illnesses}</span>
              </Pane>

              <Pane className="row">
                <Pane className="col-lg-6">
                  <label className={styles.infoLabel}>Thời gian dặn thuốc:</label>
                  <span className={styles.infoText}>{moment(medicineData?.time).format(variables.DATE_FORMAT.DATE_VI)}</span>
                </Pane>
                <Pane className="col-lg-6">
                  <label className={styles.infoLabel}>Vị trí đặt thuốc:</label>
                  <span className={styles.infoText}>{medicineData?.storageLocation}</span>
                </Pane>
              </Pane>

            </Pane>

            <List
              dataSource={medicineData?.medicines || []}
              renderItem={({ name, unit, pillTimes, note, images }, index) => (
                <ListItem key={index} className={styles.listItem}>
                  <Pane class="w-100" style={{ padding: 20 }}>
                    <Heading type="form-block-title" style={{ marginBottom: 10 }}>
                      Thuốc {index +1}
                    </Heading>

                    <Pane>
                      <label className={styles.infoLabel}>Tên thuốc:</label>
                      <span className={styles.infoText}>{name}</span>
                    </Pane>

                    <Pane className="row">
                      <Pane className="col-lg-6">
                        <label className={styles.infoLabel}>Đơn vị:</label>
                        <span className={styles.infoText}>{unit}</span>
                      </Pane>
                      <Pane  className="col-lg-6">
                        <label className={styles.infoLabel}>Thời gian uống:</label>
                        <span className={styles.infoText}>{pillTimes.map(pill => pill.title).join(', ')}</span>
                      </Pane>

                      {(pillTimes || []).map(({ title, note }, index) => (
                        <Pane  className="col-lg-6" key={index}>
                          <label className={styles.infoLabel}>{title}:</label>
                          <span className={styles.infoText}>{note}</span>
                        </Pane>
                      ))}
                    </Pane>

                    <Pane>
                      <label className={styles.infoLabel}>Ghi chú:</label>
                      <span className={styles.infoText}>{note}</span>
                    </Pane>

                    <Pane>
                      <label className={styles.infoLabel}>Hình ảnh:</label>
                      <Pane className="row">
                        {images.map(() => (
                          <Pane className="col-lg-3">
                            <img src="https://picsum.photos/300/200" alt="medicine-image" className="d-block w-100"/>
                          </Pane>
                        ))}
                      </Pane>
                    </Pane>
                  </Pane>
                </ListItem>
              )}
            />
          </Pane>
        </Pane>
      </Pane>
    </Pane >
  )
})

export default Index
