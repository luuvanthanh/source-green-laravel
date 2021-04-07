import { memo, useRef } from 'react'
import { Form, Input, DatePicker } from 'antd'
import moment from 'moment'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import Select from '@/components/CommonComponent/Select'
import ImageUpload from '@/components/CommonComponent/ImageUpload'

import { variables } from '@/utils/variables'

const { Item: FormItem } = Form

const genders = [
  { id: 0, name: 'Nam' },
  { id: 1, name: 'Nữ' },
]

const Other = memo(() => {
  const formRef = useRef()

  return (
    <Form
      layout="vertical"
      ref={formRef}
      initialValues={{
        name: 'Trần Thu Hà',
        id: '01',
        admissionDate: moment(),
        birthday: moment('2018/08/12'),
        gender: 1
      }}
    >
      <Pane className="card">
        <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>Khác</Heading>
          <Pane className="row">
            <Pane className="col">
              <FormItem name="note" label="Lưu ý về trẻ">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col">
              <FormItem name="desire" label="Mong muốn của phụ huynh">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col">
              <FormItem name="source" label="Nguồn">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
          </Pane>

          <Pane className="row">
            <Pane className="col">
              <FormItem name="contribute" label="Đóng góp của phụ huynh">
                <Input placeholder="Nhập" />
              </FormItem>
            </Pane>
          </Pane>
        </Pane>

        <Pane style={{ padding: 20 }}>
          <Button color="success" style={{ marginLeft: 'auto' }}>
            Lưu
          </Button>
        </Pane>
      </Pane>
    </Form>
  )
})

export default Other
