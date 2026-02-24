import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MailComposer from 'expo-mail-composer';

/* =========================
   DROPDOWN DATA
========================= */

const SCHOOL_LIST = [
  'Tsako Thabo Secondary',
  'Mamelodi High School',
  'Soshanguve East Secondary',
];

const SUBJECT_LIST = [
  'Mathematics',
  'Mathematical Literacy',
  'Physical Sciences',
  'Xitsonga',
  'Dramatic Arts',
];

const STATUS_OPTIONS = ['On par', 'Ahead', 'Behind'];

/* =========================
   COMPONENT
========================= */

export default function HomeScreen() {
  const [school, setSchool] = useState('');
  const [subject, setSubject] = useState('');
  const [purpose, setPurpose] = useState('');
  const [findings, setFindings] = useState('');
  const [challenges, setChallenges] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [report, setReport] = useState('');

  // Syllabus completion: status + %
  const [syllabus, setSyllabus] = useState({
    grade10: { status: '', percent: '' },
    grade11: { status: '', percent: '' },
    grade12: { status: '', percent: '' },
  });

  // SBA completion: %
  const [sba, setSba] = useState({
    grade10: '',
    grade11: '',
    grade12: '',
  });

  // Stakeholders
  const [principal, setPrincipal] = useState({ name: '', cell: '', email: '' });
  const [hod, setHod] = useState({ name: '', cell: '', email: '' });
  const [teacher, setTeacher] = useState({ name: '', cell: '', email: '' });
  const [advisor, setAdvisor] = useState({ name: '', cell: '', email: '' });

  const saveVisit = async () => {
    const visit = {
      date: new Date().toLocaleDateString(),
      school,
      subject,
      purpose,
      findings,
      challenges,
      recommendations,
      syllabus,
      sba,
      principal,
      hod,
      teacher,
      advisor,
    };

    const data = await AsyncStorage.getItem('visits');
    const visits = data ? JSON.parse(data) : [];
    visits.push(visit);
    await AsyncStorage.setItem('visits', JSON.stringify(visits));

    generateReport(visit);
    Alert.alert('Saved', 'School visit saved and report generated.');
  };

  const generateReport = (v: any) => {
    let text = `GAUTENG DEPARTMENT OF EDUCATION\n`;
    text += `SUBJECT ADVISOR SCHOOL VISIT REPORT\n\n`;
    text += `School: ${v.school}\n`;
    text += `Subject: ${v.subject}\n`;
    text += `Date of Visit: ${v.date}\n\n`;

    text += `1. PURPOSE OF VISIT\n${v.purpose}\n\n`;
    text += `2. FINDINGS\n${v.findings}\n\n`;
    text += `3. CHALLENGES\n${v.challenges}\n\n`;
    text += `4. RECOMMENDATIONS\n${v.recommendations}\n\n`;

    text += `5. SYLLABUS COMPLETION\n`;
    text += `Grade 10: ${v.syllabus.grade10.status} (${v.syllabus.grade10.percent}%)\n`;
    text += `Grade 11: ${v.syllabus.grade11.status} (${v.syllabus.grade11.percent}%)\n`;
    text += `Grade 12: ${v.syllabus.grade12.status} (${v.syllabus.grade12.percent}%)\n\n`;

    text += `6. SBA COMPLETION\n`;
    text += `Grade 10: ${v.sba.grade10}%\n`;
    text += `Grade 11: ${v.sba.grade11}%\n`;
    text += `Grade 12: ${v.sba.grade12}%\n\n`;

    text += `7. STAKEHOLDER DETAILS\n`;
    text += `Principal: ${v.principal.name} | ${v.principal.cell} | ${v.principal.email}\n`;
    text += `HOD: ${v.hod.name} | ${v.hod.cell} | ${v.hod.email}\n`;
    text += `Teacher: ${v.teacher.name} | ${v.teacher.cell} | ${v.teacher.email}\n`;
    text += `Subject Advisor: ${v.advisor.name} | ${v.advisor.cell} | ${v.advisor.email}\n`;

    setReport(text);
  };

  const emailReport = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Email not available');
      return;
    }

    await MailComposer.composeAsync({
      recipients: ['gdetsschoolvisits@gmail.com'],
      subject: 'GDE School Visit Report',
      body: report,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gauteng Department of Education</Text>
        <Text style={styles.headerSub}>Subject Advisor School Visit Report</Text>
      </View>

      <Text style={styles.label}>School</Text>
      <Picker selectedValue={school} onValueChange={setSchool}>
        <Picker.Item label="Select school" value="" />
        {SCHOOL_LIST.map((s) => (
          <Picker.Item key={s} label={s} value={s} />
        ))}
      </Picker>

      <Text style={styles.label}>Subject</Text>
      <Picker selectedValue={subject} onValueChange={setSubject}>
        <Picker.Item label="Select subject" value="" />
        {SUBJECT_LIST.map((s) => (
          <Picker.Item key={s} label={s} value={s} />
        ))}
      </Picker>

      <Text style={styles.section}>Purpose of Visit</Text>
      <TextInput style={styles.textArea} value={purpose} onChangeText={setPurpose} multiline />

      <Text style={styles.section}>Findings</Text>
      <TextInput style={styles.textArea} value={findings} onChangeText={setFindings} multiline />

      <Text style={styles.section}>Challenges</Text>
      <TextInput style={styles.textArea} value={challenges} onChangeText={setChallenges} multiline />

      <Text style={styles.section}>Recommendations</Text>
      <TextInput style={styles.textArea} value={recommendations} onChangeText={setRecommendations} multiline />

      <Text style={styles.section}>Syllabus Completion</Text>

      {(['grade10', 'grade11', 'grade12'] as const).map((g) => (
        <View key={g} style={styles.box}>
          <Text style={styles.subLabel}>{g.toUpperCase()}</Text>

          <Picker
            selectedValue={syllabus[g].status}
            onValueChange={(v) =>
              setSyllabus({ ...syllabus, [g]: { ...syllabus[g], status: v } })
            }
          >
            <Picker.Item label="Select status" value="" />
            {STATUS_OPTIONS.map((s) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Percentage (%)"
            keyboardType="numeric"
            value={syllabus[g].percent}
            onChangeText={(t) =>
              setSyllabus({ ...syllabus, [g]: { ...syllabus[g], percent: t } })
            }
          />
        </View>
      ))}

      <Text style={styles.section}>SBA Completion (%)</Text>

      {(['grade10', 'grade11', 'grade12'] as const).map((g) => (
        <TextInput
          key={g}
          style={styles.input}
          placeholder={`${g.toUpperCase()} SBA (%)`}
          keyboardType="numeric"
          value={sba[g]}
          onChangeText={(t) => setSba({ ...sba, [g]: t })}
        />
      ))}

      <Text style={styles.section}>Stakeholder Details</Text>

      {[
        ['Principal', principal, setPrincipal],
        ['HOD', hod, setHod],
        ['Teacher', teacher, setTeacher],
        ['Subject Advisor', advisor, setAdvisor],
      ].map(([label, person, setPerson]: any, i) => (
        <View key={i} style={styles.box}>
          <Text style={styles.subLabel}>{label}</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={person.name}
            onChangeText={(t) => setPerson({ ...person, name: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Cellphone"
            keyboardType="phone-pad"
            value={person.cell}
            onChangeText={(t) => setPerson({ ...person, cell: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={person.email}
            onChangeText={(t) => setPerson({ ...person, email: t })}
          />
        </View>
      ))}

      <Button title="Save Visit & Generate Report" onPress={saveVisit} />

      {report !== '' && (
        <View style={{ marginTop: 15 }}>
          <Button title="Email Report" onPress={emailReport} />
          <Text selectable style={styles.report}>{report}</Text>
        </View>
      )}
    </ScrollView>
  );
}

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { backgroundColor: '#0B5ED7', padding: 15, marginBottom: 20, borderRadius: 6 },
  headerTitle: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  headerSub: { color: '#E6E6E6', textAlign: 'center', fontSize: 12 },
  section: { marginTop: 20, fontWeight: 'bold' },
  label: { fontWeight: 'bold', marginTop: 10 },
  subLabel: { marginTop: 10, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginTop: 5 },
  textArea: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginTop: 5, height: 80 },
  report: { marginTop: 15, borderWidth: 1, borderColor: '#999', padding: 10, fontFamily: 'Courier' },
  box: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
});
