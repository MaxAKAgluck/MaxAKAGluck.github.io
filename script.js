// ========================================
// Global Language Variable 
// ========================================
let currentLang = 'en'; // Default language

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking a link
const links = document.querySelectorAll('.nav-links li a');
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if(icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 70; 
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

/* =========================================
   TRIVIA GAME LOGIC
   ========================================= */
const questions = [
    {
        question: "What does SQL stand for?",
        options: ["Structured Query Language", "Strong Question Language", "Structured Quick Log", "Simple Query List"],
        correct: 0
    },
    {
        question: "Which port is commonly used for SSH?",
        options: ["Port 80", "Port 23", "Port 22", "Port 443"],
        correct: 2
    },
    {
        question: "What is the CIA triad in information security?",
        options: ["Confidentiality, Integrity, Availability", "Control, Intelligence, Access", "Cyber, Internet, Auth", "Code, Input, Audit"],
        correct: 0
    },
    {
        question: "What command is used to list files in Linux?",
        options: ["cd", "ls", "mkdir", "pwd"],
        correct: 1
    },
    {
        question: "What is 'Phishing'?",
        options: ["Fishing for data in a lake", "A type of malware", "A fraudulent attempt to obtain sensitive info", "Testing network speed"],
        correct: 2
    },
    {
        question: "What does XSS stand for?",
        options: ["Cross-Site Scripting", "Extreme Secure Sockets", "XML System Security", "Xylophone Sound System"],
        correct: 0
    },
    {
        question: "Which flag is used to output verbose Nmap scans?",
        options: ["-sS", "-v", "-O", "-p"],
        correct: 1
    },
    {
        question: "What is a 'Zero-Day' vulnerability?",
        options: ["A bug that occurs at midnight", "A vulnerability unknown to the vendor", "A virus that deletes data in 0 days", "A patch released on Sunday"],
        correct: 1
    },
    {
        question: "Which protocol is connection-oriented?",
        options: ["UDP", "ICMP", "TCP", "IP"],
        correct: 2
    },
    {
        question: "What is the first phase of Ethical Hacking?",
        options: ["Scanning", "Reconnaissance", "Exploitation", "Reporting"],
        correct: 1
    },
    {
        question: "In Splunk, which command is used to filter search results?",
        options: ["search", "where", "filter", "select"],
        correct: 1
    },
    {
        question: "What Windows Event ID indicates a successful logon?",
        options: ["4624", "4625", "4720", "5140"],
        correct: 0
    },
    {
        question: "Which tool monitors Windows system activity at kernel level?",
        options: ["Process Monitor", "Sysmon", "Task Manager", "Event Viewer"],
        correct: 1
    },
    {
        question: "What is a 'SIEM' system primarily used for?",
        options: ["Software development", "Security Information and Event Management", "Social media integration", "Server maintenance"],
        correct: 1
    },
    {
        question: "In Incident Response, what does 'IOC' stand for?",
        options: ["Input Output Control", "Indicator of Compromise", "Internal Operations Center", "Internet Object Code"],
        correct: 1
    },
    {
        question: "Which PowerShell command retrieves Windows event logs?",
        options: ["Get-EventLog", "Read-Event", "Show-Log", "View-Events"],
        correct: 0
    },
    {
        question: "What is the purpose of network segmentation in security?",
        options: ["Speed up internet", "Limit lateral movement", "Reduce costs", "Increase bandwidth"],
        correct: 1
    },
    {
        question: "Which MITRE ATT&CK tactic involves establishing persistence?",
        options: ["Initial Access", "Execution", "Persistence", "Discovery"],
        correct: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');
const questionCounter = document.getElementById('question-counter');

// Helper to safely escape HTML (XSS Prevention)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function loadQuestion() {
    if (!questions[currentQuestionIndex]) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    
    // Use language-aware counter
    const prefix = currentLang === 'de' ? 'Frage' : 'Question';
    questionCounter.textContent = `${prefix} ${currentQuestionIndex + 1}/${questions.length}`;
    
    optionsContainer.innerHTML = '';
    feedback.textContent = '';
    feedback.className = 'trivia-feedback';
    nextBtn.style.display = 'none';

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('trivia-btn');
        button.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    const correctIndex = questions[currentQuestionIndex].correct;
    const buttons = optionsContainer.querySelectorAll('.trivia-btn');

    buttons.forEach(btn => btn.disabled = true);

    if (selectedIndex === correctIndex) {
        score++;
        const scorePrefix = currentLang === 'de' ? 'Punkte' : 'Score';
        scoreDisplay.textContent = `${scorePrefix}: ${score}`;
        feedback.textContent = currentLang === 'de' ? "Richtig! 🎉" : "Correct! 🎉";
        feedback.classList.add('text-success');
        buttons[selectedIndex].classList.add('correct');
    } else {
        feedback.textContent = currentLang === 'de' ? "Falsche Antwort! ❌" : "Wrong Answer! ❌";
        feedback.classList.add('text-danger');
        buttons[selectedIndex].classList.add('incorrect');
        buttons[correctIndex].classList.add('correct');
    }

    nextBtn.style.display = 'inline-block';
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    });
}

