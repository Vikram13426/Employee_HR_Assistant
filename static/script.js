const uploadBox = document.getElementById('uploadBox');

const pdfInput = document.getElementById('pdfInput');



/* CLICK TO SELECT FILE */

uploadBox.addEventListener('click', () => {

    pdfInput.click();
});



/* FILE SELECTED */

pdfInput.addEventListener('change', () => {

    if (pdfInput.files.length > 0) {

        uploadBox.querySelector('span').innerText =
            pdfInput.files[0].name;
    }
});



/* DRAG OVER */

uploadBox.addEventListener('dragover', (e) => {

    e.preventDefault();

    uploadBox.style.borderColor = '#60a5fa';

    uploadBox.style.background = 'rgba(96,165,250,0.12)';
});



/* DRAG LEAVE */

uploadBox.addEventListener('dragleave', () => {

    uploadBox.style.borderColor = 'rgba(96,165,250,0.5)';

    uploadBox.style.background = 'rgba(255,255,255,0.03)';
});



/* DROP FILE */

uploadBox.addEventListener('drop', (e) => {

    e.preventDefault();

    pdfInput.files = e.dataTransfer.files;

    uploadBox.style.borderColor = 'rgba(96,165,250,0.5)';

    uploadBox.style.background = 'rgba(255,255,255,0.03)';

    if (pdfInput.files.length > 0) {

        uploadBox.querySelector('span').innerText =
            pdfInput.files[0].name;
    }
});



/* UPLOAD PDF */

async function uploadPDF() {

    if (pdfInput.files.length === 0) {

        showToast('Please select a PDF');

        return;
    }

    const formData = new FormData();

    formData.append('pdf', pdfInput.files[0]);

    showToast('Uploading PDF...');

    try {

        const response = await fetch('/upload', {

            method: 'POST',

            body: formData
        });

        const data = await response.json();

        if (data.error) {

            showToast(data.error);

            return;
        }

        showToast(data.message);

    } catch (error) {

        showToast('Upload failed');
    }
}



/* ASK QUESTION */

async function askQuestion() {

    const questionInput = document.getElementById('question');

    const question = questionInput.value.trim();

    if (question === '') {
        return;
    }

    addMessage(question, 'user');

    questionInput.value = '';

    showTypingAnimation();

    try {

        const response = await fetch('/ask', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ question })
        });

        const data = await response.json();

        removeTypingAnimation();

        addMessage(data.answer, 'bot');

    } catch (error) {

        removeTypingAnimation();

        addMessage('Something went wrong', 'bot');
    }
}



/* ADD MESSAGE */

function addMessage(text, sender) {

    const chatBox = document.getElementById('chatBox');

    const messageDiv = document.createElement('div');

    messageDiv.classList.add('message', sender);

    messageDiv.innerHTML = formatMessage(text);

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}



/* TYPING ANIMATION */

function showTypingAnimation() {

    const chatBox = document.getElementById('chatBox');

    const typingDiv = document.createElement('div');

    typingDiv.classList.add('message', 'bot');

    typingDiv.id = 'typingAnimation';

    typingDiv.innerHTML = `
        <div style="display:flex; gap:6px;">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;

    chatBox.appendChild(typingDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}



/* REMOVE TYPING */

function removeTypingAnimation() {

    const typingDiv = document.getElementById('typingAnimation');

    if (typingDiv) {
        typingDiv.remove();
    }
}



/* ENTER KEY */

document.getElementById('question').addEventListener('keypress', function (event) {

    if (event.key === 'Enter') {

        askQuestion();
    }
});



/* TOAST */

function showToast(message) {

    const toast = document.createElement('div');

    toast.className = 'toast';

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {

        toast.classList.remove('show');

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 2500);
}
function formatMessage(text) {

    return text

        // Bold text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

        // Bullet points
        .replace(/^\* (.*$)/gm, '<li>$1</li>')

        // Convert line breaks
        .replace(/\n/g, '<br>');
}