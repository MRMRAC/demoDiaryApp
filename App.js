import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

const MOCK_USER = {
  login: 'patient1',
  password: '12345',
  fullName: 'Иванов Иван Иванович',
};

const MOCK_MEDICAL_CASES = [
  {
    id: 1,
    caseNumber: 'MC-2026-001',
    diagnosis: 'ОРВИ',
    startDate: '10.04.2026',
    status: 'Активен',
    treatment: {
      id: 101,
      name: 'Амбулаторное лечение ОРВИ',
      description: 'Постельный режим, обильное питье, симптоматическая терапия.',
      startDate: '10.04.2026',
      endDate: '17.04.2026',
      isActive: true,
    },
    diaryEntries: [
      {
        id: 1001,
        entryDate: '11.04.2026',
        bodyTemperature: '37.5',
        bloodPressure: '120/80',
        pulse: '82',
        wellBeingLevel: '3',
        painLevel: '2',
        symptomsText: 'Слабость, насморк',
        complaintText: 'Общее недомогание',
        commentText: 'К вечеру состояние стабильное',
      },
    ],
  },
  {
    id: 2,
    caseNumber: 'MC-2026-002',
    diagnosis: 'Артериальная гипертензия',
    startDate: '20.03.2026',
    status: 'Наблюдение',
    treatment: {
      id: 102,
      name: 'Контроль давления',
      description: 'Ежедневный контроль АД, прием назначенных препаратов.',
      startDate: '20.03.2026',
      endDate: '20.06.2026',
      isActive: true,
    },
    diaryEntries: [],
  },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [login, setLogin] = useState('patient1');
  const [password, setPassword] = useState('12345');
  const [screen, setScreen] = useState('cases');
  const [medicalCases, setMedicalCases] = useState(MOCK_MEDICAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [activeTab, setActiveTab] = useState('treatment');

  const [form, setForm] = useState({
    entryDate: '',
    bodyTemperature: '',
    systolicPressure: '',
    diastolicPressure: '',
    pulse: '',
    wellBeingLevel: '',
    painLevel: '',
    symptomsText: '',
    complaintText: '',
    commentText: '',
  });

  const selectedCase = useMemo(
    () => medicalCases.find((item) => item.id === selectedCaseId) || null,
    [medicalCases, selectedCaseId]
  );

  const handleLogin = () => {
    if (login.trim() === MOCK_USER.login && password === MOCK_USER.password) {
      setIsAuthenticated(true);
      setScreen('cases');
      return;
    }

    Alert.alert('Ошибка входа', 'Неверный логин или пароль');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedCaseId(null);
    setScreen('cases');
  };

  const openMedicalCase = (caseId) => {
    setSelectedCaseId(caseId);
    setActiveTab('treatment');
    setScreen('caseDetails');
  };

  const openCreateDiary = () => {
    setForm({
      entryDate: '',
      bodyTemperature: '',
      systolicPressure: '',
      diastolicPressure: '',
      pulse: '',
      wellBeingLevel: '',
      painLevel: '',
      symptomsText: '',
      complaintText: '',
      commentText: '',
    });
    setScreen('createDiary');
  };

  const saveDiaryEntry = () => {
    if (!selectedCase) return;

    if (!form.entryDate.trim()) {
      Alert.alert('Ошибка', 'Укажите дату записи');
      return;
    }

    const newEntry = {
      id: Date.now(),
      entryDate: form.entryDate,
      bodyTemperature: form.bodyTemperature,
      bloodPressure:
        form.systolicPressure && form.diastolicPressure
          ? `${form.systolicPressure}/${form.diastolicPressure}`
          : '',
      pulse: form.pulse,
      wellBeingLevel: form.wellBeingLevel,
      painLevel: form.painLevel,
      symptomsText: form.symptomsText,
      complaintText: form.complaintText,
      commentText: form.commentText,
    };

    setMedicalCases((prev) =>
      prev.map((item) =>
        item.id === selectedCase.id
          ? { ...item, diaryEntries: [newEntry, ...item.diaryEntries] }
          : item
      )
    );

    Alert.alert('Успешно', 'Запись дневника отправлена врачу');
    setScreen('caseDetails');
    setActiveTab('diary');
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginWrapper}>
          <Text style={styles.title}>Дневник симптомов</Text>
          <Text style={styles.subtitle}>Вход в аккаунт пациента</Text>

          <TextInput
            style={styles.input}
            placeholder="Логин"
            value={login}
            onChangeText={setLogin}
          />

          <TextInput
            style={styles.input}
            placeholder="Пароль"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Войти</Text>
          </TouchableOpacity>

          <View style={styles.demoBox}>
            <Text style={styles.demoText}>Тестовый вход:</Text>
            <Text style={styles.demoText}>Логин: patient1</Text>
            <Text style={styles.demoText}>Пароль: 12345</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'cases') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Здравствуйте!</Text>
            <Text style={styles.subtitle}>{MOCK_USER.fullName}</Text>
          </View>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
            <Text style={styles.secondaryButtonText}>Выйти</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Мои случаи обращения</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {medicalCases.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => openMedicalCase(item.id)}
            >
              <Text style={styles.cardTitle}>{item.caseNumber}</Text>
              <Text style={styles.cardText}>Диагноз: {item.diagnosis}</Text>
              <Text style={styles.cardText}>Дата начала: {item.startDate}</Text>
              <Text style={styles.cardText}>Статус: {item.status}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'caseDetails' && selectedCase) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerColumn}>
          <TouchableOpacity onPress={() => setScreen('cases')}>
            <Text style={styles.backLink}>← Назад к случаям</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{selectedCase.caseNumber}</Text>
          <Text style={styles.subtitle}>Диагноз: {selectedCase.diagnosis}</Text>
        </View>

        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'treatment' && styles.tabButtonActive]}
            onPress={() => setActiveTab('treatment')}
          >
            <Text
              style={[styles.tabButtonText, activeTab === 'treatment' && styles.tabButtonTextActive]}
            >
              Treatment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'diary' && styles.tabButtonActive]}
            onPress={() => setActiveTab('diary')}
          >
            <Text
              style={[styles.tabButtonText, activeTab === 'diary' && styles.tabButtonTextActive]}
            >
              Дневник симптомов
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === 'treatment' ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{selectedCase.treatment.name}</Text>
              <Text style={styles.cardText}>Описание: {selectedCase.treatment.description}</Text>
              <Text style={styles.cardText}>Дата начала: {selectedCase.treatment.startDate}</Text>
              <Text style={styles.cardText}>Дата окончания: {selectedCase.treatment.endDate}</Text>
              <Text style={styles.cardText}>
                Активность: {selectedCase.treatment.isActive ? 'Активно' : 'Неактивно'}
              </Text>
            </View>
          ) : (
            <View>
              <TouchableOpacity style={styles.primaryButton} onPress={openCreateDiary}>
                <Text style={styles.primaryButtonText}>Добавить запись</Text>
              </TouchableOpacity>

              {selectedCase.diaryEntries.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Записи дневника пока отсутствуют</Text>
                </View>
              ) : (
                selectedCase.diaryEntries.map((entry) => (
                  <View key={entry.id} style={styles.card}>
                    <Text style={styles.cardTitle}>Дата: {entry.entryDate}</Text>
                    <Text style={styles.cardText}>Температура: {entry.bodyTemperature || '-'}</Text>
                    <Text style={styles.cardText}>Давление: {entry.bloodPressure || '-'}</Text>
                    <Text style={styles.cardText}>Пульс: {entry.pulse || '-'}</Text>
                    <Text style={styles.cardText}>Самочувствие: {entry.wellBeingLevel || '-'}</Text>
                    <Text style={styles.cardText}>Боль: {entry.painLevel || '-'}</Text>
                    <Text style={styles.cardText}>Симптомы: {entry.symptomsText || '-'}</Text>
                    <Text style={styles.cardText}>Жалобы: {entry.complaintText || '-'}</Text>
                    <Text style={styles.cardText}>Комментарий: {entry.commentText || '-'}</Text>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'createDiary') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity onPress={() => setScreen('caseDetails')}>
            <Text style={styles.backLink}>← Назад к случаю</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Новая запись дневника</Text>
          <Text style={styles.subtitle}>Заполните поля и отправьте запись врачу</Text>

          <FormInput label="Дата" placeholder="13.04.2026" value={form.entryDate} onChangeText={(value) => setForm({ ...form, entryDate: value })} />
          <FormInput label="Температура" placeholder="37.5" value={form.bodyTemperature} onChangeText={(value) => setForm({ ...form, bodyTemperature: value })} keyboardType="numeric" />
          <FormInput label="Систолическое давление" placeholder="120" value={form.systolicPressure} onChangeText={(value) => setForm({ ...form, systolicPressure: value })} keyboardType="numeric" />
          <FormInput label="Диастолическое давление" placeholder="80" value={form.diastolicPressure} onChangeText={(value) => setForm({ ...form, diastolicPressure: value })} keyboardType="numeric" />
          <FormInput label="Пульс" placeholder="82" value={form.pulse} onChangeText={(value) => setForm({ ...form, pulse: value })} keyboardType="numeric" />
          <FormInput label="Самочувствие (1-5)" placeholder="3" value={form.wellBeingLevel} onChangeText={(value) => setForm({ ...form, wellBeingLevel: value })} keyboardType="numeric" />
          <FormInput label="Уровень боли (0-10)" placeholder="2" value={form.painLevel} onChangeText={(value) => setForm({ ...form, painLevel: value })} keyboardType="numeric" />
          <FormInput label="Симптомы" placeholder="Головная боль, слабость" value={form.symptomsText} onChangeText={(value) => setForm({ ...form, symptomsText: value })} multiline />
          <FormInput label="Жалобы" placeholder="Опишите жалобы" value={form.complaintText} onChangeText={(value) => setForm({ ...form, complaintText: value })} multiline />
          <FormInput label="Комментарий" placeholder="Дополнительная информация" value={form.commentText} onChangeText={(value) => setForm({ ...form, commentText: value })} multiline />

          <TouchableOpacity style={styles.primaryButton} onPress={saveDiaryEntry}>
            <Text style={styles.primaryButtonText}>Отправить врачу</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

function FormInput({ label, multiline = false, ...props }) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  loginWrapper: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerColumn: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 5,
    lineHeight: 20,
  },
  inputWrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  multilineInput: {
    minHeight: 96,
    paddingTop: 12,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  tabButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#2563eb',
  },
  tabButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  backLink: {
    fontSize: 15,
    color: '#2563eb',
    marginBottom: 12,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  emptyStateText: {
    color: '#6b7280',
    fontSize: 15,
  },
  demoBox: {
    marginTop: 16,
    backgroundColor: '#e0ecff',
    borderRadius: 12,
    padding: 14,
  },
  demoText: {
    color: '#1e3a8a',
    fontSize: 14,
    marginBottom: 4,
  },
});
