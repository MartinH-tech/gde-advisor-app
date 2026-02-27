import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system/legacy';
import * as MailComposer from 'expo-mail-composer';
import * as Print from 'expo-print';
import * as React from 'react';

import { Alert, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';

import AsyncStorage from '@react-native-async-storage/async-storage';

/* ---------------- SHARED SCHOOL LIST ---------------- */

const SCHOOL_LIST = [
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
  const content = `
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

/* ---------------- SHARED SUBJECT LIST ---------------- */

const SUBJECT_LIST = [
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

/* ---------------- HOME SCREEN ---------------- */

function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: '#0b3d6d' }}>
      <ScrollView contentContainerStyle={[styles.homeContainer, { flexGrow: 1, minHeight: '100%' }]} style={{ flex: 1 }}>

        <View style={styles.headerBar} />
        <Text style={styles.title}>Gauteng Department of Education</Text>
        <Text style={styles.bigSubtitle}>Subject Advisor Reporting Tools</Text>
        <View style={styles.thickYellowLine} />

        {/* FET School Visit Tool at the top */}
        <Pressable
          style={[styles.card, { backgroundColor: '#e0e7ef', borderColor: '#0b3d6d' }]}
          onPress={() => navigation.navigate('SchoolVisit')}
        >
          <Text style={styles.cardTitle}>FET School Visit Tool</Text>
          <Text style={styles.cardText}>
            Standard subject advisor FET school visit reporting tool
          </Text>
        </Pressable>

        {/* Existing cards below */}
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
          style={[styles.card, { backgroundColor: '#e6f4ff', borderColor: '#0b3d6d' }]}
          onPress={() => navigation.navigate('DirectLearnerSupport')}
        >
          <Text style={styles.cardTitle}>Direct Learner Support</Text>
          <Text style={styles.cardText}>
            Track structured learner support interventions
          </Text>
        </Pressable>

        <Pressable
          style={[styles.card, { backgroundColor: '#eef2ff', borderColor: '#0b3d6d' }]}
          onPress={() => navigation.navigate('GroupSupport')}
        >
          <Text style={styles.cardTitle}>Group Support</Text>
          <Text style={styles.cardText}>
            Record cluster, PLC and structured group support meetings
          </Text>
        </Pressable>

        <Pressable
          style={[styles.card, { backgroundColor: '#fef3c7', borderColor: '#0b3d6d' }]}
          onPress={() => navigation.navigate('ExaminationMonitoring')}
        >
          <Text style={styles.cardTitle}>Examination Monitoring</Text>
          <Text style={styles.cardText}>
            NSC Examination Centre Readiness & Commitment Monitoring
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
      </ScrollView>
    </View>
  );
}

function ExaminationMonitoringScreen() {
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  /* ---------------- SECTION A: CENTRE DETAILS ---------------- */

  const [centreName, setCentreName] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const [centreNumber, setCentreNumber] = React.useState('');
  const [principalName, setPrincipalName] = React.useState('');
  const [principalContact, setPrincipalContact] = React.useState('');
  const [chiefInvigilator, setChiefInvigilator] = React.useState('');
  const [chiefContact, setChiefContact] = React.useState('');
  const [monitorName, setMonitorName] = React.useState('');
  const [office, setOffice] = React.useState('');
  const [monitorContact, setMonitorContact] = React.useState('');
  const [date, setDate] = React.useState('');
  const [arrivalTime, setArrivalTime] = React.useState('');
  const [departureTime, setDepartureTime] = React.useState('');
  const [subjects, setSubjects] = React.useState('');

  const [candidatesPresent, setCandidatesPresent] = React.useState('');
  const [candidatesAbsent, setCandidatesAbsent] = React.useState('');
  const [unregistered, setUnregistered] = React.useState('');
  const [irregularities, setIrregularities] = React.useState('');
  const [invigilators, setInvigilators] = React.useState('');
  const [lateCandidates, setLateCandidates] = React.useState('');
  const [isolatedCandidates, setIsolatedCandidates] = React.useState('');

  /* ---------------- CHECKLIST STATE ---------------- */

  const [checklist, setChecklist] = React.useState<any>({});

  const yesNo = ['YES', 'NO'];

  const toggle = (key: string, value: string) => {
    setChecklist((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  /* ---------------- CHECKLIST ITEMS ---------------- */

  const invigilatorSection = [
    "Chief Invigilator appointed in writing (Exam Form 1)",
    "Chief Invigilator attended official training",
    "Proof of training of invigilators verified",
    "Educators do not invigilate subjects they teach",
    "Invigilators identifiable with name tags",
    "Invigilators appointed in ratio 1:30",
    "Invigilators sign attendance register"
  ];

  const storageSection = [
    "Access cards / visitor register available",
    "Timetable visible in strong room",
    "Policy displayed in strong room",
    "Access register signed by two officials",
    "Duplicate keys safely stored",
    "Double locking system in place",
    "Storage facility emptied of old material",
    "Answer books stored securely"
  ];

  const venueSection = [
    "Exam file and Gazette available",
    "Invigilation timetable available",
    "Functional seating plan available",
    "Subject allocation list available",
    "Signage visible",
    "Environment conducive",
    "1m spacing between desks",
    "Functional clock available"
  ];

  const beforeExamSection = [
    "Invigilators present before start time",
    "Candidates ID checked",
    "Candidates scanned",
    "Candidates seated 1 hour before",
    "Exam Form 11 read to candidates",
    "Plastic bags demonstrated sealed",
    "10 minutes reading time given"
  ];

  const duringExamSection = [
    "Chief Invigilator monitors rooms",
    "Late-coming procedure followed",
    "Temporary leave procedure followed",
    "Early completion procedure followed",
    "Irregularity procedure followed"
  ];

  const endExamSection = [
    "Candidates remain seated during collection",
    "Scripts counted correctly",
    "Scripts arranged correctly",
    "Reconciliation done",
    "Scripts taken to storage immediately"
  ];

  /* ---------------- DEVELOPMENT + RECOMMENDATIONS ---------------- */

  const [developmentAreas, setDevelopmentAreas] = React.useState('');
  const [recommendations, setRecommendations] = React.useState('');

  /* ---------------- SUBMIT ---------------- */

  const submitMonitoring = async () => {

    const payload = {
      tool: "examination_monitoring_full",
      centreDetails: {
        centreName,
        district,
        centreNumber,
        principalName,
        principalContact,
        chiefInvigilator,
        chiefContact,
        monitorName,
        office,
        monitorContact,
        date,
        arrivalTime,
        departureTime,
        subjects,
        candidatesPresent,
        candidatesAbsent,
        unregistered,
        irregularities,
        invigilators,
        lateCandidates,
        isolatedCandidates
      },
      checklist,
      developmentAreas,
      recommendations
    };

    const jsonBody = JSON.stringify(payload, null, 2);

    if (Platform.OS === "web") {
      const mailtoUrl = `mailto:martinharmse@gdets.onmicrosoft.com?subject=${encodeURIComponent(
        "GDE_TS_EXAM_MONITORING_FULL"
      )}&body=${encodeURIComponent(jsonBody)}`;
      window.location.href = mailtoUrl;
    } else {
      await MailComposer.composeAsync({
        recipients: ["martinharmse@gdets.onmicrosoft.com"],
        subject: "GDE_TS_EXAM_MONITORING_FULL",
        body: jsonBody,
        isHtml: false,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerBar} />
      <Text style={[styles.screenTitle, { color: '#fff' }]}>Examination Monitoring (Full Instrument)</Text>

      <Text style={[styles.section, { color: '#fff' }]}>A. Examination Centre & Monitor Details</Text>

      <TextInput style={styles.input} placeholder="Centre Name" value={centreName} onChangeText={setCentreName} />
      <TextInput style={styles.input} placeholder="District" value={district} onChangeText={setDistrict} />
      <TextInput style={styles.input} placeholder="Centre Number" value={centreNumber} onChangeText={setCentreNumber} />
      <TextInput style={styles.input} placeholder="Principal Name" value={principalName} onChangeText={setPrincipalName} />
      <TextInput style={styles.input} placeholder="Principal Contact" value={principalContact} onChangeText={setPrincipalContact} />
      <TextInput style={styles.input} placeholder="Chief Invigilator Name" value={chiefInvigilator} onChangeText={setChiefInvigilator} />
      <TextInput style={styles.input} placeholder="Chief Invigilator Contact" value={chiefContact} onChangeText={setChiefContact} />
      <TextInput style={styles.input} placeholder="Monitor Name" value={monitorName} onChangeText={setMonitorName} />
      <TextInput style={styles.input} placeholder="Office" value={office} onChangeText={setOffice} />
      <TextInput style={styles.input} placeholder="Monitor Contact" value={monitorContact} onChangeText={setMonitorContact} />
      <Text style={styles.section}>Date</Text>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          className="web-date-input"
          style={{ ...styles.input, color: '#0b3d6d', background: '#e0e7ef', border: 'none', fontSize: 16, padding: 10, borderRadius: 10, marginTop: 8 }}
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      ) : (
        <>
          <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text>{date ? date : 'Select date'}</Text>
          </Pressable>
          {showDatePicker && (
            Platform.OS === 'android' ? (
              <DateTimePicker
                value={date ? new Date(date) : new Date()}
                mode="date"
                display="default"
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate.toISOString().split('T')[0]);
                  }
                }}
              />
            ) : (
              <Modal transparent={true} visible={showDatePicker} animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                  <View style={{ backgroundColor: 'white', margin: 24, borderRadius: 8, padding: 16 }}>
                    <DateTimePicker
                      value={date ? new Date(date) : new Date()}
                      mode="date"
                      display="spinner"
                      onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                        if (event.type === 'set' && selectedDate) {
                          setDate(selectedDate.toISOString().split('T')[0]);
                        }
                        setShowDatePicker(false);
                      }}
                    />
                    <Pressable onPress={() => setShowDatePicker(false)} style={{ marginTop: 8, alignItems: 'center' }}>
                      <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Done</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            )
          )}
        </>
      )}
      <TextInput style={styles.input} placeholder="Time of Arrival" value={arrivalTime} onChangeText={setArrivalTime} />
      <TextInput style={styles.input} placeholder="Time of Departure" value={departureTime} onChangeText={setDepartureTime} />
      <TextInput style={styles.input} placeholder="Subject(s)" value={subjects} onChangeText={setSubjects} />

      <TextInput style={styles.input} placeholder="Candidates Present" keyboardType="numeric" value={candidatesPresent} onChangeText={setCandidatesPresent} />
      <TextInput style={styles.input} placeholder="Candidates Absent" keyboardType="numeric" value={candidatesAbsent} onChangeText={setCandidatesAbsent} />
      <TextInput style={styles.input} placeholder="Unregistered Candidates" keyboardType="numeric" value={unregistered} onChangeText={setUnregistered} />
      <TextInput style={styles.input} placeholder="Irregularities" keyboardType="numeric" value={irregularities} onChangeText={setIrregularities} />
      <TextInput style={styles.input} placeholder="Number of Invigilators" keyboardType="numeric" value={invigilators} onChangeText={setInvigilators} />
      <TextInput style={styles.input} placeholder="Late Candidates" keyboardType="numeric" value={lateCandidates} onChangeText={setLateCandidates} />
      <TextInput style={styles.input} placeholder="Candidates in Isolation" keyboardType="numeric" value={isolatedCandidates} onChangeText={setIsolatedCandidates} />

      {[ 
        { title: "Invigilators & Administration", items: invigilatorSection },
        { title: "Storage Facilities & Security", items: storageSection },
        { title: "Examination Venue", items: venueSection },
        { title: "Before Commencement", items: beforeExamSection },
        { title: "During Examination", items: duringExamSection },
        { title: "End of Examination", items: endExamSection }
      ].map((section) => (
        <View key={section.title}>
          <Text style={[styles.section, { color: '#fff' }]}>{section.title}</Text>
          {section.items.map((item) => (
            <View key={item}>
              <Text>{item}</Text>
              {yesNo.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.checkbox,
                    checklist[item] === option && styles.checkboxSelected
                  ]}
                  onPress={() => toggle(item, option)}
                >
                  <Text>{option}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      ))}

      <Text style={[styles.section, { color: '#fff' }]}>Areas that Need Development</Text>
      <TextInput style={styles.textArea} multiline value={developmentAreas} onChangeText={setDevelopmentAreas} />

      <Text style={styles.section}>Recommendations</Text>
      <TextInput style={styles.textArea} multiline value={recommendations} onChangeText={setRecommendations} />

      <Pressable style={styles.submitButton} onPress={submitMonitoring}>
        <Text style={styles.submitText}>Submit Full Examination Monitoring</Text>
      </Pressable>
    </ScrollView>
  );
}
/* ---------------- GROUP SUPPORT SCREEN ---------------- */

function GroupSupportScreen() {
    const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [staffMember, setStaffMember] = React.useState('');
  const [date, setDate] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [subjectSearch, setSubjectSearch] = React.useState('');
  const [showSubjectList, setShowSubjectList] = React.useState(false);
  const [meetingType, setMeetingType] = React.useState('');
  const [otherMeetingType, setOtherMeetingType] = React.useState('');
  const [focus, setFocus] = React.useState('');
  const [expectedAttendees, setExpectedAttendees] = React.useState('');
  const [actualAttendees, setActualAttendees] = React.useState('');
  const [generalComments, setGeneralComments] = React.useState('');
  const [schoolsOfConcern, setSchoolsOfConcern] = React.useState('');
  const [schoolSearch, setSchoolSearch] = React.useState('');
  const [showSchoolList, setShowSchoolList] = React.useState(false);
  const [selectedSchools, setSelectedSchools] = React.useState<string[]>([]);

  // --- DRAFT AUTOSAVE ---
  const GROUP_DRAFT_KEY = 'GROUP_SUPPORT_DRAFT';
  const [lastSaved, setLastSaved] = React.useState<string | null>(null);

  const saveDraft = async () => {
    const draft = {
      selectedSchools,
      staffMember,
      date,
      subject,
      meetingType,
      otherMeetingType,
      focus,
      expectedAttendees,
      actualAttendees,
      generalComments,
      schoolsOfConcern
    };
    await AsyncStorage.setItem(GROUP_DRAFT_KEY, JSON.stringify(draft));
    setLastSaved(new Date().toLocaleTimeString());
  };

  const loadDraft = async () => {
    const saved = await AsyncStorage.getItem(GROUP_DRAFT_KEY);
    if (saved) {
      const d = JSON.parse(saved);
      setSelectedSchools(d.selectedSchools || []);
      setStaffMember(d.staffMember || '');
      setDate(d.date || '');
      setSubject(d.subject || '');
      setMeetingType(d.meetingType || '');
      setOtherMeetingType(d.otherMeetingType || '');
      setFocus(d.focus || '');
      setExpectedAttendees(d.expectedAttendees || '');
      setActualAttendees(d.actualAttendees || '');
      setGeneralComments(d.generalComments || '');
      setSchoolsOfConcern(d.schoolsOfConcern || '');
    }
  };

  React.useEffect(() => {
    loadDraft();
  }, []);

  React.useEffect(() => {
    saveDraft();
  }, [
    selectedSchools,
    staffMember,
    date,
    subject,
    meetingType,
    otherMeetingType,
    focus,
    expectedAttendees,
    actualAttendees,
    generalComments,
    schoolsOfConcern
  ]);

  const filteredSchools =
    schoolSearch.trim().length === 0
      ? SCHOOL_LIST
      : SCHOOL_LIST.filter((s) =>
          s.toLowerCase().includes(schoolSearch.toLowerCase())
        );

  const subjects = SUBJECT_LIST;

  const filteredSubjects = subjects.filter((s) =>
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const meetingTypes = [
    'DH Meeting',
    'Cluster Moderation Meeting',
    "Deputy Principals' Meeting",
    'PLC Meeting',
    'Roadshow',
    'SAT Meeting',
    'Small group meeting',
    'SMT Workshop',
    'Subject meeting',
    'Workshop',
    'Other'
  ];

  const toggleSchool = (item: string) => {
    setSelectedSchools((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const submitGroupSupport = async () => {
    const payload = {
      tool: "group_support",
      schoolsInvolved: selectedSchools,
      staffMember,
      date,
      subject,
      meetingType,
      otherMeetingType,
      focus,
      expectedAttendees,
      actualAttendees,
      generalComments,
      schoolsOfConcern
    };

    const jsonBody = JSON.stringify(payload, null, 2);

    if (Platform.OS === "web") {
      const mailtoUrl = `mailto:martinharmse@gdets.onmicrosoft.com?subject=${encodeURIComponent(
        "GDE_TS_GROUP_SUPPORT"
      )}&body=${encodeURIComponent(jsonBody)}`;
      window.location.href = mailtoUrl;
    } else {
      await MailComposer.composeAsync({
        recipients: ["martinharmse@gdets.onmicrosoft.com"],
        subject: "GDE_TS_GROUP_SUPPORT",
        body: jsonBody,
        isHtml: false,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerBar} />
      <Text style={styles.screenTitle}>Group Support</Text>

      <Text style={styles.section}>Schools Involved</Text>

      <Pressable
        style={[styles.input, { justifyContent: 'center' }]}
        onPress={() => setShowSchoolList(!showSchoolList)}
      >
        <Text>
          {selectedSchools.length > 0
            ? `${selectedSchools.length} school(s) selected`
            : 'Select schools'}
        </Text>
      </Pressable>

      {showSchoolList && (
        <View style={[styles.pickerBox, { maxHeight: 300 }]}>
          <TextInput
            style={styles.input}
            placeholder="Search school..."
            value={schoolSearch}
            onChangeText={setSchoolSearch}
          />

          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={true}
          >
            {filteredSchools.map((s) => (
              <Pressable
                key={s}
                style={[
                  styles.checkbox,
                  selectedSchools.includes(s) && styles.checkboxSelected,
                ]}
                onPress={() => toggleSchool(s)}
              >
                <Text>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <Text style={styles.section}>Staff Member</Text>
      <TextInput style={styles.input} value={staffMember} onChangeText={setStaffMember} />

      <Text style={styles.section}>Date</Text>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          className="web-date-input"
          style={{ ...styles.input, color: '#0b3d6d', background: '#ffcc00', border: 'none', fontSize: 16, padding: 10, borderRadius: 10, marginTop: 8 }}
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      ) : (
        <>
          <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text>{date ? date : 'Select date'}</Text>
          </Pressable>
          {showDatePicker && (
            Platform.OS === 'android' ? (
              <DateTimePicker
                value={date ? new Date(date) : new Date()}
                mode="date"
                display="default"
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate.toISOString().split('T')[0]);
                  }
                }}
              />
            ) : (
              <Modal transparent={true} visible={showDatePicker} animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                  <View style={{ backgroundColor: 'white', margin: 24, borderRadius: 8, padding: 16 }}>
                    <DateTimePicker
                      value={date ? new Date(date) : new Date()}
                      mode="date"
                      display="spinner"
                      onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                        if (event.type === 'set' && selectedDate) {
                          setDate(selectedDate.toISOString().split('T')[0]);
                        }
                        setShowDatePicker(false);
                      }}
                    />
                    <Pressable onPress={() => setShowDatePicker(false)} style={{ marginTop: 8, alignItems: 'center' }}>
                      <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Done</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            )
          )}
        </>
      )}

      <Text style={styles.section}>Subject Supported</Text>

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
        <View style={[styles.pickerBox, { maxHeight: 220 }]}>
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

      <Text style={styles.section}>Type of Meeting</Text>
      {meetingTypes.map((m) => (
        <Pressable
          key={m}
          style={[styles.checkbox, meetingType === m && styles.checkboxSelected]}
          onPress={() => setMeetingType(m)}
        >
          <Text>{m}</Text>
        </Pressable>
      ))}

      {meetingType === 'Other' && (
        <>
          <Text style={styles.section}>If Other, Specify</Text>
          <TextInput
            style={styles.input}
            value={otherMeetingType}
            onChangeText={setOtherMeetingType}
          />
        </>
      )}

      <Text style={styles.section}>Focus of the Meeting / Workshop</Text>
      <TextInput
        style={styles.textArea}
        multiline
        value={focus}
        onChangeText={setFocus}
      />

      <Text style={styles.section}>Number of Attendees Expected</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={expectedAttendees}
        onChangeText={setExpectedAttendees}
      />

      <Text style={styles.section}>Actual Number of Attendees</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={actualAttendees}
        onChangeText={setActualAttendees}
      />

      <Text style={styles.section}>General Comments</Text>
      <TextInput
        style={styles.textArea}
        multiline
        value={generalComments}
        onChangeText={setGeneralComments}
      />

      <Text style={styles.section}>Schools of Concern That Were Absent</Text>
      <TextInput
        style={styles.textArea}
        multiline
        value={schoolsOfConcern}
        onChangeText={setSchoolsOfConcern}
      />

      {lastSaved && (
        <Text style={{ marginTop: 8, color: '#475569', fontSize: 12 }}>
          Draft auto-saved at {lastSaved}
        </Text>
      )}

      <Pressable style={styles.submitButton} onPress={submitGroupSupport}>
        <Text style={styles.submitText}>Submit Group Support</Text>
      </Pressable>
    </ScrollView>
  );
}

// ---------------- DRAFTS SCREEN ----------------
function DraftsScreen({ navigation }: any) {
  const [schoolDraft, setSchoolDraft] = React.useState<any>(null);
  const [priorityDraft, setPriorityDraft] = React.useState<any>(null);
  const [monitoringDraft, setMonitoringDraft] = React.useState<any>(null);
  const [groupDraft, setGroupDraft] = React.useState<any>(null);
  const [learnerDraft, setLearnerDraft] = React.useState<any>(null);

  React.useEffect(() => {
    const loadDrafts = async () => {
      const s = await AsyncStorage.getItem('SCHOOL_VISIT_DRAFT');
      const p = await AsyncStorage.getItem('PRIORITY_VISIT_DRAFT');
      const m = await AsyncStorage.getItem('EXAM_MONITORING_DRAFT');
      const g = await AsyncStorage.getItem('GROUP_SUPPORT_DRAFT');
      const l = await AsyncStorage.getItem('DIRECT_LEARNER_SUPPORT_DRAFT');
      if (s) setSchoolDraft(JSON.parse(s));
      if (p) setPriorityDraft(JSON.parse(p));
      if (m) setMonitoringDraft(JSON.parse(m));
      if (g) setGroupDraft(JSON.parse(g));
      if (l) setLearnerDraft(JSON.parse(l));
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
  const deleteMonitoringDraft = async () => {
    await AsyncStorage.removeItem('EXAM_MONITORING_DRAFT');
    setMonitoringDraft(null);
  };
  const deleteGroupDraft = async () => {
    await AsyncStorage.removeItem('GROUP_SUPPORT_DRAFT');
    setGroupDraft(null);
  };
  const deleteLearnerDraft = async () => {
    await AsyncStorage.removeItem('DIRECT_LEARNER_SUPPORT_DRAFT');
    setLearnerDraft(null);
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

      <Text style={styles.section}>Examination Monitoring Draft</Text>
      {monitoringDraft ? (
        <View style={styles.box}>
          <Text>School: {monitoringDraft.school || 'Not specified'}</Text>
          <Text>Date: {monitoringDraft.date || 'Not specified'}</Text>
          <Pressable
            style={[styles.submitButton, { marginTop: 12 }]}
            onPress={() => navigation.navigate('ExaminationMonitoring')}
          >
            <Text style={styles.submitText}>Open Monitoring Draft</Text>
          </Pressable>
          <Pressable
            style={[styles.submitButton, { backgroundColor: '#b91c1c', marginTop: 8 }]}
            onPress={deleteMonitoringDraft}
          >
            <Text style={styles.submitText}>Delete Monitoring Draft</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={{ marginTop: 8 }}>No saved Examination Monitoring draft.</Text>
      )}

      <Text style={styles.section}>Group Support Draft</Text>
      {groupDraft ? (
        <View style={styles.box}>
          <Text>Staff Member: {groupDraft.staffMember || 'Not specified'}</Text>
          <Text>Date: {groupDraft.date || 'Not specified'}</Text>
          <Pressable
            style={[styles.submitButton, { marginTop: 12 }]}
            onPress={() => navigation.navigate('GroupSupport')}
          >
            <Text style={styles.submitText}>Open Group Support Draft</Text>
          </Pressable>
          <Pressable
            style={[styles.submitButton, { backgroundColor: '#b91c1c', marginTop: 8 }]}
            onPress={deleteGroupDraft}
          >
            <Text style={styles.submitText}>Delete Group Support Draft</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={{ marginTop: 8 }}>No saved Group Support draft.</Text>
      )}

      <Text style={styles.section}>Direct Learner Support Draft</Text>
      {learnerDraft ? (
        <View style={styles.box}>
          <Text>Staff Member: {learnerDraft.staffMember || 'Not specified'}</Text>
          <Text>Date: {learnerDraft.date || 'Not specified'}</Text>
          <Pressable
            style={[styles.submitButton, { marginTop: 12 }]}
            onPress={() => navigation.navigate('DirectLearnerSupport')}
          >
            <Text style={styles.submitText}>Open Learner Support Draft</Text>
          </Pressable>
          <Pressable
            style={[styles.submitButton, { backgroundColor: '#b91c1c', marginTop: 8 }]}
            onPress={deleteLearnerDraft}
          >
            <Text style={styles.submitText}>Delete Learner Support Draft</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={{ marginTop: 8 }}>No saved Direct Learner Support draft.</Text>
      )}
    </ScrollView>
  );
}

/* ---------------- SCHOOL VISIT SCREEN ---------------- */

function SchoolVisitScreen() {
    const [sbaStatus, setSbaStatus] = React.useState('');
  const [purpose, setPurpose] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState('');
  const [school, setSchool] = React.useState('');
  const [schoolSearch, setSchoolSearch] = React.useState('');
  const [showSchoolList, setShowSchoolList] = React.useState(false);
  const [subject, setSubject] = React.useState('');
  const [subjectSearch, setSubjectSearch] = React.useState('');
  const [showSubjectList, setShowSubjectList] = React.useState(false);

  const [syllabus, setSyllabus] = React.useState({
    g10: { percent: '' },
    g11: { percent: '' },
    g12: { percent: '' },
  });
  const [scStatus, setScStatus] = React.useState('');

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

  const filteredSchools = SCHOOL_LIST.filter((s) =>
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
            <h3>FET SCHOOL VISIT TOOL</h3>
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
        subject: "TS_FET_SCHOOL_VISIT",
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

      <Text style={[styles.section, { color: '#fff' }]}>Recommendations</Text>
      <TextInput
        style={styles.textArea}
        multiline
        placeholder="Enter recommendations and support actions"
        value={recommendations}
        onChangeText={setRecommendations}
      />
      <Modal visible={previewVisible} animationType="slide">
        <ScrollView style={{ padding: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>
            Report Preview
          </Text>

          <Text>
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
        </View>
      ))}
      <View style={styles.box}>
        <Text style={styles.subLabel}>Syllabus Completion Status</Text>
        <View style={[styles.pickerBox, { marginTop: 8 }]}> 
          {['red', 'yellow', 'green'].map((option) => (
            <Pressable
              key={option}
              style={[styles.checkbox, scStatus === option && styles.checkboxSelected]}
              onPress={() => setScStatus(option)}
            >
              <Text>{option.charAt(0).toUpperCase() + option.slice(1)}</Text>
            </Pressable>
          ))}
        </View>
      </View>

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
      <View style={styles.box}>
        <Text style={styles.subLabel}>SBA Completion Status</Text>
        <View style={[styles.pickerBox, { marginTop: 8 }]}> 
          {['red', 'yellow', 'green'].map((option) => (
            <Pressable
              key={option}
              style={[styles.checkbox, sbaStatus === option && styles.checkboxSelected]}
              onPress={() => setSbaStatus(option)}
            >
              <Text>{option.charAt(0).toUpperCase() + option.slice(1)}</Text>
            </Pressable>
          ))}
        </View>
      </View>

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
      // --- School Stamp State ---
      const [schoolStampUri, setSchoolStampUri] = React.useState<string | null>(null);
      const [showStampModal, setShowStampModal] = React.useState(false);

      // Image picker logic (Expo)
      const pickStampImage = async () => {
        let result;
        if (Platform.OS === 'web') {
          result = await window.showOpenFilePicker({
            types: [{ description: 'Image', accept: { 'image/*': ['.png', '.jpg', '.jpeg'] } }],
            multiple: false,
          });
          if (result && result.length > 0) {
            const file = result[0];
            const fileData = await file.getFile();
            setSchoolStampUri(URL.createObjectURL(fileData));
          }
        } else {
          const picker = await import('expo-image-picker');
          const res = await picker.launchImageLibraryAsync({ mediaTypes: picker.MediaTypeOptions.Images, quality: 0.7 });
          if (!res.cancelled) setSchoolStampUri(res.uri);
        }
        setShowStampModal(false);
      };
    // --- Signature State ---
    const [principalSignature, setPrincipalSignature] = React.useState<string | null>(null);
    const [sesSignature, setSesSignature] = React.useState<string | null>(null);
    const [showPrincipalSigPad, setShowPrincipalSigPad] = React.useState(false);
    const [showSesSigPad, setShowSesSigPad] = React.useState(false);
  const [school, setSchool] = React.useState('');
  const [schoolSearch, setSchoolSearch] = React.useState('');
  const [showSchoolList, setShowSchoolList] = React.useState(false);
  // const [reason, setReason] = React.useState(''); // REMOVE OLD STATE
  const [findings, setFindings] = React.useState('');
  const generatePreview = async () => {
    const date = new Date().toISOString().split('T')[0];
    let stampImgTag = '';
    if (schoolStampUri) {
      let base64 = '';
      if (Platform.OS === 'web') {
        // Web: fetch as blob then convert
        const res = await fetch(schoolStampUri);
        const blob = await res.blob();
        base64 = await new Promise(resolve => {
          const reader = new window.FileReader();
          reader.onloadend = () => resolve(reader.result?.toString().split(',')[1] || '');
          reader.readAsDataURL(blob);
        });
      } else {
        // Native: use FileSystem
        base64 = await FileSystem.readAsStringAsync(schoolStampUri, { encoding: FileSystem.EncodingType.Base64 });
      }
      stampImgTag = `\nSchool Stamp:\n<img src="data:image/png;base64,${base64}" style="width:120px;height:120px;" />`;
    }
    const content = `
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
    setPreviewContent(content);
    setPreviewVisible(true);
  };
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


  const cleanEmailText = (text: string) => {
    try {
      return decodeURIComponent(text.replace(/\+/g, ' '));
    } catch {
      return text.replace(/\+/g, ' ');
    }
  };

  const submitPriorityReport = async () => {
    // --- Convert images to base64 ---
    let schoolStampBase64 = '';
    if (schoolStampUri) {
      if (Platform.OS === 'web') {
        const res = await fetch(schoolStampUri);
        const blob = await res.blob();
        schoolStampBase64 = await new Promise(resolve => {
          const reader = new window.FileReader();
          reader.onloadend = () => resolve(reader.result?.toString().split(',')[1] || '');
          reader.readAsDataURL(blob);
        });
      } else {
        schoolStampBase64 = await FileSystem.readAsStringAsync(schoolStampUri, { encoding: FileSystem.EncodingType.Base64 });
      }
    }
    let principalSignatureBase64 = '';
    if (principalSignature) {
      principalSignatureBase64 = principalSignature.replace(/^data:image\/png;base64,/, '');
    }
    let sesSignatureBase64 = '';
    if (sesSignature) {
      sesSignatureBase64 = sesSignature.replace(/^data:image\/png;base64,/, '');
    }

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

      // Images as base64
      schoolStampBase64,
      principalSignatureBase64,
      sesSignatureBase64,
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

      {/* --- School Stamp Upload --- */}
      <Text style={styles.section}>School Stamp</Text>
      {schoolStampUri ? (
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <Image source={{ uri: schoolStampUri }} style={{ width: 120, height: 120, borderWidth: 1, borderColor: '#ccc', marginBottom: 8 }} resizeMode="contain" />
          <Pressable style={[styles.submitButton, { marginTop: 8 }]} onPress={() => setSchoolStampUri(null)}>
            <Text style={styles.submitText}>Clear Stamp</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={[styles.submitButton, { marginBottom: 12 }]} onPress={() => setShowStampModal(true)}>
          <Text style={styles.submitText}>Upload School Stamp</Text>
        </Pressable>
      )}
      <Modal visible={showStampModal} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000055' }}>
          <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>Upload School Stamp</Text>
            <Pressable style={[styles.submitButton, { marginBottom: 16 }]} onPress={pickStampImage}>
              <Text style={styles.submitText}>Pick Image</Text>
            </Pressable>
            <Pressable style={[styles.submitButton, { backgroundColor: '#475569' }]} onPress={() => setShowStampModal(false)}>
              <Text style={styles.submitText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Text style={styles.section}>Principal Signature</Text>
      {principalSignature ? (
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <Image source={{ uri: principalSignature }} style={{ width: 300, height: 100, borderWidth: 1, borderColor: '#ccc' }} resizeMode="contain" />
          <Pressable style={[styles.submitButton, { marginTop: 8 }]} onPress={() => setPrincipalSignature(null)}>
            <Text style={styles.submitText}>Clear Signature</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={[styles.submitButton, { marginBottom: 12 }]} onPress={() => setShowPrincipalSigPad(true)}>
          <Text style={styles.submitText}>Add Principal Signature</Text>
        </Pressable>
      )}
      <Modal visible={showPrincipalSigPad} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', margin: 16 }}>Principal Signature</Text>
          <SignatureScreen
            onOK={sig => { setPrincipalSignature(sig); setShowPrincipalSigPad(false); }}
            onEmpty={() => setShowPrincipalSigPad(false)}
            descriptionText="Sign above"
            webStyle=".m-signature-pad--footer {display: none;}"
            autoClear={true}
          />
          <Pressable style={[styles.submitButton, { margin: 16 }]} onPress={() => setShowPrincipalSigPad(false)}>
            <Text style={styles.submitText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>

      <Text style={styles.section}>SES Signature</Text>
      {sesSignature ? (
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <Image source={{ uri: sesSignature }} style={{ width: 300, height: 100, borderWidth: 1, borderColor: '#ccc' }} resizeMode="contain" />
          <Pressable style={[styles.submitButton, { marginTop: 8 }]} onPress={() => setSesSignature(null)}>
            <Text style={styles.submitText}>Clear Signature</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={[styles.submitButton, { marginBottom: 12 }]} onPress={() => setShowSesSigPad(true)}>
          <Text style={styles.submitText}>Add SES Signature</Text>
        </Pressable>
      )}
      <Modal visible={showSesSigPad} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', margin: 16 }}>SES Signature</Text>
          <SignatureScreen
            onOK={sig => { setSesSignature(sig); setShowSesSigPad(false); }}
            onEmpty={() => setShowSesSigPad(false)}
            descriptionText="Sign above"
            webStyle=".m-signature-pad--footer {display: none;}"
            autoClear={true}
          />
          <Pressable style={[styles.submitButton, { margin: 16 }]} onPress={() => setShowSesSigPad(false)}>
            <Text style={styles.submitText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
      <Modal visible={previewVisible} animationType="slide">
        <ScrollView style={{ padding: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 16 }}>
            Priority Report Preview
          </Text>

          <Text>
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


/* ---------------- DIRECT LEARNER SUPPORT SCREEN ---------------- */

function DirectLearnerSupportScreen() {
    const [showStartDatePicker, setShowStartDatePicker] = React.useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = React.useState(false);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [staffMember, setStaffMember] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [subjectSearch, setSubjectSearch] = React.useState('');
  const [showSubjectList, setShowSubjectList] = React.useState(false);
  const [schoolSearch, setSchoolSearch] = React.useState('');
  const [selectedSchools, setSelectedSchools] = React.useState<string[]>([]);
  const [showSchoolList, setShowSchoolList] = React.useState(false);
  const [supportTypes, setSupportTypes] = React.useState<string[]>([]);
  const [otherSupport, setOtherSupport] = React.useState('');
  const [contentOfSupport, setContentOfSupport] = React.useState('');
  const [materialProvided, setMaterialProvided] = React.useState('');
  const [learnersBenefitted, setLearnersBenefitted] = React.useState('');

  // --- DRAFT AUTOSAVE ---
  const SUPPORT_DRAFT_KEY = 'DIRECT_SUPPORT_DRAFT';
  const [lastSaved, setLastSaved] = React.useState<string | null>(null);

  const saveDraft = async () => {
    const draft = {
      startDate,
      endDate,
      staffMember,
      subject,
      selectedSchools,
      supportTypes,
      otherSupport,
      contentOfSupport,
      materialProvided,
      learnersBenefitted
    };
    await AsyncStorage.setItem(SUPPORT_DRAFT_KEY, JSON.stringify(draft));
    setLastSaved(new Date().toLocaleTimeString());
  };

  const loadDraft = async () => {
    const saved = await AsyncStorage.getItem(SUPPORT_DRAFT_KEY);
    if (saved) {
      const d = JSON.parse(saved);
      setStartDate(d.startDate || '');
      setEndDate(d.endDate || '');
      setStaffMember(d.staffMember || '');
      setSubject(d.subject || '');
      setSelectedSchools(d.selectedSchools || []);
      setSupportTypes(d.supportTypes || []);
      setOtherSupport(d.otherSupport || '');
      setContentOfSupport(d.contentOfSupport || '');
      setMaterialProvided(d.materialProvided || '');
      setLearnersBenefitted(d.learnersBenefitted || '');
    }
  };

  React.useEffect(() => {
    loadDraft();
  }, []);

  React.useEffect(() => {
    saveDraft();
  }, [
    startDate,
    endDate,
    staffMember,
    subject,
    selectedSchools,
    supportTypes,
    otherSupport,
    contentOfSupport,
    materialProvided,
    learnersBenefitted
  ]);

  const subjects = SUBJECT_LIST;

  const filteredSubjects = subjects.filter((s) =>
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const supportList = [
    'Teaching in school',
    'Teach SSIP',
    'Online Lessons',
    'WhatsApp support',
    'Pre & Post tests',
    'Paired schools',
    'Motivation of Learners',
    'Study Skills',
    'Other'
  ];

  const toggleSchool = (item: string) => {
    setSelectedSchools(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const toggleSupport = (item: string) => {
    setSupportTypes(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const filteredSchools =
    schoolSearch.trim().length === 0
      ? SCHOOL_LIST
      : SCHOOL_LIST.filter((s) =>
          s.toLowerCase().includes(schoolSearch.toLowerCase())
        );

  const submitSupport = async () => {
    const payload = {
      tool: "direct_learner_support",
      startDate,
      endDate,
      staffMember,
      subject,
      schoolsInvolved: selectedSchools,
      supportTypes,
      otherSupport,
      contentOfSupport,
      materialProvided,
      learnersBenefitted
    };

    const jsonBody = JSON.stringify(payload, null, 2);

    if (Platform.OS === "web") {
      const mailtoUrl = `mailto:martinharmse@gdets.onmicrosoft.com?subject=${encodeURIComponent(
        "GDE_TS_DIRECT_LEARNER_SUPPORT"
      )}&body=${encodeURIComponent(jsonBody)}`;
      window.location.href = mailtoUrl;
    } else {
      await MailComposer.composeAsync({
        recipients: ["martinharmse@gdets.onmicrosoft.com"],
        subject: "GDE_TS_DIRECT_LEARNER_SUPPORT",
        body: jsonBody,
        isHtml: false,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerBar} />
      <Text style={styles.screenTitle}>Direct Learner Support</Text>

      <Text style={styles.section}>Start Date</Text>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          className="web-date-input"
          style={{ ...styles.input, color: '#0b3d6d', background: '#e0e7ef', border: 'none', fontSize: 16, padding: 10, borderRadius: 10, marginTop: 8 }}
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
      ) : (
        <>
          <Pressable style={styles.input} onPress={() => setShowStartDatePicker(true)}>
            <Text>{startDate ? startDate : 'Select start date'}</Text>
          </Pressable>
          {showStartDatePicker && (
            Platform.OS === 'android' ? (
              <DateTimePicker
                value={startDate ? new Date(startDate) : new Date()}
                mode="date"
                display="default"
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                  setShowStartDatePicker(false);
                  if (selectedDate) {
                    setStartDate(selectedDate.toISOString().split('T')[0]);
                  }
                }}
              />
            ) : (
              <Modal transparent={true} visible={showStartDatePicker} animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                  <View style={{ backgroundColor: 'white', margin: 24, borderRadius: 8, padding: 16 }}>
                    <DateTimePicker
                      value={startDate ? new Date(startDate) : new Date()}
                      mode="date"
                      display="spinner"
                      onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                        if (event.type === 'set' && selectedDate) {
                          setStartDate(selectedDate.toISOString().split('T')[0]);
                        }
                        setShowStartDatePicker(false);
                      }}
                    />
                    <Pressable onPress={() => setShowStartDatePicker(false)} style={{ marginTop: 8, alignItems: 'center' }}>
                      <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Done</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            )
          )}
        </>
      )}

      <Text style={styles.section}>End Date</Text>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          className="web-date-input"
          style={{ ...styles.input, color: '#0b3d6d', background: '#e0e7ef', border: 'none', fontSize: 16, padding: 10, borderRadius: 10, marginTop: 8 }}
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      ) : (
        <>
          <Pressable style={styles.input} onPress={() => setShowEndDatePicker(true)}>
            <Text>{endDate ? endDate : 'Select end date'}</Text>
          </Pressable>
          {showEndDatePicker && (
            Platform.OS === 'android' ? (
              <DateTimePicker
                value={endDate ? new Date(endDate) : new Date()}
                mode="date"
                display="default"
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                  setShowEndDatePicker(false);
                  if (selectedDate) {
                    setEndDate(selectedDate.toISOString().split('T')[0]);
                  }
                }}
              />
            ) : (
              <Modal transparent={true} visible={showEndDatePicker} animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                  <View style={{ backgroundColor: 'white', margin: 24, borderRadius: 8, padding: 16 }}>
                    <DateTimePicker
                      value={endDate ? new Date(endDate) : new Date()}
                      mode="date"
                      display="spinner"
                      onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                        if (event.type === 'set' && selectedDate) {
                          setEndDate(selectedDate.toISOString().split('T')[0]);
                        }
                        setShowEndDatePicker(false);
                      }}
                    />
                    <Pressable onPress={() => setShowEndDatePicker(false)} style={{ marginTop: 8, alignItems: 'center' }}>
                      <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Done</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            )
          )}
        </>
      )}

      <Text style={styles.section}>Staff Member</Text>
      <TextInput
        style={styles.input}
        value={staffMember}
        onChangeText={setStaffMember}
      />

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
        <View style={[styles.pickerBox, { maxHeight: 220 }]}>
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

      <Text style={styles.section}>Schools Involved</Text>

      <Pressable
        style={[styles.input, { justifyContent: 'center' }]}
        onPress={() => setShowSchoolList(!showSchoolList)}
      >
        <Text>
          {selectedSchools.length > 0
            ? `${selectedSchools.length} school(s) selected`
            : 'Select schools'}
        </Text>
      </Pressable>

      {showSchoolList && (
        <View style={[styles.pickerBox, { maxHeight: 300 }]}>
          <TextInput
            style={styles.input}
            placeholder="Search school..."
            value={schoolSearch}
            onChangeText={setSchoolSearch}
          />

          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={true}
          >
            {filteredSchools.map((s) => (
              <Pressable
                key={s}
                style={[
                  styles.checkbox,
                  selectedSchools.includes(s) && styles.checkboxSelected,
                ]}
                onPress={() => toggleSchool(s)}
              >
                <Text>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <Text style={styles.section}>Type of Learner Support</Text>
      {supportList.map((item) => (
        <Pressable
          key={item}
          style={[
            styles.checkbox,
            supportTypes.includes(item) && styles.checkboxSelected,
          ]}
          onPress={() => toggleSupport(item)}
        >
          <Text>{item}</Text>
        </Pressable>
      ))}

      {supportTypes.includes('Other') && (
        <>
          <Text style={styles.section}>If Other, Specify</Text>
          <TextInput
            style={styles.textArea}
            multiline
            value={otherSupport}
            onChangeText={setOtherSupport}
          />
        </>
      )}

      <Text style={styles.section}>Content of Support</Text>
      <TextInput
        style={styles.textArea}
        multiline
        placeholder="Describe the academic content or focus of the support provided"
        value={contentOfSupport}
        onChangeText={setContentOfSupport}
      />

      <Text style={styles.section}>Material Provided to Learners</Text>
      <TextInput
        style={styles.textArea}
        multiline
        placeholder="Specify worksheets, study guides, revision packs, etc."
        value={materialProvided}
        onChangeText={setMaterialProvided}
      />

      <Text style={styles.section}>Number of Learners Benefitted</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter number of learners"
        value={learnersBenefitted}
        onChangeText={setLearnersBenefitted}
      />

      {lastSaved && (
        <Text style={{ marginTop: 8, color: '#475569', fontSize: 12 }}>
          Draft auto-saved at {lastSaved}
        </Text>
      )}

      <Pressable
        style={styles.submitButton}
        onPress={submitSupport}
      >
        <Text style={styles.submitText}>Submit Direct Learner Support</Text>
      </Pressable>
    </ScrollView>
  );
}

/* ---------------- NAVIGATION ---------------- */

const Stack = createNativeStackNavigator();

export default function App() {

  React.useEffect(() => {
    if (Platform.OS === 'web' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.log('Service Worker registration failed:', err));
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="SchoolVisit"
          component={SchoolVisitScreen}
          options={{ title: 'FET School Visit Tool' }}
        />
        <Stack.Screen
          name="PriorityVisit"
          component={PriorityVisitScreen}
          options={{ title: 'Priority School Visit' }}
        />
        <Stack.Screen
          name="DirectLearnerSupport"
          component={DirectLearnerSupportScreen}
          options={{ title: 'Direct Learner Support' }}
        />
        <Stack.Screen
          name="GroupSupport"
          component={GroupSupportScreen}
          options={{ title: 'Group Support' }}
        />
        <Stack.Screen
          name="ExaminationMonitoring"
          component={ExaminationMonitoringScreen}
          options={{ title: 'Examination Monitoring' }}
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
    bigSubtitle: {
      textAlign: 'center',
      marginBottom: 18,
      color: '#ffcc00',
      fontSize: 28,
      fontWeight: 'bold',
      letterSpacing: 1.2,
      marginTop: 8,
      textShadowColor: '#000',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
    },
    thickYellowLine: {
      height: 8,
      backgroundColor: '#ffcc00',
      borderRadius: 4,
      marginBottom: 24,
      width: '80%',
      alignSelf: 'center',
    },
  /* ---------- GLOBAL CONTAINERS ---------- */

  homeContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#0b3d6d',
    minHeight: '100%',
  },

  scrollContainer: {
    flexGrow: 1,
    minHeight: '100%',
    padding: 24,
    paddingBottom: 80,
    backgroundColor: '#25477a', // lighter navy
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
    color: '#fff', // white for better contrast
  },

  /* ---------- CARDS ---------- */

  card: {
    backgroundColor: '#13294b',
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
    color: '#fff', // white for better contrast
    fontSize: 15,
  },

  subLabel: {
    fontWeight: '700',
    marginBottom: 8,
    fontSize: 17,
    color: '#fff', // white for exam monitoring sub-headings
  },

  /* ---------- INPUTS ---------- */

  pickerBox: {
    position: 'relative',
    zIndex: 1,
    elevation: 1,
    left: 0,
    right: 0,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    maxHeight: 280,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ffcc00',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    backgroundColor: '#fff', // white background for required fields
    color: '#111', // black text for readability
  },

  textArea: {
    borderWidth: 1,
    borderColor: '#ffcc00',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff', // white background for required fields
    color: '#111', // black text for readability
  },

  /* ---------- CHECKBOXES ---------- */

  checkbox: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#fff', // always white when not selected
  },

  checkboxSelected: {
    backgroundColor: '#fff9c4', // lighter yellow when selected
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
    height: 12,
    backgroundColor: '#ffcc00',
    marginBottom: 24,
    borderRadius: 6,
    width: '100%',
    alignSelf: 'center',
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