const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXV0aHMvbG9naW4iLCJpYXQiOjE3MTk3MzY5MTksImV4cCI6MTcxOTc0MDUxOSwibmJmIjoxNzE5NzM2OTE5LCJqdGkiOiJhU3BwVWVYdHd3SXhyRGVxIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.wI7WZNLMmpSsravfbK-kC9h0xlDn8cg9Tcfx3YZ_Clg';

const urlBase = 'http://localhost:8000/';/*https://landingpages.svr6.appsfarma.com/  */
const namePage = 'TesteCKEDITOR2'

let editorCount = 0;
let sectionCount = 0;
let sectionId;
let editors = {};
/* let editorsArray = {}; */
let sectionContainer;
let pointCounter = 0;
let pointListCounter = 0;
let contactForm = 0;

const colors = {
  'primary': '#101980',
  'secundary': '#31a1fc',
  'secundary-light': '#e4f2ff',
  'white': '#f6f5f5',
  'grey': '#838EA0',
  'grey-light': '#fbf8f8',
  'header': '#ffffff',
  'editor': '#bcffac'
};

document.addEventListener('DOMContentLoaded', async function () {
  await data().then(dataFromBackend => {
    console.log(dataFromBackend)
    if (dataFromBackend && dataFromBackend.success && dataFromBackend.data.length > 0) {
      const contentData = dataFromBackend.data[0].content;
      const contentPoints = dataFromBackend.data[0].contentPoints;
      const contentPointsString = JSON.parse(contentPoints);

      contentData.forEach((item, index) => {
        getSection(item.type, item.elements, item.backgroundColor, contentPointsString);
      });

      const title = document.getElementById('pageTitle');
      const description = document.getElementById('pageDescription');
      const metaTitle = document.getElementById('metaTitle');
      title.value = dataFromBackend.data[0].title;
      description.value = dataFromBackend.data[0].description;
      metaTitle.value = dataFromBackend.data[0].metaTitle;
    }
  });

  const button = document.getElementById('buttons-edit');
  const initialOffset = button.offsetTop;

  window.addEventListener('scroll', function () {
    if (window.scrollY > initialOffset) {
      button.classList.add('fixed-buttons-edit');
    } else {
      button.classList.remove('fixed-buttons-edit');
    }
  });

  const textarea = document.getElementById('pageDescription');
  const charCount = document.getElementById('charCount');

  textarea.addEventListener('input', function () {
    const currentLength = textarea.value.length;
    charCount.textContent = `${currentLength}/200 caracteres`;
  });

  // TYPE 6 Opçoes
  const sectionTypeRadios = document.querySelectorAll('input[name="sectionType"]');
  const additionalOptions = document.getElementById('additionalOptions');
  const customFile = document.getElementById('custom-file');
  const imageInput = document.getElementById('imageInput');
  const addSectionButton = document.getElementById('add-section-button');


  let imgApi = '';
  imageInput.addEventListener('change', async function (event) {
    const file = event.target.files[0];

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${urlBase}upload`, {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar arquivo.');
      }

      const responseData = await response.json();
      console.log('Resposta da API:', responseData);
      imgApi = responseData;
      const customFileLabel = document.getElementById('file-label');
      customFileLabel.textContent = responseData.url;
      checkImageSelected();
    } catch (error) {
      console.error('Erro:', error);
    }
  });

  // Adiciona um ouvinte de evento para mudanças no grupo de rádios
  sectionTypeRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (this.value === 'type6' && this.checked) {
        additionalOptions.style.display = 'block';
        customFile.style.display = 'block';
        checkImageSelected();
      } else {
        additionalOptions.style.display = 'none';
        customFile.style.display = 'none';
      }
    });
  });

  function checkImageSelected() {
    const file = imageInput.files[0];
    if (file) {
      addSectionButton.disabled = false;
    } else {
      addSectionButton.disabled = true;
    }
  }

  document.getElementById('add-section-button').addEventListener('click', () => {
    additionalOptions.style.display = 'none';
    const sectionType = document.querySelector('input[name="sectionType"]:checked');
    if (sectionType) {
      if (sectionType.value === 'type5' && contactForm === 1) {
        alert('Já tem um formulario de contacto');
      } else {
        if (sectionType.value === 'type6') {
          let sectionTypeValue = sectionType.value;
          const alignmentSelect = document.getElementById('alignment');
          const alignmentValue = alignmentSelect.value;
          console.log(alignmentValue)
          sectionTypeValue = sectionTypeValue + '-' + alignmentValue
          addNewSection(sectionTypeValue, imgApi);
        } else {
          const sectionTypeValue = sectionType.value;
          addNewSection(sectionTypeValue);
        }
      }
    } else {
      console.error('Nenhum tipo de seção selecionado.');
    }
  });

  document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', () => {
      const buttonId = button.id;
      const sectionId = buttonId.split('-')[1];
      openConfirmationModal(sectionId);
    });
  });

});

function openConfirmationModal(sectionId) {
  const modalContent = `
    <div class="modal fade" id="deleteModal-${sectionId}" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Confirmar Exclusão Secção ${sectionId}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Deseja realmente apagar a seção ${sectionId}?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" id="confirmDelete-${sectionId}">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalContent);

  $(`#deleteModal-${sectionId}`).modal('show');

  $(`#confirmDelete-${sectionId}`).click(function () {
    const sectionToDelete = document.getElementById(`section-${sectionId}`);
    if (sectionToDelete) {
      const editorsToDelete = sectionToDelete.querySelectorAll('.editable-section');
      const editorIdsToDelete = [];

      editorsToDelete.forEach(editor => {
        editorIdsToDelete.push(editor.id);
      });

      // Remover editores do objeto 'editors'
      editorIdsToDelete.forEach(editorId => {
        if (editors.hasOwnProperty(editorId)) {
          delete editors[editorId];
        }
      });

      const dataTypeValue = sectionToDelete.dataset.type;
      if (dataTypeValue === 'type5') {
        contactForm = 0;
      }

      sectionToDelete.remove();

      const editableSections = document.querySelectorAll('.editable-section');
      const newEditors = {};
      let i = 0;

      editableSections.forEach((section) => {
        if (!section.classList.contains('imgPoints')) {
          const newId = `section${i++}`;
          const oldId = section.id;
          section.id = newId;

          if (editors.hasOwnProperty(oldId)) {
            editors[oldId].sourceElement.id = newId;
            newEditors[newId] = editors[oldId];
          }
        }
      });

      i = 0;
      editableSections.forEach((section) => {
        if (!section.classList.contains('imgPoints')) {
          const newId = `section${i++}`;
          if (newEditors.hasOwnProperty(newId)) {
            newEditors[newId].sourceElement.id = newId;
          }
        }
      });
      console.log(editors)
      const infoPointerElements = [];
      Object.keys(editors).forEach(key => {
        if (key.startsWith('info-pointer')) {
          infoPointerElements.push(editors[key]);
        }
      });
      console.log(infoPointerElements)

      // Substituir o objeto 'editors' pelo novo objeto com IDs atualizados
      editors = {
        ...newEditors, // Espalha os elementos de 'newEditors'
        ...infoPointerElements.reduce((acc, element) => {
          console.log(element,     acc)
          acc[element.sourceElement.id] = element;
          return acc;
        }, {})
      };
      console.log(editors)
    }
    $(`#deleteModal-${sectionId}`).modal('hide');
  });
}

function addEditor(sectionId) {
  const element = document.querySelector(`#${sectionId}`);
  ClassicEditor
    .create(element, {
      extraPlugins: [CustomUploadAdapterPlugin]
    })
    .then(editor => {
      editors[sectionId] = editor;
      document.getElementById('close-modal').click();
      document.querySelectorAll('input[name="sectionType"]').forEach(radioButton => {
        radioButton.checked = false;
      });
    })
    .catch(error => {
      console.error('Error initializing editor for sectionId:', sectionId, error);
    });
}

// Plugin para Custom Upload Adapter usando axios
function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader, editor);
  };
}

