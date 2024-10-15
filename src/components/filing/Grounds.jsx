// import api from '../../api'
// import React, {useState, useEffect} from 'react'
// import { toast, ToastContainer } from 'react-toastify'
// import { nanoid } from '@reduxjs/toolkit'

// const Grounds = () => {
//     const initialState = {
//         id: nanoid(),
//         description: ''
//     }
//     const[form, setForm] = useState(initialState)
//     const[grounds, setGrounds] = useState([])
//     const[count, setCount] = useState(0)
//     const validationSchema = Yup.object({
//         description: Yup.string().required("The description field may not be blank").max(3000, "Description should not be more than 3000 characters")
//     })
   
//     useEffect(() => {
//         const fetchGrounds = async() => {
//             try{
//                 cino = localStorage.getItem("cino")
//                 const response = await api.get("api/bail/filing/grounds/list", {
//                     params: {
//                         cino:cino
//                     }
//                 })
//                 if(response.status === 200){
//                     setGrounds(response.data)
//                 }
//             }catch(error){
//                 console.log(error)
//             }
//         }
//         fetchGrounds()
//     }, [grounds])

//     const saveGround = async () => {
//         try{
//             await  validationSchema.validate(form, {abortEarly: false})
//             const cino = localStorage.getItem("cino")
//             const response = await api.post(`api/bail/filing/${cino}/grounds/create/`, form)
//             if(response.status === 201){
//                 setCount(count+1)
//                 setForm(initialState)
//                 toast.success("Grounds added successfully", {
//                     theme: "colored"
//                 })
//             }
//         }catch(error){
//             const newErrors = {};
//             error.inner.forEach((err) => {
//                 newErrors[err.path] = err.message;
//             });
//             setErrors(newErrors);
//         }
//     }

//     const deleteGround = async (id) => {
//         try{
//             if(window.confirm("Are you sure you want to submit the petition")){
//                 const newGrounds = grounds.filter((ground) => {
//                     return ground.id !== id
//                 })
//                 const response = await api.delete(`api/bail/filing/${id}/grounds/delete/`)
//                 if(response.status === 204){
//                     toast.error("Grounds details deleted successfully", {
//                         theme:"colored"
//                     })
//                     setGrounds(newGrounds)
//                     setCount(count-1)
//                 }
//             }
//         }catch(error){
//             console.error(error)
//         }
//     }

//     const editGround = async(id) => {
//         try{
//             const response = await api.get("api/bail/filing/ground/read/", {
//                 params:{
//                     cino:cino
//                 }
//             })
//             if(response.status === 200){
//                 setForm(response.data)
//             }
//         }catch(error){
//             console.error(error)
//         }
//     }

//     const updateGround = async(id) => {
//         try{
//             const response = await api.put("api/bail/filing/ground/update/", form, {
//                 params: {
//                     id:id
//                 }
//             })
//             if(response.status === 201){
//                 toast.success("Grounds details added successfully", {
//                     theme:"colored"
//                 })
//                 setForm(initialState)
//             }
//         }catch(error){
//             console.error(error)
//         }
//     }

//     return (
//         <>
//             <ToastContainer />
//             <div className="container-fluid m-0">
//                 <div className="card">
//                     <div className="card-header">
//                         <h3 className="card-title"><i className="fas fa-file mr-2"></i><strong>Grounds</strong></h3>
//                     </div>
//                     <div className="card-body p-1">
//                         <div className="row">
//                             <div className="col-md-12">
//                             { grounds.map((ground, index) => (
//                                 <div className="card" key={index}>
//                                     <div className="card-body">
//                                         {ground.description}
//                                     </div>
//                                     <div className="card-footer d-flex justify-content-end" style={{backgroundColor:"inherit", borderTop:"none", marginTop:"-20px"}}>
//                                     <Button 
//                                             variant="primary" 
//                                             size="sm" 
//                                             className="mr-2"
//                                         >
//                                             <i className="fa fa-pencil-alt mr-2"></i>
//                                         Edit</Button>
//                                         <Button 
//                                             variant="danger" 
//                                             size="sm" 
//                                             onClick={()=>handleDelete(ground) }
//                                         >
//                                             <i className="fa fa-trash mr-2"></i>
//                                         Delete</Button>
//                                     </div>
//                                 </div>
//                             ))}
//                             </div>   
//                             <div className="col-md-12"> 
//                                 <div className="form-group">
//                                     <Editor 
//                                         value={form.description} 
//                                         onChange={(e) => setForm({...form, description: e.target.value })} 
//                                         style={{ minHeight:'300px'}}
//                                     />
//                                     <div className="invalid-feedback">
//                                         { errors.description }
//                                     </div>
//                                 </div>
//                                 <div className="form-group">
//                                     <Button 
//                                         variant="contained"
//                                         color="success"
//                                         onClick={saveGround}
//                                     >
//                                         <i className="fa fa-plus mr-2"></i>
//                                     Add Ground</Button>
//                                 </div>    
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//      )
// }


// export default Grounds