import React, { useState } from 'react';

import "./_UserDetailsForm.scss"

import { AiFillGithub, AiFillLinkedin } from "react-icons/ai"

import { useTypedSelector } from '../../hooks/useTypedSelector'
import { useActions } from '../../hooks/useActions';


const UserDetailsForm: React.FC = () => {

    const [bio, setBio] = useState('');
    const [organizations, setOrganizations] = useState('');
    const [experience, setExperience] = useState('');
    const [position, setPosition] = useState('');
    const [github, setGithub] = useState('');
    const [linkedin, setLinkedin] = useState('');

    const [organizationList, setOraganizationList] = useState<any>([{}]);

    // console.log(organizationList);


    const handleorganiztionListAdd = () => {
        setOraganizationList([...organizationList, { organizations: "" }])
    }

    const handleorganiztionListARemove = (index: any) => {
        console.log(index);

        const list = [...organizationList]
        console.log(organizationList);
        console.log(list);

        list.splice(index, 1)
        setOraganizationList(list)


    }





    const OnChangeBioValidator = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(e.target.value);
    }

    const OnChangeOrganizationValidator = (e: React.ChangeEvent<HTMLInputElement>, index: any) => {
        const { name, value } = e.target
        const list = [...organizationList]
        list[index][name] = value;
        setOraganizationList(list);
    }
    const OnChangeExperienceValidator = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setExperience(e.target.value);
        console.log(experience);
    }
    const OnChangePositionValidator = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPosition(e.target.value);
    }
    const OnChangeGithubValidator = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGithub(e.target.value);
    }
    const OnChangeLinkedinValidator = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLinkedin(e.target.value);
    }








    const { user }: any = useTypedSelector(
        (state) => state.UserSignin
    )

    const { UserEditProfileDetails } = useActions();


    // const EditUserProfileDetails = (e: React.SyntheticEvent) => {
    //     e.preventDefault();
    //     const editProfileData = {
    //         bio: bio,
    //         organizations: [organizations],
    //         skills: [],
    //         experience: [{ experience }],
    //         education: [{ position }],
    //         works: [{}],
    //         socials: [{ github: github }, { linkedin: linkedin }]
    //     }
    //     UserEditProfileDetails({ token: user.token, editProfileData: editProfileData })
    // }

    return (
        <div className='detailsform'>
            <div className="detailsform_title">Add your details</div>
            <form >
                <div className='detailsform_wrapper'>
                    <div className='detailsform_wrapper_input'>
                        <div className="profile-pic">
                            <label className="-label" htmlFor='file'>
                                <span className="glyphicon glyphicon-camera"></span>
                                <span>Change Profile</span>
                            </label>
                            <input className='imageinput' id="file" type="file" />
                            <img src="https://cdn.pixabay.com/photo/2017/08/06/21/01/louvre-2596278_960_720.jpg" id="output" width="200" alt='profile' />
                        </div>
                    </div>

                    <div className='detailsform_wrapper_input'>
                        <label>Position / Role</label>
                        <input type="text" placeholder='eg: developer, engineer ....' onChange={OnChangePositionValidator} />
                    </div>

                    <div className='detailsform_wrapper_input'>
                        <label>Bio</label>
                        <textarea placeholder='Add Bio' onChange={OnChangeBioValidator} />
                    </div>
                    <div className='detailsform_wrapper_input'>
                        <label>Experience</label>
                        <select placeholder='experience' onChange={OnChangeExperienceValidator}>experience
                            <option value="">select</option>
                            <option value="0-6 months">0-6 mnths</option>
                            <option value="1 year+">1 year +</option>
                            <option value="2 year+">2 year +</option>
                        </select>
                    </div>
                    <div className='detailsform_wrapper_input'>
                        <label>GitHub<AiFillGithub className='detailsform_wrapper_input_icons' size={20} /></label>
                        <input type="text" placeholder='Add profile url' onChange={OnChangeGithubValidator} />
                    </div>
                    <div className='detailsform_wrapper_input'>
                        <label>Linkedin<AiFillLinkedin className='detailsform_wrapper_input_icons' size={20} /></label>
                        <input type="text" placeholder='Add profile url' onChange={OnChangeLinkedinValidator} />
                    </div>
                    <div className='detailsform_wrapper_input'>
                        <label>Education</label>
                        <input type="text" placeholder='education' />
                    </div>
                    <div className='detailsform_wrapper_input'>
                        <label>Organization</label>
                        {organizationList.map((singleorg: any, index: any) => (
                            <React.Fragment key={index}>
                                <input type="text" name='organizations' placeholder='organization'
                                    value={singleorg.oraganizations}
                                    onChange={(e) => OnChangeOrganizationValidator(e, index)} />
                                <div className='detailsform_actions'>
                                    {organizationList.length - 1 === index && organizationList.length < 3 && (
                                        <button type='button' className='detailsform_add-btn' onClick={handleorganiztionListAdd}><span>Add +</span></button>
                                    )}

                                    {organizationList.length !== 1 && (
                                        <button type='button' className='detailsform_remove-btn' onClick={() => handleorganiztionListARemove(index)}><span>Remove -</span></button>
                                    )}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className='detailsform_wrapper_input'>
                        <button className="button-skip">Cancel</button>
                        <button type='submit' className="button-submit">Submit</button>
                    </div>

                </div>
            </form>
        </div>
    )
};

export default UserDetailsForm;
