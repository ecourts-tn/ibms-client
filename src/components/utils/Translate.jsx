import React, {useState} from 'react'
import api from 'api';
import Loading from './utils/Loading';

const Translate = () => {
    const[text, setText] = useState('')
    const[translatedText, setTranslatedText] = useState('')
    const[loading, setLoading] = useState(false)
    
    async function fetchCSRFToken() {
        const response = await api.get('csrf/');
        const csrfToken = response.headers['x-csrftoken'];
        return csrfToken;
    }

    async function translateText() {
        try{
            setLoading(true)
            const csrfToken = await fetchCSRFToken();
            const response = await api.post(
                'translate/',
                { text: text, source_language: 'en', target_language: 'ta' },
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                    },
                }
            );
        
            setTranslatedText(response.data)
        }catch(error){
            console.error(error)
        }finally{
            setLoading(false)
        }

    }

    return (
        <div> { loading && <Loading />}
            <textarea
                name="text"
                className='form-control'
                value={text}
                onChange={(e) => setText(e.target.value)}
            ></textarea>
            <button onClick={translateText} className="btn btn-success mt-1">Translate</button>
            <p className="mt-1">Translated Text: {translatedText.translated_text}</p>
        </div>
    )
}

export default Translate