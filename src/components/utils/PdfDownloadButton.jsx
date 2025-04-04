// PdfDownloadButton.jsx
import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfDocument from './PdfDocument';
import api from 'api';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';

const PdfDownloadButton = ({state}) => {
//   const { state } = useLocation();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!state?.efile_no) return;

    async function fetchData() {
      try {
        const response = await api.get(`case/filing/detail/`, {
          params: { efile_no: state.efile_no },
        });

        if (response.status === 200) {
          const petition = response.data.petition;
          const advocates = response.data.advocates;
          const crime = response.data.crime;
          const grounds = response.data.grounds;
          const petitioner = response.data.litigants.filter(l => l.litigant_type === 1);
          const respondent = response.data.litigants.filter(l => l.litigant_type === 2);

          setData({ petition, advocates, crime, grounds, petitioner, respondent });
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    }

    fetchData();
  }, [state?.efile_no]);

  // 🛑 Render fallback button while data is loading
  if (!data) {
    return (
      <Button variant="outlined" disabled>
        Preparing PDF...
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<PdfDocument {...data} />}
      fileName={`${data.petition.efile_number || 'petition'}.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) =>
        loading ? (
          <Button variant="outlined">Generating PDF...</Button>
        ) : (
          <Button variant="contained" endIcon={<DownloadIcon />}>
            Download PDF
          </Button>
        )
      }
    </PDFDownloadLink>
  );
};

export default PdfDownloadButton;
