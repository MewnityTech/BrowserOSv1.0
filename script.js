document.addEventListener('DOMContentLoaded', function() {
    const desktopIcons = [
        { name: 'Calculator', icon: 'fas fa-calculator', app: 'calculator', left: 20, top: 20 },
        { name: 'Notepad', icon: 'fas fa-edit', app: 'notepad', left: 20, top: 130 },
        { name: 'Terminal', icon: 'fas fa-terminal', app: 'terminal', left: 20, top: 240 },
        { name: 'Settings', icon: 'fas fa-cog', app: 'settings', left: 20, top: 350 }
    ];

    const desktop = document.getElementById('desktop');
    const startMenu = document.getElementById('startMenu');
    const startMenuContent = document.getElementById('startMenuContent');
    const appTaskbar = document.getElementById('appTaskbar');
    const contextMenu = document.getElementById('contextMenu');
    const systemTime = document.getElementById('systemTime');

    const openWindows = {};
    let zIndex = 10;
    let activeWindow = null;

    desktopIcons.forEach(icon => {
        const desktopIcon = document.createElement('div');
        desktopIcon.className = 'desktop-icon';
        desktopIcon.style.left = icon.left + 'px';
        desktopIcon.style.top = icon.top + 'px';
        desktopIcon.innerHTML = `
            <div class="icon-image">
                <i class="${icon.icon}"></i>
            </div>
            <div class="icon-text">${icon.name}</div>
        `;
        desktopIcon.addEventListener('dblclick', () => openApp(icon.app));
        desktop.appendChild(desktopIcon);
    });


    startMenu.addEventListener('click', () => {
        startMenuContent.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && !startMenuContent.contains(e.target)) {
            startMenuContent.classList.remove('active');
        }
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const app = item.getAttribute('data-app');
            openApp(app);
            startMenuContent.classList.remove('active');
        });
    });

    desktop.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        contextMenu.style.display = 'block';
        contextMenu.style.left = e.pageX + 'px';
        contextMenu.style.top = e.pageY + 'px';
    });

    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
    });

    document.getElementById('settings').addEventListener('click', () => openApp('settings'));

    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        systemTime.textContent = `${hours}:${minutes}`;
    }
    updateTime();
    setInterval(updateTime, 60000);

    function openApp(appName) {
        if (openWindows[appName]) {
            setActiveWindow(openWindows[appName]);
            return;
        }

        const window = document.createElement('div');
        window.className = 'window';
        window.dataset.app = appName;
        window.style.width = '400px';
        window.style.height = '300px';
        window.style.left = '100px';
        window.style.top = '100px';
        window.style.zIndex = ++zIndex;

        let title = '';
        let content = '';

        switch (appName) {
            case 'calculator':
                title = 'Calculator';
                content = `
                    <div class="calculator">
                        <div class="calculator-display">0</div>
                        <button>7</button>
                        <button>8</button>
                        <button>9</button>
                        <button class="operator">÷</button>
                        <button>4</button>
                        <button>5</button>
                        <button>6</button>
                        <button class="operator">×</button>
                        <button>1</button>
                        <button>2</button>
                        <button>3</button>
                        <button class="operator">-</button>
                        <button>0</button>
                        <button>.</button>
                        <button>C</button>
                        <button class="operator">+</button>
                        <button class="equals operator">=</button>
                        <button class="operator">%</button>
                    </div>
                `;
                break;
            case 'notepad':
                title = 'Notepad';
                content = `
                    <div class="notepad">
                        <textarea placeholder="Start typing..."></textarea>
                    </div>
                `;
                break;
            case 'terminal':
                title = 'Terminal';
                content = `
                    <div class="terminal">
                        <div class="terminal-output" id="terminalOutput">
                            Welcome to BrowserOS Terminal<br>
                            Type 'help' for a list of commands<br><br>
                        </div>
                        <div class="terminal-input">
                            <span>$</span>
                            <input type="text" id="terminalInput">
                        </div>
                    </div>
                `;
                break;
            case 'settings':
                title = 'Settings';
                content = `
                    <div class="settings">
                        <h4>Appearance</h4>
                        <div class="settings-section">
                            <div class="settings-option">
                                <label>Theme</label>
                                <div class="theme-options">
                                    <div class="theme-option active" style="background-color: #1e1e2e;" data-theme="dark"></div>
                                    <div class="theme-option" style="background-color: #f8f9fa;" data-theme="light"></div>
                                    <div class="theme-option" style="background-color: #24273a;" data-theme="catppuccin"></div>
                                    <div class="theme-option" style="background-color: #0f0f0f;" data-theme="black"></div>
                                </div>
                            </div>
                            <div class="settings-option">
                                <label>Wallpaper</label>
                                <div class="wallpaper-options">
                                    <div class="wallpaper-preview" style="background-color: #1e1e2e;" data-wallpaper="default"></div>
                                    <div class="wallpaper-preview" style="background: linear-gradient(45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);" data-wallpaper="gradient1"></div>
                                    <div class="wallpaper-preview" style="background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);" data-wallpaper="gradient2"></div>
                                </div>
                            </div>
                        </div>
                        <h4>System Information</h4>
                        <div class="settings-section">
                            <p>BrowserOS v1.0</p>
                            <p>Running in: ${navigator.userAgent}</p>
                        </div>
                    </div>
                `;
                break;
            default:
                content = '<div>App content</div>';
        }

        window.innerHTML = `
            <div class="window-title">
                <h3>${title}</h3>
                <div class="window-controls">
                    <div class="control-btn minimize"></div>
                    <div class="control-btn maximize"></div>
                    <div class="control-btn close"></div>
                </div>
            </div>
            <div class="window-content">${content}</div>
        `;

        desktop.appendChild(window);
        openWindows[appName] = window;

        const taskbarItem = document.createElement('div');
        taskbarItem.className = 'running-app active';
        taskbarItem.dataset.app = appName;
        taskbarItem.innerHTML = `<i class="${getAppIcon(appName)}"></i>`;
        appTaskbar.appendChild(taskbarItem);

        setActiveWindow(window);

        setupWindowControls(window, taskbarItem);

        if (appName === 'calculator') {
            initCalculator(window);
        } else if (appName === 'terminal') {
            initTerminal(window);
        } else if (appName === 'settings') {
            initSettings(window);
        }
    }

    function getAppIcon(appName) {
        const iconMap = {
            calculator: 'fas fa-calculator',
            notepad: 'fas fa-edit',
            terminal: 'fas fa-terminal',
            settings: 'fas fa-cog'
        };
        return iconMap[appName] || 'fas fa-window-maximize';
    }

    function setupWindowControls(window, taskbarItem) {
        const titleBar = window.querySelector('.window-title');
        const closeBtn = window.querySelector('.close');
        const maximizeBtn = window.querySelector('.maximize');
        const minimizeBtn = window.querySelector('.minimize');

        let isDragging = false;
        let offsetX, offsetY;

        titleBar.addEventListener('mousedown', (e) => {
            if (e.target === titleBar || e.target.tagName === 'H3') {
                isDragging = true;
                offsetX = e.clientX - window.getBoundingClientRect().left;
                offsetY = e.clientY - window.getBoundingClientRect().top;
                setActiveWindow(window);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                window.style.left = (e.clientX - offsetX) + 'px';
                window.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        closeBtn.addEventListener('click', () => {
            window.remove();
            delete openWindows[window.dataset.app];
            taskbarItem.remove();
            if (activeWindow === window) {
                activeWindow = null;
            }
        });

        maximizeBtn.addEventListener('click', () => {
            if (window.style.width === '100%') {
                window.style.width = '400px';
                window.style.height = '300px';
                window.style.left = '100px';
                window.style.top = '100px';
            } else {
                window.style.width = '100%';
                window.style.height = 'calc(100% - 40px)';
                window.style.left = '0';
                window.style.top = '0';
            }
        });

        minimizeBtn.addEventListener('click', () => {
            window.style.display = 'none';
            taskbarItem.classList.remove('active');
        });

        taskbarItem.addEventListener('click', () => {
            if (window.style.display === 'none') {
                window.style.display = 'flex';
                setActiveWindow(window);
            } else if (activeWindow === window) {
                window.style.display = 'none';
                taskbarItem.classList.remove('active');
                activeWindow = null;
            } else {
                setActiveWindow(window);
            }
        });

        window.addEventListener('mousedown', () => {
            setActiveWindow(window);
        });
    }

    function setActiveWindow(window) {
        document.querySelectorAll('.running-app').forEach(item => {
            item.classList.remove('active');
        });

        const taskbarItem = document.querySelector(`.running-app[data-app="${window.dataset.app}"]`);
        if (taskbarItem) {
            taskbarItem.classList.add('active');
        }

        window.style.zIndex = ++zIndex;
        window.style.display = 'flex';
        activeWindow = window;
    }

    function initCalculator(window) {
        const display = window.querySelector('.calculator-display');
        const buttons = window.querySelectorAll('.calculator button');
        
        let firstOperand = null;
        let operator = null;
        let waitForSecondOperand = false;

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.textContent;
                
                if (value === 'C') {
                    display.textContent = '0';
                    firstOperand = null;
                    operator = null;
                    waitForSecondOperand = false;
                } else if (value === '=') {
                    if (operator && !waitForSecondOperand) {
                        const secondOperand = parseFloat(display.textContent);
                        const result = calculate(firstOperand, operator, secondOperand);
                        display.textContent = result;
                        firstOperand = result;
                        waitForSecondOperand = true;
                        operator = null;
                    }
                } else if (['+', '-', '×', '÷', '%'].includes(value)) {
                    const displayValue = parseFloat(display.textContent);
                    
                    if (firstOperand === null) {
                        firstOperand = displayValue;
                    } else if (operator) {
                        const result = calculate(firstOperand, operator, displayValue);
                        display.textContent = result;
                        firstOperand = result;
                    }
                    
                    waitForSecondOperand = true;
                    operator = value;
                } else {
                    if (waitForSecondOperand) {
                        display.textContent = value;
                        waitForSecondOperand = false;
                    } else {
                        display.textContent = display.textContent === '0' ? value : display.textContent + value;
                    }
                }
            });
        });

        function calculate(first, operator, second) {
            switch (operator) {
                case '+': return first + second;
                case '-': return first - second;
                case '×': return first * second;
                case '÷': return first / second;
                case '%': return first % second;
                default: return second;
            }
        }
    }

    function initTerminal(window) {
        const output = window.querySelector('#terminalOutput');
        const input = window.querySelector('#terminalInput');
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                output.innerHTML += `$ ${command}<br>`;
                
                processCommand(command, output);
                
                input.value = '';
            }
        });

        function processCommand(command, output) {
            const parts = command.split(' ');
            const cmd = parts[0].toLowerCase();
            
            switch (cmd) {
                case 'help':
                    output.innerHTML += `
                        Available commands:<br>
                        help - Show this help<br>
                        echo [text] - Display text<br>
                        clear - Clear terminal<br>
                        date - Show current date<br>
                        ls - List files (simulated)<br>
                        whoami - Show user<br>
                        open [app] - Open application<br>
                        <br>
                    `;
                    break;
                case 'echo':
                    output.innerHTML += `${parts.slice(1).join(' ')}<br><br>`;
                    break;
                case 'clear':
                    output.innerHTML = '';
                    break;
                case 'date':
                    output.innerHTML += `${new Date().toString()}<br><br>`;
                    break;
                case 'ls':
                    output.innerHTML += `
                        Documents/<br>
                        Pictures/<br>
                        Downloads/<br>
                        system.config<br>
                        notes.txt<br>
                        <br>
                    `;
                    break;
                case 'whoami':
                    output.innerHTML += `user@browseros<br><br>`;
                    break;
                case 'open':
                    if (parts[1]) {
                        const appName = parts[1].toLowerCase();
                        if (['calculator', 'notepad', 'settings'].includes(appName)) {
                            openApp(appName);
                            output.innerHTML += `Opening ${appName}...<br><br>`;
                        } else {
                            output.innerHTML += `Application '${appName}' not found.<br><br>`;
                        }
                    } else {
                        output.innerHTML += `Usage: open [app]<br><br>`;
                    }
                    break;
                default:
                    output.innerHTML += `Command not found: ${cmd}<br><br>`;
            }
            
            output.scrollTop = output.scrollHeight;
        }
    }

    function initSettings(window) {
        const themeOptions = window.querySelectorAll('.theme-option');
        const wallpaperOptions = window.querySelectorAll('.wallpaper-preview');
        
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                const theme = option.getAttribute('data-theme');
                applyTheme(theme);
            });
        });
        
        wallpaperOptions.forEach(option => {
            option.addEventListener('click', () => {
                const wallpaper = option.getAttribute('data-wallpaper');
                applyWallpaper(wallpaper);
            });
        });
    }
    
    function applyTheme(theme) {
        const root = document.documentElement;
        
        switch (theme) {
            case 'light':
                root.style.setProperty('--bg-color', '#f8f9fa');
                root.style.setProperty('--window-color', '#ffffff');
                root.style.setProperty('--text-color', '#343a40');
                root.style.setProperty('--accent-color', '#007bff');
                root.style.setProperty('--taskbar-color', '#e9ecef');
                root.style.setProperty('--app-color', '#f8f9fa');
                root.style.setProperty('--title-color', '#007bff');
                break;
            case 'catppuccin':
                root.style.setProperty('--bg-color', '#24273a');
                root.style.setProperty('--window-color', '#363a4f');
                root.style.setProperty('--text-color', '#cad3f5');
                root.style.setProperty('--accent-color', '#c6a0f6');
                root.style.setProperty('--taskbar-color', '#181926');
                root.style.setProperty('--app-color', '#363a4f');
                root.style.setProperty('--title-color', '#c6a0f6');
                break;
            case 'black':
                root.style.setProperty('--bg-color', '#0f0f0f');
                root.style.setProperty('--window-color', '#1f1f1f');
                root.style.setProperty('--text-color', '#f0f0f0');
                root.style.setProperty('--accent-color', '#e74c3c');
                root.style.setProperty('--taskbar-color', '#000000');
                root.style.setProperty('--app-color', '#1f1f1f');
                root.style.setProperty('--title-color', '#e74c3c');
                break;
            default: // dark
                root.style.setProperty('--bg-color', '#1e1e2e');
                root.style.setProperty('--window-color', '#313244');
                root.style.setProperty('--text-color', '#cdd6f4');
                root.style.setProperty('--accent-color', '#89b4fa');
                root.style.setProperty('--taskbar-color', '#11111b');
                root.style.setProperty('--app-color', '#313244');
                root.style.setProperty('--title-color', '#cba6f7');
        }
    }
    
    function applyWallpaper(wallpaper) {
        const desktop = document.getElementById('desktop');
        
        switch (wallpaper) {
            case 'gradient1':
                desktop.style.background = 'linear-gradient(45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)';
                desktop.style.backgroundSize = '400% 400%';
                // Add animation
                desktop.style.animation = 'gradient 15s ease infinite';
                document.head.insertAdjacentHTML('beforeend', `
                    <style>
                        @keyframes gradient {
                            0% {
                                background-position: 0% 50%;
                            }
                            50% {
                                background-position: 100% 50%;
                            }
                            100% {
                                background-position: 0% 50%;
                            }
                        }
                    </style>
                `);
                break;
            case 'gradient2':
                desktop.style.background = 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)';
                desktop.style.animation = 'none';
                break;
            default:
                desktop.style.background = '';
                desktop.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
                desktop.style.animation = 'none';
        }
    }
    
    function makeResizable(element) {
        const resizers = document.createElement('div');
        resizers.className = 'resizers';
        
        const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        positions.forEach(pos => {
            const resizer = document.createElement('div');
            resizer.className = `resizer ${pos}`;
            resizers.appendChild(resizer);
        });
        
        element.appendChild(resizers);
        
    }
    
    // доп функции в 1.2 будет
    
    function showNotification(title, message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
    
    const fileSystem = {
        desktop: [],
        documents: ['report.txt', 'budget.xlsx'],
        pictures: ['vacation.jpg', 'family.jpg'],
        downloads: ['app-installer.exe']
    };
    
    document.getElementById('newFolder').addEventListener('click', () => {
        const folderName = prompt('Enter folder name:', 'New Folder');
        if (folderName) {
            const folderIcon = document.createElement('div');
            folderIcon.className = 'desktop-icon';
            folderIcon.style.left = '120px';
            folderIcon.style.top = '20px';
            folderIcon.innerHTML = `
                <div class="icon-image" style="background-color: var(--accent-color)">
                    <i class="fas fa-folder"></i>
                </div>
                <div class="icon-text">${folderName}</div>
            `;
            desktop.appendChild(folderIcon);
            
            fileSystem[folderName.toLowerCase()] = [];
            
            showNotification('Folder Created', `Folder "${folderName}" has been created.`);
        }
    });
    
    function bootSystem() {
        const bootScreen = document.createElement('div');
        bootScreen.className = 'boot-screen';
        bootScreen.innerHTML = `
            <div class="boot-logo">
                <i class="fas fa-desktop fa-5x"></i>
            </div>
            <div class="boot-progress">
                <div class="boot-progress-bar"></div>
            </div>
            <div class="boot-text">Starting BrowserOS...</div>
        `;
        document.body.appendChild(bootScreen);
        
        setTimeout(() => {
            bootScreen.classList.add('fade-out');
            setTimeout(() => bootScreen.remove(), 1000);
            
            setTimeout(() => {
                showNotification('Welcome to BrowserOS', 'System loaded successfully.');
            }, 1500);
        }, 3000);
    }
    
    bootSystem();
    
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        .boot-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--bg-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 1s;
        }
        
        .boot-logo {
            margin-bottom: 30px;
            color: var(--accent-color);
        }
        
        .boot-progress {
            width: 300px;
            height: 5px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            overflow: hidden;
            margin-bottom: 15px;
        }
        
        .boot-progress-bar {
            height: 100%;
            width: 0;
            background-color: var(--accent-color);
            animation: progress 3s linear forwards;
        }
        
        @keyframes progress {
            0% { width: 0; }
            100% { width: 100%; }
        }
        
        .boot-text {
            color: var(--text-color);
            font-size: 16px;
        }
        
        .fade-out {
            opacity: 0;
        }
        
        .notification {
            position: fixed;
            bottom: 50px;
            right: 20px;
            background-color: var(--window-color);
            border-left: 4px solid var(--accent-color);
            padding: 12px 20px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            transition: opacity 0.5s;
            max-width: 300px;
        }
        
        .notification-title {
            font-weight: bold;
            margin-bottom: 5px;
            color: var(--title-color);
        }
        
        .notification-message {
            color: var(--text-color);
        }
        
        .resizers {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }
        
        .resizer {
            width: 10px;
            height: 10px;
            position: absolute;
            background-color: var(--accent-color);
            border-radius: 50%;
        }
        
        .resizer.top-left {
            top: -5px;
            left: -5px;
            cursor: nwse-resize;
        }
        
        .resizer.top-right {
            top: -5px;
            right: -5px;
            cursor: nesw-resize;
        }
        
        .resizer.bottom-left {
            bottom: -5px;
            left: -5px;
            cursor: nesw-resize;
        }
        
        .resizer.bottom-right {
            bottom: -5px;
            right: -5px;
            cursor: nwse-resize;
        }
    `;
    document.head.appendChild(additionalStyles);
});
