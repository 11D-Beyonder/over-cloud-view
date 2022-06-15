import {getRequest, postRequest, putRequest} from "@/requests/http";

export const getFileListByPath = (_) => getRequest("/file/file-list/path", _);
export const getFileListByType = (_) => getRequest("/file/file-list/type", _);
export const createFolder = (_) => postRequest("/file/folder", _);
export const getFileContent = (_) => getRequest("/transfer/download", _);
export const getFileStorage = (_) => getRequest("/transfer/storage", _);
export const getFileTree = (_) => getRequest("/file/tree", _);
export const deleteFile = (_) => putRequest("/file/delete-flag", _);
export const moveFile = (_) => putRequest("/file/path", _);
export const renameFile = (_) => putRequest("/file/name-extension", _);
export const batchMoveFile = (_) => putRequest("/file/batch-path", _);
export const batchDeleteFile = (_) => putRequest("/file/batch-delete-flag", _);
export const getDeletedFile = (_) => getRequest("/file/trash", _);
