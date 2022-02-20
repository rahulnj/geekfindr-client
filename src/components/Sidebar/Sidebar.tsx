import React, { useEffect, useState } from 'react'
import './_Sidebar.scss'
import { FiHome, FiSettings } from 'react-icons/fi'
import { BsChatLeft } from 'react-icons/bs'
import { GrProjects } from 'react-icons/gr'
import { SidebarProps } from '../../models'

import post from '../../assets/persons/1.jpeg'
import { useActions } from '../../hooks/useActions'


const Sidebar: React.FC<SidebarProps> = ({ isSidebar, handleToggleSidebar, project }) => {

    const [windowSizeListener, setWindowSizeListener] = useState(false)

    useEffect(() => {
        const listener = () => {
            if (window.innerWidth <= 540) {
                setWindowSizeListener(true)
            } else {
                setWindowSizeListener(false)
            }
        }
        window.addEventListener('resize', listener);

        return () => {
            window.removeEventListener('resize', listener)
        }
    }, [])

    const { GetMyProject } = useActions();

    useEffect(() => {
        GetMyProject()
    }, [])








    return (
        <div className={isSidebar ? "sidebar open" : "sidebar"}
            style={{ display: project ? (windowSizeListener ? 'block' : 'none') : '' }}
            onClick={() => handleToggleSidebar(false)}>
            <div className="sidebar_wrapper">
                <div className='sidebar_heading'>
                    <h4>Projects</h4>
                    {/* <span>see all</span> */}
                </div>
                <div className='sidebar_projects'>
                    <div className='sidebar_singleproject'>
                        <img src={post} alt="" />
                        <h4>Project Name</h4>
                    </div>
                </div>
                <ul className="sidebar_list">
                    <li className="sidebar_listItem">
                        <a href="#" className='sidebar_link'>
                            <FiHome size={24} className="sidebar_icon" />
                            <span className="sidebar_listItemText">Home</span>
                        </a>
                    </li>
                    <li className="sidebar_listItem">
                        <a href="#" className='sidebar_link'>
                            <BsChatLeft size={24} className="sidebar_icon" />
                            <span className="sidebar_listItemText">Chats</span>
                        </a>
                    </li>
                    <li className="sidebar_listItem">
                        <a href="#" className='sidebar_link'>
                            <GrProjects size={24} className="sidebar_icon" />
                            <span className="sidebar_listItemText">Projects</span>
                        </a>
                    </li>
                    <li className="sidebar_listItem">
                        <a href="#" className='sidebar_link'>
                            <FiSettings size={24} className="sidebar_icon" />
                            <span className="sidebar_listItemText">Settings</span>
                        </a>
                    </li>
                </ul>
                {/* <button className="sidebar_button">Show More</button>
                <hr className="sidebar_hr" /> */}
                {/* <ul className="sidebarFriendList">
                    {Users.map((u) => (
                        <CloseFriend key={u.id} user={u} />
                    ))}
                </ul> */}
            </div>
        </div >
    )
}

export default Sidebar
