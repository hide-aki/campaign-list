import { SET_CAMPAIGN_DATA, DELETE_CAMPAIGN_DATA, UPDATE_CAMPAIGN_DATA } from './type';

export const setCampaignData = payload => ({ type: SET_CAMPAIGN_DATA, payload });
export const deleteCampaignData = payload => ({ type: DELETE_CAMPAIGN_DATA, payload });
export const updateCampaignData = payload => ({ type: UPDATE_CAMPAIGN_DATA, payload });
