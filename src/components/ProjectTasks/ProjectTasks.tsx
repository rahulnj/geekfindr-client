import React, { useEffect, useState } from 'react'
import './_ProjectTasks.scss'
import { AiFillBug, AiOutlineDeploymentUnit } from 'react-icons/ai'
import { GoIssueOpened } from 'react-icons/go'

import {
    MdNotificationImportant,
    MdOutlineFeaturedPlayList
} from 'react-icons/md'

import { SiAffinitydesigner, SiSpeedtest } from 'react-icons/si'
import { Params, useParams } from 'react-router-dom'
import { useActions } from '../../hooks/useActions'
import { useTypedSelector } from '../../hooks/useTypedSelector'

import {
    GetProjectDetailState,
    ProjectState,
    UserData
} from '../../models'

import Modal from '../Modal/Modal'



const ProjectTasks = () => {
    const CurrentUser: UserData = JSON.parse(localStorage.getItem("gfr-user") as string);
    const { projectId }: Readonly<Params<string>> = useParams()
    const { GetProjectDetails } = useActions()

    let { data: projectDetails }: GetProjectDetailState = useTypedSelector(
        (state) => state.GetProjectDetails
    )
    const { success: projectTaskSuccess }: ProjectState = useTypedSelector(
        (state) => state.ProjectTask
    )
    const { success: projectTaskIsCompleteSuccess }: ProjectState = useTypedSelector(
        (state) => state.ProjectTaskIsComplete
    )
    const { success: projectTaskDeleteSuccess }: ProjectState = useTypedSelector(
        (state) => state.ProjectTaskDelete
    )
    useEffect(() => {
        GetProjectDetails({
            token: CurrentUser?.token,
            projectId
        })
    }, [projectTaskSuccess, projectTaskIsCompleteSuccess, projectTaskDeleteSuccess])
    const [isProjectTaskModal, setIsProjectTaskModal] = useState(false)
    const [isProjectTaskManageModal, setIsProjectTaskManageModal] = useState(false)
    const [projectTaskIndex, setProjectTaskIndex] = useState<number>()

    console.log(projectDetails);
    const manageProjectTask = (index: number) => {
        setProjectTaskIndex(index)
        setIsProjectTaskManageModal(true)
    }


    return (
        <>
            <Modal isProjectTaskModal={isProjectTaskModal}
                setIsProjectTaskModal={setIsProjectTaskModal}
                isProjectTaskManageModal={isProjectTaskManageModal}
                setIsProjectTaskManageModal={setIsProjectTaskManageModal}
                projectTaskIndex={projectTaskIndex} />
            <div className='projecttasks'>
                <div className="projecttasks_header">
                    <h3>Tasks</h3>
                    <div className='projecttasks_input'>
                        {(projectDetails?.role === 'owner' || projectDetails?.role === 'admin') && <button className="projecttasks_buttonassign"
                            onClick={() => setIsProjectTaskModal(true)}
                        >+ Assign Tasks</button>
                        }
                    </div>
                </div>
                <hr />
                {
                    projectDetails?.project?.task?.map((task, index) => (
                        <div className='projecttasks_singletask' key={index}>
                            <div className='projecttasks_singletask_left'>
                                <h3>
                                    {task?.title}
                                </h3>
                                <p>
                                    {task?.description}
                                </p>
                            </div>
                            <div className='projecttasks_singletask_center'>
                                {
                                    task?.type === 'development' && <div className='projecttasks_singletask_center_icons'><SiSpeedtest size={24} /> Development</div> ||
                                    task?.type === 'design' && <div className='projecttasks_singletask_center_icons'> <SiAffinitydesigner size={24} />Design</div> ||
                                    task?.type === 'testing' && <div className='projecttasks_singletask_center_icons'> <SiSpeedtest size={24} fill='green' />Testing</div> ||
                                    task?.type === 'deployment' && <div className='projecttasks_singletask_center_icons'><AiOutlineDeploymentUnit size={24} fill='green' />Deployment</div> ||
                                    task?.type === 'feature' && <div className='projecttasks_singletask_center_icons'><MdOutlineFeaturedPlayList size={24} fill='green' />Feature</div> ||
                                    task?.type === 'hotfix' && <div className='projecttasks_singletask_center_icons'> <MdNotificationImportant size={24} fill='green' />Hotfix</div> ||
                                    task?.type === 'issue' && <div className='projecttasks_singletask_center_icons'> <GoIssueOpened size={24} fill='green' />Issue</div> ||
                                    task?.type === 'bug' && <div className='projecttasks_singletask_center_icons'><AiFillBug size={24} fill='red' />Bug</div>
                                }
                            </div>
                            {(task?.assignor?.id === CurrentUser?.id || projectDetails?.role === 'owner') ?
                                <div className='projecttasks_singletask_right'>
                                    <button className="projecttasks_buttonassign"
                                        onClick={() => manageProjectTask(index)}
                                    >Manage</button>
                                </div>
                                :
                                (task?.users?.includes(CurrentUser?.id) && (!task?.isComplete)) ?
                                    <>
                                        <div className='projecttasks_singletask_right'>
                                            <button className="projecttasks_buttonassign"
                                                onClick={() => manageProjectTask(index)}
                                            >pending</button>
                                        </div>
                                    </> :
                                    <div className='projecttasks_singletask_right'>
                                        <button className="projecttasks_buttonassign"
                                            onClick={() => manageProjectTask(index)}
                                        >View</button>
                                    </div>
                            }
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default ProjectTasks