const socket = io();
const terminalOutput = document.getElementById('terminalOutput');
const terminalInput = document.getElementById('terminalInput');
const prompt = document.getElementById('prompt');

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const value = terminalInput.value;
        socket.emit('input', value);
        terminalInput.value = ''; // Clear input
        e.preventDefault();
        terminalOutput.scrollTop = terminalOutput.scrollHeight; // Auto-scroll
    }
});

socket.on('output', (data) => {
    if (shouldClearTerminal(data)) {
        terminalOutput.textContent = '';
    } else {
        terminalOutput.textContent += data;
    }
    terminalOutput.scrollTop = terminalOutput.scrollHeight; // Keep scrolled to bottom
});



function shouldClearTerminal(data) {
    // Check for terminal escape sequences that clear the screen
    return data.includes('\u001b[H\u001b[2J') || data.includes('\u001b[3J');
}
