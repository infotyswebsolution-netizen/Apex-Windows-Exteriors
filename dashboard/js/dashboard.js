
document.addEventListener('DOMContentLoaded', () => {
  renderQuotes();
  updateStats();
});

let quoteData = JSON.parse(localStorage.getItem('apex_quotes')) || [];

function saveQuote() {
  const name = document.getElementById('client-name').value;
  const contact = document.getElementById('client-contact').value;
  const service = document.getElementById('service-type').value;
  const value = document.getElementById('quote-value').value;

  if (!name || !contact || !service || !value) {
    alert('Missing fields required for quote logging.');
    return;
  }

  const newQuote = {
    id: Date.now(),
    date: new Date().toLocaleDateString('en-CA'),
    name: name,
    contact: contact,
    service: service,
    value: parseFloat(value),
    status: 'Pending'
  };

  quoteData.unshift(newQuote);
  localStorage.setItem('apex_quotes', JSON.stringify(quoteData));

  // Reset Form
  document.getElementById('client-name').value = '';
  document.getElementById('client-contact').value = '';
  document.getElementById('service-type').value = '';
  document.getElementById('quote-value').value = '';

  renderQuotes();
  updateStats();
}

function updateStats() {
  const totalEl = document.getElementById('total-quotes-stat');
  if (!totalEl) return;
  
  totalEl.innerText = quoteData.length;
  
  // Calculate Pipeline Value (Status: Pending)
  const pipeValue = quoteData
    .filter(q => q.status === 'Pending')
    .reduce((sum, q) => sum + q.value, 0);
  
  // Calculate Win Rate (Won / (Won + Lost))
  const wonCount = quoteData.filter(q => q.status === 'Won').length;
  const lostCount = quoteData.filter(q => q.status === 'Lost').length;
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
    renderQuotes();
    updateStats();
  }
}

function deleteQuote(id) {
  if (!confirm('Are you sure you want to delete this record?')) return;
  quoteData = quoteData.filter(q => q.id !== id);
  localStorage.setItem('apex_quotes', JSON.stringify(quoteData));
  renderQuotes();
  updateStats();
}

function exportToCSV() {
    if (quoteData.length === 0) {
        alert('No data to export');
        return;
    }
    const headers = ['Date', 'Client', 'Contact', 'Service', 'Value', 'Status'];
    const rows = quoteData.map(q => [q.date, q.name, q.contact, q.service, q.value, q.status]);
    
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

function renderQuotes() {
  const container = document.getElementById('quote-table-body');
  const emptyState = document.getElementById('empty-state');
  
  if (!container) return;
  
  if (quoteData.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  container.innerHTML = quoteData.map(q => `
    <tr>
      <td style="font-size:0.8rem; color:#64748b;">${q.date}</td>
      <td><strong>${q.name}</strong><div style="font-size:0.75rem; color:#94a3b8;">${q.contact}</div></td>
      <td style="font-size:0.9rem;">${q.service}</td>
      <td style="font-weight:600;">$${q.value.toLocaleString()}</td>
      <td><span class="tag tag-${q.status.toLowerCase()}">${q.status.toUpperCase()}</span></td>
      <td>
        <div style="display:flex; gap:5px;">
           ${q.status === 'Pending' ? `
            <button onclick="updateStatus(${q.id}, 'Won')" style="background:#dcfce7; color:#166534; border:none; padding:5px; border-radius:4px; font-size:0.65rem; cursor:pointer; font-weight:700;">WON</button>
            <button onclick="updateStatus(${q.id}, 'Lost')" style="background:#fee2e2; color:#ef4444; border:none; padding:5px; border-radius:4px; font-size:0.65rem; cursor:pointer; font-weight:700;">LOST</button>
          ` : `<button onclick="updateStatus(${q.id}, 'Pending')" style="background:#f1f5f9; color:#64748b; border:none; padding:5px; border-radius:4px; font-size:0.65rem; cursor:pointer;">REOPEN</button>`}
          <button onclick="deleteQuote(${q.id})" style="background:transparent; border:none; color:#94a3b8; font-size:0.65rem; cursor:pointer; margin-left:10px;">X</button>
        </div>
      </td>
    </tr>
  `).join('');
}
