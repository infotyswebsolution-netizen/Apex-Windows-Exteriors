
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

function deleteQuote(id) {
  if (!confirm('Are you sure you want to delete this record?')) return;
  quoteData = quoteData.filter(q => q.id !== id);
  localStorage.setItem('apex_quotes', JSON.stringify(quoteData));
  renderQuotes();
  updateStats();
}

function updateStats() {
  const totalEl = document.getElementById('total-quotes-stat');
  const count = quoteData.length;
  if (totalEl) totalEl.innerText = count;
  
  // Update win rate placeholder (mock logic for MVP)
  const winRateEl = document.querySelectorAll('.stat-val')[2];
  if(winRateEl && count > 0) winRateEl.innerText = '32%'; 
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
      <td><span class="tag tag-pending">${q.status}</span></td>
      <td>
        <button onclick="deleteQuote(${q.id})" style="background:white; border:1px solid #fee2e2; color:#ef4444; padding:5px 8px; border-radius:4px; font-size:0.7rem; cursor:pointer;">REMOVE</button>
      </td>
    </tr>
  `).join('');
}
