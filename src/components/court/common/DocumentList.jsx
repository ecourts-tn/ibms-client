import React, {useState} from 'react'
import config from 'config'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import ViewDocument from 'components/utils/ViewDocument'
import { formatDate } from 'utils'

const DocumentList = ({documents}) => {
    const {t} = useTranslation()
    const[selectedDocument, setSelectedDocument] = useState(null)

    const handleShow = (document) => {
        setSelectedDocument(document)
    }

    const handleClose = () => {
        setSelectedDocument(null)
    }

    return (
        <table className="table table-striped table-bordered table-sm">
            <thead className="bg-secondary">
                <tr>
                    <th>Document No.</th>
                    <th>{t('document_title')}</th>
                    <th>Submitted At</th>
                    <th>Verified</th>
                    <th>{t('action')}</th>
                </tr>
            </thead>
            <tbody>
                { documents.map((d, index) => (
                <tr key={index}>
                    <td>{ d.document_id }</td>
                    <td>{ d.title?.document_name }</td>
                    <td>{ formatDate(d.created_at) }</td>
                    <td>
                        {d.is_verified ? (
                            <span className="text-success">Verified</span>
                        ) : (
                            <span className="text-danger">Not Verified</span>
                        )}
                    </td>

                    <td>
                        <Button 
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={()=>handleShow(d)}
                        >{t('view')}</Button>
                        { selectedDocument && (
                            <ViewDocument 
                                url={`${config.docUrl}${selectedDocument.document}`}
                                title={selectedDocument.title?.document_name}
                                show={!!selectedDocument}
                                handleClose={handleClose}
                                // isDepartment={true}
                            />
                        )}
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    )
}

export default DocumentList