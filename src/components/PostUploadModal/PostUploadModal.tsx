import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Params, useNavigate, useParams } from 'react-router-dom';

import './_PostUploadModal.scss'
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { BsUpload } from 'react-icons/bs'

import { PostUploadModalProps, UserData } from '../../models';
import { useTypedSelector } from '../../hooks/useTypedSelector';

import request from '../../api';
import { useActions } from '../../hooks/useActions';
import { Spinner } from '..';

const CurrentUser: UserData = JSON.parse(localStorage.getItem("gfr-user") as string);


const PostUploadModal = ({ isModalOpened, setIsModalOpened, isEditModalOpened, setIsEditModalOpened }: PostUploadModalProps) => {

    const navigate = useNavigate();
    const { postId }: Readonly<Params<string>> = useParams()

    const [selectedImage, SetSelectedImage] = useState<any>(null)
    const [fileName, setFileName] = useState('')
    const [image, setImage] = useState<any>(null)
    const [crop, setCrop] = useState<any>({ aspect: 3.5 / 2.75 })
    const [croppedImage, setCroppedImage] = useState<any>(null);
    const [imageConfirm, setImageConfirm] = useState(false);
    const [description, setDescription] = useState<any>('')
    const [projectName, setProjectName] = useState('')
    const [editPost, setEditPost] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [selectedRadioBtn, setSelectedRadioBtn] = useState('post')
    const [isProject, setIsProject] = useState(false)

    const { data: ProfilePosts }: any = useTypedSelector(
        (state) => state.GetMyPost
    )

    const { CreatePost, EditPost } = useActions();

    const uploadFileForPost = (e: any) => {
        const file = e.target.files[0]
        SetSelectedImage(URL.createObjectURL(file))
        setFileName(file.name)
    }

    const uploadPost = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setLoading(true)
        function convertdataURLtoFile(dataurl: any, filename: string) {
            let arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        }

        const convertedCroppedImage = convertdataURLtoFile(croppedImage, fileName);

        const config = {
            headers: {
                'Content-Type': 'image/jpeg'
            },
        }

        try {
            const uploadconfig = await request.get('/api/v1/uploads/signed-url', {
                params: {
                    fileType: "image",
                    fileSubType: "jpeg"
                },
                headers: {
                    'Authorization': `Bearer ${CurrentUser?.token}`,
                }
            })

            if (uploadconfig.data.key) {

                await axios.put(uploadconfig.data.url, convertedCroppedImage, config);
                let postData;
                if (isProject) {
                    postData = {
                        mediaType: "image",
                        isProject: isProject,
                        mediaURL: uploadconfig.data.key,
                        projectName: projectName,
                        description: description,
                        isOrganization: false
                    }
                } else {
                    postData = {
                        mediaType: "image",
                        isProject: isProject,
                        mediaURL: uploadconfig.data.key,
                        description: description,
                        isOrganization: false
                    }
                }


                CreatePost({
                    postData: postData, navigate, setIsModalOpened
                })
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
        }
    }

    function getCroppedImg() {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx: any = canvas.getContext("2d");

        // New lines to be added
        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        const base64Image = canvas.toDataURL("image/jpeg");
        setCroppedImage(base64Image)
    }

    const confirmFinalImage = () => {
        if (croppedImage) {
            setImageConfirm(true)
        }
        return;
    }

    useEffect(() => {
        const EditPostDetails = ProfilePosts.filter(
            (post: any) => post.id === postId
        )

        setEditPost(EditPostDetails[0])
        setDescription(EditPostDetails[0]?.description)

    }, [postId, isEditModalOpened, ProfilePosts])


    const UploadEditedPost = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const EditedPostData = {
            description: description,
        }

        EditPost({
            EditedPostData: EditedPostData, postId: postId,
            navigate, setIsEditModalOpened
        })
    }

    const isRadioSelected = (value: string): boolean => selectedRadioBtn === value;

    const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>): void => {
        console.log(e.currentTarget.value);
        setSelectedRadioBtn(e.currentTarget.value)
        if (e.currentTarget.value === 'project') {
            setIsProject(true)
        } else if (e.currentTarget.value === 'post') {
            setIsProject(false)
        }
    }

    return (
        <>
            <Spinner loader={loading} />
            <div className={selectedImage || isEditModalOpened ? 'postmodal' : 'postmodal_single'}>
                <div className='postmodal_leftside'>
                    <div className="postmodal_leftside_wrapper">
                        <div className="postmodal_leftside_image">
                            {selectedImage && !imageConfirm && (
                                <ReactCrop onImageLoaded={setImage} src={selectedImage} crop={crop} onChange={setCrop} />
                            )}
                            {
                                (imageConfirm || isEditModalOpened) && (
                                    isEditModalOpened ? <img src={editPost?.mediaURL} alt="" /> : <img src={croppedImage} alt="" />
                                )
                            }
                        </div>
                        {!selectedImage && (<div className="postmodal_leftside_content">
                            <div className="postmodal_leftside_icon">
                                <BsUpload />
                            </div>
                            <div className="postmodal_leftside_text">
                                No file chosen, yet!
                            </div>
                        </div>)}
                    </div>
                    <div className='postmodal_leftside_action'>
                        {
                            (selectedImage && !imageConfirm) && (<button className='postmodal_leftside_choose' onClick={getCroppedImg}>Crop</button>)
                        }
                        {(!selectedImage && !isEditModalOpened) &&
                            (<button className='postmodal_leftside_choose'>Choose a file</button>
                            )}
                        {!selectedImage &&
                            (<input type="file" onChange={uploadFileForPost} />
                            )}
                    </div>
                </div>
                {(selectedImage && !imageConfirm) && (
                    <div className="postmodal_rightside">
                        <div className="postmodal_rightside_wrapper">
                            <img src={croppedImage} alt="" />
                        </div>
                        <div>
                            <button className='postmodal_rightside_confirm' onClick={confirmFinalImage}>confirm</button>
                        </div>
                    </div>
                )}
                {(imageConfirm || isEditModalOpened) && (<div className="postmodal_descriptionarea">
                    <div className='postmodal_descriptionarea_wrapper'>
                        <label htmlFor="">Caption</label>
                        {isEditModalOpened ? <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='postmodal_descriptionarea_textarea' placeholder='Type Something' /> :
                            <textarea onChange={(e) => setDescription(e.target.value)} className='postmodal_descriptionarea_textarea' placeholder='Type Something' />}
                        {isProject && <div>
                            <label className='postmodal_label'>Project Name</label>
                            <input className='postmodal_input' type="text"
                                onChange={(e) => setProjectName(e.target.value)}
                            />
                        </div>}
                        <div className="postmodal_descriptionarea_actions">
                            {isEditModalOpened ? (
                                <>
                                    <button className="postmodal_descriptionarea_actions_cancel" onClick={() => {
                                        setIsEditModalOpened(false);
                                        navigate(`/profile/${CurrentUser?.id}`)
                                    }}>Discard</button>
                                    <button className="postmodal_descriptionarea_actions_post"
                                        onClick={UploadEditedPost}>Save</button>
                                </>
                            ) :
                                (
                                    <>
                                        <div className="radio_container">
                                            <form className='radio_container_form'>
                                                <label className='radio_container_label'>
                                                    <input className='radio_container_input' type="radio" value='post' name="radio" checked={isRadioSelected('post')}
                                                        onChange={handleRadioClick}
                                                    />
                                                    <span className='radio_container_span'>Post</span>
                                                </label>
                                                <label className='radio_container_label'>
                                                    <input className='radio_container_input' type="radio" value='project' name="radio" checked={isRadioSelected('project')}
                                                        onChange={handleRadioClick}
                                                    />
                                                    <span className='radio_container_span'>Project</span>
                                                </label>
                                            </form>
                                        </div>

                                        <button className="postmodal_descriptionarea_actions_cancel" onClick={() => setIsModalOpened(false)}>Cancel</button>
                                        <button className="postmodal_descriptionarea_actions_post" onClick={uploadPost}>Post</button>
                                    </>
                                )}
                        </div>
                    </div>
                </div>
                )
                }
            </div >
        </>
    )
};

export default PostUploadModal;