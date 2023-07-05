import { useEffect, useRef, useState } from "react"
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import { adminApi } from '../../../utils/Apis'
import { useErrorHandler } from '../../../user/ErrorHandlers/ErrorHandler'
import { toast as toaster, ToastContainer } from 'react-toastify'
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from "primereact/button"

export default function Banner () {
  const [image, setImage] = useState({});
  const [banner, setBanner] = useState([]);
  const { adminAuthenticationHandler } = useErrorHandler();
  const toast = useRef(null);
  const fileInputRef = useRef(null);
  const dialogRef = useRef();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState(null); // Added state to store the selected banner ID

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Reset the input value to null
    }
  };

  const accept = (bannerId) => {
    console.log('yes',toast.current);
    adminApi.delete(`/delete/banner/${bannerId}`).then(({ data: { message, data } }) => {
      toast?.current?.show({ severity: 'info', summary: 'Confirmed', detail: message, life: 3000 });
      setDialogVisible(false);
      setBanner(data);
    }).catch(err => {
      console.log(err, 'err');
      adminAuthenticationHandler(err);
    });
  };

  const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'Delete canceled', life: 3000 });
  };

  useEffect(() => {
    adminApi.get('/get/all/banners').then(({ data: { data } }) => {
      setBanner(data);
    }).catch(err => {
      adminAuthenticationHandler(err);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };
    adminApi.post('/add/banner', formData, config).then(({ data: { data, message } }) => {
      console.log('on tyhen', message);
      toaster.success(message);
      resetFileInput();
      setImage({});
      setBanner(data);
    }).catch(err => {
      console.log('on catch', err);
      adminAuthenticationHandler(err);
    });
  };

  const deleteConfirm = (bannerId) => {
    console.log(bannerId);
    setSelectedBannerId(bannerId); // Store the selected banner ID
    setDialogVisible(true); // Show the dialog
  };
  
  const handleDialogAccept = () => {
    accept(selectedBannerId); // Call accept with the selected banner ID
  };
  
  const handleDialogReject = () => {
    setDialogVisible(false); // Hide the dialog
  };

    return (
        <div className="col-md-10 col-sm-9 mt-5">
            <div className="d-flex mb-2 justify-content-between">
  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" className="btn btn-primary">Add banner</button>
</div>



<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Banner</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
            <form onSubmit={handleSubmit}>
      <div class="modal-body ">
                <label htmlFor="">Image</label>
               { image?.name && <img className="w-100 my-3" src={URL.createObjectURL(image)} alt="" />}
                <input ref={fileInputRef} onChange={(e)=>{ setImage(e.target.files[0]) }} type="file" />
     </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary">upload image</button>
      </div>
            </form>
    </div>
  </div>
</div>

 <Table className="custom-table" >
  <Thead>
    <Tr>
      <Th>#</Th>
      <Th>Banner</Th>
    </Tr>
  </Thead>
  <Tbody>
   { banner.length > 0 && banner.map((x,i) => {
    return(
    <Tr >
      <Td>{i+1}</Td>
      <Td><img className="w-100 my-4" src={`${process.env.REACT_APP_URL}/public/images/banner/${x?.image}`} alt="" /></Td>
      <Td>   <Toast ref={toast} />
            {/* <ConfirmDialog visible={dialogVisible}  onHide={() => setDialogVisible(false)} ref={dialogRef} /> */}
            <div className="card flex flex-wrap gap-2 justify-content-center">
                <Button onClick={() => deleteConfirm(x._id)} icon="pi pi-times" label="Delete" />
              </div>
            </Td>
    </Tr>
    )
  })
}
    
  
  </Tbody>
  <ConfirmDialog visible={dialogVisible} onHide={handleDialogReject} accept={handleDialogAccept} reject={handleDialogReject}
  message="Do you want to delete this record?" header="Delete Confirmation" icon="pi pi-info-circle" acceptClassName="p-button-danger" />
</Table>
<ToastContainer/>
        </div>
    )
}