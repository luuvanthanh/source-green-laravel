import { memo, useState } from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';


import variablesModules from '../../variables';
import styles from '../../index.scss';
import EveryDayComponent from './everyDayComponent';
import HistoryComponent from './historyComponent';
import ChartComponent from './chartComponent';

const { TabPane } = Tabs;

const Index = memo(({ studentId }) => {

  const [tab, setTab] = useState('everyDay');

  const tables = (tab) => {
    switch (tab) {
      case 'everyDay':
        return <EveryDayComponent studentId={studentId} status={tab} />;

      case 'chart':
        return <ChartComponent studentId={studentId} status={tab} />;

      case 'history':
        return <HistoryComponent studentId={studentId} status={tab} />;

      default:
        return null;
    }
  };

  const changeTab = (tab) => {
    setTab(tab);
  };

  return (
    <div className={styles['container-bus']}>
      <Tabs onChange={changeTab} activeKey={tab}>
        {variablesModules.TABS_HEALTH.map(({ id, name }) => (
          <TabPane tab={name} key={id} />
        ))}
      </Tabs>
      {tables(tab)}
    </div>
  );
});

Index.propTypes = {
  studentId: PropTypes.string,
};

Index.defaultProps = {
  studentId: '',
};

export default Index;
