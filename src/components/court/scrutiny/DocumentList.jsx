import React, {useState} from 'react'
import config from 'config'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import ViewDocument from 'components/pages/ViewDocument'

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
                    <th>{t('document_title')}</th>
                    <th>{t('action')}</th>
                </tr>
            </thead>
            <tbody>
                { documents.map((d, index) => (
                <tr key={index}>
                    <td>{ d.title }</td>
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
                                title={selectedDocument.title}
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