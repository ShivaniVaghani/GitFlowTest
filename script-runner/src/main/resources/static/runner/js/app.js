class Param {
    constructor() {
        this.name = ko.observable('');
        this.description = ko.observable('');
        this.defaultValue = ko.observable('');
        this.required = ko.observable(false);
    }
}

function ViewModel() {
    const self = this;
    self.scripts = ko.observableArray([]);
    self.selected = ko.observable();

    self.newScript = {
        name: ko.observable(''),
        description: ko.observable(''),
        version: ko.observable(1),
        active: ko.observable(true),
        file: null,
        parameters: ko.observableArray([])
    };

    self.isRunning = ko.observable(false);
    self.isSaving = ko.observable(false);

    self.addParam = () => self.newScript.parameters.push(new Param());
    self.removeParam = param => self.newScript.parameters.remove(param);
    self.fileChanged = (d, e) => self.newScript.file = e.target.files[0];

    self.load = async () => {
        try {
            const res = await fetch('/scripts');
            if (!res.ok) throw new Error(await res.text());
            self.scripts(await res.json());
        } catch (err) {
            self.showError('Failed to load scripts: ' + err.message);
        }
    };

    self.openRunModal = s => {
        self.selected(s);
        self.isRunning(false);
        new bootstrap.Modal(document.getElementById('runModal')).show();
    };

    self.executeScript = async (data, event) => {
        event?.preventDefault();
        self.isRunning(true);

        const form = document.querySelector('#runModal form');
        const script = self.selected();
        const payload = Object.fromEntries(new FormData(form).entries());

        try {
            const res = await fetch(`/scripts/${script.name}/run`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (!res.ok) {
                const message = result?.error || "Unknown error occurred while executing script.";
                self.showError(message);
                return;
            }

            if (result?.link) {
                window.location = result.link;
                bootstrap.Modal.getInstance(document.getElementById('runModal')).hide();
            } else {
                self.showError("Unexpected response from server. Please try again.");
            }

        } catch (err) {
            self.showError("Client-side error occurred: " + err.message);
        } finally {
            self.isRunning(false);
        }
    };

    self.deleteScript = s => {
        self.selected(s);
        new bootstrap.Modal(document.getElementById('confirmDeleteModal')).show();
    };

    self.confirmDeleteScript = async () => {
        const s = self.selected();
        try {
            const res = await fetch(`/scripts/${s.id}`, {method: 'DELETE'});
            if (!res.ok) throw new Error(await res.text());
            self.scripts.remove(s);
            bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal')).hide();
        } catch (err) {
            self.showError(`Failed to delete: ${err.message}`);

        }
    };

    self.addScript = async (data, event) => {
        event?.preventDefault();
        self.isSaving(true);
        const form = document.getElementById('addForm');

        const meta = {
            name: self.newScript.name(),
            description: self.newScript.description(),
            version: +self.newScript.version(),
            active: self.newScript.active(),
            parameters: self.newScript.parameters().map(p => ({
                name: p.name(),
                description: p.description(),
                defaultValue: p.defaultValue(),
                required: p.required()
            }))
        };

        const fd = new FormData();
        fd.append('metadata', new Blob([JSON.stringify(meta)], {type: 'application/json'}));
        fd.append('file', self.newScript.file);

        try {
            const res = await fetch('/scripts', {method: 'POST', body: fd});
            if (!res.ok) throw new Error(await res.text());
            self.load();
            bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
            form.reset();
            self.newScript.parameters([]);
        } catch (err) {
            self.showError(err.message);
        } finally {
            self.isSaving(false);
        }
    };

    self.editingScript = {
        id: ko.observable(),
        name: ko.observable(''),
        description: ko.observable(''),
        version: ko.observable(1),
        active: ko.observable(true),
        parameters: ko.observableArray([])
    };

    self.openEditModal = (script) => {
        self.editingScript.id(script.id);
        self.editingScript.name(script.name);
        self.editingScript.description(script.description);
        self.editingScript.version(script.version);
        self.editingScript.active(script.active);
        self.editingScript.parameters(script.parameters.map(p => {
            const param = new Param();
            param.name(p.name);
            param.description(p.description);
            param.defaultValue(p.defaultValue);
            param.required(p.required);
            return param;
        }));

        new bootstrap.Modal(document.getElementById('editModal')).show();
    };

    self.addEditParam = () => self.editingScript.parameters.push(new Param());
    self.removeEditParam = param => self.editingScript.parameters.remove(param);

    self.updateScript = async (data, event) => {
        event?.preventDefault();
        self.isSaving(true);

        const payload = {
            name: self.editingScript.name(),
            description: self.editingScript.description(),
            version: +self.editingScript.version(),
            active: self.editingScript.active(),
            parameters: self.editingScript.parameters().map(p => ({
                name: p.name(),
                description: p.description(),
                defaultValue: p.defaultValue(),
                required: p.required()
            }))
        };

        try {
            const res = await fetch(`/scripts/${self.editingScript.id()}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error(await res.text());

            self.load(); // reload updated list
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        } catch (err) {
            self.showError(err.message);
        } finally {
            self.isSaving(false);
        }
    };

    self.showError = function (error) {
        const toastEl = document.getElementById('errorToast');
        const toastBody = document.getElementById('errorToastBody');
        toastBody.textContent = error.message || error || "An unknown error occurred";
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    };

    self.load();
}

const vm = new ViewModel();
ko.applyBindings({vm});