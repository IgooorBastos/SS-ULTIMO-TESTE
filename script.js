/**
 * =================================================================
 * SUNVOLT JAVASCRIPT - VERSÃO SIMPLES E FUNCIONAL
 * =================================================================
 */

// VARIÁVEIS GLOBAIS
let canvas, ctx, painting = false;

/**
 * INICIALIZAÇÃO PRINCIPAL
 */
document.addEventListener('DOMContentLoaded', function() {
  initDynamicDateTime();
  initCanvas();
  initAutoCalculations();
});

/**
 * DATETIME AUTOMÁTICO
 */
function initDynamicDateTime() {
  const datetimeInput = document.getElementById('datetime');
  if (datetimeInput) {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - timezoneOffset).toISOString().slice(0, 16);
    datetimeInput.value = localISOTime;
  }
}

/**
 * CÁLCULO AUTOMÁTICO DE ÁREA
 */
function initAutoCalculations() {
  const lengthInput = document.getElementById('roofLength');
  const widthInput = document.getElementById('roofWidth');
  
  if (lengthInput && widthInput) {
    const calculateArea = () => {
      const length = parseFloat(lengthInput.value) || 0;
      const width = parseFloat(widthInput.value) || 0;
      const area = length * width;
      
      const areaInput = document.getElementById('roofArea');
      if (areaInput) {
        areaInput.value = area > 0 ? area.toFixed(2) : '';
      }
    };
    
    lengthInput.addEventListener('input', calculateArea);
    widthInput.addEventListener('input', calculateArea);
  }
}

/**
 * NOTIFICAÇÕES SIMPLES
 */