function showResults() {
    questionText.textContent = currentLang === 'de' ? "Quiz abgeschlossen!" : "Quiz Completed!";
    optionsContainer.innerHTML = '';
    
    const resultDiv = document.createElement('div');
    resultDiv.style.gridColumn = "span 2";
    resultDiv.style.textAlign = "center";
    
    const scoreHeading = document.createElement('h3');
    const scoreLabel = currentLang === 'de' ? 'Dein Ergebnis' : 'Your Score';
    scoreHeading.textContent = `${scoreLabel}: ${score} / ${questions.length}`;
    
    const messageP = document.createElement('p');
    if (currentLang === 'de') {
        messageP.textContent = score > (questions.length / 2) ? "Fantastisch! Du bist ein Profi!" : "Gute Leistung! Weiter lernen.";
    } else {
        messageP.textContent = score > (questions.length / 2) ? "Amazing! You're a pro!" : "Good effort! Keep learning.";
    }
    
    const replayBtn = document.createElement('button');
    replayBtn.textContent = currentLang === 'de' ? "Nochmal spielen" : "Play Again";
    replayBtn.className = "btn btn-primary";
    replayBtn.style.marginTop = "20px";
    replayBtn.onclick = restartGame;

    resultDiv.appendChild(scoreHeading);
    resultDiv.appendChild(messageP);
    resultDiv.appendChild(replayBtn);
    
    optionsContainer.appendChild(resultDiv);
    
    nextBtn.style.display = 'none';
    feedback.textContent = '';
    questionCounter.textContent = '';
}

window.restartGame = function() {
    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.textContent = `Score: 0`;
    loadQuestion();
}

// Initialize Trivia if elements exist
if (document.getElementById('trivia-card')) {
    loadQuestion();
}

/* =========================================
   CONTACT FORM HANDLING (No Backend)
   ========================================= */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
        alert(`Thanks ${name}! Your message would be sent here (Backend required).`);
        contactForm.reset();
    });
}

/* =========================================
   CLI TERMINAL LOGIC
   ========================================= */
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const terminalBody = document.getElementById('terminal-body');

