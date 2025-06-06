// PdfDocument.jsx
import React from 'react';
import {
  Document, Page, Text, View, StyleSheet, Font
} from '@react-pdf/renderer';

// Optional: Custom font registration (for Tamil, Devanagari, etc.)
// Font.register({ family: 'Noto Sans', src: '/path-to/NotoSans-Regular.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    lineHeight: 1.6,
  },
  heading: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  }
});

const PdfDocument = ({ petition, petitioner, respondent, advocates, crime, grounds }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>
          IN THE COURT OF THE HONOURABLE {petition?.judiciary?.judiciary_name || petition?.court?.court_name}
        </Text>
        <Text style={{ textAlign: 'center' }}>
          {petition?.efile_number}
        </Text>
      </View>

      <View style={styles.section}>
        <Text>
          In the matter of Crime No: {petition?.fir_number}/{petition?.fir_year} of {petition?.police_station?.station_name} Police Station,
          U/s. {crime?.section} of {crime?.act}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Petitioner(s):</Text>
        {petitioner.map((l, index) => (
          <Text key={index}>
            {index + 1}. {l.litigant_name}, {l.age}, {l.gender}, {l.rank} - {l.address}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Respondent(s):</Text>
        {respondent.map((l, index) => (
          <Text key={index}>
            {index + 1}. {l.litigant_name}, {l.designation?.designation_name}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Bail Petition by:</Text>
        <Text>
          {advocates.map((a, index) => (
            `${a.adv_name} [${a.adv_reg}]${index < advocates.length - 1 ? ', ' : ''}`
          ))}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.bold}>Grounds for Bail:</Text>
        <Text>1. {crime?.gist_of_fir_in_local || 'FIR summary not provided.'}</Text>
        <Text>2. Arrested on: {crime?.date_of_arrest}</Text>
        <Text>3. In custody at: {petitioner[0]?.prison?.prison_name || 'Not specified'}</Text>

        {grounds.map((g, index) => (
          <Text key={index}>{index + 4}. {g.description.replace(/<[^>]+>/g, '')}</Text>
        ))}

        <Text>{grounds.length + 4}. The petitioner has sureties and will not abscond.</Text>
        <Text>{grounds.length + 5}. Ready to accept any condition from the court.</Text>
        <Text>{grounds.length + 6}. This is the first bail petition filed.</Text>
      </View>

      <View style={styles.section}>
        <Text>Place: {petition?.seat?.seat_name || petition?.district?.district_name}</Text>
        <Text>Submitted on: {new Date(petition?.created_at).toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text>Advocates:</Text>
        {advocates.map((a, index) => (
          <Text key={index}>{a.advocate.username} - [{a.advocate.adv_reg}]</Text>
        ))}
      </View>
    </Page>
  </Document>
);

export default PdfDocument;
