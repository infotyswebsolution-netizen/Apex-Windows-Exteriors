
document.addEventListener('DOMContentLoaded', () => {
  renderQuotes();
  updateStats();
});

let quoteData = JSON.parse(localStorage.getItem('apex_quotes')) || [];

function saveQuote() {
  const name = document.getElementById('client-name').value;
  const contact = document.getElementById('client-contact').value;
  const service = document.getElementById('service-type').value;
  const source = document.getElementById('lead-source').value;
  const value = document.getElementById('quote-value').value;
  const followUp = document.getElementById('follow-up-date').value;

  if (!name || !contact || !service || !value) {
    alert('Name, Contact, Service, and Value are required.');
    return;
  }

  const newQuote = {
    id: Date.now(),
    date: new Date().toLocaleDateString('en-CA'),
    name: name,
    contact: contact,
    service: service,
    source: source,
    value: parseFloat(value),
    status: 'Pending',
    followUp: followUp,
    archived: false
  };

  quoteData.unshift(newQuote);
  localStorage.setItem('apex_quotes', JSON.stringify(quoteData));

  // Reset Form
  ['client-name', 'client-contact', 'service-type', 'lead-source', 'quote-value', 'follow-up-date'].forEach(id => {
      document.getElementById(id).value = id.includes('source') ? 'Other' : (id.includes('service') ? '' : '');
  });

  applyFilters();
}

function updateStats() {
  const totalEl = document.getElementById('total-quotes-stat');
  if (!totalEl) return;
  
  // Stats ONLY reflect ACTIVE (non-archived) quotes
  const activeQuotes = quoteData.filter(q => !q.archived);
  totalEl.innerText = activeQuotes.length;
  
  const pipeValue = activeQuotes
    .filter(q => q.status === 'Pending')
    .reduce((sum, q) => sum + q.value, 0);
  
  const wonCount = activeQuotes.filter(q => q.status === 'Won').length;
  const lostCount = activeQuotes.filter(q => q.status === 'Lost').length;
  const totalClosed = wonCount + lostCount;
  const winRate = totalClosed > 0 ? ((wonCount / totalClosed) * 100).toFixed(0) : 0;

  const statValues = document.querySelectorAll('.stat-val');
  if (statValues[2]) statValues[2].innerText = winRate + '%';
  
  if (statValues[1]) {
    statValues[1].innerText = '$' + pipeValue.toLocaleString();
    statValues[1].parentElement.querySelector('.stat-label').innerText = 'Pipeline Value ($)';
  }
}

function updateStatus(id, newStatus) {
  const idx = quoteData.findIndex(q => q.id === id);
  if (idx !== -1) {
    quoteData[idx].status = newStatus;
    localStorage.setItem('apex_quotes', JSON.stringify(quoteData));
    applyFilters();
  }
}

function exportToCSV() {
    if (quoteData.length === 0) {
        alert('No data to export');
        return;
    }
    const headers = ['Date', 'Source', 'Client', 'Contact', 'Service', 'Value', 'Status', 'FollowUp'];
    const rows = quoteData.map(q => [q.date, q.source || 'Other', q.name, q.contact, q.service, q.value, q.status, q.followUp || 'None']);
    
    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apex_quotes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function toggleArchive(id) {
  const idx = quoteData.findIndex(q => q.id === id);
  if (idx !== -1) {
    quoteData[idx].archived = !quoteData[idx].archived;
    localStorage.setItem('apex_quotes', JSON.stringify(quoteData));
    applyFilters();
  }
}

function applyFilters() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const serviceFilter = document.getElementById('filter-service').value;
  const statusFilter = document.getElementById('filter-status').value;
  const urgencyFilter = document.getElementById('filter-urgency').value;
  const archiveFilter = document.getElementById('filter-archived').value;
  const today = new Date().toISOString().split('T')[0];

  const filtered = quoteData.filter(q => {
    // Backward compatibility: default archive to false
    const isArchived = q.archived === true;
    if (archiveFilter === 'active' && isArchived) return false;
    if (archiveFilter === 'archived' && !isArchived) return false;

    const matchesSearch = q.name.toLowerCase().includes(searchTerm) || q.contact.toLowerCase().includes(searchTerm);
    const matchesService = serviceFilter === 'all' || q.service === serviceFilter;
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || (
      urgencyFilter === 'today' ? q.followUp === today : (urgencyFilter === 'overdue' ? q.followUp < today : true)
    );
    
    return matchesSearch && matchesService && matchesStatus && matchesUrgency;
  });

  const countDisplay = document.getElementById('result-count');
  if (countDisplay) {
    countDisplay.innerText = `Showing ${filtered.length} of ${quoteData.length} records`;
  }

  renderQuotes(filtered);
  updateStats();
}

