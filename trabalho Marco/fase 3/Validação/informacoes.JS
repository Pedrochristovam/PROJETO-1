
function validarCPF(cpf) {
    const numeros = cpf.replace(/[^\d]/g, '');
    
    if (numeros.length !== 11) return false;
    
    if (/^(\d)\1+$/.test(numeros)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(numeros[i]) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto >= 10 ? 0 : resto;
    
    if (parseInt(numeros[9]) !== digito1) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(numeros[i]) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto >= 10 ? 0 : resto;
    
    return parseInt(numeros[10]) === digito2;
}


function aplicarMascaraCPF(valor) {
    return valor
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

const cpfInput = document.getElementById('cpf-input');
const cpfStatus = document.getElementById('cpf-status');
const cpfMessage = document.getElementById('cpf-message');

cpfInput.addEventListener('input', function(e) {
    e.target.value = aplicarMascaraCPF(e.target.value);
});

cpfInput.addEventListener('blur', function(e) {
    const cpf = e.target.value;
    
    if (cpf === '') {
        e.target.classList.remove('valid', 'invalid');
        cpfStatus.textContent = '';
        cpfMessage.className = 'validation-message';
        return;
    }

    if (cpf.length === 14 && validarCPF(cpf)) {
        e.target.classList.remove('invalid');
        e.target.classList.add('valid');
        cpfMessage.textContent = 'CPF válido';
        cpfMessage.className = 'validation-message success';
    } else {
        e.target.classList.remove('valid');
        e.target.classList.add('invalid');
        cpfMessage.textContent = 'CPF inválido. Use o formato: 000.000.000-00';
        cpfMessage.className = 'validation-message error';
    }
});

const emailInput = document.getElementById('email-input');
const emailStatus = document.getElementById('email-status');
const emailMessage = document.getElementById('email-message');

emailInput.addEventListener('blur', function(e) {
    const email = e.target.value;

    if (email === '') {
        e.target.classList.remove('valid', 'invalid');
        emailStatus.textContent = '';
        emailMessage.className = 'validation-message';
        return;
    }

    if (validarEmail(email)) {
        e.target.classList.remove('invalid');
        e.target.classList.add('valid');
        emailMessage.textContent = 'E-mail válido';
        emailMessage.className = 'validation-message success';
    } else {
        e.target.classList.remove('valid');
        e.target.classList.add('invalid');
        emailMessage.textContent = 'E-mail inválido. Use o formato: usuario@dominio.com';
        emailMessage.className = 'validation-message error';
    }
});

function adicionarInformacao() {
    const labelInput = document.getElementById('info-label');
    const valueInput = document.getElementById('info-value');
    const table = document.getElementById('additional-info-table');

    const label = labelInput.value.trim();
    const value = valueInput.value.trim();

    if (label === '' || value === '') {
        alert('Por favor, preencha tanto o campo quanto o valor.');
        return;
    }

    const existingLabels = Array.from(table.querySelectorAll('td:first-child')).map(td => 
        td.textContent.replace(':', '').toLowerCase()
    );

    if (existingLabels.includes(label.toLowerCase())) {
        alert('Este campo já existe! Escolha um nome diferente.');
        return;
    }

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${label}:</td>
        <td class="new-info-item">
            ${value}
            <button class="remove-btn" onclick="removerInformacao(this)" title="Remover">×</button>
        </td>
    `;

    table.appendChild(newRow);
    labelInput.value = '';
    valueInput.value = '';
    labelInput.focus();

    setTimeout(() => {
        const newItem = newRow.querySelector('.new-info-item');
        if (newItem) {
            newItem.classList.remove('new-info-item');
            newItem.style.background = 'transparent';
            newItem.style.color = '#34495e';
        }
    }, 2000);
}

function removerInformacao(button) {
    const row = button.closest('tr');
    const fieldName = row.querySelector('td:first-child').textContent.replace(':', '');
    
    if (confirm(`Tem certeza que deseja remover o campo "${fieldName}"?`)) {
        row.remove();
    }
}

let draggedElement = null;

function adicionarUC() {
    const novaUC = prompt("Digite o nome da nova Unidade Curricular:");
    
    if (novaUC && novaUC.trim() !== "") {
        const nomeUC = novaUC.trim();
        const ucList = document.getElementById('uc-list');
        const ucExistentes = Array.from(ucList.children).map(li => 
            li.querySelector('.uc-content').textContent.toLowerCase()
        );
        
        if (ucExistentes.includes(nomeUC.toLowerCase())) {
            alert("Esta Unidade Curricular já está na lista!");
            return;
        }
        
        const novoItem = criarItemUC(nomeUC);
        novoItem.classList.add('new-uc');
        ucList.appendChild(novoItem);
        atualizarContador();
        atualizarBotoes();
        
        setTimeout(() => {
            novoItem.classList.remove('new-uc');
        }, 500);
    } else if (novaUC !== null) {
        alert("Por favor, digite um nome válido para a UC.");
    }
}

function criarItemUC(nome) {
    const li = document.createElement('li');
    li.className = 'uc-item';
    li.draggable = true;
    li.innerHTML = `
        <span class="drag-handle">⋮⋮</span>
        <div class="uc-content">${nome}</div>
        <div class="uc-controls">
            <button class="arrow-btn" onclick="moverUC(this, 'up')" title="Mover para cima">↑</button>
            <button class="arrow-btn" onclick="moverUC(this, 'down')" title="Mover para baixo">↓</button>
        </div>
    `;
    adicionarEventosDrag(li);
    return li;
}

function moverUC(button, direction) {
    const ucItem = button.closest('.uc-item');
    const ucList = document.getElementById('uc-list');
    
    if (direction === 'up' && ucItem.previousElementSibling) {
        ucList.insertBefore(ucItem, ucItem.previousElementSibling);
    } else if (direction === 'down' && ucItem.nextElementSibling) {
        ucList.insertBefore(ucItem.nextElementSibling, ucItem);
    }
    atualizarBotoes();
}

function atualizarBotoes() {
    const items = document.querySelectorAll('.uc-item');
    items.forEach((item, index) => {
        const upBtn = item.querySelector('.arrow-btn:first-child');
        const downBtn = item.querySelector('.arrow-btn:last-child');
        upBtn.disabled = (index === 0);
        downBtn.disabled = (index === items.length - 1);
    });
}

function atualizarContador() {
    const ucList = document.getElementById('uc-list');
    const contador = document.getElementById('uc-count');
    contador.textContent = ucList.children.length;
}


function adicionarEventosDrag(element) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd);
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragleave', handleDragLeave);
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.stopPropagation();
    if (draggedElement !== this) {
        const ucList = document.getElementById('uc-list');
        const items = Array.from(ucList.children);
        const draggedIndex = items.indexOf(draggedElement);
        const targetIndex = items.indexOf(this);

        if (draggedIndex < targetIndex) {
            ucList.insertBefore(draggedElement, this.nextSibling);
        } else {
            ucList.insertBefore(draggedElement, this);
        }
        atualizarBotoes();
    }
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.uc-item').forEach(item => {
        item.classList.remove('drag-over');
    });
    draggedElement = null;
}


function changePhoto(thumbnail) {
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnail.classList.add('active');
    const mainPhoto = document.getElementById('mainPhoto');
    mainPhoto.src = thumbnail.src;
    mainPhoto.alt = thumbnail.alt;
    mainPhoto.style.display = 'block';
}

function changeToPlaceholder(element, emoji, description) {
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    element.classList.add('active');
    const mainPhoto = document.getElementById('mainPhoto');
    const photoContainer = mainPhoto.parentElement;
    mainPhoto.style.display = 'none';
    
    const existingPlaceholder = photoContainer.querySelector('.main-placeholder');
    if (existingPlaceholder) existingPlaceholder.remove();
    
    const placeholder = document.createElement('div');
    placeholder.className = 'main-photo main-placeholder';
    placeholder.style.cssText = `
        width: 250px;
        height: 250px;
        border-radius: 15px;
        border: 3px solid var(--primary-color);
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 60px;
        box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
    `;
    placeholder.innerHTML = `
        <div>${emoji}</div>
        <div style="font-size: 14px; margin-top: 10px;">${description}</div>
    `;
    photoContainer.appendChild(placeholder);
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.uc-item').forEach(item => {
        adicionarEventosDrag(item);
    });
    atualizarBotoes();
    atualizarContador();
    
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'n') {
            event.preventDefault();
            adicionarUC();
        }
    });
    
    if (emailInput.value) {
        emailInput.dispatchEvent(new Event('blur'));
    }
});