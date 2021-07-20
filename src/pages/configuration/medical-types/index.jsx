import { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, TimePicker } from 'antd';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';
import moment from 'moment';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import styles from '@/assets/styles/Common/common.scss';
import { variables } from '@/utils';
import Loading from '@/components/CommonComponent/Loading';

const Index = memo(() => {
  // const params = useParams();
  const { loading, data } = useSelector(({ loading, MedicalTypes }) => ({
    loading: loading.effects,
    data: MedicalTypes.data,
  }));

  // const [{}] = useSelector(({ _ }) => []);
  const dispatch = useDispatch();

  // const history = useHistory();
  // const formRef = useRef();

  useEffect(() => {
    dispatch({
      type: 'MedicalTypes/GET_DATA',
      payload: {
        type: 'MEDICAL',
      },
    });
  }, []);

  const onActive = (event, record) => {
    dispatch({
      type: 'MedicalTypes/ACTIVE',
      payload: {
        id: record.id,
        isActive: event,
      },
      callback: (response) => {
        if (response) {
          dispatch({
            type: 'MedicalTypes/GET_DATA',
            payload: {
              type: 'MEDICAL',
            },
          });
        }
      },
    });
  };

  const onSetValue = (value, record) => {
    dispatch({
      type: 'MedicalTypes/SET_VALUE',
      payload: {
        id: record.id,
        value: moment(value).format(variables.DATE_FORMAT.HOUR),
      },
      callback: (response) => {
        if (response) {
          dispatch({
            type: 'MedicalTypes/GET_DATA',
            payload: {
              type: 'MEDICAL',
            },
          });
        }
      },
    });
  };

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title="Thiết lập cảnh báo y tế" />
      <Pane className="row justify-content-center">
        <Pane className="col-lg-12">
          <Heading type="form-title" className="mb20">
            Thiết lập cảnh báo y tế
          </Heading>
          <Pane className="card">
            <Loading loading={loading['MedicalTypes/GET_DATA']}>
              {data.map((item) => (
                <Pane className={styles['card-item']} key={item.id}>
                  <Pane className="row">
                    <Pane className="col-4 d-flex align-items-center">
                      <Pane className={styles['table-switch']}>
                        <Switch
                          checked={item.isActive}
                          onChange={(event) => onActive(event, item)}
                        />
                        <span className={styles.label}>{item.description}</span>
                      </Pane>
                    </Pane>
                    {item.configs.map((itemConfig) => (
                      <Pane
                        className="col-4 text-right d-flex align-items-center"
                        key={itemConfig.id}
                      >
                        <span className={classnames(styles.label, 'mr10')}>
                          {itemConfig?.configProperty?.description}
                        </span>
                        <TimePicker
                          disabled={!item.isActive}
                          style={{ minWidth: '100px' }}
                          format={variables.DATE_FORMAT.HOUR}
                          value={moment(itemConfig.value, variables.DATE_FORMAT.HOUR)}
                          onChange={(e) => onSetValue(e, itemConfig)}
                        />
                      </Pane>
                    ))}
                  </Pane>
                </Pane>
              ))}
            </Loading>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