function renderQuotes(dataToRender = null) {
  const container = document.getElementById('quote-table-body');
  const emptyState = document.getElementById('empty-state');
  if (!container) return;
  
  const activeData = dataToRender || quoteData.filter(q => !q.archived);
  
  if (activeData.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    emptyState.innerText = dataToRender ? 'No matching results.' : 'No active quotes.';
    return;
  }

  emptyState.style.display = 'none';
  const today = new Date().toISOString().split('T')[0];

  container.innerHTML = activeData.map(q => {
    let followUpBadge = '';
    if (q.followUp && q.status === 'Pending' && !q.archived) {
        if (q.followUp === today) followUpBadge = '<div style="color:#d97706; font-weight:700; font-size:0.7rem;">⚠️ DUE TODAY</div>';
        else if (q.followUp < today) followUpBadge = '<div style="color:#ef4444; font-weight:700; font-size:0.7rem;">🚨 OVERDUE</div>';
    }

    return `
    <tr style="${q.archived ? 'opacity:0.6; background:#f8fafc;' : ''}">
      <td style="font-size:0.8rem; color:#64748b;">
        ${q.date}<br>
        <span style="color:var(--primary); font-weight:600; font-size:0.65rem;">${q.source || 'Direct'}</span>
      </td>
      <td><strong>${q.name}</strong><div style="font-size:0.75rem; color:#94a3b8;">${q.contact}</div></td>
      <td style="font-size:0.9rem;">${q.service}</td>
      <td style="font-weight:600;">$${q.value.toLocaleString()}</td>
      <td>
        <span style="font-size:0.8rem; color:#475569;">${q.followUp || '--'}</span>
        ${followUpBadge}
      </td>
      <td><span class="tag tag-${q.status.toLowerCase()}">${q.status.toUpperCase()}</span></td>
      <td>
        <div style="display:flex; gap:5px;">
           ${q.status === 'Pending' && !q.archived ? `
            <button onclick="updateStatus(${q.id}, 'Won')" style="background:#dcfce7; color:#166534; border:none; padding:5px; border-radius:4px; font-size:0.65rem; cursor:pointer; font-weight:700;">WON</button>
            <button onclick="updateStatus(${q.id}, 'Lost')" style="background:#fee2e2; color:#ef4444; border:none; padding:5px; border-radius:4px; font-size:0.65rem; cursor:pointer; font-weight:700;">LOST</button>
          ` : (q.archived ? '' : `<button onclick="updateStatus(${q.id}, 'Pending')" style="background:#f1f5f9; color:#64748b; border:none; padding:5px; border-radius:4px; font-size:0.65rem; cursor:pointer;">REOPEN</button>`)}
          
          <button onclick="toggleArchive(${q.id})" style="background:${q.archived ? '#e2e8f0' : 'transparent'}; border:none; color:${q.archived ? '#475569' : '#94a3b8'}; font-size:0.65rem; cursor:pointer; margin-left:10px; padding:4px 8px; border-radius:4px; font-weight:600;">
            ${q.archived ? 'RESTORE' : 'ARCHIVE'}
          </button>
        </div>
      </td>
    </tr>
    `;
  }).join('');
}
