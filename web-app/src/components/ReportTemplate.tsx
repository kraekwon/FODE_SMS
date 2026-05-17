import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginTop: 4, color: '#666', textAlign: 'center' },
  section: { margin: 10, padding: 10 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 5 },
  label: { width: 150, fontSize: 12, fontWeight: 'bold' },
  value: { fontSize: 12, flex: 1 },
});

export const StudentReport = ({ student }: { student: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>FODE Education Agency</Text>
          <Text style={styles.subtitle}>Official Student Record Form</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: 'bold' }}>Student Details</Text>
        <View style={styles.row}><Text style={styles.label}>Student ID:</Text><Text style={styles.value}>{student?.stdID}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Name:</Text><Text style={styles.value}>{student?.Fname} {student?.Lname}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Gender:</Text><Text style={styles.value}>{student?.Gender}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Province:</Text><Text style={styles.value}>{student?.ProvinceCODE}</Text></View>
      </View>
      <View style={styles.section}>
        <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: 'bold' }}>Academic Records</Text>
        {student?.marks && student.marks.map((mark: any, idx: number) => (
          <View key={idx} style={{ marginBottom: 10, padding: 5, backgroundColor: '#f9f9f9' }}>
             <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Subject ID: {mark.subjID}</Text>
             <Text style={{ fontSize: 10 }}>Exam Rating: {mark.ExamRating || 'Pending'}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);