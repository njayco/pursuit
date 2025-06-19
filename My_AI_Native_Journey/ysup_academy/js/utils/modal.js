// Modal utility functions
export function showModal(message, confirmText = "OK", showCancel = false, onConfirm = () => {}, onCancel = () => {}) {
    const confirmModal = document.getElementById('confirmModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalConfirmButton = document.getElementById('modalConfirmButton');
    const modalCancelButton = document.getElementById('modalCancelButton');
    
    modalMessage.innerHTML = message; // Use innerHTML for potential formatting
    modalConfirmButton.textContent = confirmText;
    modalConfirmButton.onclick = () => {
        confirmModal.style.display = 'none';
        onConfirm();
    };
    
    if (showCancel) {
        modalCancelButton.style.display = 'inline-block';
        modalCancelButton.onclick = () => {
            confirmModal.style.display = 'none';
            onCancel();
        };
    } else {
        modalCancelButton.style.display = 'none';
    }
    
    confirmModal.style.display = 'flex';
}

export function initializeModal() {
    const confirmModal = document.getElementById('confirmModal');
    const closeModalButton = document.getElementById('closeModalButton');
    
    // Close modal button
    closeModalButton.onclick = () => {
        confirmModal.style.display = 'none';
    };
    
    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target == confirmModal) {
            confirmModal.style.display = 'none';
        }
    };
} 