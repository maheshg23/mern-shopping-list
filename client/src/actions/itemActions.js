import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from './types';


export const getItems = () => {
    return {
        type: GET_ITEMS
    };
}