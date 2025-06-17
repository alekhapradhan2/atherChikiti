
let pendingNote = null;
function askNote(title, callback) {
  pendingNote = callback;
  document.getElementById('noteModalTitle').textContent = title;
  document.getElementById('noteModalTextarea').value = '';
  document.getElementById('noteModal').style.display = 'block';
}

document.getElementById("togglePassword").addEventListener("click", function () {
  const input = document.getElementById("otpInput");
  input.type = input.type === "password" ? "text" : "password";
});

function submitNote() {
  const val = document.getElementById('noteModalTextarea').value.trim();
  document.getElementById('noteModal').style.display = 'none';
  if (val && pendingNote) pendingNote(val);
  pendingNote = null;
}
function cancelNote() {
  document.getElementById('noteModal').style.display = 'none';
  pendingNote = null;
}
const profileToggle = document.getElementById('profileToggle');
const profileDropdown = document.getElementById('profileDropdown');

profileToggle.addEventListener('click', () => {
  profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click', (e) => {
  if (!document.querySelector('.profile-wrapper').contains(e.target)) {
    profileDropdown.style.display = 'none';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('verified');
  location.reload();
});


window.addEventListener('popstate', () => {
  if (sessionStorage.getItem('verified') !== 'yes') {
    location.reload();
  }
});

function showApp() {
  gate.style.display = 'none';
  mainApp.style.display = 'block';
  history.pushState({}, ''); // prevent immediate back
  initApp();
}



  let currentPage = 1;
    let recordsPerPage = 10;
    let filteredLeads = [];

    function paginate(leads) {
      const start = (currentPage - 1) * recordsPerPage;
      const end = start + recordsPerPage;
      return leads.slice(start, end);
    }

    document.getElementById('recordsPerPage').addEventListener('change', e => {
      recordsPerPage = parseInt(e.target.value);
      currentPage = 1;
      renderTable();
    });

function renderPaginationControls(totalItems){
  const totalPages = Math.ceil(totalItems / recordsPerPage);
  const wrapper    = document.getElementById('paginationControls');
  wrapper.innerHTML = '';

  if (totalPages <= 1) return;       // no pager needed

  // --- Helper to create a button ---
  const makeBtn = (label, page, cls='pagination-btn') => {
    const b = document.createElement('button');
    b.textContent = label;
    b.className   = cls;
    if (page === currentPage) b.classList.add('active');
    b.addEventListener('click', () => { 
      if (page === null || page === currentPage) return;
      currentPage = page;
      renderTable();
      wrapper.scrollIntoView({block:'nearest', behavior:'smooth'});
    });
    return b;
  };

  // --- Prev button ---
  const prev = makeBtn('«', currentPage - 1, 'pagination-nav');
  if (currentPage === 1) prev.setAttribute('disabled', 'disabled');
  wrapper.appendChild(prev);

  // --- Page number block (compressed) ---
  const maxNumbers = 3;                // how many numeric buttons to show
  let startPage = Math.max(1, currentPage - Math.floor(maxNumbers/2));
  let endPage   = startPage + maxNumbers - 1;
  if (endPage > totalPages){
    endPage   = totalPages;
    startPage = Math.max(1, endPage - maxNumbers + 1);
  }

  // Always show 1 ...
  if (startPage > 1){
    wrapper.appendChild(makeBtn('1', 1));
    if (startPage > 2){
      const ell = document.createElement('span');
      ell.textContent = '…';
      ell.style.padding = '.4rem .2rem';
      wrapper.appendChild(ell);
    }
  }

  // Middle numbers
  for (let p = startPage; p <= endPage; p++){
    wrapper.appendChild(makeBtn(String(p), p));
  }

  // ... last page
  if (endPage < totalPages){
    if (endPage < totalPages - 1){
      const ell = document.createElement('span');
      ell.textContent = '…';
      ell.style.padding = '.4rem .2rem';
      wrapper.appendChild(ell);
    }
    wrapper.appendChild(makeBtn(String(totalPages), totalPages));
  }

  // --- Next button ---
 const next = makeBtn('»', currentPage + 1, 'pagination-nav');
  if (currentPage === totalPages) next.setAttribute('disabled', 'disabled');
  wrapper.appendChild(next);
}


    flatpickr("#followDate", { dateFormat: "d/m/Y" });
    flatpickr("#startDate", { dateFormat: "d/m/Y" });
    flatpickr("#endDate", { dateFormat: "d/m/Y" });

  /* ---------- Staff pass‑code gate ---------- */
  let PASSCODE = '';
  async function fetchPasscode() {
  try {
    const response = await fetch('https://sheetdb.io/api/v1/ignujv9v55stp'); // Replace with your actual SheetDB API
    const data = await response.json();
    if (data && data.length > 0 && data[0].Password) {
      PASSCODE = data[0].Password;
    } else {
      console.error('⚠️ Password not found in the sheet');
    }
  } catch (error) {
    console.error('❌ Error fetching password:', error);
  }
}
const loader = document.getElementById('loader');
const gate = document.getElementById('otpGate');
const mainApp = document.getElementById('mainApp');
mainApp.style.display = 'none';
gate.style.display = 'none';

// ✅ Optimized function
async function initAppOnce() {
  if (localStorage.getItem('verified') === 'yes') {
    loader.style.display = 'none';
    showApp(); // Calls initApp() which calls loadLeads()
  } else {
    await fetchPasscode(); // Only when needed
    loader.style.display = 'none';
    gate.style.display = 'flex';
  }
}
initAppOnce();


otpBtn.addEventListener('click', () => {
  if (otpInput.value.trim() === PASSCODE) {
    localStorage.setItem('verified', 'yes');
    showApp();
  } else {
    otpErr.style.display = 'block';
  }
});

  /* ---------- Main application ---------- */
  function initApp(){
    /* === DOM shortcuts === */
    const qs          = (s,c=document)=>c.querySelector(s);
    const createBtn   = qs('#createBtn');
    const followBtn   = qs('#followBtn');
    const enquiryModal= qs('#enquiryModal');
    const closeModal  = qs('#closeModal');
    const enquiryForm = qs('#enquiryForm');
    const leadBody    = qs('#leadTable tbody');
    const emptyMsg    = qs('#emptyMsg');
    const searchInput = qs('#searchInput');
    const startDate   = qs('#startDate');
    const endDate     = qs('#endDate');
    const viewModal   = qs('#viewModal');
    const closeView   = qs('#closeView');
    const viewBody    = qs('#viewBody');

    /* === Config === */
    const API_URL = 'https://sheetdb.io/api/v1/24ae0wb72a4u6';
    let leads     = [];
    let viewingToday = false;

    /* === Bootstrap === */
    loadLeads();
    createBtn.addEventListener('click',()=>{ enquiryModal.classList.add('active'); });
    closeModal.addEventListener('click',()=>{ enquiryModal.classList.remove('active'); });
    closeView.addEventListener('click',()=>{ viewModal.classList.remove('active'); });
    window.addEventListener('keydown',e=>{ if(e.key==='Escape'){ enquiryModal.classList.remove('active'); viewModal.classList.remove('active'); }});
    [searchInput,startDate,endDate].forEach(el=>el.addEventListener('input',renderTable));
    followBtn.addEventListener('click',()=>{
      viewingToday = !viewingToday;
      followBtn.textContent = viewingToday ? 'Show All' : "Today's Follow‑ups";
      renderTable();
    });

    /* === CRUD helpers === */
async function loadLeads() {
  try {
    const res = await fetch(API_URL);
    let allData = await res.json() || [];
    
    // Filter out entries that don't have a valid 'date' field
    leads = allData.filter(l => l.date && l.date.includes('/'));
    
    renderTable();
  } catch(err) {
    console.error('Load error', err);
  }
}

    async function saveLead(data){
      return fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data})});
    }

    async function updateLead(phone,data){
      return fetch(`${API_URL}/phone/${phone}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({data})});
    }

    /* === Form submit === */
const submitBtn = enquiryForm.querySelector('button[type="submit"]');
const submitMsg = document.getElementById('submitMessage');

enquiryForm.addEventListener('submit', async e => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  submitMsg.style.display = 'none';

  const newLead = {
    date: new Date().toLocaleDateString('en-GB'),
    name: document.getElementById('fullName').value.trim(),
    phone: document.getElementById('mobile').value.trim(),
    email: document.getElementById('email').value.trim(),
    model: document.getElementById('model').value,
    type: document.getElementById('enquiryType').value,
    followup: document.getElementById('followDate').value,
    status: 'new',
    notes: document.getElementById('notes').value.trim()
  };
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({data: newLead})
    });
    enquiryForm.reset();
    document.getElementById('enquiryModal').classList.remove('active');
    submitMsg.style.display = 'block';
    setTimeout(() => { submitMsg.style.display = 'none'; }, 4000);
    loadLeads(); 
  } catch (err) {
    alert('❌ Failed to save enquiry. Please try again.');
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Enquiry';
  }
});

    /* === Render table === */
function td(label,value){return `<td data-label="${label}">${value}</td>`;}
function renderTable() {
  const term = searchInput.value.toLowerCase();
  const s = startDate.value ? new Date(startDate.value) : null;
  const e = endDate.value ? new Date(endDate.value) : null;
  const todayStr = new Date().toLocaleDateString('en-GB');

  const filtered = leads.filter(l => {
    const [d, m, y] = l.date.split('/');
    const lDate = new Date(y, m - 1, d);
    if (viewingToday && l.followup !== todayStr) return false;
    const dateOk = (!s || lDate >= s) && (!e || lDate <= e);
    const termOk = [l.name, l.phone, l.email || '', l.notes || ''].some(x =>
      x.toLowerCase().includes(term)
    );
    return dateOk && termOk;
  });

  const paginated = filtered.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  leadBody.innerHTML = '';

  if (!paginated.length) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  paginated.forEach(lead => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      ${td('Date', lead.date)}
      ${td('Name', lead.name)}
      ${td('Phone', lead.phone)}
      ${td('Email', lead.email || '-')}
      ${td('Model', lead.model)}
      ${td('Enquiry Type', lead.type)}
      ${td('Next Follow-up', lead.followup || '-')}
      ${td('Notes', lead.notes || '-')}
      ${td('Status', `<span class="status ${lead.status}">${lead.status}</span>`)}
      ${td('Actions', `
        <select class="action-select" data-ph="${lead.phone}">
          <option value="">--Action--</option>
          <option value="closed">Closed</option>
          <option value="postponed">Postponed</option>
          <option value="purchased">Purchased elsewhere</option>
        </select><br />
        <input type="date" class="postpone-date" style="display:none" />
        <button class="action-btn view-btn" data-ph="${lead.phone}">View</button>
      `)}
    `;
    leadBody.appendChild(tr);
  });

   renderPaginationControls(filtered.length);
  
}
leadBody.addEventListener('change', async e => {
  const sel = e.target.closest('select.action-select');
  if(sel){
    const action = sel.value;
    const row = sel.closest('tr');
    const dateInput = row.querySelector('.postpone-date');
    const phone = sel.dataset.ph;
    const lead = leads.find(l=>l.phone===phone);
    if(!lead) return;
    if(action==='postponed'){
      dateInput.style.display='inline-block';
      dateInput.value='';
      dateInput.focus();
    }else if(action){
      askNote(`Add note for ${action}`, async note => {
        await updateLead(phone, {status: action, notes: note});
        lead.status = action; lead.notes = note;
        renderTable();
      });
    }
    return;
  }
  const input = e.target.closest('input.postpone-date');
  if(input){
    const iso = input.value;
    if(!iso) return;
    const formatted = new Date(iso).toLocaleDateString('en-GB');
    const row = input.closest('tr');
    const phone = row.querySelector('select.action-select').dataset.ph;
    const lead = leads.find(l=>l.phone===phone);
    askNote('Add note for postponed', async note => {
      await updateLead(phone, {status: 'postponed', followup: formatted, notes: note});
      if(lead){ lead.status='postponed'; lead.followup=formatted; lead.notes=note; }
      renderTable();
    });
  }
});
 window.renderTable = renderTable;
    /* === View button === */
    leadBody.addEventListener('click',e=>{
      const btn=e.target.closest('button.view-btn');
      if(!btn) return;
      const phone=btn.dataset.ph;
      const lead = leads.find(l=>l.phone===phone);
      if(!lead) return;

      viewBody.innerHTML=`
        <dt>Name</dt><dd>${lead.name}</dd>
        <dt>Phone</dt><dd>${lead.phone}</dd>
        <dt>Email</dt><dd>${lead.email||'N/A'}</dd>
        <dt>Vehicle Model</dt><dd>${lead.model}</dd>
        <dt>Enquiry Type</dt><dd>${lead.type}</dd>
        <dt>Next Follow‑up</dt><dd>${lead.followup||'N/A'}</dd>
        <dt>Status</dt><dd><span class="status ${lead.status}">${lead.status}</span></dd>
        <dt>Notes</dt><dd>${lead.notes||'None'}</dd>`;

      viewModal.classList.add('active');
    });
  }