// Classe para o adaptador de upload
class MyUploadAdapter {
  constructor(loader, editor) {
    this.loader = loader;
    this.editor = editor;
  }
  //TODO erro ao carregar imagem
  upload() {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("pageName", namePage);

        axios.post(`${urlBase}upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
          withCredentials: false,
        })
          .then(response => {
            if (response.data && response.data.url) {
              const pictureHtml = `
                                  <picture>
                                    <source srcset="${response.data.srcset['320w']}" media="(max-width: 320px)">
                                    <source srcset="${response.data.srcset['480w']}" media="(max-width: 480px)">
                                    <source srcset="${response.data.srcset['800w']}" media="(max-width: 800px)">
                                    <img src="${response.data.url}" alt="Imagem carregada" loading="lazy">
                                  </picture>
                                `;
              const viewFragment = this.editor.data.processor.toView(pictureHtml);
              const modelFragment = this.editor.data.toModel(viewFragment);
              this.editor.model.insertContent(modelFragment);
              console.log(this.editor.getData());

              resolve({
                default: response.data.url
              });
            } else {
              reject(response.data.message || 'Upload failed');
            }
          })
          .catch(error => {
            reject(error.message || 'Upload failed');
          });
      }));
  }

  abort() {
    // Método para abortar a requisição, se necessário
  }
}

function getSection(type, sectionItems, backgroundColor, points, position = null) {

  sectionContainer = document.createElement('section');
  sectionContainer.dataset.type = type;
  sectionContainer.id = `section-${sectionCount}`;
  sectionContainer.style.backgroundColor = backgroundColor;

  const containerDiv = document.createElement('div');
  containerDiv.className = 'container';
  sectionContainer.appendChild(containerDiv);

  const rowDiv = document.createElement('div');
  rowDiv.className = 'row';
  containerDiv.appendChild(rowDiv);

  const infoDiv = document.createElement('div');
  infoDiv.className = 'info-div';
  rowDiv.appendChild(infoDiv);

  const h2 = document.createElement('h2');
  h2.innerHTML = `Section ${sectionCount}`;
  infoDiv.appendChild(h2);

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'Apagar Seção';
  deleteButton.className = 'delete-button';
  deleteButton.id = `button-${sectionCount}`;
  infoDiv.appendChild(deleteButton);

  // Cria o dropdown do Bootstrap para selecionar a cor de fundo
  const dropdownDiv = document.createElement('div');
  dropdownDiv.className = 'dropdown';
  infoDiv.appendChild(dropdownDiv);

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
    /*      colorItem.href = '#'; */
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

  sectionCount++;
  let count = 0;
  let countType6 = 0;

  sectionItems.forEach((item, index) => {
    const div = document.createElement('div');
    if (type === 'type1') {
      div.className = `editable-section col-12 mt-4`;
      const p = document.createElement('h6');
      p.innerHTML = `100% da div`;
      infoDiv.appendChild(p);
    } else if (type === 'type2') {
      div.className = `editable-section col-md-8 mt-4`;
      const p = document.createElement('h6');
      p.innerHTML = `75% da div`;
      infoDiv.appendChild(p);
    } else if (type === 'type3') {
      div.className = `editable-section col-md-6 mt-4`;
      const p = document.createElement('h6');
      if (count === 0) {
        p.innerHTML = `Left section`;
        count++;
      } else if (count === 1) {
        p.innerHTML = `Right section`;
        count = 0;
      }
      infoDiv.appendChild(p);
    } else if (type === 'type4') {
      div.className = `editable-section col-md-4 mt-4`;
      const p = document.createElement('h6');
      if (count === 0) {
        p.innerHTML = `Left section`;
        count++;
      } else if (count === 1) {
        p.innerHTML = `Center section`;
        count++;
      } else if (count === 2) {
        p.innerHTML = `Right section`;
        count = 0;
      }
      infoDiv.appendChild(p);
    } if (type === 'type5') {
      contactForm = 1;
      div.className = `editable-section col-12 mt-4`;
      const p = document.createElement('h6');
      p.innerHTML = `Contact Form`;
      infoDiv.appendChild(p);
    } else if (type === 'type6-left' || type === 'type6-right') {
      div.className = `editable-section col-md-6 mt-4`;
      const p = document.createElement('h6');
      if (count === 0 && type === 'type6-left') {
        div.className += ` imgPoints`;
        p.innerHTML = `Left section`;
        count++;
      } else if (count === 1 && type === 'type6-left') {
        p.innerHTML = `Right section`;
        count = 0;
      } else if (count === 0 && type === 'type6-right') {
        p.innerHTML = `Left section`;
        count++;
      } else if (count === 1 && type === 'type6-right') {
        div.className += ` imgPoints`;
        p.innerHTML = `Right section`;
        count = 0;
      }
      infoDiv.appendChild(p);
    }
    sectionId = `section${editorCount}`;
    editorCount++;
    div.id = sectionId;

    if (type === 'type6-left' && countType6 === 0 || type === 'type6-right' && countType6 === 1) {
      const contentClass = document.createElement('div');
      contentClass.className = 'content';
      contentClass.innerHTML = item.data;
      div.appendChild(contentClass);
      countType6++;
    } else if (type === 'type6-right' && countType6 === 0) {
      div.innerHTML = item.data;
      countType6++;
    } else {
      div.innerHTML = item.data;
      countType6 = 0;
    }

    infoDiv.appendChild(div);
  });

  if (position !== null && position < document.getElementById('editor-container').children.length) {
    document.getElementById('editor-container').insertBefore(sectionContainer, document.getElementById('editor-container').children[position]);
  } else {
    document.getElementById('editor-container').appendChild(sectionContainer);
  }
  console.log()

  sectionItems.forEach((item, index) => {
    if (points.hasOwnProperty(item.id)) {
      const infoPoints = points[item.id].infoPoints;
      infoPoints.forEach(point => {
        // Cria uma nova div
        const newDiv = document.createElement('div');
        newDiv.classList.add('cd-more-info');
        newDiv.classList.add('editable-sectionPoints');
        newDiv.id = point.id;
        newDiv.innerHTML = point.data;  // Se precisar que inicialmente esteja escondido

        // Cria e adiciona o botão de fechar
        const closeButton = document.createElement('button');
        closeButton.classList.add('btn-close-info');
        closeButton.innerHTML = '<i class="fa-solid fa-close"></i>';
        newDiv.appendChild(closeButton);

        // Identifica o elemento DOM correspondente ao item.id
        const itemElement = document.querySelector(`#${item.id}`);
        if (itemElement) {
          // Adiciona a nova div ao item atual
          itemElement.appendChild(newDiv);

          // Chama a função addEditor para adicionar o editor na div
          addEditor(newDiv.id);
        } else {
          console.error('Element not found for item.id:', item.id);
        }
      });
    }


    if (type === 'type6-left' && countType6 === 0 || type === 'type6-right' && countType6 === 0) {
      countType6++
    } else if (type === 'type6-right' && countType6 === 0) {
      countType6++
      pointListCounter++;
      const divId = `section${editorCount - sectionItems.length + index}`;
      addEditor(divId);
    } else {
      const divId = `section${editorCount - sectionItems.length + index}`;
      addEditor(divId);
      countType6 = 0;
    }
  });

}

