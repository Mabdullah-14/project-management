import { API } from "./api";

export const createColumn = (columnData) => {
    return API.post('/columns', columnData).then(res => res.data);
};

export const getColumnsByBoard = (boardId) => {
    return API.get(`/columns/board/${boardId}`).then(res => res.data);
};

export const updateColumn = (id, columnData) => {
    return API.patch(`/columns/${id}`, columnData).then(res => res.data);
};

export const deleteColumn = (id) => {
    return API.delete(`/columns/${id}`).then(res => res.data);
};

export const reorderColumn=(reorderData)=>{
    return API.put('/columns/reorder',reorderData).then(res=>res.data)
}

export const searchColumn=(search="")=>{
    return API.get('/columns/search-coulumn',{params:{search}}).then(res=>res.data)
}