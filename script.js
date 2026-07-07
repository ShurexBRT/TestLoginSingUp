(function () {
    const storageKey = "autofillTestAccount";

    function getAccount() {
        try {
            return JSON.parse(localStorage.getItem(storageKey));
        } catch (error) {
            return null;
        }
    }

    function saveAccount(account) {
        localStorage.setItem(storageKey, JSON.stringify(account));
        renderAccountState();
    }

    function clearAccount() {
        localStorage.removeItem(storageKey);
        renderAccountState();
        showMessage("Saved test account cleared.", "warning");
    }

    function renderAccountState() {
        const account = getAccount();
        const summaries = document.querySelectorAll("[data-account-summary]");
        const details = document.querySelectorAll("[data-account-detail]");

        summaries.forEach((summary) => {
            summary.textContent = account ? account.email : "No test account saved";
        });

        details.forEach((detail) => {
            detail.textContent = account
                ? `${account.name} is saved locally for autofill checks.`
                : "No local test account exists yet. Create one on the sign up page.";
        });
    }

    function showMessage(text, type) {
        const panel = document.querySelector("[data-form-message]");
        if (!panel) {
            return;
        }

        panel.textContent = text;
        panel.className = `message-panel ${type || ""}`.trim();
    }

    function showDownloadMessage(text, type) {
        const panel = document.querySelector("[data-download-message]");
        if (!panel) {
            return;
        }

        panel.textContent = text;
        panel.className = `message-panel ${type || ""}`.trim();
    }

    function isStrongEnough(password) {
        return password.length >= 8;
    }

    function handleSignup(event) {
        event.preventDefault();

        const form = event.currentTarget;
        const name = form.elements.name.value.trim();
        const email = form.elements.email.value.trim();
        const password = form.elements.password.value;
        const confirmPassword = form.elements.confirmPassword.value;

        if (!name || !email || !password || !confirmPassword) {
            showMessage("Fill every field before saving the test account.", "warning");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }

        if (!isStrongEnough(password)) {
            showMessage("Password must be at least 8 characters long.", "error");
            return;
        }

        saveAccount({ name, email, password });
        showMessage("Test account saved locally.", "success");
        form.reset();
    }

    function handleLogin(event) {
        event.preventDefault();

        const account = getAccount();
        const form = event.currentTarget;
        const email = form.elements.email.value.trim();
        const password = form.elements.password.value;

        if (!account) {
            showMessage("No saved test account exists yet.", "warning");
            return;
        }

        if (email === account.email && password === account.password) {
            showMessage("Login simulation successful.", "success");
            form.reset();
            return;
        }

        showMessage("Login simulation failed. Email or password does not match the saved account.", "error");
    }

    function handlePasswordReset(event) {
        event.preventDefault();

        const account = getAccount();
        const form = event.currentTarget;
        const email = form.elements.email.value.trim();
        const oldPassword = form.elements.oldPassword.value;
        const newPassword = form.elements.newPassword.value;
        const confirmPassword = form.elements.confirmPassword.value;

        if (!account) {
            showMessage("No saved test account exists yet.", "warning");
            return;
        }

        if (email !== account.email || oldPassword !== account.password) {
            showMessage("Current credentials do not match the saved test account.", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage("New passwords do not match.", "error");
            return;
        }

        if (!isStrongEnough(newPassword)) {
            showMessage("New password must be at least 8 characters long.", "error");
            return;
        }

        saveAccount({ ...account, password: newPassword });
        showMessage("Test account password updated locally.", "success");
        form.reset();
    }

    async function handleBlobDownload(event) {
        const button = event.currentTarget;
        const url = button.dataset.blobDownload;
        const downloadName = button.dataset.downloadName || "blob-test.pdf";

        try {
            showDownloadMessage("Creating Blob URL for PDF download...", "warning");
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = downloadName;
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.setTimeout(function () {
                URL.revokeObjectURL(objectUrl);
            }, 1000);

            showDownloadMessage(`Blob PDF download triggered (${Math.round(blob.size / 1024)} KB).`, "success");
        } catch (error) {
            showDownloadMessage(`Blob PDF download failed: ${error.message}`, "error");
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        renderAccountState();

        document.querySelectorAll("[data-clear-account]").forEach((button) => {
            button.addEventListener("click", clearAccount);
        });

        const signupForm = document.getElementById("signupForm");
        const loginForm = document.getElementById("loginForm");
        const passwordResetForm = document.getElementById("passwordResetForm");

        if (signupForm) {
            signupForm.addEventListener("submit", handleSignup);
        }

        if (loginForm) {
            loginForm.addEventListener("submit", handleLogin);
        }

        if (passwordResetForm) {
            passwordResetForm.addEventListener("submit", handlePasswordReset);
        }

        document.querySelectorAll("[data-blob-download]").forEach((button) => {
            button.addEventListener("click", handleBlobDownload);
        });
    });
})();