function addNewSection(type, imgApi, position = null) {
  console.log(pointListCounter)
  console.log(imgApi);
  console.log(editorCount)
  sectionContainer = document.createElement('section');
  sectionContainer.dataset.type = type;
  sectionContainer.id = `section-${sectionCount}`;

  const containerDiv = document.createElement('div');
  containerDiv.className = 'container';
  sectionContainer.appendChild(containerDiv);

  const rowDiv = document.createElement('div');
  rowDiv.className = 'row';
  containerDiv.appendChild(rowDiv);

  const infoDiv = document.createElement('div');
  infoDiv.className = 'info-div';
  rowDiv.appendChild(infoDiv);

  sectionId = `section${editorCount}`;
  editorCount++;
  content = 'Insira o texto';

  const h2 = document.createElement('h2');
  h2.innerHTML = `Section ${sectionCount}`;
  infoDiv.appendChild(h2);

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'Apagar Seção';
  deleteButton.className = 'delete-button';
  infoDiv.appendChild(deleteButton);
  const sectionToDelete = sectionCount;
  // Adiciona evento de clique ao botão para apagar a seção
  deleteButton.addEventListener('click', () => {
    openConfirmationModal(sectionToDelete);
  });



  // Cria o dropdown do Bootstrap para selecionar a cor de fundo
  const dropdownDiv = document.createElement('div');
  dropdownDiv.className = 'dropdown';
  infoDiv.appendChild(dropdownDiv);

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
    /*      colorItem.href = '#'; */
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

  sectionCount++;

  if (type === 'type1' || type === 'type2') {
    if (type === 'type1') {
      const p = document.createElement('h6');
      p.innerHTML = `100% da div`;
      infoDiv.appendChild(p);
    } else if (type === 'type2') {
      const p = document.createElement('h6');
      p.innerHTML = `75% da div`;
      infoDiv.appendChild(p);
    }

    const div = document.createElement('div');
    div.className = 'editable-section';
    div.id = sectionId;
    div.innerHTML = content;
    infoDiv.appendChild(div);

    // Adicionar a sectionContainer ao editor-container
    if (position !== null && position < document.getElementById('editor-container').children.length) {
      document.getElementById('editor-container').insertBefore(sectionContainer, document.getElementById('editor-container').children[position]);
    } else {
      document.getElementById('editor-container').appendChild(sectionContainer);
    }

    addEditor(div.id);
  } else if (type === 'type3') {
    const pLeft = document.createElement('h6');
    pLeft.innerHTML = `Left section`;
    infoDiv.appendChild(pLeft);

    const leftDiv = document.createElement('div');
    leftDiv.className = 'editable-section';
    leftDiv.id = sectionId;
    leftDiv.innerHTML = content;
    infoDiv.appendChild(leftDiv);

    sectionId = `section${editorCount}`;
    editorCount++;

    const pRight = document.createElement('h6');
    pRight.innerHTML = `Right section`;
    infoDiv.appendChild(pRight);

    const rightDiv = document.createElement('div');
    rightDiv.className = 'editable-section';
    rightDiv.id = sectionId;
    rightDiv.innerHTML = content;
    infoDiv.appendChild(rightDiv);

    if (position !== null && position < document.getElementById('editor-container').children.length) {
      document.getElementById('editor-container').insertBefore(sectionContainer, document.getElementById('editor-container').children[position]);
    } else {
      document.getElementById('editor-container').appendChild(sectionContainer);
    }

    // Chamar addEditor para ambas as divs internas
    addEditor(leftDiv.id);
    addEditor(rightDiv.id);
  } else if (type === 'type4') {
    const pLeft = document.createElement('h6');
    pLeft.innerHTML = `Left section`;
    infoDiv.appendChild(pLeft);

    const leftDiv = document.createElement('div');
    leftDiv.className = 'editable-section';
    leftDiv.id = sectionId;
    leftDiv.innerHTML = content;
    infoDiv.appendChild(leftDiv);

    sectionId = `section${editorCount}`;
    editorCount++;

    const pCenter = document.createElement('h6');
    pCenter.innerHTML = `Center section`;
    infoDiv.appendChild(pCenter);

    const centerDiv = document.createElement('div');
    centerDiv.className = 'editable-section';
    centerDiv.id = sectionId;
    centerDiv.innerHTML = content;
    infoDiv.appendChild(centerDiv);

    sectionId = `section${editorCount}`;
    editorCount++;

    const pRight = document.createElement('h6');
    pRight.innerHTML = `Right section`;
    infoDiv.appendChild(pRight);

    const rightDiv = document.createElement('div');
    rightDiv.className = 'editable-section';
    rightDiv.id = sectionId;
    rightDiv.innerHTML = content;
    infoDiv.appendChild(rightDiv);

    if (position !== null && position < document.getElementById('editor-container').children.length) {
      document.getElementById('editor-container').insertBefore(sectionContainer, document.getElementById('editor-container').children[position]);
    } else {
      document.getElementById('editor-container').appendChild(sectionContainer);
    }

    addEditor(leftDiv.id);
    addEditor(centerDiv.id);
    addEditor(rightDiv.id);
  } if (type === 'type5') {
    contactForm = 1;
    const p = document.createElement('p');
    p.innerHTML = `Contact Form`;
    infoDiv.appendChild(p);

    const div = document.createElement('div');
    div.className = 'editable-section';
    div.id = sectionId;
    div.innerHTML = content;
    infoDiv.appendChild(div);

    // Adicionar a sectionContainer ao editor-container
    if (position !== null && position < document.getElementById('editor-container').children.length) {
      document.getElementById('editor-container').insertBefore(sectionContainer, document.getElementById('editor-container').children[position]);
    } else {
      document.getElementById('editor-container').appendChild(sectionContainer);
    }

    addEditor(div.id);
  } if (type === 'type6-left' || type === 'type6-right') {
    const pLeft = document.createElement('h6');
    pLeft.innerHTML = `Left section`;
    infoDiv.appendChild(pLeft);

    const leftDiv = document.createElement('div');
    const rightDiv = document.createElement('div');

    const pRight = document.createElement('h6');
    pRight.innerHTML = `Right section`;
    infoDiv.appendChild(pRight);

    leftDiv.className = 'editable-section';
    leftDiv.id = sectionId;
    sectionId = `section${editorCount}`;
    editorCount++;
    rightDiv.className = 'editable-section';
    rightDiv.id = sectionId;


    infoDiv.appendChild(leftDiv);
    infoDiv.appendChild(pRight);
    infoDiv.appendChild(rightDiv);

    if (position !== null && position < document.getElementById('editor-container').children.length) {
      document.getElementById('editor-container').insertBefore(sectionContainer, document.getElementById('editor-container').children[position]);
    } else {
      document.getElementById('editor-container').appendChild(sectionContainer);
    }

    const contentClass = document.createElement('div');
    contentClass.className = 'content';


    const pointList = `points-list${pointListCounter++}`;
    console.log(pointList)
    const ul = document.createElement('ul');
    ul.id = pointList;
    contentClass.appendChild(ul);

    if (type === 'type6-left') {
      leftDiv.className += ' imgPoints';
      const response = buildImg(imgApi, pointList)
      contentClass.appendChild(response);
      leftDiv.appendChild(contentClass);
      rightDiv.innerHTML = content;

      addEditor(rightDiv.id);
    } else if (type === 'type6-right') {
      rightDiv.className += ' imgPoints';
      const response = buildImg(imgApi, pointList)
      contentClass.appendChild(response);
      rightDiv.appendChild(contentClass);
      leftDiv.innerHTML = content;

      addEditor(leftDiv.id);
    }
  }


  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
}

