import React, { useState, useEffect, useContext } from 'react'
// import GroundsList from './GroundsList'
// import GroundsForm from './GroundsForm'
import api from 'api'
import { useTranslation } from 'react-i18next'
import { toast, ToastContainer } from 'react-toastify'
import Loading from 'components/utils/Loading'
import * as Yup from 'yup'
import Button from 'react-bootstrap/Button';
import Editor from 'react-simple-wysiwyg';
import { CreateMarkup } from 'utils'
import { BaseContext } from 'contexts/BaseContext'

const Grounds = () => {

    const[grounds, setGrounds] = useState([])
    const[isUpdate, setIsUpdate] = useState(false)
    const[selectedGround, setSelectedGround] = useState(null)
    const[loading, setLoading] = useState(false)
    const {efileNumber} = useContext(BaseContext)
    const {t} = useTranslation()
    
    useEffect(() => {
        const fecthGrounds = async() => {
            try{
                const response = await api.get("case/ground/", {params:{efile_no:efileNumber}})
                if(response.status === 200){
                    setGrounds(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fecthGrounds()
    }, [])

    const addGround = async (ground) => {
        try{
            setLoading(true)
            if(!isUpdate){
                ground.efile_no = efileNumber
                const response = await api.post(`case/ground/`, ground)
                if(response.status === 201){
                    setGrounds(grounds => [...grounds, ground])
                    toast.success(t('alerts.ground_added'), {theme:"colored"})
                }
            }else{
                const response = await api.put(`case/ground/update/`, ground)
                if(response.status === 200){
                    setIsUpdate(false)
                    toast.success("ground updated successfully", {theme:"colored"})
                }
            }
        }catch(error){
            console.error(error)
        }finally{
            setIsUpdate(false)
            setLoading(false)

        }
    }

    const editGround = async(ground) => {
        try{
            const response = await api.get(`case/ground/detail/`, {
                params: {
                    id:ground.id,
                    efile_no:ground.efile_no
                }
            })
            if(response.status === 200){
                setIsUpdate(true)
                setSelectedGround(response.data)
            }
        }catch(error){
            console.log(error)
        }
    }

    const deleteGround = async(ground) => {
        try{
            const newGrounds = grounds.filter((g) => {
                return g.id !== ground.id
            })
            const response = await api.delete(`case/ground/delete/`, {
                data:{
                    id:ground.id,
                    efile_no:ground.efile_no
                }
            })
            if(response.status === 204){
                setGrounds(newGrounds)
                toast.error(t('alerts.ground_deleted'), {
                    theme: "colored"
                })
            }
        }catch(error){
            console.error(error)
        }
    }

    return (
        <div className="container-fluid">
            { loading && <Loading />}
            <div className="row">
                <div className="col-md-12">
                    <GroundsList 
                        grounds={grounds} 
                        deleteGround={deleteGround} 
                        editGround={editGround}
                    />
                </div>   
                { parseInt(grounds.length) < 3 && (
                <div className="col-md-12"> 
                    <GroundsForm 
                        addGround={addGround} 
                        selectedGround={selectedGround}
                    />
                </div>
                )}
            </div>
        </div>
    )
}

export default Grounds




const GroundsForm = ({ addGround, selectedGround }) => {
    // Yup validation schema
    const validationSchema = Yup.object({
        description: Yup.string()
            .max(3000, "Description should not be more than 3000 characters") // Max 3000 characters
            .required("The description field may not be blank") // Required field
    });

    const initialState = {
        description: ''
    };
    const [ground, setGround] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [remainingChars, setRemainingChars] = useState(3000); // Set to 3000 as per your requirement
    const { t } = useTranslation();

    // Save the ground to the parent component
    const saveGround = async () => {
        try {
            // Validate using Yup validation schema
            await validationSchema.validate(ground, { abortEarly: false });
            addGround(ground); // If valid, add the ground and reset
            setGround(initialState);
            setRemainingChars(3000); // Reset remaining characters to 3000 after save
        } catch (error) {
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors); // Update errors with validation messages
        }
    };

    // If there is a selected ground, populate it in the state
    useEffect(() => {
        if (selectedGround) {
            setGround(selectedGround);
        }
        setRemainingChars(3000); // Ensure it starts at 3000
        setErrors({ description: '' }); // Clear any errors on initial render
    }, [selectedGround]);

    // Handle the editor change and limit the characters
    const handleEditorChange = (e) => {
        const newValue = e.target.value;

        // Directly calculate the remaining characters from the input
        const updatedRemainingChars = 3000 - newValue.length;

        // Update state if the length is within the limit (3000 characters)
        if (updatedRemainingChars >= 0) {
            setGround({ ...ground, description: newValue });
            setRemainingChars(updatedRemainingChars); // Update remaining characters correctly
            setErrors({ ...errors, description: '' }); // Clear error if within limit
        } else {
            setErrors({ ...errors, description: 'Maximum 3000 characters only allowed' }); // Show error message if limit is exceeded
        }
    };

    const handlePaste = (e) => {
        // Get the pasted content
        const pastedContent = e.clipboardData.getData('text');
        
        // Combine the current content and pasted content
        const newContent = ground.description + pastedContent;

        // Check if the new content exceeds the 3000 character limit
        if (newContent.length > 3000) {
            e.preventDefault(); // Prevent the paste
            const truncatedContent = newContent.slice(0, 3000); // Truncate to 3000 characters
            setGround({ ...ground, description: truncatedContent });
            setRemainingChars(0); // No remaining characters if truncated
        } else {
            // Allow the paste if it's within the limit
            setGround({ ...ground, description: newContent });
            setRemainingChars(3000 - newContent.length); // Update remaining characters correctly
            setErrors({ ...errors, description: '' }); // Clear error if within limit
        }
    };
    // const handleKeyDown = (e) => {
    //     if (e.key === 'Enter') {
    //       e.preventDefault();  // Prevent the default behavior (line break)
    //     }
    //   };

    return (
        <React.Fragment>
            <ToastContainer />
            <div className="form-group">
                <Editor
                    value={ground.description}
                    onChange={handleEditorChange}  // Handle text change
                    onPaste={handlePaste}  // Handle paste event
                    // onKeyDown={handleKeyDown} 
                    style={{ minHeight: '300px', width: '100%' }}  // Added width to ensure it's full-width
                />
                {/* Display remaining characters */}
                <div>
                    <span>{remainingChars} characters remaining</span>
                </div>
                {errors.description && (
                    <div style={{ color: 'red' }}>{errors.description}</div> // Display error if max limit exceeded
                )}
            </div>
            <div className="form-group">
                <Button variant="success" onClick={saveGround}>
                    <i className="fa fa-plus mr-2"></i>
                    {t('add_ground')}
                </Button>
            </div>
        </React.Fragment>

    );
};


const GroundsList = ({grounds, deleteGround, editGround}) => {
    const {t} = useTranslation()
    return (
        <>
            { grounds.map((ground, index) => (
                <div className="card" key={index}>
                    <div className="card-body" dangerouslySetInnerHTML={CreateMarkup(ground.description)}>

                    </div>
                    <div className="card-footer d-flex justify-content-end" style={{backgroundColor:"inherit", borderTop:"none", marginTop:"-20px"}}>
                    <Button 
                            variant="primary" 
                            size="sm" 
                            className="mr-2"
                            onClick={()=>editGround(ground) }
                        >
                            <i className="fa fa-pencil-alt"></i>
                        </Button>
                        <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={()=>deleteGround(ground) }
                        >
                            <i className="fa fa-trash"></i>
                        </Button>
                    </div>
                </div>
            ))}
        </>
    )
}