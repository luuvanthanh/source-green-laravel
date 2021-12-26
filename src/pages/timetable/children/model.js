import * as categories from '@/services/categories';
import * as services from './services';

const FAKE_DATA = [
  {
    timeLearn: 60,
    title: 'Đón trẻ và ăn sáng',
    image:
      'https://media.istockphoto.com/photos/noisy-nursery-lesson-picture-id544352854?k=20&m=544352854&s=612x612&w=0&h=gClfvVbJxbjuo3U-nHv-8BIJLO_qIiIGtSE_kesXO1A=',
    group: 'earlyHours',
    teacher: 'Cô A',
  },
  {
    timeLearn: 30,
    title: 'Circle Time - Reahan',
    image:
      'https://media.istockphoto.com/photos/preschool-childs-picture-id1010535774?k=20&m=1010535774&s=612x612&w=0&h=-Sft6d-IjMcKP5eYgkJzQPMdpBqH-SB5ob6KCHdKuvU=',
    group: 'circleTime',
    teacher: 'Cô B',
  },
  {
    timeLearn: 15,
    title: 'Giáo cụ',
    image:
      'https://media.istockphoto.com/photos/adorable-boy-gives-thumbs-up-in-preschool-picture-id886934266?k=20&m=886934266&s=612x612&w=0&h=Fx61iZy7jvwIAoWWdYLtqDmIQOazfW0xUF9rB_QxSLU=',
    group: 'teachingAids',
    teacher: 'Cô C',
  },
  {
    timeLearn: 45,
    title: 'Bơi',
    image:
      'https://media.istockphoto.com/photos/asian-female-teacher-teaching-mixed-race-kids-reading-book-in-pre-picture-id870381458?k=20&m=870381458&s=612x612&w=0&h=g2x_2gpeXpkdaKKd76XEN5jPyEIoDl7bR5T2u80_QKc=',
    group: 'swim',
    teacher: 'Thầy A',
  },
  {
    timeLearn: 30,
    title: 'Tiếng Anh - Be',
    image:
      'https://media.istockphoto.com/photos/three-diverse-friends-at-kindergarten-picture-id1069720918?k=20&m=1069720918&s=612x612&w=0&h=rNwY1DWe5fdwNgWzvc2J17sNUdoxlwCuo5mqpd3O-PE=',
    group: 'elng',
    teacher: 'Cô E',
  },
  {
    timeLearn: 30,
    title: 'Moomin',
    image:
      'https://media.istockphoto.com/photos/nursery-children-playing-with-teacher-in-the-classroom-picture-id1124654057?k=20&m=1124654057&s=612x612&w=0&h=w1x1t-veqtavTJs00emUGAwzbEpRrvjhkC_ihc0uqZ0=',
    group: 'moomin',
    teacher: 'Cô E',
  },
  {
    timeLearn: 180,
    title: 'Ăn trưa - Ngủ trưa',
    group: 'earlyHours',
    image:
      'https://media.istockphoto.com/vectors/children-at-play-vector-id1187871269?k=20&m=1187871269&s=612x612&w=0&h=WwKXdsJvE7_9dDDkPa3REBgU8HEr13jzaBRQH-0O5qs=',
    teacher: 'Cô G',
  },
  {
    timeLearn: 10,
    title: 'Giáo cụ',
    image:
      'https://media.istockphoto.com/photos/little-girl-drawing-with-colorful-pencils-picture-id1218784963?k=20&m=1218784963&s=612x612&w=0&h=nlNu3m6yz6bds1RUXo2jFxzkFQVmXvVsvkk8aKa2WGM=',
    group: 'teachingAids',
    teacher: 'Cô H',
  },
  {
    timeLearn: 10,
    title: 'Thể chất',
    image:
      'https://media.istockphoto.com/photos/little-kids-playing-toys-in-the-playroom-picture-id1074135186?k=20&m=1074135186&s=612x612&w=0&h=ItcQ6YJ0KnsaBJnkoNElnBA2LnwFDDVNx__U06qx27o=',
    group: 'Physical',
    teacher: 'Thầy B',
  },
  {
    timeLearn: 40,
    title: 'Arkki',
    image:
      'https://media.istockphoto.com/photos/creative-kids-creative-arts-and-crafts-classes-in-after-school-picture-id1172681503?k=20&m=1172681503&s=612x612&w=0&h=rZd1qdAqe1usmSpPROoV4gaqPn8XUiQfPDo83dHAacU=',
    group: 'arkki',
    teacher: 'Cô I',
  },
  {
    timeLearn: 60,
    title: 'Ăn ngoài',
    image:
      'https://media.istockphoto.com/photos/teacher-with-preschoolers-finger-painting-at-class-picture-id1151224020?k=20&m=1151224020&s=612x612&w=0&h=MpmkXiria8JhiIN6D250KjJczyJliK7ASuwJMV47bkQ=',
    group: 'earlyHours',
    teacher: 'Cô K',
  },
  {
    timeLearn: 30,
    title: 'Đón trẻ ra về',
    image:
      'https://media.istockphoto.com/photos/they-tell-each-other-their-own-wishes-picture-id1154950781?k=20&m=1154950781&s=612x612&w=0&h=v-hJ7zpuBN7mUTUE7S3UX1ksw7G48u57l6sIEQuTpm8=',
    group: 'earlyHours',
    teacher: 'Cô M',
  },
];

export default {
  namespace: 'timeTablesChildren',
  state: {
    data: [],
    branches: [],
    classes: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
    }),
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        data: {
          ...payload,
        },
      },
    }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_CLASSES: (state, { payload }) => ({
      ...state,
      classes: payload.items,
    }),
  },
  effects: {
    *GET_BRANCHES({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getBranches, payload);
        yield saga.put({
          type: 'SET_BRANCHES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_CLASSES({ payload }, saga) {
      try {
        const response = yield saga.call(categories.getClasses, payload);
        yield saga.put({
          type: 'SET_CLASSES',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: response.items,
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_FAKE_DATA(_, saga) {
      try {
        yield saga.put({
          type: 'SET_DATA',
          payload: {
            parsePayload: FAKE_DATA,
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *REMOVE({ payload, callback }, saga) {
      try {
        yield saga.call(services.remove, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
  },
  subscriptions: {},
};
