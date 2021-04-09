import { memo, useRef } from 'react'
import { Helmet } from 'react-helmet';
import { Form, Radio, Checkbox, List, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import FormItem from '@/components/CommonComponent/FormItem'
import Quill from '@/components/CommonComponent/Quill';
import Text from '@/components/CommonComponent/Text';

import variables from '@/utils/variables'
import styles from '@/assets/styles/Common/information.module.scss'

const { Item: FormItemAntd } = Form
const { Group: RadioGroup } = Radio
const { Item: ListItem } = List

const objectTypes = [
  { value: 1, label: 'Nhân viên' },
  { value: 2, label: 'Phụ huynh' },
]

const mockEmployee = [
  { id: 1, name: 'Nguyễn Văn Tuyết', posistion: 'Giáo viên chủ nhiệm' },
  { id: 2, name: 'Lê Xuân Thanh', posistion: 'Giáo viên' },
  { id: 3, name: 'Nguyễn Thị Linh', posistion: 'Giáo viên' },
  { id: 4, name: 'Lê Tiểu Linh', posistion: 'Giáo viên' },
]

const Index = memo(() => {
  const filterRef = useRef()
  const formRef = useRef()

  return (
    <>
      <Helmet title="Tạo thông báo" />
      <Pane className="p20">
        <Pane className="mb20">
          <Heading type="page-title">Tạo thông báo</Heading>
        </Pane>

        <Pane className="row">
          <Pane className="col-lg-6">
            <Pane className="card">
              <Form
                layout="vertical"
                ref={filterRef}
              >
                <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                  <Pane className="mb20">
                    <Heading type="form-title">Thông tin chung</Heading>
                  </Pane>

                  <FormItemAntd label="Đối tượng gửi">
                    <RadioGroup options={objectTypes} defaultValue={1} />
                  </FormItemAntd>
                </Pane>

                <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <FormItem
                        label="Cơ sở"
                        name="position"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                      />
                    </Pane>
                    <Pane className="col-lg-6">
                      <FormItem
                        label="Lớp"
                        name="class"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                      />
                    </Pane>
                  </Pane>
                </Pane>

                <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                  <FormItemAntd label="Gửi cho">
                    <Checkbox>Tất cả nhân viên</Checkbox>
                  </FormItemAntd>
                </Pane>

                <Pane className="border-bottom">
                  <List
                    dataSource={mockEmployee}
                    renderItem={({ id, name, posistion }) => (
                      <ListItem key={id} className={styles.listItem}>
                        <Pane className="px20 w-100 d-flex align-items-center">
                          <Checkbox className="mr15" />
                          <Pane className={styles.userInformation}>
                            <Avatar shape="square" size={40} icon={<UserOutlined />} />
                            <Pane>
                              <h3>{name}</h3>
                              <p>{posistion}</p>
                            </Pane>
                          </Pane>
                        </Pane>
                      </ListItem>
                    )}
                  />
                </Pane>

                <Pane className="p20">
                  <Text color="dark" size="normal">
                    Đã chọn _ nhân viên
                  </Text>
                </Pane>
              </Form>
            </Pane>
          </Pane>

          <Pane className="col-lg-6">
            <Pane className="card">
              <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                <Pane className="mb20">
                  <Heading type="form-title">Tạo thông báo</Heading>
                </Pane>

                <Form
                  layout="vertical"
                  ref={formRef}
                  initialValues={{
                    title: 'Tham gia hoạt động ngoại khóa'
                  }}
                >
                  <FormItem
                    name="title"
                    label="Tiêu đề"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                  <FormItemAntd
                    name="description"
                    label="Nội dung"
                  >
                    <Quill />
                  </FormItemAntd>
                </Form>
              </Pane>
              <Pane className="p20">
                <Button
                  color="success"
                  style={{ marginLeft: 'auto' }}
                  htmlType="submit"
                >
                  Gửi thông báo
                </Button>
              </Pane>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    </>
  )
})

export default Index
// </Pane>
