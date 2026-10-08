(() => {
  'use strict';
  const demo = new URLSearchParams(window.location.search).get('demo') === '1';
  const data = demo ? window.EMERGENCY_EXAMPLE : window.EMERGENCY_PROFILE;
  if (!data) return;
  const $ = (id) => document.getElementById(id);
  const element = (tag, cls, value) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (value !== undefined && value !== null) el.textContent = String(value);
    return el;
  };
  const filled = (value) => typeof value === 'string' && value.trim().length > 0;
  const display = (value) => filled(value) ? value.trim() : 'Not provided';
  const appendEmpty = (parent, label = 'Not provided') => parent.appendChild(element('p', 'unavailable', label));
  const isPhone = (s) => /^\+?[0-9()\s-]{7,22}$/.test(String(s).trim());

  if (demo) $('demoBanner').hidden = false;
  $('personName').textContent = filled(data.fullName) ? data.fullName : 'Profile not configured';
  $('personAge').textContent = filled(data.ageOrBirthYear) ? data.ageOrBirthYear : 'Personal emergency information';
  const initials = filled(data.fullName) ? data.fullName.trim().split(/\s+/).slice(0,2).map(x => x[0]).join('').toUpperCase() : '+';
  $('avatar').textContent = initials;

  const reviewed = data.reviewedOn && /^\d{4}-\d\d-\d\d$/.test(data.reviewedOn);
  if (reviewed) {
    const parts = data.reviewedOn.split('-').map(Number);
    const dt = new Date(Date.UTC(parts[0], parts[1]-1, parts[2]));
    if (!Number.isNaN(dt.getTime())) {
      const dateString = new Intl.DateTimeFormat('en-AU', { day:'numeric', month:'short', year:'numeric',timeZone:'UTC'}).format(dt);
      $('reviewedText').textContent = `Last reviewed ${dateString}${filled(data.reviewedBy) ? ' · ' + data.reviewedBy : ''}`;
      $('verifiedStatus').classList.add('verification--reviewed');
    }
  }

  function renderTextList(id, items, mode) {
    const parent = $(id);
    if (!Array.isArray(items) || !items.length) { appendEmpty(parent); return; }
    const list = element('ul', mode === 'alert' ? 'critical-list' : 'detail-list');
    let count = 0;
    items.forEach(x => { if (filled(x)) { list.appendChild(element('li', '', x)); count++; } });
    if (!count) appendEmpty(parent); else parent.appendChild(list);
  }
  const allergyBox = $('allergies');
  const allergies = (data.allergies || []).filter(x => filled(x.substance));
  if (!allergies.length) appendEmpty(allergyBox, 'Allergy status not provided');
  else allergies.forEach(x => {
    const item = element('div', 'allergy-item');
    item.appendChild(element('strong', '', x.substance));
    item.appendChild(element('span', '', filled(x.reaction) ? `Reaction: ${x.reaction}` : 'Reaction not recorded'));
    allergyBox.appendChild(item);
  });
  renderTextList('medicationRisks', data.medicineWarnings, 'alert');
  renderTextList('criticalConditions', data.criticalConditions, 'alert');

  const medicineList = $('medicinesList');
  const med = (data.medicines || []).filter(x => filled(x.name));
  if (!med.length) {
    const box = element('div', 'empty-med'); box.appendChild(element('strong', '', 'Medication list not provided'));
    box.appendChild(element('span', '', 'Check with the person, caregiver, pharmacy or treating team.'));
    medicineList.appendChild(box);
  } else med.forEach(x => {
    const row = element('div', 'medicine-row');
    const left = element('div'); left.appendChild(element('strong', 'med-name', x.name));
    if (filled(x.purpose)) left.appendChild(element('small','med-note',x.purpose));
    const right = element('div');right.appendChild(element('strong','med-dose',display(x.dose)));
    right.appendChild(element('small','med-note',display(x.schedule)));
    row.append(left,right);medicineList.appendChild(row);
  });

  ['conditions','devices','communication','otherNotes'].forEach(id => renderTextList(id,data[id]));
  // Place the nominated first contact immediately below the 000 button.
  // In this prototype, the FIRST item in contacts is the priority person.
  // Remaining contacts are shown lower on the page as alternatives.
  const usableContacts = (data.contacts || []).filter(x => filled(x.name) || filled(x.phone));
  const primary = $('primaryContact');
  if (!usableContacts.length) {
    const missing = element('div', 'primary-contact-missing');
    missing.appendChild(element('strong', '', 'Emergency contact not provided'));
    missing.appendChild(element('p', '', 'No contact has been configured for this card. Do not delay calling 000 in an emergency.'));
    primary.appendChild(missing);
  } else {
    const first = usableContacts[0];
    const identity = element('div', 'primary-person');
    identity.appendChild(element('small', 'primary-relation', display(first.relation)));
    identity.appendChild(element('strong', 'primary-name', display(first.name)));
    identity.appendChild(element('span', 'primary-number', display(first.phone)));
    primary.appendChild(identity);
    if (isPhone(first.phone) && !demo) {
      const action = element('a', 'primary-call', 'Call emergency contact ↗');
      action.href = 'tel:' + first.phone.replace(/[^\d+]/g, '');
      action.setAttribute('aria-label', 'Call ' + display(first.name) + ', ' + display(first.relation));
      primary.appendChild(action);
    } else {
      const unavailable = element('div', 'primary-call primary-call--disabled', demo ? 'Demo only · Calling disabled' : 'Phone number not available');
      unavailable.setAttribute('aria-disabled', 'true');
      primary.appendChild(unavailable);
    }
  }

  const contacts = $('contactsList');
  const additionalContacts = usableContacts.slice(1);
  if (!additionalContacts.length) {
    const notice = element('div', 'empty-contact');
    notice.appendChild(element('strong', '', 'No additional contact provided'));
    notice.appendChild(element('p', '', 'Only the primary emergency contact is listed above.'));
    contacts.appendChild(notice);
  } else additionalContacts.forEach((x, i) => {
    const card = element('article', 'contact-card');
    const first = element('div', 'contact-number', '0' + (i + 2));
    const body = element('div', 'contact-body');
    body.appendChild(element('small', 'contact-kind', display(x.relation)));
    body.appendChild(element('strong', 'contact-name', display(x.name)));
    body.appendChild(element('span', 'contact-phone', display(x.phone)));
    card.append(first, body);
    if (isPhone(x.phone) && !demo) {
      const link = element('a', 'contact-call', 'Call ↗');
      link.href = 'tel:' + x.phone.replace(/[^\d+]/g, '');
      link.setAttribute('aria-label', 'Call ' + display(x.name));
      card.appendChild(link);
    }
    contacts.appendChild(card);
  });

  const care = $('healthcareContacts');
  const careList=(data.healthcareContacts || []).filter(x => filled(x.name)||filled(x.phone));
  if (!careList.length) appendEmpty(care);
  else careList.forEach(x => {
    const block = element('div','care-contact');
    block.appendChild(element('small','care-role',display(x.role)));
    block.appendChild(element('strong','',display(x.name)));
    if (isPhone(x.phone)) {const a=element('a','',x.phone);a.href='tel:'+x.phone.replace(/[^\d+]/g,'');block.appendChild(a);}
    else block.appendChild(element('span','unavailable',display(x.phone)));
    care.appendChild(block);
  });

  const facts=$('supportingFacts');
  [ ['Blood group', data.bloodGroup], ['Preferred language', data.preferredLanguage], ['Insurance provider', data.insuranceProvider] ].forEach(([name,value]) => {
    const line=element('div','fact-row');line.appendChild(element('dt','',name));line.appendChild(element('dd',filled(value)?'':'unavailable',display(value)));facts.appendChild(line);
  });
  const acp=$('advancePlan');
  const plan=data.advancePlan||{};
  if (!filled(plan.status)&&!filled(plan.custodian)&&!filled(plan.phone)) appendEmpty(acp,'No details provided');
  else {
    if (filled(plan.status)) acp.appendChild(element('strong','acp-status',plan.status));
    if (filled(plan.custodian)) acp.appendChild(element('p','',`Document contact: ${plan.custodian}`));
    if (isPhone(plan.phone)) { const a=element('a','acp-phone',plan.phone);a.href='tel:'+plan.phone.replace(/[^\d+]/g,'');acp.appendChild(a);}
  }
  $('printCard').addEventListener('click', () => window.print());
})();
