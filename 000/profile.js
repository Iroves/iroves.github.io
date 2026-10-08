/*
  PUBLIC EMERGENCY PROFILE CONFIGURATION
  WARNING: Data saved here is public on any public hosting service (including GitHub Pages).
  Do not enter real medical or contact details until privacy, consent and hosting are resolved.
  Keep blanks blank: the page displays 'Not provided', NOT 'None'.
  This prototype has no authentication, encryption, secure database or private records.
*/
window.EMERGENCY_PROFILE = {
  fullName: '',
  ageOrBirthYear: '',     // Optional: prefer approximate age to exact DOB in a public view.
  reviewedOn: '',        // YYYY-MM-DD; only after a real accuracy review.
  reviewedBy: '',        // Optional name/role of person confirming info.
  allergies: [/* { substance: '', reaction: '' } */],
  medicineWarnings: [/* 'Taking an anticoagulant: verify current medicine/dose' */],
  criticalConditions: [/* 'Critical condition and implications' */],
  medicines: [/* { name: '', dose: '', schedule: '', purpose: '' } */],
  conditions: [],
  devices: [],
  communication: [],
  otherNotes: [],
  contacts: [/* { name: '', relation: '', phone: '' } */],
  healthcareContacts: [/* { role: 'GP', name: '', phone: '' } */],
  bloodGroup: '',        // Optional; MUST be professionally confirmed. NOT for transfusion decisions.
  preferredLanguage: '',
  insuranceProvider: '', // Provider name only. No policy, Medicare or member number.
  advancePlan: { status: '', custodian: '', phone: '' }
};

/* Fictional design-preview content only — loaded with ?demo=1. */
window.EMERGENCY_EXAMPLE = {
  fullName: 'Alex Example', ageOrBirthYear: 'Example profile · 74 years',
  reviewedOn: '2026-10-01', reviewedBy: 'Fictional sample',
  allergies: [{substance:'Example allergy',reaction:'Reaction details appear here'}],
  medicineWarnings: ['Example alert: important treatment or medicine risk'],
  criticalConditions: ['Example condition requiring special consideration'],
  medicines: [
    {name:'Example medicine A',dose:'Dose to confirm',schedule:'Morning',purpose:'Purpose (optional)'},
    {name:'Example medicine B',dose:'Dose to confirm',schedule:'Evening',purpose:''}
  ],
  conditions: ['Example chronic condition','Second condition, if relevant'],
  devices: ['Example device / implant information'],
  communication: ['Speaks English','Hearing or mobility assistance, if needed'],
  otherNotes: ['Only brief, medically relevant information'],
  contacts:[{name:'First emergency contact',relation:'Family member',phone:''},{name:'Second emergency contact',relation:'Trusted person',phone:''}],
  healthcareContacts:[{role:'GP / clinic',name:'Healthcare professional',phone:''}],
  bloodGroup:'Not recorded',preferredLanguage:'English',insuranceProvider:'Provider name only',
  advancePlan:{status:'Details available from contact',custodian:'Planning document custodian',phone:''}
};
