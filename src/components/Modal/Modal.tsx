import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import './_Modal.scss'

import { useTypedSelector } from '../../hooks/useTypedSelector';
import { FollowersState } from '../../models';

import {
    Comment,
    Messages,
    PostUploadModal,
    ProjectDescriptionModal,
    ProjectTaskManageModal,
    ProjectTaskModal, CreateChatModal,
    RoomModal
} from '..';
import { ModalProps } from '../../models/Modal';



const Modal = ({ isModalOpened, setIsModalOpened,
    isEditModalOpened, setIsEditModalOpened,
    followersModal, setFollowersModal,
    followingModal, setFollowingModal,
    isCommentModalOpened, setIsCommentModalOpened,
    commentPostId, commentPostImg, isProjectDescriptionModal,
    setIsProjectDescriptionModal,
    isProjectTaskModal, setIsProjectTaskModal,
    isProjectTaskManageModal, setIsProjectTaskManageModal,
    projectTaskIndex, isChatModal, setIsChatModal,
    isRoomModal, setIsRoomModal, chatUser
}: any) => {

    const Modalref = useRef<any>()

    const { data: Followers }: FollowersState = useTypedSelector(
        (state) => state.GetUserFollowers
    )
    const { data: Followings }: FollowersState = useTypedSelector(
        (state) => state.GetFollowingUsers
    )

    let MODAL: boolean;

    if (isModalOpened) {
        MODAL = isModalOpened
    } else if (isEditModalOpened) {
        MODAL = isEditModalOpened
    } else if (followersModal) {
        MODAL = followersModal
    } else if (followingModal) {
        MODAL = followingModal
    } else if (isCommentModalOpened) {
        MODAL = isCommentModalOpened
    } else if (isProjectDescriptionModal) {
        MODAL = isProjectDescriptionModal
    } else if (isProjectTaskModal) {
        MODAL = isProjectTaskModal
    } else if (isProjectTaskManageModal) {
        MODAL = isProjectTaskManageModal
    } else if (isChatModal) {
        MODAL = isChatModal
    } else if (isRoomModal) {
        MODAL = isRoomModal
    }



    useEffect(() => {
        const checkIfClickedOutsideModal = (e: MouseEvent) => {
            if (MODAL && Modalref.current && !Modalref.current.contains(e.target)) {
                if (isModalOpened) {
                    setIsModalOpened(false)
                } else if (isEditModalOpened) {
                    setIsEditModalOpened(false)
                } else if (followersModal) {
                    setFollowersModal(false)
                } else if (followingModal) {
                    setFollowingModal(false)
                } else if (isCommentModalOpened) {
                    setIsCommentModalOpened(false)
                } else if (isProjectDescriptionModal) {
                    setIsProjectDescriptionModal(false)
                } else if (isProjectTaskModal) {
                    setIsProjectTaskModal(false)
                } else if (isProjectTaskManageModal) {
                    setIsProjectTaskManageModal(false)
                } else if (isChatModal) {
                    setIsChatModal(false)
                } else if (isRoomModal) {
                    setIsRoomModal(false)
                }
            }
        }
        document.addEventListener("mousedown", checkIfClickedOutsideModal)
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutsideModal)
        };
    }, [isModalOpened, setIsModalOpened,
        isEditModalOpened, setIsEditModalOpened,
        followersModal, setFollowersModal,
        followingModal, setFollowingModal,
        isCommentModalOpened, setIsCommentModalOpened,
        isProjectDescriptionModal, setIsProjectDescriptionModal,
        isProjectTaskModal, setIsProjectTaskModal,
        isProjectTaskManageModal, setIsProjectTaskManageModal,
        isChatModal, setIsChatModal,
        isRoomModal, setIsRoomModal]);

    if (!isModalOpened &&
        !isEditModalOpened &&
        !followersModal &&
        !followingModal &&
        !isCommentModalOpened &&
        !isProjectDescriptionModal &&
        !isProjectTaskModal &&
        !isProjectTaskManageModal &&
        !isChatModal &&
        !isRoomModal
    ) {
        return null;
    }

    return createPortal(
        <>
            <div className="modal_overlay"></div>
            <div className={(followersModal || followingModal || isRoomModal) ? "modal-sm" : "modal-lg"}
                ref={Modalref}>
                {followersModal &&
                    Followers.map((user) => (
                        <Messages followersModal={followersModal}
                            key={user.id}
                            username={user.username}
                            role={user.role}
                            userId={user.id}
                            avatar={user.avatar}
                        />
                    ))
                }
                {followingModal &&
                    Followings.map((user) => (
                        <Messages followingModal={followingModal}
                            key={user.id}
                            username={user.username}
                            role={user.role}
                            userId={user.id}
                            avatar={user.avatar}
                        />
                    ))
                }
                {(isModalOpened || isEditModalOpened) && <PostUploadModal isModalOpened={isModalOpened} setIsModalOpened={setIsModalOpened}
                    isEditModalOpened={isEditModalOpened} setIsEditModalOpened={setIsEditModalOpened} />}
                {isCommentModalOpened && <Comment commentPostId={commentPostId} commentPostImg={commentPostImg} />}
                {isProjectDescriptionModal && <ProjectDescriptionModal setIsProjectDescriptionModal={setIsProjectDescriptionModal} />}
                {isProjectTaskModal && <ProjectTaskModal setIsProjectTaskModal={setIsProjectTaskModal} />}
                {isProjectTaskManageModal && <ProjectTaskManageModal setIsProjectTaskManageModal={setIsProjectTaskManageModal}
                    projectTaskIndex={projectTaskIndex} />}
                {isChatModal && <CreateChatModal setIsChatModal={setIsChatModal} />}
                {isRoomModal && <RoomModal chatUser={chatUser} />}
            </div>
        </>,
        document.getElementById('modal') as HTMLElement
    )
};

export default Modal;