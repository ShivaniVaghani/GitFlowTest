// public/runner/js/app.js

const listEl  = document.getElementById("script-list");
const modalEl = document.getElementById("paramModal");
const modal   = new bootstrap.Modal(modalEl);
const bodyEl  = document.getElementById("modal-body");
const labelEl = document.getElementById("paramModalLabel");
let currentName;

// fetch and list scripts
async function load() {
  try {
    const res = await fetch("/scripts");
    if (!res.ok) throw new Error(await res.text());
    const configs = await res.json();
    configs.forEach(cfg => {
      cfg.params = cfg.params || cfg.parameters || [];
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
  } catch (err) {
    listEl.innerHTML = `<li class="list-group-item text-danger">Error: ${err.message}</li>`;
  }
}

// build and show modal
function open(cfg) {
  currentName = cfg.name;
  labelEl.textContent = `Run ${cfg.name}`;
  bodyEl.innerHTML = "";

  cfg.params.forEach(p => {
    const wr = document.createElement("div"); wr.className = "mb-3";
    const lb = document.createElement("label");
    lb.textContent = p.description;
    lb.className = "form-label";

    const inp = document.createElement("input");
    inp.className = "form-control";
    inp.name = p.name;
    inp.value = p.defaultValue || "";
    if (p.required) inp.required = true;

    wr.append(lb, inp);
    bodyEl.appendChild(wr);
  });

  modal.show();
}

// handle form submit
document.getElementById("paramForm").addEventListener("submit", async e => {
  e.preventDefault();
  const data = {};
  new FormData(e.target).forEach((v,k)=> data[k]=v);

  try {
    const res = await fetch(`/scripts/${currentName}/run`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    const { link } = await res.json();

    // trigger download
    const a = document.createElement("a");
    a.href = link;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
    modal.hide();
  } catch (err) {
    alert("Error: " + err.message);
  }
});

window.addEventListener("DOMContentLoaded", load);


