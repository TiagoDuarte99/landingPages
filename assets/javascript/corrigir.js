

const buttonsSection = document.createElement('div');
buttonsSection.className = 'buttons-section';
rowDiv.appendChild(buttonsSection);

const deleteButton = document.createElement('button');
deleteButton.innerHTML = 'Apagar Seção';
deleteButton.className = 'delete-button';
buttonsSection.appendChild(deleteButton);
const sectionToDelete = sectionCount;
// Adiciona evento de clique ao botão para apagar a seção
deleteButton.addEventListener('click', () => {
  openConfirmationModal(sectionToDelete);
});

// Cria o dropdown do Bootstrap para selecionar a cor de fundo
const dropdownDiv = document.createElement('div');
dropdownDiv.className = 'dropdown';
buttonsSection.appendChild(dropdownDiv);

const dropdownButton = document.createElement('button');
dropdownButton.className = 'btn btn-secondary dropdown-toggle';
dropdownButton.setAttribute('type', 'button');
dropdownButton.setAttribute('id', `dropdownMenuButton-${sectionCount}`);
dropdownButton.setAttribute('data-toggle', 'dropdown');
dropdownButton.setAttribute('aria-haspopup', 'true');
dropdownButton.setAttribute('aria-expanded', 'false');
dropdownButton.innerHTML = 'Escolha a cor de fundo';
dropdownDiv.appendChild(dropdownButton);

const dropdownMenu = document.createElement('div');
dropdownMenu.className = 'dropdown-menu';
dropdownMenu.setAttribute('aria-labelledby', `dropdownMenuButton-${sectionCount}`);
dropdownDiv.appendChild(dropdownMenu);

for (const [colorName, colorValue] of Object.entries(colors)) {
  const colorItem = document.createElement('a');
  colorItem.className = 'dropdown-item';
  colorItem.innerHTML = colorName;

  // Usar uma função de fábrica para capturar o contexto correto
  colorItem.addEventListener('click', (function (colorValue, sectionContainer) {
    return function (event) {
      event.preventDefault();
      sectionContainer.style.backgroundColor = colorValue;
    };
  })(colorValue, sectionContainer));

  dropdownMenu.appendChild(colorItem);
}

// Adiciona o botão para abrir o modal
const modalButton = document.createElement('button');
modalButton.setAttribute('type', 'button');
modalButton.className = 'btn btn-primary';
modalButton.setAttribute('data-toggle', 'modal');
modalButton.setAttribute('data-target', '#exampleModal');
modalButton.setAttribute('data-section-id', sectionContainer.id);
modalButton.innerHTML = 'Add linha';
buttonsSection.appendChild(modalButton);
// TODO ate aqui ta igual ao add poderei fazer uma função para reduzir codigo
