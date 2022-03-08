import { CreateConversationOrRoomActionType, GetMyChatsActionType } from "../actiontypes";

//Action model for creating a conversation or a room

interface CreateConversationOrRoomRequestAction {
    type: CreateConversationOrRoomActionType.CREATE_CONVERSATION_OR_ROOM_REQUEST
}

interface CreateConversationOrRoomSuccessAction {
    type: CreateConversationOrRoomActionType.CREATE_CONVERSATION_OR_ROOM_SUCCESS
    payload: string[]
}

interface CreateConversationOrRoomFailAction {
    type: CreateConversationOrRoomActionType.CREATE_CONVERSATION_OR_ROOM_FAIL
    payload: string[]
}

export type CreateConversationOrRoomAction =
    | CreateConversationOrRoomRequestAction
    | CreateConversationOrRoomSuccessAction
    | CreateConversationOrRoomFailAction

//Action models for getting currentuser conversations.

interface GetMyChatsRequestAction {
    type: GetMyChatsActionType.GET_MY_CHATS_REQUEST
}

interface GetMyChatsSuccessAction {
    type: GetMyChatsActionType.GET_MY_CHATS_SUCCESS
    payload: string[]
}

interface GetMyChatsFailAction {
    type: GetMyChatsActionType.GET_MY_CHATS_FAIL
    payload: string[]
}

export type GetMyChatsAction =
    | GetMyChatsRequestAction
    | GetMyChatsSuccessAction
    | GetMyChatsFailAction