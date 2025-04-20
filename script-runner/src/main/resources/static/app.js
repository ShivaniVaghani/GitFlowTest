const listEl     = document.getElementById("script-list");
const modalEl    = document.getElementById("paramModal");
const modal      = new bootstrap.Modal(modalEl);
const bodyEl     = document.getElementById("modal-body");
const labelEl    = document.getElementById("paramModalLabel");
let currentName;

// Load scripts on start
async function load() {
  const res = await fetch("/scripts");
  const configs = await res.json();
  configs.forEach(cfg => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = cfg.description;
    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-primary";
    btn.textContent = "Run";
    btn.onclick = () => open(cfg);
    li.appendChild(btn);
    listEl.appendChild(li);
  });
}

// Open modal and build form
function open(cfg) {
  currentName = cfg.name;
  labelEl.textContent = `Run ${cfg.name}`;
  bodyEl.innerHTML = "";
  cfg.params.forEach(p => {
    const wr = document.createElement("div"); wr.className="mb-3";
    const lb = document.createElement("label"); lb.textContent=p.description; lb.className="form-label";
    const inp = document.createElement("input"); inp.className="form-control";
    inp.name = p.name; inp.value = p.defaultValue || "";
    if(p.required) inp.required = true;
    wr.append(lb, inp);
    bodyEl.appendChild(wr);
  });
  modal.show();
}

// Handle submit
document.getElementById("paramForm").addEventListener("submit", async e => {
  e.preventDefault();
  const data = {};
  new FormData(e.target).forEach((v,k)=>data[k]=v);
  const res = await fetch(`/scripts/${currentName}/run`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });
  if(!res.ok) {
    alert("Error: " + await res.text());
    return;
  }
  const {link} = await res.json();
  // Trigger file download
  const a = document.createElement("a");
  a.href = link;
  a.download = "";
  document.body.appendChild(a);
  a.click();
  a.remove();
  modal.hide();
});

window.addEventListener("DOMContentLoaded", load);