function showNotification(message) {
  // Remove notificação existente
  const existing = document.querySelector('.temp-notification');
  if (existing) existing.remove();
  
  // Cria nova notificação
  const notif = document.createElement('div');
  notif.className = 'temp-notification';
  notif.textContent = message;
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4da6ff;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    z-index: 10000;
    font-size: 14px;
  `;
  
  document.body.appendChild(notif);
  
  // Remove após 2 segundos
  setTimeout(() => {
    if (notif.parentNode) {
      notif.parentNode.removeChild(notif);
    }
  }, 2000);
}

/**
 * SISTEMA DE NOTAS
 */
window.toggleNotes = function(button) {
  const notesField = button.nextElementSibling;
  
  if (notesField && notesField.tagName === 'TEXTAREA') {
    notesField.style.display = 'block';
    notesField.focus();
    
    button.textContent = 'Remover Nota';
    button.onclick = () => removeNotes(button, notesField);
  }
};

function removeNotes(button, notesField) {
  notesField.style.display = 'none';
  notesField.value = '';
  
  button.textContent = 'Adicionar Nota';
  button.onclick = () => toggleNotes(button);
  
  showNotification('Nota removida.');
}

/**
 * PREVIEW DE IMAGENS
 */
window.previewPhotos = function(event, previewId, inputId) {
  const previewContainer = document.getElementById(previewId);
  const fileInput = document.getElementById(inputId);
  
  if (!previewContainer || !fileInput) return;
  
  previewContainer.innerHTML = '';
  const files = event.target.files;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith('image/')) continue;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'preview-image-wrapper';
    
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.onload = () => URL.revokeObjectURL(img.src);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.type = 'button';
    
    deleteBtn.onclick = () => {
      wrapper.remove();
      fileInput.value = '';
      showNotification('Foto removida.');
    };
    
    wrapper.appendChild(img);
    wrapper.appendChild(deleteBtn);
    previewContainer.appendChild(wrapper);
  }
};

/**
 * SISTEMA DE CANVAS
 */
function initCanvas() {
  canvas = document.getElementById('sketchCanvas');
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  setupCanvasDimensions();
  
  // Mouse events
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
  canvas.addEventListener('mousemove', draw);
  
  // Touch events
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchend', stopDrawing);
  canvas.addEventListener('touchmove', draw);
  
  window.addEventListener('resize', setupCanvasDimensions);
}

function setupCanvasDimensions() {
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

function getCoords(e) {
  const rect = canvas.getBoundingClientRect();
  const event = e.touches ? e.touches[0] : e;
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function startDrawing(e) {
  e.preventDefault();
  painting = true;
  const coords = getCoords(e);
  ctx.beginPath();
  ctx.moveTo(coords.x, coords.y);
}

function stopDrawing() {
  painting = false;
}

function draw(e) {
  if (!painting) return;
  e.preventDefault();
  
  const coords = getCoords(e);
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#2c3e50';
  ctx.lineTo(coords.x, coords.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(coords.x, coords.y);
}

window.clearCanvas = function() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const sketchImageInput = document.getElementById('sketchImage');
  if (sketchImageInput) sketchImageInput.value = '';
  
  showNotification('Esboço limpo.');
};

window.saveSketch = function() {
  if (!canvas) return;
  
  const dataURL = canvas.toDataURL('image/png');
  const sketchImageInput = document.getElementById('sketchImage');
  
  if (sketchImageInput) {
    sketchImageInput.value = dataURL;
    showNotification('Esboço salvo!');
  }
};

/**
 * CONTROLES DE SEÇÕES
 */
window.toggleAllDetails = function(openState) {
  const allDetails = document.querySelectorAll('details');
  for (let i = 0; i < allDetails.length; i++) {
    allDetails[i].open = openState;
  }
};

/**
 * SISTEMA DE IMPRESSÃO SIMPLES E FUNCIONAL
 */
window.printReport = function() {
  console.log('Iniciando impressão...');
  
  // Abre todas as seções
  const allDetails = document.querySelectorAll('details');
  for (let i = 0; i < allDetails.length; i++) {
    allDetails[i].open = true;
  }
  
  // Aguarda um pouco e imprime
  setTimeout(function() {
    window.print();
  }, 500);
};

/**
 * FORÇA CORES NA IMPRESSÃO
 */
window.addEventListener('beforeprint', function() {
  document.body.style.webkitPrintColorAdjust = 'exact';
  document.body.style.colorAdjust = 'exact';
  document.body.style.printColorAdjust = 'exact';
});

console.log('Sunvolt JavaScript carregado!');
/**
 * FUNÇÃO GENERATEPDF (QUE ESTAVA FALTANDO)
 */
window.generatePDF = function() {
  console.log('🖨️ Gerando PDF...');
  
  // Força abertura de TODAS as seções
  const allDetails = document.querySelectorAll('details');
  allDetails.forEach(detail => {
    detail.open = true;
  });
  
  // Mostra notificação
  showNotification('Abrindo todas as seções...');
  
  // Coleta dados do formulário para nome sugerido
  const customerName = document.getElementById('customer') ? 
                       document.getElementById('customer').value || 'Cliente' : 'Cliente';
  const surveyDate = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
  const fileName = `Sunvolt_Survey_${customerName}_${surveyDate}`;
  
  // Aguarda meio segundo para garantir que as seções abriram
  setTimeout(function() {
    // Força ajuste de cores para impressão
    document.body.style.webkitPrintColorAdjust = 'exact';
    document.body.style.colorAdjust = 'exact';
    document.body.style.printColorAdjust = 'exact';
    
    // Mostra instrução
    showNotification('Abrindo diálogo de impressão...');
    
    // Aguarda mais um pouco e abre a impressão
    setTimeout(function() {
      console.log('📄 Abrindo diálogo de impressão');
      window.print();
    }, 300);
    
  }, 500);
};

// FUNÇÃO ALTERNATIVA CASO A PRINCIPAL NÃO FUNCIONE
window.printReport = function() {
  console.log('🖨️ Método alternativo de impressão...');
  window.generatePDF(); // Chama a função principal
};
