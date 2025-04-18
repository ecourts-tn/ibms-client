import React, {useState} from 'react'
import config from 'config'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import ViewDocument from 'components/utils/ViewDocument'

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
        <table className="table table-striped table-bordered table-sm mt-3">
            <thead className="bg-secondary">
                <tr>
                    <th>Document No.</th>
                    <th>{t('document_title')}</th>
                    <td>Hash</td>
                    <th>{t('action')}</th>
                </tr>
            </thead>
            <tbody>
                { documents.map((d, index) => (
                <tr key={index}>
                    <td>{`${d.efile_no}${d.id}`}</td>
                    <td>{ d.title?.document_name }</td>
                    <td>{ d.hash }</td>
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