// /mnt/data/script.js

document.getElementById('passwordResetForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (newPassword.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }

    alert('Password reset successful for: ' + email);
    // Simulate form submission
    this.reset();
});
