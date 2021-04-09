import { memo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Menu } from 'antd';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import GeneralForm from './forms/general';
import CuratorForm from './forms/curator';
import LevelForm from './forms/level';
import CertificateForm from './forms/certificate';
import HistoryForm from './forms/history';
import ContactForm from './forms/contact';
import HealthForm from './forms/health';
import BankForm from './forms/bank';
import TimeworkForm from './forms/timework';

import { menu, defaultKey } from './menu';

const { Item: MenuItem } = Menu;

const forms = {
  general: <GeneralForm />,
  curator: <CuratorForm />,
  level: <LevelForm />,
  certificate: <CertificateForm />,
  history: <HistoryForm />,
  contact: <ContactForm />,
  health: <HealthForm />,
  bank: <BankForm />,
  timework: <TimeworkForm />,
};

const Index = memo(({ match: { params } }) => {
  const [activeMenuItem, setActiveMenuItem] = useState(defaultKey);
  return (
    <Pane style={{ padding: 20 }}>
      <Helmet title="Tạo hồ sơ học sinh" />
      <Pane className="row" style={{ marginBottom: 20 }}>
        <Pane className="col">
          <Heading type="page-title">Tạo hồ sơ nhân viên</Heading>
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
              {params.id && menu.map(({ key, label }) => <MenuItem key={key}>{label}</MenuItem>)}
              {!params.id &&
                menu
                  .filter((item) => item.key === 'general')
                  .map(({ key, label }) => <MenuItem key={key}>{label}</MenuItem>)}
            </Menu>
          </Pane>
        </Pane>
        <Pane className="col-lg-9">{forms[activeMenuItem]}</Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
