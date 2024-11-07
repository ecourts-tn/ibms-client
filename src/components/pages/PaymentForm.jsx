import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const generateSignature = async (payload) => {
        const requiredFields = ['login', 'pass', 'txnType', 'prodid', 'amt', 'scamt', 'txnid', 'txndate'];
        for (const field of requiredFields) {
            if (!payload[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        const data = `${payload.login}${payload.pass}${payload.txnType}${payload.prodid}${payload.amt}${payload.scamt}${payload.txnid}${payload.txndate}`;
        const encoder = new TextEncoder();
        const dataBytes = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest("SHA-512", dataBytes);

        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            login: "tnhgcourt",
            pass: "ourttnh",
            txnType: "NA",
            prodid: "PHCFEE",
            txnid: "P202408020000001",
            txndate: "25-OCT-2024 11:10:22",
            amt: "500",
            scamt: "0",
            ru: "http://117.193.76.243/",
            udf1: "deenadayalan",
            udf2: "deenadayalan.mhc@gmail.com",
            udf3: "8344381139",
            udf4: "DC",
            udf5: "netbanking_payment",
            udf6: "ibms_application",
            udf7: "ATN20240000001"
        };

        try {
            const signature = await generateSignature(payload);
            payload.signature = signature;

            const res = await axios.post("https://dr.shcileservices.com/OnlineE-Payment/sEpsePmtTrans", payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                transformRequest: [(data) => {
                    return new URLSearchParams(data).toString(); // Transform data for x-www-form-urlencoded
                }],
            });

            setResponse({ status: res.status, data: res.data });

        } catch (err) {
            setError(`Request failed: ${err.response ? err.response.data : err.message}`);
        }
    };

    return (
        <div>
            <h2>Payment Form</h2>
            <form onSubmit={handleSubmit}>
                <button type="submit">Submit Payment</button>
            </form>
            {response && (
                <div>
                    <h3>Status: {response.status}</h3>
                    <p>Response: {JSON.stringify(response.data)}</p>
                </div>
            )}
            {error && <p>{error}</p>}
        </div>
    );
};

export default PaymentForm;
