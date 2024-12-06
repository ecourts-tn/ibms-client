// hooks/useVerifyCaptcha.js
import { useState } from 'react';
import api from '../api';

const useCaptcha = () => {
    const [captchaValid, setCaptchaValid] = useState(null);
    const [captchaImageUrl, setCaptchaImageUrl] = useState('');

    // Define fetchCaptcha inside the hook
    const fetchCaptcha = async () => {
        try {
            const response = await api.get('auth/captcha/generate/', {
                responseType: 'blob',
                withCredentials: true,
            });
            const imageBlob = URL.createObjectURL(response.data);
            setCaptchaImageUrl(imageBlob);
        } catch (error) {
            console.error('Error fetching CAPTCHA:', error);
        }
    };

    // Verify CAPTCHA and fetch new one if invalid
    const verifyCaptcha = async (captchaValue) => {
        try {
            const response = await api.post(
                'auth/captcha/verify/',
                { captcha: captchaValue },
                { withCredentials: true }
            );

            if (response.data.success) {
                setCaptchaValid(true);
                return true;
            } else {
                setCaptchaValid(false);
                await fetchCaptcha(); // Call fetchCaptcha here if verification fails
                return false;
            }
        } catch (error) {
            console.error('Error verifying CAPTCHA:', error);
            setCaptchaValid(false);
            return false;
        }
    };

    return { captchaValid, captchaImageUrl, verifyCaptcha, fetchCaptcha };
};

export default useCaptcha;
