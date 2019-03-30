import { differenceBy } from 'lodash';
import { SET_CAMPAIGN_DATA, DELETE_CAMPAIGN_DATA, UPDATE_CAMPAIGN_DATA } from './type';
import initialState from '../../initialState';

export default (state = initialState.campaign, action) => {
  const data = state.data;
  switch (action.type) {
    case SET_CAMPAIGN_DATA:
      return { ...state, data: action.payload };
    case UPDATE_CAMPAIGN_DATA: {
      const { index, newRecord } = action.payload;
      return {
        ...state,
        data: [...data.slice(0, index), newRecord, ...data.slice(index + 1, data.length)],
      };
    }
    case DELETE_CAMPAIGN_DATA:
      return { ...state, data: differenceBy(data, action.payload, '_id') };

    default:
      return state;
  }
};