function imageClickHandler(event, pointList) {
  const pointList2 = document.getElementById(pointList);
  const image = event.target;

  const parentSection = image.closest('.editable-section');
  if (parentSection) {
    const rect = image.getBoundingClientRect();

    // Calcula as coordenadas relativas do clique na imagem
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calcula as coordenadas em porcentagem
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    console.log(`X: ${xPercent}%, Y: ${yPercent}%`);

    // Cria um novo ponto
    const pointId = `point-${pointCounter}`;
    const point = document.createElement('li');
    point.classList.add('cd-single-point');
    point.id = pointId;
    point.style.left = `${xPercent}%`;
    point.style.top = `${yPercent}%`;

    const pInfoPointer = document.createElement('p');
    pInfoPointer.innerHTML = `Texto pointer ${pointCounter}`;

    const divInfoPointer = document.createElement('div');
    const infoPointerId = `info-pointer-${pointCounter}`;
    divInfoPointer.className = 'editable-sectionPoints';
    divInfoPointer.id = infoPointerId;

    // Cria o link dentro do ponto
    const link = document.createElement('a');
    link.classList.add('cd-img-replace', 'info');
    link.href = "#0";
    link.setAttribute('data-target', infoPointerId);
    link.setAttribute('aria-label', 'Más información');
    link.innerHTML = `<i class="fa-solid fa-info"></i>${pointCounter}`;
    link.style.cursor = 'pointer';
    point.appendChild(link);

    // Cria a animação de pulsação
    const pulse = document.createElement('div');
    pulse.classList.add('cd-pulse');
    point.appendChild(pulse);
    pointCounter++;
    // Adiciona o ponto à lista
    console.log(`Adding point to ${pointList}`);
    pointList2.appendChild(point);
    parentSection.appendChild(pInfoPointer);
    parentSection.appendChild(divInfoPointer);


    addEditor(divInfoPointer.id);
  } else {
    console.log('Parent section not found');
  }
}

