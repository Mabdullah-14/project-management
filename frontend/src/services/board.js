import { API } from "./api"

export const createBoard = (boardData) => {
    return API.post('/boards', boardData).then(res => res.data)
}

export const getBoard = (page = 1, limit = 6) => {
    return API.get('/boards', {
        params: { page, limit }
    }).then(res => res.data)
}

export const updateBoard = (id, boardData) => {
    return API.patch(`/boards/${id}`, boardData).then(res => res.data)
}

export const deleteBoard = (id) => {
    return API.delete(`/boards/${id}`).then(res => res.data)
}

export const getBoardById = (id) => {
    return API.get(`/boards/${id}`).then(res => res.data)
}

export const searchBoard = (search = "") => {
    return API.get('/boards/search-board', {
        params: { search }
    }).then(res => res.data)
}