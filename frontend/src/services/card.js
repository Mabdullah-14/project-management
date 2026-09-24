import { API } from "./api";

export const createCard = (cardData) => {
    return API.post('/cards', cardData).then(res => res.data);
};

export const getCards = () => {
    return API.get('/cards').then(res => res.data);
};

export const updateCard = (id, cardData) => {
    return API.patch(`/cards/${id}`, cardData).then(res => res.data);
};

export const deleteCard = (id) => {
    return API.delete(`/cards/${id}`).then(res => res.data);
};

export const reorderCard=(cardData)=>{
    return API.put('/cards/reorder-cards',cardData).then(res=>res.data)
}

export const searchCard=(search="")=>{
    return API.get('/cards/card-search',{params:{search}}).then(res=>res.data)
}