function buildImg(imgApi, pointList) {
  const pictureElement = document.createElement('picture');

  Object.keys(imgApi.srcset).forEach(size => {
    const sourceElement = document.createElement('source');
    sourceElement.setAttribute('srcset', imgApi.srcset[size]);
    sourceElement.setAttribute('media', `(max-width: ${size}px)`);
    pictureElement.appendChild(sourceElement);
  });

  const imgElement = document.createElement('img');
  imgElement.setAttribute('src', imgApi.url);
  imgElement.setAttribute('alt', 'Imagem carregada');
  pictureElement.appendChild(imgElement);

  imgElement.addEventListener('click', (event) => imageClickHandler(event, pointList));

  return pictureElement;
}

async function data() {
  try {
    let url = `${urlBase}pages/${namePage}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (data.success) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

let saveBt = document.getElementById('save-button');
saveBt.addEventListener('click', async function () {
  let baseUrl = `${urlBase}pages/${namePage}/`;
  try {
    const content = {};
    const contentPoints = {};
    let sectionIndex = 0;
    let sectionIndexPoints = 0;

    const sections = document.getElementById('editor-container').querySelectorAll('section');
    const title = document.getElementById('pageTitle').value;
    const description = document.getElementById('pageDescription').value;
    const metaTitle = document.getElementById('metaTitle').value;


    sections.forEach((section) => {
      const sectionType = section.dataset.type;
      const sectionColor = section.style.backgroundColor || '#fbf8f8';
      const editableSections = section.querySelectorAll('.editable-section');

      content[sectionIndex] = {
        type: sectionType,
        backgroundColor: sectionColor,
        elements: []
      };

      editableSections.forEach((editableSection) => {
        let editorData;

        const editorId = editableSection.id;
        if (editableSection.classList.contains('imgPoints')) {
          const contentHtml = editableSection.querySelector('.content').innerHTML;
          editorData = contentHtml;

          const editorsPoints = editableSection.querySelectorAll('.editable-sectionPoints');
          const editorsPointsArray = Array.from(editorsPoints);

          // Inicialize contentPoints usando editorId em vez de sectionIndex
          contentPoints[editorId] = {
            infoPoints: []
          };
          console.log(editorsPoints)
          editorsPointsArray.forEach((editorPoint) => {
            console.log('entrei aquui')
            const editorPointId = editorPoint.id;
            const editorDataPoints = editors[editorPointId].getData();

            contentPoints[editorId].infoPoints.push({
              id: editorPointId,
              data: editorDataPoints
            });
          });
        } else {
          console.log(editors[editorId])
          editorData = editors[editorId].getData();
        }

        content[sectionIndex].elements.push({
          id: editorId,
          data: editorData
        });
      });

      sectionIndex++;
    });
    console.log(contentPoints)

    const section = "TESTEW";

    const sectionUrl = baseUrl + section;
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const requestBody = {
      namePage: namePage,
      section: section,
      content: content,
      contentPoints: contentPoints,
      title: title,
      description: description,
      metaTitle: metaTitle
    };

    const response = await fetch(sectionUrl, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      window.location.href = 'index.html';
      /*       console.log(`Dados da seção ${section} enviados com sucesso!`);
            console.log(response) */
    } else {
      console.error(`Erro ao enviar dados da seção ${section}. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Erro ao salvar dados do editor`, error);
  }

});

// Initialize Sortable
new Sortable(document.getElementById('editor-container'), {
  animation: 150,
  onEnd: function (evt) {
    reorderSections(evt.oldIndex, evt.newIndex);
  }
});

function reorderSections(oldIndex, newIndex) {
  const editorContainer = document.getElementById('editor-container');
  const sections = editorContainer.querySelectorAll('section')

  const movedSection = sections[oldIndex];
  if (oldIndex < newIndex) {
    for (let i = oldIndex; i < newIndex; i++) {
      sections[i] = sections[i + 1];
    }
  } else {
    for (let i = oldIndex; i > newIndex; i--) {
      sections[i] = sections[i - 1];
    }
  }
  sections[newIndex] = movedSection;

}