// Resource Links Database (for random selection)
const resourceLinks = [
    { name: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", desc: "Web Vulnerabilities" },
    { name: "OWASP Cheat Sheet Series", url: "https://cheatsheetseries.owasp.org/", desc: "Security Best Practices" },
    { name: "Splunk Security Cheat Sheets", url: "https://www.stationx.net/splunk-cheat-sheet/", desc: "Useful Splunk commands cheatsheet" },
    { name: "CyberChef", url: "https://gchq.github.io/CyberChef/", desc: "Cyber Swiss Army Knife" },
    { name: "HackTricks", url: "https://book.hacktricks.xyz/", desc: "Pentesting Wiki" },
    { name: "GTFOBins", url: "https://gtfobins.github.io/", desc: "Unix Binaries Exploitation" },
    { name: "Metasploit Unleashed", url: "https://www.offsec.com/metasploit-unleashed/", desc: "In-depth Metasploit guide" },
    { name: "MITRE ATT&CK", url: "https://attack.mitre.org/", desc: "Adversary Tactics & Techniques" }
];

const commands = {
    help: {
        desc: "Show available commands",
        action: () => {
            return `Available commands:
  <span style="color: #00aaff;">help</span>        - Show this menu
  <span style="color: #00aaff;">theme dark</span>  - Enable dark mode (Hacker style)
  <span style="color: #00aaff;">theme light</span> - Enable light mode
  <span style="color: #00aaff;">whoami</span>      - Print current user info
  <span style="color: #00aaff;">ascii</span>       - Show random ASCII art
  <span style="color: #00aaff;">links</span>       - Get a random CyberSec resource
  <span style="color: #00aaff;">poweroff</span>    - Shutdown the system
  <span style="color: #00aaff;">clear</span>       - Clear terminal screen`;
        }
    },
    theme: {
        desc: "Change website theme (dark/light)",
        action: (args) => {
            const mode = args[0];
            if (mode === 'dark') {
                document.body.classList.add('dark-theme');
                return "Dark mode enabled. Welcome to the matrix.";
            } else if (mode === 'light') {
                document.body.classList.remove('dark-theme');
                return "Light mode enabled.";
            } else {
                return "Usage: theme [dark|light]";
            }
        }
    },
    whoami: {
        desc: "Display user",
        action: () => {
            return "guest@portfolio\nRole: Visitor / Recruiter / Fellow Hacker\nAccess Level: Read-Only";
        }
    },
    links: {
        desc: "Show useful resource links",
        action: () => {
            // Return a RANDOM resource instead of all
            const randomResource = resourceLinks[Math.floor(Math.random() * resourceLinks.length)];
            return `<span style="color: #20bf6b;">► ${randomResource.name}</span>
  <a href="${randomResource.url}" target="_blank">${randomResource.url}</a>
  Description: ${randomResource.desc}`;
        }
    },
    ascii: {
        desc: "Random ASCII art",
        action: () => {
            const arts = [
                // Metasploit-inspired ASCII Art
"        [ metasploit v6.3.0-dev                           ]\n" +
"        [ 2296 exploits - 1202 auxiliary - 410 post       ]\n" +
"        [ 951 payloads - 45 encoders - 11 nops            ]\n" +
"        [ 9 evasion                                       ]",

"    ██╗  ██╗ █████╗  ██████╗██╗  ██╗███████╗██████╗ \n" +
"    ██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗\n" +
"    ███████║███████║██║     █████╔╝ █████╗  ██████╔╝\n" +
"    ██╔══██║██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗\n" +
"    ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║\n" +
"    ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝",


"       .---.        .-----------\n" +
"      /     \\  __  /    ------\n" +
"     / /     \\(  )/    -----\n" +
"    //////   ' \\/ `   ---\n" +
"   //// / // :    : ---\n" +
"  // /   /  `    '--\n" +
" //          //..\\\\",

"    _____                 _\n" +
"   / ____|               | |\n" +
"  | |     _ __ __ _  ___| | __\n" +
"  | |    | '__/ _` |/ __| |/ /\n" +
"  | |____| | | (_| | (__|   <\n" +
"   \\_____|_|  \\__,_|\\___|_|\\_\\",

"        .==.        .==.\n" +
"       //..\\\\      //..\\\\      \n" +
"      // ..\\ \\    // ..\\ \\\n" +
"     //  .  \\ \\  //  .  \\ \\\n" +
"    //__  __\\ \\  /__  __\\ \\\n" +
"   =  = ==  =  = ==  = =\n" +
"     DIGITAL FORTRESS"
            ];
            return arts[Math.floor(Math.random() * arts.length)];
        }
    },
    poweroff: {
        desc: "Shutdown system",
        action: () => {
            // Create glitch effect (non-infinite)
            document.body.classList.add('glitch-active');
            
            // Remove glitch after 1.5 seconds
            setTimeout(() => {
                document.body.classList.remove('glitch-active');
            }, 1500);
            
            // Create full-screen poweroff overlay
            let poweroffScreen = document.getElementById('poweroff-screen');
            if (!poweroffScreen) {
                poweroffScreen = document.createElement('div');
                poweroffScreen.id = 'poweroff-screen';
                poweroffScreen.innerHTML = `
                    <div class="shutdown-text">
                        <p>Broadcast message from root@portfolio (pts/0) (Wed Nov 19 23:45:23 2025):</p>
                        <p></p>
                        <p>The system is going down for poweroff NOW!</p>
                        <p></p>
                        <p>[  OK  ] Stopped target Graphical Interface.</p>
                        <p>[  OK  ] Stopped target Multi-User System.</p>
                        <p>         Stopping Session 1 of user guest...</p>
                        <p>[  OK  ] Stopped User Manager for UID 1000.</p>
                        <p>[  OK  ] Unmounted /home.</p>
                        <p>[  OK  ] Reached target Shutdown.</p>
                        <p>[  OK  ] Reached target Final Step.</p>
                        <p>         Starting Power-Off...</p>
                        <p></p>
                        <p style="color: #ff5555;">System halted.</p>
                        <p></p>
                        <p style="color: #888;">[ <span class="blink-cursor">_</span> ]</p>
                    </div>
                `;
                document.body.appendChild(poweroffScreen);
            }
            
            // Trigger shutdown screen after 1 second
            setTimeout(() => {
                poweroffScreen.classList.add('active');
            }, 1000);
            
            // Auto-remove the poweroff screen after 3 seconds
            setTimeout(() => {
                poweroffScreen.classList.remove('active');
            }, 4000);
            
            return "Initiating shutdown sequence...";
        }
    },
    clear: {
        desc: "Clear screen",
        action: () => {
            terminalOutput.innerHTML = '';
            return '';
        }
    }
};

function printLine(text, className) {
    if (!text) return;
    const p = document.createElement('p');
    p.innerHTML = text; // innerHTML allowed for styling (colors/links)
    if (className) p.className = className;
    terminalOutput.appendChild(p);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = terminalInput.value.trim();
            if (!input) return;

            // Echo user command
            printLine(`<span style="color: #bd93f9;">guest@portfolio:~$</span> ${escapeHtml(input)}`);
            
            // Process command
            const [cmd, ...args] = input.split(' ');
            const commandObj = commands[cmd.toLowerCase()];
            
            if (commandObj) {
                const response = commandObj.action(args);
                if (response) printLine(response);
            } else {
                printLine(`Command not found: ${cmd}. Type 'help' for list.`);
            }
            
            terminalInput.value = '';
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
}

// ========================================
// Language Toggle Functionality
// ========================================

const langToggle = document.getElementById('lang-toggle');

if (langToggle) {
    langToggle.addEventListener('click', () => {
        // Toggle language
        currentLang = currentLang === 'en' ? 'de' : 'en';
        
        // Update button text
        const langText = langToggle.querySelector('.lang-text');
        langText.textContent = currentLang === 'en' ? 'DE' : 'EN';
        
        // Update all translatable elements
        updateLanguage();
    });
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-en]');
    
    elements.forEach(element => {
        const enText = element.getAttribute('data-en');
        const deText = element.getAttribute('data-de');
        
        if (currentLang === 'de' && deText) {
            // Special handling for elements with inner HTML (like terminal messages)
            if (element.tagName === 'P' && element.parentElement.id === 'terminal-output') {
                element.innerHTML = deText;
            } else {
                element.textContent = deText;
            }
        } else if (currentLang === 'en' && enText) {
            // Special handling for elements with inner HTML (like terminal messages)
            if (element.tagName === 'P' && element.parentElement.id === 'terminal-output') {
                element.innerHTML = enText;
            } else {
                element.textContent = enText;
            }
        }
    });
    
    // Update trivia counter and score with proper prefixes
    const questionCounter = document.getElementById('question-counter');
    const score = document.getElementById('score');
    
    if (questionCounter) {
        const prefix = currentLang === 'de' ? 'Frage' : 'Question';
        const match = questionCounter.textContent.match(/\d+\/\d+/);
        if (match) {
            questionCounter.textContent = `${prefix} ${match[0]}`;
        }
    }
    
    if (score) {
        const prefix = currentLang === 'de' ? 'Punkte' : 'Score';
        const match = score.textContent.match(/\d+/);
        if (match) {
            score.textContent = `${prefix}: ${match[0]}`;
        }
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
}
