import * as React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Alert, Platform, Image, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as MailComposer from 'expo-mail-composer';
import * as Print from 'expo-print';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* ---------------- HOME SCREEN ---------------- */

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.homeContainer}>
      <View style={styles.headerBar} />

      <Text style={styles.title}>Gauteng Department of Education</Text>
      <Text style={styles.subtitle}>Subject Advisor Reporting Tools</Text>

      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate('SchoolVisit')}
      >
        <Text style={styles.cardTitle}>School Visit Report</Text>
        <Text style={styles.cardText}>
          Routine monitoring, support and follow-up visits
        </Text>
      </Pressable>

      <Pressable
        style={[styles.card, styles.priority]}
        onPress={() => navigation.navigate('PriorityVisit')}
      >
        <Text style={styles.cardTitle}>Priority School Visit</Text>
        <Text style={styles.cardText}>
          Targeted intervention for priority schools
        </Text>
      </Pressable>

      <Pressable
        style={[styles.card, { backgroundColor: '#e2e8f0', borderColor: '#0b3d6d' }]}
        onPress={() => navigation.navigate('Drafts')}
      >
        <Text style={styles.cardTitle}>Saved Drafts</Text>
        <Text style={styles.cardText}>
          View and open locally saved drafts
        </Text>
      </Pressable>
    </View>
  );
}

// ---------------- DRAFTS SCREEN ----------------
function DraftsScreen({ navigation }: any) {
  const [schoolDraft, setSchoolDraft] = React.useState<any>(null);
  const [priorityDraft, setPriorityDraft] = React.useState<any>(null);

  React.useEffect(() => {
    const loadDrafts = async () => {
      const s = await AsyncStorage.getItem('SCHOOL_VISIT_DRAFT');
      const p = await AsyncStorage.getItem('PRIORITY_VISIT_DRAFT');
      if (s) setSchoolDraft(JSON.parse(s));
      if (p) setPriorityDraft(JSON.parse(p));
    };
    loadDrafts();
  }, []);

  const deleteSchoolDraft = async () => {
    await AsyncStorage.removeItem('SCHOOL_VISIT_DRAFT');
    setSchoolDraft(null);
  };

  const deletePriorityDraft = async () => {
    await AsyncStorage.removeItem('PRIORITY_VISIT_DRAFT');
    setPriorityDraft(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.screenTitle}>Saved Drafts</Text>

      <Text style={styles.section}>School Visit Draft</Text>
      {schoolDraft ? (
        <View style={styles.box}>
          <Text>School: {schoolDraft.school || 'Not specified'}</Text>
          <Text>Subject: {schoolDraft.subject || 'Not specified'}</Text>
          <Pressable
            style={[styles.submitButton, { marginTop: 12 }]}
            onPress={() => navigation.navigate('SchoolVisit')}
          >
            <Text style={styles.submitText}>Open School Visit Draft</Text>
          </Pressable>
          <Pressable
            style={[styles.submitButton, { backgroundColor: '#b91c1c', marginTop: 8 }]}
            onPress={deleteSchoolDraft}
          >
            <Text style={styles.submitText}>Delete School Visit Draft</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={{ marginTop: 8 }}>No saved School Visit draft.</Text>
      )}

      <Text style={styles.section}>Priority Visit Draft</Text>
      {priorityDraft ? (
        <View style={styles.box}>
          <Text>School: {priorityDraft.school || 'Not specified'}</Text>
          <Text>Priority: {priorityDraft.priority || 'Not specified'}</Text>
          <Pressable
            style={[styles.submitButton, { marginTop: 12 }]}
            onPress={() => navigation.navigate('PriorityVisit')}
          >
            <Text style={styles.submitText}>Open Priority Draft</Text>
          </Pressable>
          <Pressable
            style={[styles.submitButton, { backgroundColor: '#b91c1c', marginTop: 8 }]}
            onPress={deletePriorityDraft}
          >
            <Text style={styles.submitText}>Delete Priority Draft</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={{ marginTop: 8 }}>No saved Priority draft.</Text>
      )}
    </ScrollView>
  );
}

/* ---------------- SCHOOL VISIT SCREEN ---------------- */

