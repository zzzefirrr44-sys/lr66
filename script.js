'use strict';

const tabsContainer = document.querySelector('#tabs-container');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

const topLeft = document.querySelector('#topLeft');
const topRight = document.querySelector('#topRight');
const bottomRight = document.querySelector('#bottomRight');
const bottomLeft = document.querySelector('#bottomLeft');

const topLeftValue = document.querySelector('#topLeftValue');
const topRightValue = document.querySelector('#topRightValue');
const bottomRightValue = document.querySelector('#bottomRightValue');
const bottomLeftValue = document.querySelector('#bottomLeftValue');

const preview = document.querySelector('#preview');
const previewButton = document.querySelector('#preview-button');
const letterSpacing = document.querySelector('#letter-spacing');
const letterSpacingValue = document.querySelector('#letter-spacing-value');
const textTransform = document.querySelector('#text-transform');
const cssCode = document.querySelector('#css-code');
const copyButton = document.querySelector('#copy-button');
const copyMessage = document.querySelector('#copy-message');
const presetForm = document.querySelector('#preset-form');
const presetName = document.querySelector('#preset-name');
const presetError = document.querySelector('#preset-error');
const coordinates = document.querySelector('#coordinates');
const scrollTopButton = document.querySelector('#scroll-top');

function hideTabs() {
    tabs.forEach(function (tab) {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });

    tabContents.forEach(function (content) {
        content.classList.remove('active');
        content.hidden = true;
    });
}

function showTab(tabName) {
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = document.querySelector(`[data-content="${tabName}"]`);

    if (!selectedTab || !selectedContent) {
        return;
    }

    selectedTab.classList.add('active');
    selectedTab.setAttribute('aria-selected', 'true');
    selectedContent.classList.add('active');
    selectedContent.hidden = false;
}

function updateCSSCode() {
    const radius = `${topLeft.value}px ${topRight.value}px ${bottomRight.value}px ${bottomLeft.value}px`;
    cssCode.value = `border-radius: ${radius};\nletter-spacing: ${letterSpacing.value}px;\ntext-transform: ${textTransform.value};`;
}

function generateBorderRadius() {
    const topLeftRadius = topLeft.value;
    const topRightRadius = topRight.value;
    const bottomRightRadius = bottomRight.value;
    const bottomLeftRadius = bottomLeft.value;
    const radius = `${topLeftRadius}px ${topRightRadius}px ${bottomRightRadius}px ${bottomLeftRadius}px`;

    preview.style.borderRadius = radius;
    topLeftValue.textContent = `${topLeftRadius} px`;
    topRightValue.textContent = `${topRightRadius} px`;
    bottomRightValue.textContent = `${bottomRightRadius} px`;
    bottomLeftValue.textContent = `${bottomLeftRadius} px`;
    updateCSSCode();
}

function updateLetterSpacing() {
    letterSpacingValue.textContent = `${letterSpacing.value} px`;
    preview.style.letterSpacing = `${letterSpacing.value}px`;
    updateCSSCode();
}

function updateTextTransform() {
    preview.style.textTransform = textTransform.value;
    updateCSSCode();
}

function handlePresetSubmit(event) {
    event.preventDefault();
    const name = presetName.value.trim();

    if (!name) {
        presetName.classList.add('error');
        presetError.textContent = 'Введіть назву пресета';
        presetName.focus();
        return;
    }

    presetName.classList.remove('error');
    presetError.textContent = '';
    console.log(`Пресет: ${name}`);
    console.log(cssCode.value);
}

function handleKeyDown(event) {
    if (event.key !== 'Escape') {
        return;
    }

    document.querySelectorAll('input[type="range"]').forEach(function (range) {
        range.value = '0';
    });

    generateBorderRadius();
    updateLetterSpacing();
    updateTextTransform();
}

async function copyCSS() {
    copyMessage.textContent = '';

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(cssCode.value);
        } else {
            cssCode.focus();
            cssCode.select();
            const copied = document.execCommand('copy');
            cssCode.setSelectionRange(0, 0);

            if (!copied) {
                throw new Error('Копіювання недоступне');
            }
        }

        copyMessage.textContent = 'CSS-код скопійовано';
    } catch (error) {
        copyMessage.textContent = 'Не вдалося скопіювати. Виділи CSS-код і скопіюй його вручну.';
    }
}

function handleScroll() {
    if (window.scrollY > 300) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
}

tabsContainer.addEventListener('click', function (event) {
    if (!event.target.classList.contains('tab')) {
        return;
    }

    const tabName = event.target.dataset.tab;
    console.log(event.type);
    console.log(event.target);
    console.log(event.currentTarget);

    hideTabs();
    showTab(tabName);
});

[ topLeft, topRight, bottomRight, bottomLeft ].forEach(function (range) {
    range.addEventListener('input', generateBorderRadius);
});

letterSpacing.addEventListener('input', updateLetterSpacing);
textTransform.addEventListener('change', updateTextTransform);

presetName.addEventListener('focus', function () {
    presetName.classList.add('focused');
});

presetName.addEventListener('blur', function () {
    presetName.classList.remove('focused');

    if (!presetName.value.trim()) {
        presetName.classList.add('error');
        presetError.textContent = 'Введіть назву пресета';
    } else {
        presetName.classList.remove('error');
        presetError.textContent = '';
    }
});

presetForm.addEventListener('submit', handlePresetSubmit);
document.addEventListener('keydown', handleKeyDown);
copyButton.addEventListener('click', copyCSS);

preview.addEventListener('click', function () {
    console.log('Preview click');
});

previewButton.addEventListener('click', function (event) {
    event.stopPropagation();
    console.log('Button click');
});

preview.addEventListener('mouseover', function () {
    preview.classList.add('hovered');
});

preview.addEventListener('mouseout', function (event) {
    if (event.relatedTarget && preview.contains(event.relatedTarget)) {
        return;
    }

    preview.classList.remove('hovered');
});

preview.addEventListener('mousemove', function (event) {
    coordinates.textContent = `X: ${event.clientX}; Y: ${event.clientY}`;
    console.log(`pageX: ${event.pageX}; pageY: ${event.pageY}`);
});

window.addEventListener('scroll', handleScroll);
scrollTopButton.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

hideTabs();
showTab('radius');
generateBorderRadius();
updateLetterSpacing();
updateTextTransform();
handleScroll();
