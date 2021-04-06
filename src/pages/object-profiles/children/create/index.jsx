import { memo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Menu } from 'antd'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import GeneralForm from './forms/general'
import CuratorForm from './forms/curator'

import { menu, defaultKey } from './menu'

const { Item: MenuItem } = Menu

const forms = {
  general: <GeneralForm />,
  curator: <CuratorForm />
}

const Index = memo(() => {
  const [activeMenuItem, setActiveMenuItem] = useState(defaultKey)

  return (
    <Pane style={{ padding: 20 }}>
      <Helmet title="Tạo hồ sơ học sinh" />
      <Pane className="row" style={{ marginBottom: 20 }}>
        <Pane className="col">
          <Heading type="page-title">Tạo hồ sơ học sinh</Heading>
        </Pane>
      </Pane>
      <Pane className="row">
        <Pane className="col-lg-3">
          <Pane className="card">
            <Menu
              selectedKeys={activeMenuItem}
              mode="inline"
              onClick={({ key }) => setActiveMenuItem(key)}
            >
              {menu.map(({ key, label }) => (
                <MenuItem key={key}>
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </Pane>
        </Pane>
        <Pane className="col-lg-9">
          {forms[activeMenuItem]}
        </Pane>
      </Pane>
    </Pane>
  )
})

export default Index