function SchoolVisitScreen() {
  const [purpose, setPurpose] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState('');
  const [school, setSchool] = React.useState('');
  const [schoolSearch, setSchoolSearch] = React.useState('');
  const [showSchoolList, setShowSchoolList] = React.useState(false);
  const [subject, setSubject] = React.useState('');
  const [subjectSearch, setSubjectSearch] = React.useState('');
  const [showSubjectList, setShowSubjectList] = React.useState(false);

  const [syllabus, setSyllabus] = React.useState({
    g10: { percent: '', status: '' },
    g11: { percent: '', status: '' },
    g12: { percent: '', status: '' },
  });

  const [sba, setSba] = React.useState({
    g10: '',
    g11: '',
    g12: '',
  });

  const [findings, setFindings] = React.useState('');
  const [challenges, setChallenges] = React.useState('');
  const [recommendations, setRecommendations] = React.useState('');

  const [principal, setPrincipal] = React.useState({ name: '', cell: '', email: '' });
  const [hod, setHod] = React.useState({ name: '', cell: '', email: '' });
  const [teacher, setTeacher] = React.useState({ name: '', cell: '', email: '' });
  const [advisor, setAdvisor] = React.useState({ name: '', cell: '', email: '' });

  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewContent, setPreviewContent] = React.useState('');
  const [lastSaved, setLastSaved] = React.useState<string | null>(null);

  const DRAFT_KEY = 'SCHOOL_VISIT_DRAFT';

  const saveDraft = async () => {
    const draft = {
      purpose,
      status,
      school,
      subject,
      syllabus,
      sba,
      findings,
      challenges,
      recommendations,
      principal,
      hod,
      teacher,
      advisor,
    };
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    const time = new Date().toLocaleTimeString();
    setLastSaved(time);
  };

  const loadDraft = async () => {
    const saved = await AsyncStorage.getItem(DRAFT_KEY);
    if (saved) {
      const draft = JSON.parse(saved);
      setPurpose(draft.purpose || []);
      setStatus(draft.status || '');
      setSchool(draft.school || '');
      setSubject(draft.subject || '');
      setSyllabus(draft.syllabus || syllabus);
      setSba(draft.sba || sba);
      setFindings(draft.findings || '');
      setChallenges(draft.challenges || '');
      setRecommendations(draft.recommendations || '');
      setPrincipal(draft.principal || principal);
      setHod(draft.hod || hod);
      setTeacher(draft.teacher || teacher);
      setAdvisor(draft.advisor || advisor);
    }
  };

  const clearDraft = async () => {
    await AsyncStorage.removeItem(DRAFT_KEY);
  };


  const purposes = [
    'Assessment Management support',
    'Curriculum Management and delivery support',
    'School / Subject readiness',
    'Mentoring',
    'Moderation',
    'Monitoring',
    'Monitoring of Improvement Strategies',
    'Curriculum and SBA Implementation',
    'Accountability',
    'Follow-up',
  ];

  const schools = [
    'AFRIKAANSE HOËR MEISIESKOOL',
    'AFRIKAANSE HOËR SEUNSKOOL',
    'AL GHAZALI INDEPENDENT SCHOOL',
    'AL-ASR EDUCATIONAL INSTITUTE',
    'AMITY INTERNATIONAL',
    'AMBERFIELD COLLEGE',
    'BOKGONI TECHNICAL SECONDARY SCHOOL',
    'BONA LESEDI SECONDARY SCHOOL',
    'BOPHELONG COMMUNITY INDEPENDENT SCHOOL',
    'CAPITAL CITY ACADEMY',
    'CARPE DIEM ACADEMY',
    'CENTRAL ISLAMIC SCHOOL',
    'CENTURION SECONDARY SCHOOL',
    'CORNERSTONE COLLEGE SEC. SCHOOL',
    'CURRO COLLEGE PRETORIA',
    'CURRO COLLEGE MAMELODI',
    'DANSA INTERNATIONAL COLLEGE',
    'DAVID HELLEN PETA SECONDARY SCHOOL',
    'DR WF NKOMO SECONDARY SCHOOL',
    'DUO EDU SENIORONAFHANKLIKE SKOOL',
    'EDWARD PHATUDI SECONDARY SCHOOL',
    'EERSTERUST SECONDARY SCHOOL',
    'ELMAR COLLEGE',
    'EMPRO ACADEMY',
    'FLAVIUS MAREKA SECONDARY SCHOOL',
    'FOUNDERS COMMUNITY SCHOOL',
    'GATANG SECONDARY SCHOOL',
    'GAUTENG CENTRAL COLLEGE',
    'GLENMARK CHRISTIAN COLLEGE',
    'GREENWOOD COLLEGE',
    'HIMALAYA SECONDARY SCHOOL',
    'HOËRSKOOL CENTURION',
    'HOËRSKOOL DIE WILGERS',
    'HOËRSKOOL ELDORAIGNE',
    'HOËRSKOOL F H ODENDAAL',
    'HOËRSKOOL GARSFONTEIN',
    'HOËRSKOOL MENLOPARK',
    'HOËRSKOOL SILVERTON',
    'HOËRSKOOL UITSIG',
    'HOËRSKOOL VOORTREKKERHOOGTE',
    'HOËRSKOOL WATERKLOOF',
    'HOËRSKOOL ZWARTKOP',
    'HOFMEYR SECONDARY SCHOOL',
    'HOLY TRINITY HIGH SCHOOL (CATHOLIC SEC.)',
    'J KEKANA SECONDARY SCHOOL',
    'JAFTA MAHLANGU SECONDARY SCHOOL',
    'LAKEWOOD COLLEGE',
    'LAUDIUM SECONDARY SCHOOL',
    'LEHLABILE SECONDARY SCHOOL',
    'LIMELIGHT ACADEMY',
    'LOMPEC INDEPENDENT SECONDARY SCHOOL',
    'LORETO CONVENT SCHOOL',
    'LYTTELTON MANOR HIGH SCHOOL',
    'MAHUBE VALLEY SECONDARY SCHOOL',
    'MAMELODI SECONDARY SCHOOL',
    'MBOWENI SECONDARY SCHOOL',
    'MODIRI TECHNICAL SCHOOL',
    'NELLMAPIUS SECONDARY SCHOOL',
    'NUWE HOOPSKOOL',
    'OLIEVENHOUTBOSCH SECONDARY SCHOOL',
    'OLIEVENHOUTBOSCH SECONDARY SCHOOL NO 2',
    'PEPPS MOTHEONG PRIMARY SCHOOL',
    'PHATENG SECONDARY SCHOOL',
    'PHELINDABA SECONDARY SCHOOL',
    "PRETORIA BOYS' HIGH SCHOOL",
    'PRETORIA CENTRAL HIGH SCHOOL',
    'PRETORIA HIGH SCHOOL FOR GIRLS',
    'PRETORIA INSTITUTE OF LEARNING',
    'PRETORIA MUSLIM TRUST SUNNI SCHOOL',
    'PRETORIA SECONDARY SCHOOL',
    'PRETORIA TECHNICAL HIGH SCHOOL',
    'PRINCEFIELD TRUST SCHOOL',
    'PRINCESS PARK COLLEGE',
    'PRO ARTE ALPHEN PARK',
    'PROSPERITUS SECONDARY SCHOOL',
    'QUEENS PRIVATE SCHOOL',
    'RASLOUW ACADEMY',
    'REPHAFOGILE SECONDARY SCHOOL',
    'RIBANE-LAKA SECONDARY SCHOOL',
    'RIETVLEI AKADEMIE',
    'ROSINA SEDIBANE-MODIBA SCHOOL',
    'SAULRIDGE SECONDARY SCHOOL',
    'SESHEGONG SECONDARY SCHOOL',
    'SOLOMON MAHLANGU FREEDOM SCHOOL',
    'SONITUSSKOOL',
    'ST AQUINAS-PRETORIA CAMPUS',
    'STANZA BOPAPE SECONDARY SCHOOL',
    'STAR COLLEGE PRETORIA',
    'STEVE TSWETE SECONDARY SCHOOL',
    'SUTHERLAND HIGH SCHOOL',
    'THE GLEN HIGH SCHOOL',
    'THE WAY CHRISTIAN SCHOOL',
    'THUTO BOHLALE SECONDARY SCHOOL',
    'TRANSORANJE SCHOOL FOR THE DEAF',
    'TRANSVALIASKOOL-SCHOOL',
    'TSAKO THABO SECONDARY SCHOOL',
    'TSHWANE COLLEGE',
    'TSHWANE MUSLIM SCHOOL',
    'TSHWANE SECONDARY SCHOOL',
    'TUKSSPORT HIGH SCHOOL',
    'VERITAS ACADEMICS',
    'VLAKFONTEIN SECONDARY SCHOOL',
    'VUKANI MAWETHU SECONDARY SCHOOL',
    'WATERSRAND SECONDARY SCHOOL',
    'WIERDA INDEPENDENT SCHOOL',
    'WILLOWRIDGE HIGH SCHOOL',
  ];
  const filteredSchools = schools.filter((s) =>
    s.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const subjects = [
    'Accounting',
    'Afrikaans First Additional Language',
    'Afrikaans Home Language',
    'Afrikaans Second Additional Language',
    'Agricultural Management Practices',
    'Agricultural Science',
    'Agricultural Technology',
    'Arabic Second Additional Language',
    'Business Studies',
    'Civil Technology (Civil Services)',
    'Civil Technology (Construction)',
    'Civil Technology (Woodworking)',
    'Computer Applications Technology',
    'Consumer Studies',
    'Dance Studies',
    'Design',
    'Dramatic Arts',
    'Economics',
    'Electrical Technology (Digital Systems)',
    'Electrical Technology (Electronics)',
    'Electrical Technology (Power Systems)',
    'Engineering Graphics and Design',
    'English First Additional Language',
    'English Home Language',
    'English Second Additional Language',
    'Equine Studies',
    'French Second Additional Language',
    'Geography',
    'German Home Language',
    'German Second Additional Language',
    'Gujarati First Additional Language',
    'Gujarati Home Language',
    'Gujarati Second Additional Language',
    'Hebrew Second Additional Language',
    'Hindi First Additional Language',
    'Hindi Home Language',
    'Hindi Second Additional Language',
    'History',
    'Hospitality Studies',
    'Information Technology',
    'IsiNdebele First Additional Language',
    'IsiNdebele Home Language',
    'IsiNdebele Second Additional Language',
    'IsiXhosa First Additional Language',
    'IsiXhosa Home Language',
    'IsiXhosa Second Additional Language',
    'IsiZulu First Additional Language',
    'IsiZulu Home Language',
    'IsiZulu Second Additional Language',
    'Italian Second Additional Language',
    'Latin Second Additional Language',
    'Life Orientation',
    'Life Sciences',
    'Mandarin Second Additional Language',
    'Marine Sciences',
    'Maritime Economics',
    'Mathematical Literacy',
    'Mathematics',
    'Mechanical Technology (Automotive)',
    'Mechanical Technology (Fitting and Machining)',
    'Mechanical Technology (Welding and Metal Work)',
    'Modern Greek Second Additional Language',
    'Music',
    'Nautical Science',
    'Physical Sciences',
    'Portuguese First Additional Language',
    'Portuguese Home Language',
    'Portuguese Second Additional Language',
    'Religion Studies',
    'Sepedi First Additional Language',
    'Sepedi Home Language',
    'Sepedi Second Additional Language',
    'Serbian Home Language',
    'Serbian Second Additional Language',
    'Sesotho First Additional Language',
    'Sesotho Home Language',
    'Sesotho Second Additional Language',
    'Setswana First Additional Language',
    'Setswana Home Language',
    'Setswana Second Additional Language',
    'SiSwati First Additional Language',
    'SiSwati Home Language',
    'SiSwati Second Additional Language',
    'South African Sign Language Home Language',
    'Spanish Second Additional Language',
    'Sport and Exercise Science',
    'Tamil First Additional Language',
    'Tamil Home Language',
    'Tamil Second Additional Language',
    'Technical Mathematics',
    'Technical Sciences',
    'Telegu First Additional Language',
    'Telegu Home Language',
    'Telegu Second Additional Language',
    'Tourism',
    'Tshivenda First Additional Language',
    'Tshivenda Home Language',
    'Tshivenda Second Additional Language',
    'Urdu First Additional Language',
    'Urdu Home Language',
    'Urdu Second Additional Language',
    'Visual Arts',
    'Xitsonga First Additional Language',
    'Xitsonga Home Language',
    'Xitsonga Second Additional Language',
  ];
  const filteredSubjects = subjects.filter((s) =>
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const statuses = [
    'RED – Needs urgent intervention',
    'AMBER – Needs intervention and follow-up',
    'YELLOW – Needs some improvement',
    'GREEN – Good performance',
  ];

  const togglePurpose = (item: string) => {
    setPurpose((prev) =>
      prev.includes(item)
        ? prev.filter((p) => p !== item)
        : [...prev, item]
    );
  };

  const cleanEmailText = (text: string) => {
    try {
      return decodeURIComponent(text.replace(/\+/g, ' '));
    } catch {
      return text.replace(/\+/g, ' ');
    }
  };

  React.useEffect(() => {
    loadDraft();
  }, []);

  React.useEffect(() => {
    const autoSave = async () => {
      const draft = {
        purpose,
        status,
        school,
        subject,
        syllabus,
        sba,
        findings,
        challenges,
        recommendations,
        principal,
        hod,
        teacher,
        advisor,
      };
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      const time = new Date().toLocaleTimeString();
      setLastSaved(time);
    };
    autoSave();
  }, [
    purpose,
    status,
    school,
    subject,
    syllabus,
    sba,
    findings,
    challenges,
    recommendations,
    principal,
    hod,
    teacher,
    advisor,
  ]);

  // ========================
  // Local Professional Refine (Section-specific)
  // ========================
  const localRefine = (text: string, section: string) => {
    if (!text) return text;

    let refined = text.trim();

    // Normalize spacing
    refined = refined.replace(/\s+/g, ' ');
    refined = refined.replace(/\.\s*/g, '. ');
    refined = refined.replace(/\?\s*/g, '? ');
    refined = refined.replace(/\!\s*/g, '! ');

    // Capitalise first letter of sentences
    refined = refined.replace(/(^\w|[.!?]\s+\w)/g, (c) =>
      c.toUpperCase()
    );

    // Vocabulary upgrades
    const replacements: Record<string, string> = {
      kids: 'learners',
      teachers: 'educators',
      staff: 'educators and staff',
      'a lot': 'numerous',
      things: 'matters',
      'big problem': 'significant concern',
      'not good': 'unsatisfactory',
      'very bad': 'highly concerning',
      bad: 'inadequate',
      good: 'effective',
      okay: 'satisfactory',
      fix: 'address',
      help: 'support',
      improve: 'enhance',
      problem: 'challenge',
    };

    Object.keys(replacements).forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      refined = refined.replace(regex, replacements[word]);
    });

    // Convert multiple sentences into bullet points if more than 2 sentences
    const sentences = refined.split('. ').filter(Boolean);

    if (sentences.length > 2) {
      refined = sentences
        .map((s) => '• ' + s.trim().replace(/\.$/, ''))
        .join('\n');
    }

    // Split very long paragraphs into structured blocks
    if (refined.length > 350) {
      const parts = refined.match(/.{1,250}(?:\s|$)/g);
      if (parts) refined = parts.join('\n\n');
    }

    // Section-specific transitions
    const lower = refined.toLowerCase();

    if (section === 'findings' && !lower.startsWith('•') && !lower.startsWith('it was observed')) {
      refined = 'It was observed that ' + refined.charAt(0).toLowerCase() + refined.slice(1);
    }

    if (section === 'challenges' && !lower.startsWith('•') && !lower.startsWith('the following challenges')) {
      refined = 'The following challenges were identified: ' + refined.charAt(0).toLowerCase() + refined.slice(1);
    }

    if (section === 'recommendations' && !lower.startsWith('•') && !lower.startsWith('it is recommended')) {
      refined = 'It is recommended that ' + refined.charAt(0).toLowerCase() + refined.slice(1);
    }

    if (!/[.!?\n]$/.test(refined)) {
      refined = refined + '.';
    }

    return refined;
  };

  const refineText = () => {
    setFindings(localRefine(findings, 'findings'));
    setChallenges(localRefine(challenges, 'challenges'));
    setRecommendations(localRefine(recommendations, 'recommendations'));
    Alert.alert('Refined', 'Report has been refined locally.');
  };

  const generatePreview = () => {
    const date = new Date().toISOString().split('T')[0];

    const content = `
GAUTENG DEPARTMENT OF EDUCATION
SUBJECT ADVISOR SCHOOL VISIT REPORT

School: ${school}
Subject: ${subject}
Date: ${date}

1. PURPOSE OF VISIT
${purpose.join(', ')}

2. FINDINGS
${findings}

3. CHALLENGES
${challenges}

4. RECOMMENDATIONS
${recommendations}

5. SYLLABUS COMPLETION
Grade 10: ${syllabus.g10.percent}% – ${syllabus.g10.status}
Grade 11: ${syllabus.g11.percent}% – ${syllabus.g11.status}
Grade 12: ${syllabus.g12.percent}% – ${syllabus.g12.status}

6. SBA COMPLETION
Grade 10: ${sba.g10}%
Grade 11: ${sba.g11}%
Grade 12: ${sba.g12}%

7. CURRENT STATUS
${status}

Principal: ${principal.name}
HOD: ${hod.name}
Teacher: ${teacher.name}
Advisor: ${advisor.name}
    `;

    setPreviewContent(content);
    setPreviewVisible(true);
  };

  const refineAndPreview = () => {
    refineText();
    generatePreview();
  };

  const generatePdf = async () => {
    const date = new Date().toISOString().split('T')[0];
    const safeSchool = school.replace(/\s+/g, '_');
    const safeSubject = subject.replace(/\s+/g, '_');

    const html = `
      <html>
        <body style="font-family: Arial; font-size: 12px;">
          <div style="text-align:center;">
            <h2>GAUTENG DEPARTMENT OF EDUCATION</h2>
            <div><em>Balancing the Equation</em></div>
            <hr />
            <h3>SUBJECT ADVISOR SCHOOL VISIT REPORT</h3>
          </div>

          <p><strong>School:</strong> ${school}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Date:</strong> ${date}</p>

          <h4>1. PURPOSE OF VISIT</h4>
          <p>${purpose.join(', ')}</p>

          <h4>2. FINDINGS</h4>
          <p>${findings}</p>

          <h4>3. CHALLENGES</h4>
          <p>${challenges}</p>

          <h4>4. RECOMMENDATIONS</h4>
          <p>${recommendations}</p>

          <h4>5. SYLLABUS COMPLETION</h4>
          <p>
            Grade 10: ${syllabus.g10.percent}% – ${syllabus.g10.status}<br/>
            Grade 11: ${syllabus.g11.percent}% – ${syllabus.g11.status}<br/>
            Grade 12: ${syllabus.g12.percent}% – ${syllabus.g12.status}
          </p>

          <h4>6. SBA COMPLETION</h4>
          <p>
            Grade 10: ${sba.g10}%<br/>
            Grade 11: ${sba.g11}%<br/>
            Grade 12: ${sba.g12}%
          </p>

          <h4>7. CURRENT STATUS OF THE SCHOOL</h4>
          <p>${status}</p>

          <h4>8. STAKEHOLDER DETAILS</h4>
          <p>
            Principal: ${principal.name} | ${principal.cell} | ${principal.email}<br/>
            HOD: ${hod.name} | ${hod.cell} | ${hod.email}<br/>
            Teacher: ${teacher.name} | ${teacher.cell} | ${teacher.email}<br/>
            Subject Advisor: ${advisor.name} | ${advisor.cell} | ${advisor.email}
          </p>

          <p style="margin-top:40px;">
            Teacher Signature: ____________________ Date: _______<br/><br/>
            HOD Signature: ____________________ Date: _______<br/><br/>
            Principal Signature: ____________________ Date: _______<br/><br/>
            Subject Advisor Signature: ____________________ Date: _______<br/><br/>
            DCES Signature: ____________________ Date: _______<br/><br/>
            CES Signature: ____________________ Date: _______
          </p>
        </body>
      </html>
    `;

    // Create PDF
    const { uri } = await Print.printToFileAsync({ html });

    // Rename file properly
    const fileName = `${date}_${safeSubject}_${safeSchool}.pdf`;
    const newUri = FileSystem.cacheDirectory + fileName;

    await FileSystem.copyAsync({
      from: uri,
      to: newUri,
    });

    return newUri;
  };

  const submitReport = async () => {
    const payload = {
      tool: "school",
      school,
      subject,
      date: new Date().toISOString().split("T")[0],
      purpose,
      findings,
      challenges,
      recommendations,
      status,
      g10SyllabusPercent: syllabus.g10.percent,
      g11SyllabusPercent: syllabus.g11.percent,
      g12SyllabusPercent: syllabus.g12.percent,
      g10SBA: sba.g10,
      g11SBA: sba.g11,
      g12SBA: sba.g12,
      principal,
      hod,
      teacher,
      advisor,
    };

    const isAvailable = await MailComposer.isAvailableAsync();

    if (!isAvailable) {
      Alert.alert(
        "Report Generated",
        "Email is not available on this device."
      );
      return;
    }

    const jsonBody = JSON.stringify(payload, null, 2);

    if (Platform.OS === "web") {
      const mailtoUrl = `mailto:martinharmse@gdets.onmicrosoft.com?subject=${encodeURIComponent(
        "GDE_TS_SCHOOL_VISIT"
      )}&body=${encodeURIComponent(jsonBody)}`;
      window.location.href = mailtoUrl;
    } else {
      await MailComposer.composeAsync({
        recipients: ["martinharmse@gdets.onmicrosoft.com"],
        subject: "GDE_TS_SCHOOL_VISIT",
        body: jsonBody,
        isHtml: false,
      });
      await clearDraft();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerBar} />
      <Text style={styles.screenTitle}>School Visit Report</Text>

      <Text style={styles.section}>School</Text>

      <TextInput
        style={styles.input}
        placeholder="Search school..."
        value={schoolSearch}
        onChangeText={(text) => {
          setSchoolSearch(text);
          setShowSchoolList(true);
        }}
        onFocus={() => setShowSchoolList(true)}
      />

      {showSchoolList && (
        <View style={[styles.pickerBox, { maxHeight: 220 }]}>
          <ScrollView>
            {filteredSchools.map((s) => (
              <Pressable
                key={s}
                style={[
                  styles.checkbox,
                  school === s && styles.checkboxSelected,
                ]}
                onPress={() => {
                  setSchool(s);
                  setSchoolSearch(s);
                  setShowSchoolList(false);
                }}
              >
                <Text>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <Text style={styles.section}>Subject</Text>

      <TextInput
        style={styles.input}
        placeholder="Search subject..."
        value={subjectSearch}
        onChangeText={(text) => {
          setSubjectSearch(text);
          setShowSubjectList(true);
        }}
        onFocus={() => setShowSubjectList(true)}
      />

      {showSubjectList && (
        <View style={[styles.pickerBox, { maxHeight: 200 }]}>
          <ScrollView>
            {filteredSubjects.map((s) => (
              <Pressable
                key={s}
                style={[
                  styles.checkbox,
                  subject === s && styles.checkboxSelected,
                ]}
                onPress={() => {
                  setSubject(s);
                  setSubjectSearch(s);
                  setShowSubjectList(false);
                }}
              >
                <Text>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <Text style={styles.section}>Purpose of Visit</Text>
      {purposes.map((item) => (
        <Pressable
          key={item}
          style={[
            styles.checkbox,
            purpose.includes(item) && styles.checkboxSelected,
          ]}
          onPress={() => togglePurpose(item)}
        >
          <Text>{item}</Text>
        </Pressable>
      ))}

      <Text style={styles.section}>Findings</Text>
      <TextInput
        style={styles.textArea}
        multiline
        placeholder="Enter key findings from the visit"
        value={findings}
        onChangeText={setFindings}
      />

      <Text style={styles.section}>Challenges</Text>
      <TextInput
        style={styles.textArea}
        multiline
        placeholder="Enter challenges identified"
        value={challenges}
        onChangeText={setChallenges}
      />

      <Text style={styles.section}>Recommendations</Text>
      <TextInput
        style={styles.textArea}
        multiline
        placeholder="Enter recommendations and support actions"
        value={recommendations}
        onChangeText={setRecommendations}
      />
      <Pressable
        style={[styles.submitButton, { backgroundColor: '#334155', marginTop: 12 }]}
        onPress={refineAndPreview}
      >
        <Text style={styles.submitText}>Refine & Preview Report</Text>
      </Pressable>
      <Modal visible={previewVisible} animationType="slide">
        <ScrollView style={{ padding: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>
            Report Preview
          </Text>

          <Text style={{ whiteSpace: 'pre-line' as any }}>
            {previewContent}
          </Text>

          <Pressable
            style={[styles.submitButton, { marginTop: 24 }]}
            onPress={() => setPreviewVisible(false)}
          >
            <Text style={styles.submitText}>Close Preview</Text>
          </Pressable>
        </ScrollView>
      </Modal>

      <Text style={styles.section}>Syllabus Completion</Text>

      {(['g10', 'g11', 'g12'] as const).map((g) => (
        <View key={g} style={styles.box}>
          <Text style={styles.subLabel}>
            Grade {g === 'g10' ? '10' : g === 'g11' ? '11' : '12'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Percentage completed"
            keyboardType="numeric"
            value={syllabus[g].percent}
            onChangeText={(t) =>
              setSyllabus({ ...syllabus, [g]: { ...syllabus[g], percent: t } })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Status (On par / Ahead / Behind)"
            value={syllabus[g].status}
            onChangeText={(t) =>
              setSyllabus({ ...syllabus, [g]: { ...syllabus[g], status: t } })
            }
          />
        </View>
      ))}

      <Text style={styles.section}>SBA Completion</Text>

      {(['g10', 'g11', 'g12'] as const).map((g) => (
        <View key={g} style={styles.box}>
          <Text style={styles.subLabel}>
            Grade {g === 'g10' ? '10' : g === 'g11' ? '11' : '12'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="SBA completion percentage"
            keyboardType="numeric"
            value={sba[g]}
            onChangeText={(t) => setSba({ ...sba, [g]: t })}
          />
        </View>
      ))}

      <Text style={styles.section}>Current Status of the School</Text>
      {statuses.map((s) => (
        <Pressable
          key={s}
          style={[
            styles.statusBox,
            status === s && (
              s.includes('RED')
                ? styles.statusRed
                : s.includes('AMBER')
                ? styles.statusAmber
                : s.includes('YELLOW')
                ? styles.statusYellow
                : styles.statusGreen
            ),
          ]}
          onPress={() => setStatus(s)}
        >
          <Text>{s}</Text>
        </Pressable>
      ))}

      <Text style={styles.section}>Stakeholder Details</Text>

      {[
        ['Principal', principal, setPrincipal],
        ['HOD', hod, setHod],
        ['Teacher', teacher, setTeacher],
        ['Subject Advisor', advisor, setAdvisor],
      ].map(([label, person, setPerson]: any, i) => (
        <View key={i} style={styles.personBox}>
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
      <Pressable
        style={[styles.submitButton, { backgroundColor: '#475569', marginTop: 12 }]}
        onPress={saveDraft}
      >
        <Text style={styles.submitText}>Save Draft</Text>
      </Pressable>
      {lastSaved && (
        <Text style={{ marginTop: 8, color: '#475569', fontSize: 12 }}>
          Last saved at {lastSaved}
        </Text>
      )}
      <Pressable
        style={[
          styles.submitButton,
          (!school || !subject) && { opacity: 0.5 },
        ]}
        disabled={!school || !subject}
        onPress={submitReport}
      >
        <Text style={styles.submitText}>Save & Submit Report</Text>
      </Pressable>
    </ScrollView>
  );
}

/* ---------------- PRIORITY VISIT SCREEN ---------------- */

function PriorityVisitScreen() {
  const [school, setSchool] = React.useState('');
  const [schoolSearch, setSchoolSearch] = React.useState('');
  const [showSchoolList, setShowSchoolList] = React.useState(false);
  // const [reason, setReason] = React.useState(''); // REMOVE OLD STATE
  const [findings, setFindings] = React.useState('');
  // NEW STRUCTURED STATE
  const [challengesIdentified, setChallengesIdentified] = React.useState('');
  const [recommendations, setRecommendations] = React.useState('');
  const [goodPractices, setGoodPractices] = React.useState('');
  const [areasForImprovement, setAreasForImprovement] = React.useState('');
  const [improvementsFromPrevious, setImprovementsFromPrevious] = React.useState('');
  const [schoolChallenges, setSchoolChallenges] = React.useState('');
  const [priority, setPriority] = React.useState('');

  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewContent, setPreviewContent] = React.useState('');
  const [lastSaved, setLastSaved] = React.useState<string | null>(null);

  const PRIORITY_DRAFT_KEY = 'PRIORITY_VISIT_DRAFT';

  /* ---------------- CHECKLIST SECTIONS ---------------- */

  // General Observations
  const [generalObservations, setGeneralObservations] = React.useState<string[]>([]);
  const generalObservationList = [
    'All teachers and learners are present and engaged in scheduled teaching and learning activities.',
    'The school environment is clean and neat.',
    'A system is in place to ensure learners of absent teachers are supervised or taught.',
    'SSIP attendance is monitored and followed up by the SMT, particularly for Grade 12 learners.',
    'Time-on-task is evident in classrooms observed.',
  ];
  const toggleGeneralObservation = (item: string) => {
    setGeneralObservations((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  // Curriculum Implementation
  const [curriculumItems, setCurriculumItems] = React.useState<string[]>([]);
  const curriculumList = [
    'Learner attendance in Grades 8–11 is regular and monitored.',
    'The school has submitted the Curriculum Coverage Report to the district in accordance with DM 188 requirements, including a signed scanned copy and the required electronic submission to the District CES.',
  ];
  const toggleCurriculumItem = (item: string) => {
    setCurriculumItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  // Assessment Practices
  const [assessmentItems, setAssessmentItems] = React.useState<string[]>([]);
  const assessmentList = [
    'All SBAs for Term 2 have been completed, or a clear completion plan with dates is in place.',
    'All assessments completed before the school holidays were marked, moderated and captured on SASAMS.',
    'DHs have quality assured and signed off captured marks on SASAMS WMS.',
    'The school has a plan in place to submit learner performance data on 6 August as per DM 208.',
    'Learner performance data has been submitted to the district in accordance with DM 208.',
    'Term 1 curriculum data is loaded onto the DDD dashboard.',
  ];
  const toggleAssessmentItem = (item: string) => {
    setAssessmentItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  // Intervention Strategies
  const [interventionItems, setInterventionItems] = React.useState<string[]>([]);
  const interventionList = [
    'An intervention plan for Grade 12 learners is in place and implemented, with documented planning and monitoring.',
    'All Grade 12 learners have been provided with the official examination guidelines for all subjects.',
    'Structured intervention plans are in place for Grade 10 and Grade 11 learners.',
    'Remote learning packs provided by the GDE are distributed and utilised by Grade 10 and Grade 11 learners.',
    'Targeted academic intervention support is provided to Grade 8 and Grade 9 learners.',
  ];
  const toggleInterventionItem = (item: string) => {
    setInterventionItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  // --- Draft Save/Load/Clear ---
  const saveDraft = async () => {
    const draft = {
      school,
      priority,
      generalObservations,
      curriculumItems,
      assessmentItems,
      interventionItems,
      findings,
      challengesIdentified,
      recommendations,
      goodPractices,
      areasForImprovement,
      improvementsFromPrevious,
      schoolChallenges,
    };
    await AsyncStorage.setItem(PRIORITY_DRAFT_KEY, JSON.stringify(draft));
    const time = new Date().toLocaleTimeString();
    setLastSaved(time);
  };

  const loadDraft = async () => {
    const saved = await AsyncStorage.getItem(PRIORITY_DRAFT_KEY);
    if (saved) {
      const draft = JSON.parse(saved);
      setSchool(draft.school || '');
      setPriority(draft.priority || '');
      setGeneralObservations(draft.generalObservations || []);
      setCurriculumItems(draft.curriculumItems || []);
      setAssessmentItems(draft.assessmentItems || []);
      setInterventionItems(draft.interventionItems || []);
      setFindings(draft.findings || '');
      setChallengesIdentified(draft.challengesIdentified || '');
      setRecommendations(draft.recommendations || '');
      setGoodPractices(draft.goodPractices || '');
      setAreasForImprovement(draft.areasForImprovement || '');
      setImprovementsFromPrevious(draft.improvementsFromPrevious || '');
      setSchoolChallenges(draft.schoolChallenges || '');
    }
  };

  const clearDraft = async () => {
    await AsyncStorage.removeItem(PRIORITY_DRAFT_KEY);
  };


  const schools = [
    'DR WF NKOMO SS',
    'PROSPERITUS SS',
    'PHELINDABA SOS',
    'EDWARD PHATUDI SOS',
    'REPHAFOGILE SS',
    'HOFMEYR SS',
    'STEVE TSHWETE SS',
    'TSHWANE SS',
    'NELLMAPIUS SS',
    'JAFTA MAHLANGU SS',
    'ROSINA SEDIBANE SOS',
    'GATANG SS',
    'TSAKO THABO SS',
    'EERSTERUST SS',
    'OLIEVENHOUTBOSCH 1 SS',
    'THUTO BOHLALE SS',
    'J KEKANA SS',
    'PHATENG SS',
    'DAVID HELLEN PETA SS',
    'HIMALAYA SECONDARY SCHOOL',
  ];
  const filteredSchools = schools.filter((s) =>
    s.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const subjects = [
    'Mathematics',
    'Mathematical Literacy',
    'Physical Sciences',
    'Xitsonga',
    'Dramatic Arts',
  ];

  const priorities = [
    'CRITICAL – Immediate district intervention',
    'HIGH – Weekly monitoring required',
    'MODERATE – Fortnightly follow-up',
    'STABILISED – Routine monitoring',
  ];

  // ========================
  // Local Professional Refine (Section-specific)
  // ========================
  const localRefine = (text: string, section: string) => {
    if (!text) return text;

    let refined = text.trim();

    // Normalize spacing
    refined = refined.replace(/\s+/g, ' ');
    refined = refined.replace(/\.\s*/g, '. ');
    refined = refined.replace(/\?\s*/g, '? ');
    refined = refined.replace(/\!\s*/g, '! ');

    // Capitalise first letter of sentences
    refined = refined.replace(/(^\w|[.!?]\s+\w)/g, (c) =>
      c.toUpperCase()
    );

    // Vocabulary upgrades
    const replacements: Record<string, string> = {
      kids: 'learners',
      teachers: 'educators',
      staff: 'educators and staff',
      'a lot': 'numerous',
      things: 'matters',
      'big problem': 'significant concern',
      'not good': 'unsatisfactory',
      'very bad': 'highly concerning',
      bad: 'inadequate',
      good: 'effective',
      okay: 'satisfactory',
      fix: 'address',
      help: 'support',
      improve: 'enhance',
      problem: 'challenge',
    };

    Object.keys(replacements).forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      refined = refined.replace(regex, replacements[word]);
    });

    // Convert multiple sentences into bullet points if more than 2 sentences
    const sentences = refined.split('. ').filter(Boolean);

    if (sentences.length > 2) {
      refined = sentences
        .map((s) => '• ' + s.trim().replace(/\.$/, ''))
        .join('\n');
    }

    // Split very long paragraphs into structured blocks
    if (refined.length > 350) {
      const parts = refined.match(/.{1,250}(?:\s|$)/g);
      if (parts) refined = parts.join('\n\n');
    }

    // Section-specific transitions
    const lower = refined.toLowerCase();

    if (section === 'findings' && !lower.startsWith('•') && !lower.startsWith('it was observed')) {
      refined = 'It was observed that ' + refined.charAt(0).toLowerCase() + refined.slice(1);
    }

    if (section === 'challenges' && !lower.startsWith('•') && !lower.startsWith('the following challenges')) {
      refined = 'The following challenges were identified: ' + refined.charAt(0).toLowerCase() + refined.slice(1);
    }

    if (section === 'recommendations' && !lower.startsWith('•') && !lower.startsWith('it is recommended')) {
      refined = 'It is recommended that ' + refined.charAt(0).toLowerCase() + refined.slice(1);
    }

    if (!/[.!?\n]$/.test(refined)) {
      refined = refined + '.';
    }

    return refined;
  };

  const refinePriorityText = () => {
    setFindings(localRefine(findings, 'findings'));
    setChallengesIdentified(localRefine(challengesIdentified, 'challenges'));
    setRecommendations(localRefine(recommendations, 'recommendations'));
    setGoodPractices(localRefine(goodPractices, 'findings'));
    setAreasForImprovement(localRefine(areasForImprovement, 'challenges'));
    setImprovementsFromPrevious(localRefine(improvementsFromPrevious, 'findings'));
    setSchoolChallenges(localRefine(schoolChallenges, 'challenges'));
    Alert.alert('Refined', 'Priority report has been refined locally.');
  };

  const generatePreview = () => {
    const date = new Date().toISOString().split('T')[0];

    const content = `
GAUTENG DEPARTMENT OF EDUCATION
PRIORITY SCHOOL VISIT REPORT

School: ${school}
Date: ${date}
Priority Status: ${priority}

GENERAL OBSERVATIONS
${generalObservations.join('\n')}

CURRICULUM IMPLEMENTATION
${curriculumItems.join('\n')}

ASSESSMENT PRACTICES
${assessmentItems.join('\n')}

INTERVENTION STRATEGIES
${interventionItems.join('\n')}

FINDINGS
${findings}

CHALLENGES IDENTIFIED
${challengesIdentified}

RECOMMENDATIONS
${recommendations}

GOOD PRACTICES
${goodPractices}

AREAS FOR IMPROVEMENT
${areasForImprovement}

IMPROVEMENTS FROM PREVIOUS VISITS
${improvementsFromPrevious}

CHALLENGES EXPERIENCED BY THE SCHOOL
${schoolChallenges}
    `;

    setPreviewContent(content);
    setPreviewVisible(true);
  };

  const refineAndPreview = () => {
    refinePriorityText();
    generatePreview();
  };

  const cleanEmailText = (text: string) => {
    try {
      return decodeURIComponent(text.replace(/\+/g, ' '));
    } catch {
      return text.replace(/\+/g, ' ');
    }
  };

  const submitPriorityReport = async () => {
    const payload = {
      tool: "priority",
      date: new Date().toISOString().split("T")[0],
      school,
      priorityStatus: priority,

      // Checklist selections
      generalObservations,
      curriculumItems,
      assessmentItems,
      interventionItems,

      // Narrative sections
      findings,
      challengesIdentified,
      recommendations,
      goodPractices,
      areasForImprovement,
      improvementsFromPrevious,
      schoolChallenges,
    };

    const isAvailable = await MailComposer.isAvailableAsync();

    if (!isAvailable) {
      Alert.alert(
        "Report Generated",
        "Email is not available on this device."
      );
      return;
    }

    const jsonBody = JSON.stringify(payload, null, 2);

    if (Platform.OS === "web") {
      const mailtoUrl = `mailto:martinharmse@gdets.onmicrosoft.com?subject=${encodeURIComponent(
        "GDE_TS_PRIORITY_VISIT"
      )}&body=${encodeURIComponent(jsonBody)}`;
      window.location.href = mailtoUrl;
    } else {
      await MailComposer.composeAsync({
        recipients: ["martinharmse@gdets.onmicrosoft.com"],
        subject: "GDE_TS_PRIORITY_VISIT",
        body: jsonBody,
        isHtml: false,
      });
      await clearDraft();
    }
  };

  React.useEffect(() => {
    loadDraft();
  }, []);

  React.useEffect(() => {
    const autoSave = async () => {
      const draft = {
        school,
        priority,
        generalObservations,
        curriculumItems,
        assessmentItems,
        interventionItems,
        findings,
        challengesIdentified,
        recommendations,
        goodPractices,
        areasForImprovement,
        improvementsFromPrevious,
        schoolChallenges,
      };
      await AsyncStorage.setItem(PRIORITY_DRAFT_KEY, JSON.stringify(draft));
      const time = new Date().toLocaleTimeString();
      setLastSaved(time);
    };
    autoSave();
  }, [
    school,
    priority,
    generalObservations,
    curriculumItems,
    assessmentItems,
    interventionItems,
    findings,
    challengesIdentified,
    recommendations,
    goodPractices,
    areasForImprovement,
    improvementsFromPrevious,
    schoolChallenges,
  ]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerBar} />
      <Text style={styles.screenTitle}>Priority School Visit</Text>

      <Text style={styles.section}>School</Text>

      <TextInput
        style={styles.input}
        placeholder="Search school..."
        value={schoolSearch}
        onChangeText={(text) => {
          setSchoolSearch(text);
          setShowSchoolList(true);
        }}
        onFocus={() => setShowSchoolList(true)}
      />

      {showSchoolList && (
        <View style={[styles.pickerBox, { maxHeight: 220 }]}>
          <ScrollView>
            {filteredSchools.map((s) => (
              <Pressable
                key={s}
                style={[
                  styles.checkbox,
                  school === s && styles.checkboxSelected,
                ]}
                onPress={() => {
                  setSchool(s);
                  setSchoolSearch(s);
                  setShowSchoolList(false);
                }}
              >
                <Text>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}


      <Text style={styles.section}>General Observations</Text>
      {generalObservationList.map((item) => (
        <Pressable
          key={item}
          style={[
            styles.checkbox,
            generalObservations.includes(item) && styles.checkboxSelected,
          ]}
          onPress={() => toggleGeneralObservation(item)}
        >
          <Text>{item}</Text>
        </Pressable>
      ))}

      <Text style={styles.section}>Curriculum Implementation</Text>
      {curriculumList.map((item) => (
        <Pressable
          key={item}
          style={[
            styles.checkbox,
            curriculumItems.includes(item) && styles.checkboxSelected,
          ]}
          onPress={() => toggleCurriculumItem(item)}
        >
          <Text>{item}</Text>
        </Pressable>
      ))}

      <Text style={styles.section}>Assessment Practices</Text>
      {assessmentList.map((item) => (
        <Pressable
          key={item}
          style={[
            styles.checkbox,
            assessmentItems.includes(item) && styles.checkboxSelected,
          ]}
          onPress={() => toggleAssessmentItem(item)}
        >
          <Text>{item}</Text>
        </Pressable>
      ))}

      <Text style={styles.section}>Intervention Strategies</Text>
      {interventionList.map((item) => (
        <Pressable
          key={item}
          style={[
            styles.checkbox,
            interventionItems.includes(item) && styles.checkboxSelected,
          ]}
          onPress={() => toggleInterventionItem(item)}
        >
          <Text>{item}</Text>
        </Pressable>
      ))}

      {/* Structured Sections */}
      <Text style={styles.section}>Findings</Text>
      <TextInput
        style={styles.textArea}
        multiline
        value={findings}
        onChangeText={setFindings}
      />

      <Text style={styles.section}>Challenges Identified</Text>
      <TextInput
        style={styles.textArea}
        multiline
        value={challengesIdentified}
        onChangeText={setChallengesIdentified}
      />

      <Text style={styles.section}>Recommendations</Text>
      <TextInput
        style={styles.textArea}
        multiline
        value={recommendations}
        onChangeText={setRecommendations}
      />

      <Text style={styles.section}>Good Practices</Text>
      <TextInput
        style={styles.textArea}
        multiline
        value={goodPractices}
        onChangeText={setGoodPractices}
      />

      <Text style={styles.section}>Areas for Improvement</Text>
      <TextInput
        style={styles.textArea}
        multiline
        value={areasForImprovement}
        onChangeText={setAreasForImprovement}
      />

      <Text style={styles.section}>Improvements from Previous Visits</Text>
      <TextInput
        style={styles.textArea}
        multiline
        value={improvementsFromPrevious}
        onChangeText={setImprovementsFromPrevious}
      />

      <Text style={styles.section}>Challenges Experienced by the School</Text>
      <TextInput
        style={styles.textArea}
        multiline
        value={schoolChallenges}
        onChangeText={setSchoolChallenges}
      />
      <Pressable
        style={[styles.submitButton, { backgroundColor: '#334155', marginTop: 12 }]}
        onPress={refineAndPreview}
      >
        <Text style={styles.submitText}>Refine & Preview Priority Report</Text>
      </Pressable>
      <Modal visible={previewVisible} animationType="slide">
        <ScrollView style={{ padding: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>
            Priority Report Preview
          </Text>

          <Text style={{ whiteSpace: 'pre-line' as any }}>
            {previewContent}
          </Text>

          <Pressable
            style={[styles.submitButton, { marginTop: 24 }]}
            onPress={() => setPreviewVisible(false)}
          >
            <Text style={styles.submitText}>Close Preview</Text>
          </Pressable>
        </ScrollView>
      </Modal>

      <Pressable
        style={[styles.submitButton, { backgroundColor: '#475569', marginTop: 12 }]}
        onPress={saveDraft}
      >
        <Text style={styles.submitText}>Save Draft</Text>
      </Pressable>
      {lastSaved && (
        <Text style={{ marginTop: 8, color: '#475569', fontSize: 12 }}>
          Last saved at {lastSaved}
        </Text>
      )}


      <Text style={styles.section}>Priority Status</Text>
      {priorities.map((p) => (
        <Pressable
          key={p}
          style={[
            styles.statusBox,
            priority === p && styles.statusSelected,
          ]}
          onPress={() => setPriority(p)}
        >
          <Text>{p}</Text>
        </Pressable>
      ))}

      <Pressable
        style={[
          styles.submitButton,
          (!school || !priority) && { opacity: 0.5 },
        ]}
        disabled={!school || !priority}
        onPress={submitPriorityReport}
      >
        <Text style={styles.submitText}>Submit Priority Report</Text>
      </Pressable>
    </ScrollView>
  );
}

/* ---------------- NAVIGATION ---------------- */

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="SchoolVisit"
          component={SchoolVisitScreen}
          options={{ title: 'School Visit Report' }}
        />
        <Stack.Screen
          name="PriorityVisit"
          component={PriorityVisitScreen}
          options={{ title: 'Priority School Visit' }}
        />
        <Stack.Screen
          name="Drafts"
          component={DraftsScreen}
          options={{ title: 'Saved Drafts' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  /* ---------- GLOBAL CONTAINERS ---------- */

  homeContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#0b3d6d', 
  },

  scrollContainer: {
    padding: 24,
    paddingBottom: 80,
    backgroundColor: '#f4f8fc',
  },

  /* ---------- HEADER & TITLES ---------- */

  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    color: '#ffcc00',
    letterSpacing: 0.8,
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#e2e8f0',
    fontSize: 14,
  },

  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
    color: '#0f172a',
  },

  /* ---------- CARDS ---------- */

  card: {
    backgroundColor: '#ffffff',
    padding: 22,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ffcc00',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  priority: {
    backgroundColor: '#fff9e6',
    borderColor: '#ffcc00',
  },

  cardTitle: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
  },

  cardText: {
    color: '#475569',
    fontSize: 13,
  },

  /* ---------- SECTIONS ---------- */

  section: {
    marginTop: 26,
    fontWeight: '600',
    color: '#0f172a',
    fontSize: 15,
  },

  subLabel: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 14,
    color: '#334155',
  },

  /* ---------- INPUTS ---------- */

  pickerBox: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },

  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    backgroundColor: '#ffffff',
    color: '#0f172a',
  },

  textArea: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    color: '#0f172a',
  },

  /* ---------- CHECKBOXES ---------- */

  checkbox: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },

  checkboxSelected: {
    backgroundColor: '#ffcc00',
    borderColor: '#0b3d6d',
  },

  /* ---------- STATUS BOXES ---------- */

  statusBox: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 14,
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },

  statusSelected: {
    backgroundColor: '#ffcc00',
    borderColor: '#0b3d6d',
  },

  /* ---------- PANELS ---------- */

  box: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 14,
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  personBox: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    backgroundColor: '#f8fafc',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  /* ---------- BUTTON ---------- */

  submitButton: {
    marginTop: 36,
    backgroundColor: '#0b3d6d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  submitText: {
    color: '#ffcc00',
    fontWeight: '700',
    fontSize: 16,
  },

  /* ---------- LOGO ---------- */

  logo: {
    width: 260,
    height: 260,
    alignSelf: 'center',
    marginBottom: 30,
  },

  headerBar: {
    height: 6,
    backgroundColor: '#ffcc00',
    marginBottom: 20,
    borderRadius: 3,
  },

  statusRed: {
    backgroundColor: '#fee2e2',
    borderColor: '#dc2626',
  },

  statusAmber: {
    backgroundColor: '#fff7ed',
    borderColor: '#f59e0b',
  },

  statusYellow: {
    backgroundColor: '#fef9c3',
    borderColor: '#eab308',
  },

  statusGreen: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
  },
});