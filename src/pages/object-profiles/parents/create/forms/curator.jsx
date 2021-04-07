import { memo, useRef } from 'react'
import { Form } from 'antd'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import Select from '@/components/CommonComponent/Select'

const { Item: FormItem } = Form

const Curator = memo(() => {
  const formRef = useRef()

  return (
    <Form
    layout="vertical"
    ref={formRef}
    >
      <Pane className="card">
        <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>Theo dõi</Heading>

          <Pane className="row">
            <Pane className="col-lg-4">
              <FormItem name="curator" label="Nhân viên theo dõi">
                <Select
                  placeholder="Chọn"
                  dataSet={[]}
                />
              </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="source" label="Nguồn khách hàng">
                <Select
                  placeholder="Chọn"
                  dataSet={[]}
                />
              </FormItem>
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="id" label="Mã khách hàng">
                <Select
                  placeholder="Chọn"
                  dataSet={[]}
                />
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

export default Curator