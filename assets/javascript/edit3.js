

const urlBase = 'http://localhost:8000/';/*https://landingpages.svr6.appsfarma.com/  */
let namePage = ''

let editorCount = 0;
let sectionCount = 0;
let sectionId;
let editors = {};
let sectionContainer;
let pointCounter = 0;
let pointListCounter = 0;
let contactForm = 0;
let uploadDataStore = {};

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

const namePageLogin = document.getElementById('namePageLogin');
const loginForm = document.getElementById('loginForm');
const buttonsEdit = document.getElementById('buttons-edit');
const editorContainer = document.getElementById('editor-container');
const titleDescriptionId = document.getElementById('title-description-id');
const titleEdit = document.getElementById('title-edit');
const titleH1 = document.getElementById('titleH1');

const namePageDropdown = document.getElementById('namePage');
const messageNamePage = document.getElementById('messageNamePage');
const buttonNamePage = document.getElementById('buttonNamePage');

const newPageNameInput = document.getElementById('newPageName');
const messageNewPage = document.getElementById('messageNewPage');
const buttonNewPage = document.getElementById('buttonNewPage');

document.addEventListener('DOMContentLoaded', async function () {
  const storedToken = localStorage.getItem('token');
  namePage = localStorage.getItem('namePage');
  const token = localStorage.getItem('token');

  if (storedToken) {
    namePageLogin.style.display = 'block';
    loginForm.style.display = 'none';
    namePageDropdown.innerHTML = '<option value="" disabled selected>Selecione uma página</option>';
    fetchNamePages()
    checkRefreshToken();
  }
  if (namePage) {
    namePageLogin.style.display = 'none';


    buttonsEdit.style.display = 'flex';
    editorContainer.style.display = 'block';
    titleDescriptionId.style.display = 'block';

    await data(namePage).then(dataFromBackend => {
      console.log(dataFromBackend)
      if (dataFromBackend && dataFromBackend.success && dataFromBackend.data.length > 0) {

        const contentData = dataFromBackend.data[0].content;
        const contentPoints = dataFromBackend.data[0].contentPoints;
        const contentPointsString = JSON.parse(contentPoints);

        if (Array.isArray(contentData) && contentData.length > 0) {
          contentData.forEach((item, index) => {
            getSection(item.elements, item.backgroundColor, contentPointsString);
          });
        }

        namePageLogin.style.display = 'none';

        buttonsEdit.style.display = 'flex';
        editorContainer.style.display = 'block';
        titleDescriptionId.style.display = 'block';
        titleEdit.style.display = 'block';
        titleH1.innerText = `Editar Página ${namePage}`;

        const title = document.getElementById('pageTitle');
        const description = document.getElementById('pageDescription');
        const metaTitle = document.getElementById('metaTitle');
        title.value = dataFromBackend.data[0].title;
        description.value = dataFromBackend.data[0].description;
        metaTitle.value = dataFromBackend.data[0].metaTitle;
      }

    });
  }

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
    console.log(token)

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append("pageName", namePage);

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

  document.getElementById('button-add-section').addEventListener('click', () => {
    addNewSection();
  });

  /*  Adiconar secção ao botao do modal*/
  $('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var sectionId = button.data('section-id');
    var modal = $(this);

    modal.find('#add-section-button').attr('data-section-id', sectionId);
  });

  /*  Adiconar row a secção */
  $('#add-section-button').on('click', function () {
    position = null;
    additionalOptions.style.display = 'none';
    var sectionId = $(this).attr('data-section-id');
    var type = $('input[name="sectionType"]:checked').val();


    if (type === 'type5' && contactForm === 1) {
      alert('Já tem um formulário de contacto');
    }
    else {
      if (type === 'type6') {
        const alignmentSelect = document.getElementById('alignment');
        const alignmentValue = alignmentSelect.value;
        type = type + '-' + alignmentValue;
      }
      const section = document.getElementById(sectionId)
      const containerDiv = section.querySelector('.container');

      const rowDiv = document.createElement('div');
      rowDiv.className = 'row';
      containerDiv.appendChild(rowDiv);

      const infoDiv = document.createElement('div');
      infoDiv.className = 'info-div';
      infoDiv.dataset.type = type;
      rowDiv.appendChild(infoDiv);

      const deleteButton = createButtonDeleteRow(rowDiv)

      // Adicionar o botão de exclusão ao infoDiv
      infoDiv.appendChild(deleteButton);

      sectionId = `section${editorCount}`;
      editorCount++;
      content = 'Insira o texto';

      if (type === 'type1' || type === 'type2') {
        const divInfo = document.createElement('div');
        divInfo.className = 'type-dropdown';
        const p = document.createElement('h3');
        if (type === 'type1') {
          p.innerHTML = `100% da div`;
        } else if (type === 'type2') {
          p.innerHTML = `75% da div`;
        }
        divInfo.appendChild(p)
        const selectContainer = createDropdownAos(sectionId);
        divInfo.appendChild(selectContainer);
        infoDiv.appendChild(divInfo);

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
        const divInfoLeft = document.createElement('div');
        divInfoLeft.className = 'type-dropdown';
        const pLeft = document.createElement('h3');
        pLeft.innerHTML = `Left section`;
        divInfoLeft.appendChild(pLeft)
        const selectContainerLeft = createDropdownAos(sectionId);
        divInfoLeft.appendChild(selectContainerLeft);
        infoDiv.appendChild(divInfoLeft);

        const leftDiv = document.createElement('div');
        leftDiv.className = 'editable-section';
        leftDiv.id = sectionId;
        leftDiv.innerHTML = content;
        infoDiv.appendChild(leftDiv);

        sectionId = `section${editorCount}`;
        editorCount++;

        const divInfoRight = document.createElement('div');
        divInfoRight.className = 'type-dropdown';
        const pRight = document.createElement('h3');
        pRight.innerHTML = `Right section`;
        divInfoRight.appendChild(pRight)
        const selectContainerRight = createDropdownAos(sectionId);
        divInfoRight.appendChild(selectContainerRight);
        infoDiv.appendChild(divInfoRight);

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

        const divInfoLeft = document.createElement('div');
        divInfoLeft.className = 'type-dropdown';
        const pLeft = document.createElement('h3');
        pLeft.innerHTML = `Left section`;
        divInfoLeft.appendChild(pLeft)
        const selectContainerLeft = createDropdownAos(sectionId);
        divInfoLeft.appendChild(selectContainerLeft);
        infoDiv.appendChild(divInfoLeft);

        const leftDiv = document.createElement('div');
        leftDiv.className = 'editable-section';
        leftDiv.id = sectionId;
        leftDiv.innerHTML = content;
        infoDiv.appendChild(leftDiv);

        sectionId = `section${editorCount}`;
        editorCount++;


        const divInfoCenter = document.createElement('div');
        divInfoCenter.className = 'type-dropdown';
        const pCenter = document.createElement('h3');
        pCenter.innerHTML = `Center section`;
        divInfoCenter.appendChild(pCenter)
        const selectContainerCenter = createDropdownAos(sectionId);
        divInfoCenter.appendChild(selectContainerCenter);
        infoDiv.appendChild(divInfoCenter);

        const centerDiv = document.createElement('div');
        centerDiv.className = 'editable-section';
        centerDiv.id = sectionId;
        centerDiv.innerHTML = content;
        infoDiv.appendChild(centerDiv);

        sectionId = `section${editorCount}`;
        editorCount++;

        const divInfoRight = document.createElement('div');
        divInfoRight.className = 'type-dropdown';
        const pRight = document.createElement('h3');
        pRight.innerHTML = `Right section`;
        divInfoRight.appendChild(pRight)
        const selectContainerRight = createDropdownAos(sectionId);
        divInfoRight.appendChild(selectContainerRight);
        infoDiv.appendChild(divInfoRight);

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
      } else if (type === 'type5') {
        contactForm = 1;

        const divInfo = document.createElement('div');
        divInfo.className = 'type-dropdown';
        const p = document.createElement('h3');
        p.innerHTML = `Contact Form`;
        divInfo.appendChild(p)
        const selectContainer = createDropdownAos(sectionId);
        divInfo.appendChild(selectContainer);
        infoDiv.appendChild(divInfo);

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
      } else if (type === 'type6-left' || type === 'type6-right') {
        const divInfoLeft = document.createElement('div');
        divInfoLeft.className = 'type-dropdown';
        const pLeft = document.createElement('h3');
        pLeft.innerHTML = `Left section`;
        divInfoLeft.appendChild(pLeft)
        const selectContainerLeft = createDropdownAos(sectionId);
        divInfoLeft.appendChild(selectContainerLeft);
        infoDiv.appendChild(divInfoLeft);

        const leftDiv = document.createElement('div');
        const rightDiv = document.createElement('div');

        leftDiv.className = 'editable-section';
        leftDiv.id = sectionId;
        sectionId = `section${editorCount}`;
        editorCount++;
        rightDiv.className = 'editable-section';
        rightDiv.id = sectionId;

        const divInfoRight = document.createElement('div');
        divInfoRight.className = 'type-dropdown';
        const pRight = document.createElement('h3');
        pRight.innerHTML = `Right section`;
        divInfoRight.appendChild(pRight)
        const selectContainerRight = createDropdownAos(sectionId);
        divInfoRight.appendChild(selectContainerRight);

        infoDiv.appendChild(leftDiv);
        infoDiv.appendChild(divInfoRight);
        infoDiv.appendChild(rightDiv);

        if (position !== null && position < document.getElementById('editor-container').children.length) {
          document.getElementById('editor-container').insertBefore(sectionContainer, document.getElementById('editor-container').children[position]);
        } else {
          document.getElementById('editor-container').appendChild(sectionContainer);
        }

        const contentClass = document.createElement('div');
        contentClass.className = 'content';

        const pointList = `points-list${pointListCounter++}`;
        const ul = document.createElement('ul');
        ul.id = pointList;

        contentClass.appendChild(ul);

        if (type === 'type6-left') {
          leftDiv.className += ' imgPoints';
          const response = buildImg(imgApi, pointList)
          contentClass.appendChild(response);

          const divAlt = addAltImageType6()

          leftDiv.appendChild(divAlt);


          leftDiv.appendChild(contentClass);
          rightDiv.innerHTML = content;

          addEditor(rightDiv.id);
        } else if (type === 'type6-right') {
          rightDiv.className += ' imgPoints';
          const response = buildImg(imgApi, pointList)
          contentClass.appendChild(response);

          const divAlt = addAltImageType6()

          rightDiv.appendChild(divAlt);

          rightDiv.appendChild(contentClass);
          leftDiv.innerHTML = content;

          addEditor(leftDiv.id);
        }
      } else if (type === 'type7') {
        const divInfo = document.createElement('div');
        divInfo.className = 'type-dropdown';
        const p = document.createElement('h3');
        p.innerHTML = `Code div`;
        divInfo.appendChild(p)
        const selectContainer = createDropdownAos(sectionId);
        divInfo.appendChild(selectContainer);
        infoDiv.appendChild(divInfo);

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

      }
    }
    $('#exampleModal').modal('hide');
  });

  document.getElementById('confirmDeleteButton').addEventListener('click', () => {
    const rowDiv = $('#confirmationModal').data('rowDiv');
    deleteSection(rowDiv);

    $('#confirmationModal').modal('hide');
  });
});

function openConfirmationModalSectionDelete(sectionId) {
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
      const rowsToDelete = sectionToDelete.querySelectorAll('.row');
      console.log(sectionToDelete)
      console.log(rowsToDelete)

      rowsToDelete.forEach(row => {
        deleteSection(row);
      });

      sectionToDelete.remove();

      $(`#deleteModal-${sectionId}`).modal('hide');

    }
  });

}

function deleteSection(rowDiv) {
  const divType = rowDiv.querySelector('.info-div');

  if (divType) {
    const type = divType.dataset.type;

    if (type === 'type6-right' || type === 'type6-left') {
      const divImgPoints = divType.querySelector('.imgPoints');

      const pointNumbers = getPointNumbers(divImgPoints);

      const totalPoints = document.querySelectorAll('.cd-single-point');

      const totalInfoPoints = document.querySelectorAll('.cd-more-info');

      const infoPTotal = document.querySelectorAll('p[id^="p-info-pointer-"]');

      let ulNumberDelete = getUlNumberDelete(divImgPoints);

      updateUlIds(ulNumberDelete);

      const filteredTotalPoints = filterPoints(totalPoints, pointNumbers);
      const filteredTotalInfoPoints = filterPoints(totalInfoPoints, pointNumbers, 'info-pointer');
      const filteredTotalInfoP = filterPoints(infoPTotal, pointNumbers, 'p-info-pointer');

      pointNumbers.sort((a, b) => b - a);

      pointNumbers.forEach(number => {
        decrementIds(filteredTotalPoints, number, 'point');
        decrementInfoIds(filteredTotalInfoPoints, number, 'info-pointer');
        decrementPIds(filteredTotalInfoP, number, 'p-info-pointer');

        const idToDelete = `info-pointer-${number}`;

        reindexEditors(number);
      });
    }


    if (rowDiv) {
      rowDiv.remove();

      const totalPointsFinal = document.querySelectorAll('.cd-single-point');
      pointCounter = totalPointsFinal.length;

      if (type === 'type5') {
        contactForm = 0;
      }
      $('#confirmationModal').modal('hide');
    }
  }
}

function reindexEditors(pointerValue) {
  const idToDelete = `info-pointer-${pointerValue}`;
  const keysToReindex = [];

  Object.keys(editors).forEach(key => {
    const editorNumber = parseInt(key.replace('info-pointer-', ''), 10);

    if (key === idToDelete) {
      delete editors[key];
    } else if (editorNumber > pointerValue) {
      keysToReindex.push({ oldKey: key, newKey: `info-pointer-${editorNumber - 1}` });
    }
  });

  keysToReindex.sort((a, b) => {
    const aNumber = parseInt(a.oldKey.replace('info-pointer-', ''), 10);
    const bNumber = parseInt(b.oldKey.replace('info-pointer-', ''), 10);
    return aNumber - bNumber;
  });

  keysToReindex.forEach(({ oldKey, newKey }) => {
    console.log({ oldKey, newKey });
    editors[newKey] = editors[oldKey];
    delete editors[oldKey];
  });
}

function getPointNumbers(divImgPoints) {
  const points = divImgPoints.querySelectorAll('.cd-single-point');
  const pointNumbers = [];
  points.forEach(point => {
    const id = point.id;
    const number = parseInt(id.split('-')[1], 10);
    pointNumbers.push(number);
  });
  return pointNumbers;
}

function getUlNumberDelete(divImgPoints) {
  const ulElement = divImgPoints.querySelector('ul');

  if (ulElement) {
    const ulId = ulElement.id;
    const numberPart = ulId.replace('points-list', '');
    const ulNumberDelete = parseInt(numberPart, 10);
    return ulNumberDelete;
  }
  return 0;
}

function updateUlIds(ulNumberDelete) {
  const ulElements = document.querySelectorAll('ul[id^="points-list"]');
  ulElements.forEach(ul => {
    const ulId = ul.id;
    const numberPart = ulId.replace('points-list', '');
    const ulNumber = parseInt(numberPart, 10);

    if (ulNumber > ulNumberDelete) {
      const newUlNumber = ulNumber - 1;
      const newUlId = `points-list${newUlNumber}`;
      ul.id = newUlId;

      const imgElement = ul.closest('.content').querySelector('img');
      if (imgElement) {
        updateImageClickHandler(imgElement, newUlId);
      }
    }
  });
}

function filterPoints(totalPoints, pointNumbers, prefix = 'point') {
  return Array.from(totalPoints).filter(point => {
    const id = point.id;
    const number = parseInt(id.split('-')[1], 10);
    return !pointNumbers.includes(number);
  });
}

function decrementIds(pointsArray, threshold, idPrefix) {
  pointsArray.forEach(point => {
    const id = point.id;
    const number = parseInt(id.split('-')[1], 10);
    if (number > threshold) {
      const newPointNumber = number - 1;
      point.id = `${idPrefix}-${newPointNumber}`;
      const aPoint = point.querySelector('a');
      if (aPoint) {
        aPoint.dataset.target = `info-pointer-${newPointNumber}`;
        aPoint.innerHTML = `<i class="fa-solid fa-info"></i>${newPointNumber}`;
      }
    }
  });
}

function decrementInfoIds(infoPointsArray, threshold, idPrefix) {
  console.log('entrei no descontar infoIds')
  infoPointsArray.forEach(point => {
    const id = point.id;
    const number = parseInt(id.split('-')[2], 10);
    if (number > threshold) {
      const newPointNumber = number - 1;
      point.id = `${idPrefix}-${newPointNumber}`;
    }
  });
}

function decrementPIds(infoPArray, threshold, idPrefix) {
  infoPArray.forEach(p => {
    const id = p.id;
    const number = parseInt(id.split('-')[3], 10);
    if (number > threshold) {
      const newPointNumber = number - 1;
      p.id = `${idPrefix}-${newPointNumber}`;
      p.innerText = `Texto pointer info-pointer-${newPointNumber}`
    }
  });
}

function updateImageClickHandler(imgElement, pointList) {
  // Verifica se a imagem já possui um manipulador de clique
  if (imgElement.clickHandler) {
    imgElement.removeEventListener('click', imgElement.clickHandler);
  }

  // Cria um novo manipulador de clique
  const newHandler = (event) => {
    imageClickHandler(event, pointList);
  };

  // Adiciona o novo manipulador à imagem e define na propriedade personalizada
  imgElement.addEventListener('click', newHandler);
  imgElement.clickHandler = newHandler;

}

function createDropdownAos(sectionId, valueDropdown) {
  const selectContainer = document.createElement('div');
  selectContainer.className = 'dropdown';

  const button = document.createElement('button');
  button.className = 'btn btn-secondary dropdown-toggle';
  button.type = 'button';
  button.id = `dropdownMenuButton-${sectionId}`;
  button.setAttribute('data-toggle', 'dropdown');
  button.setAttribute('aria-haspopup', 'true');
  button.setAttribute('aria-expanded', 'false');
  // Inicialmente, não definimos o texto do botão aqui.

  const selectMenu = document.createElement('div');
  selectMenu.className = 'dropdown-menu';
  selectMenu.setAttribute('aria-labelledby', `dropdownMenuButton-${sectionId}`);

  const options = [
    'Escolha o tipo de animação', 'fade-up', 'fade-down', 'fade-right', 'fade-left', 'fade-up-right', 'fade-up-left',
    'fade-down-right', 'fade-down-left', 'flip-left', 'flip-right', 'flip-up', 'flip-down',
    'zoom-in', 'zoom-in-up', 'zoom-in-down', 'zoom-in-left', 'zoom-in-right', 'zoom-out',
    'zoom-out-up', 'zoom-out-down', 'zoom-out-right', 'zoom-out-left'
  ];

  options.forEach(optionText => {
    const option = document.createElement('a');
    option.className = 'dropdown-item';
    option.draggable = false;
    option.innerText = optionText;
    option.addEventListener('click', () => {
      button.innerText = optionText;
      button.value = optionText === 'Escolha o tipo de animação' ? null : optionText;
    });
    selectMenu.appendChild(option);
  });

  // Define o texto e o valor inicial do botão com base no valueDropdown
  if (valueDropdown && options.includes(valueDropdown)) {
    button.innerText = valueDropdown;
    button.value = valueDropdown;
  } else {
    button.innerText = 'Escolha o tipo de animação';
    button.value = null;
  }

  selectContainer.appendChild(button);
  selectContainer.appendChild(selectMenu);
  return selectContainer;
}

function addEditor(sectionId) {
  const element = document.querySelector(`#${sectionId}`);
  if (element) {
    ClassicEditor
      .create(element, {
        extraPlugins: [CustomUploadAdapterPlugin],
      })
      .then(editor => {
        const sectionId = editor.sourceElement.id;
        editors[sectionId] = editor;

        document.getElementById('close-modal').click();
        document.querySelectorAll('input[name="sectionType"]').forEach(radioButton => {
          radioButton.checked = false;
        });
      })
      .catch(error => {
        console.error('Error initializing editor:', error);
      });
  }

}

// Plugin para Custom Upload Adapter usando axios
function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    // Use o ID da seção ou alguma identificação única
    const sectionId = editor.sourceElement.id;
    return new MyUploadAdapter(loader, editor, sectionId);
  };
}

// Classe para o adaptador de upload

class MyUploadAdapter {
  constructor(loader, editor, sectionId) {
    this.loader = loader;
    this.editor = editor;
    this.sectionId = sectionId;
  }

  upload() {
    const token = localStorage.getItem('token');
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
              uploadDataStore[this.sectionId] = response.data;
              console.log(uploadDataStore);

              let pictureHtml;
              if (response.data.srcset) {
                console.log('entrei srcset')
                pictureHtml = `
                  <picture>
                    <source srcset="${response.data.srcset['320w']} 320w" type="image/webp" media="(max-width: 320px)">
                    <source srcset="${response.data.srcset['480w']} 480w" type="image/webp" media="(max-width: 480px)">
                    <source srcset="${response.data.srcset['800w']} 800w" type="image/webp" media="(max-width: 800px)">
                    <img src="${response.data.url}" alt="Imagem carregada" loading="lazy">
                  </picture>
                `;
              } else {
                console.log('entrei else')

                pictureHtml = `<img src="${response.data.url}" alt="Imagem carregada" loading="lazy">`;
              }

              console.log(pictureHtml)

              const viewFragment = this.editor.data.processor.toView(pictureHtml);
              const modelFragment = this.editor.data.toModel(viewFragment);
              console.log( modelFragment )

              this.editor.model.change(writer => {
                // Inserir o fragmento de model no local da seleção
                this.editor.model.insertContent(modelFragment, this.editor.model.document.selection);
                const finalData = this.editor.getData();
                console.log('Final editor data:', finalData);
              });

              resolve({
                default: pictureHtml // Aqui passa o HTML direto sem escapar
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
    // Não implementado, mas poderia ser utilizado para abortar uploads pendentes se necessário
  }
}

function convertImgToPicture(htmlString, apiResponseData) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  const imgElements = tempDiv.querySelectorAll('img');

  imgElements.forEach((img, index) => {
    const picture = document.createElement('picture');

    picture.innerHTML = `
      <source srcset="${apiResponseData.srcset['320w']} 320w" media="(max-width: 320px)">
      <source srcset="${apiResponseData.srcset['480w']} 480w" media="(max-width: 480px)">
      <source srcset="${apiResponseData.srcset['800w']} 800w" media="(max-width: 800px)">
      <img src="${img.src}" alt="${img.alt}" loading="lazy">
    `;
    img.replaceWith(picture);
  });

  return tempDiv.innerHTML;
}

function convertAndSave(editor, sectionId) {
  const html = editor.getData();
  const apiResponseData = uploadDataStore[sectionId];
  if (apiResponseData) {
    const convertedHtml = convertImgToPicture(html, apiResponseData);
    // Atualizar o conteúdo do editor com o HTML convertido

    editor.setData(convertedHtml);
    setTimeout(() => {
      console.log('Editor content after setData:', editor.getData());
    }, 1000);
  }
  console.log('Editor in question:', editor);
}

function getSection(elements, backgroundColor, points, position = null) {
  // TODO ate aqui ta igual ao add poderei fazer uma função para reduzir codigo
  sectionContainer = document.createElement('section');
  /* sectionContainer.dataset.type = type; */
  sectionContainer.id = `section-${sectionCount}`;
  sectionContainer.style.backgroundColor = backgroundColor;

  const containerDiv = document.createElement('div');
  containerDiv.className = 'container';
  sectionContainer.appendChild(containerDiv);

  const rowDiv = document.createElement('div');
  rowDiv.className = 'row';
  containerDiv.appendChild(rowDiv);

  const titleSectionDiv = document.createElement('div');
  rowDiv.appendChild(titleSectionDiv);

  const h2 = document.createElement('h2');
  h2.innerHTML = `Section ${sectionCount}`;
  titleSectionDiv.appendChild(h2);



  const buttonsSection = document.createElement('div');
  buttonsSection.className = 'buttons-section';
  rowDiv.appendChild(buttonsSection);

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'Apagar Seção';
  deleteButton.className = 'delete-button btn btn-danger';

  buttonsSection.appendChild(deleteButton);
  const sectionToDelete = sectionCount;
  // Adiciona evento de clique ao botão para apagar a seção
  deleteButton.addEventListener('click', () => {
    openConfirmationModalSectionDelete(sectionToDelete);
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

  let i = 0;
  elements.forEach((items, index) => {


    items.forEach((item, innerIndex) => {
      const type = item.type;

      let contentEditor;

      const rowDiv2 = document.createElement('div');
      rowDiv2.className = 'row';
      containerDiv.appendChild(rowDiv2);

      const infoDiv = document.createElement('div');
      infoDiv.className = 'info-div';
      infoDiv.dataset.type = type;
      rowDiv2.appendChild(infoDiv);

      const deleteButton = createButtonDeleteRow(rowDiv2)

      // Adicionar o botão de exclusão ao infoDiv
      infoDiv.appendChild(deleteButton);


      sectionId = `section${editorCount}`;
      editorCount++;
      /* content = 'Insira o texto'; */
      let countType6 = 0;

      if (type === 'type1' || type === 'type2') {
        const divInfo = document.createElement('div');
        divInfo.className = 'type-dropdown';
        const p = document.createElement('h3');
        if (type === 'type1') {
          p.innerHTML = `100% da div`;
        } else if (type === 'type2') {
          p.innerHTML = `75% da div`;
        }
        divInfo.appendChild(p)
        const selectContainer = createDropdownAos(sectionId, item.elements[0].aos);
        divInfo.appendChild(selectContainer);
        infoDiv.appendChild(divInfo);

        const div = document.createElement('div');
        div.className = 'editable-section';

        div.id = sectionId;
        contentEditor = item.elements[0].data
        div.innerHTML = contentEditor;
        infoDiv.appendChild(div);

        // Adicionar a sectionContainer ao editor-container
        if (position !== null && position < document.getElementById('editor-container').children.length) {
          document.getElementById('editor-container').insertBefore(sectionContainer, document.getElementById('editor-container').children[position]);
        } else {
          document.getElementById('editor-container').appendChild(sectionContainer);
        }

        addEditor(div.id);
      } else if (type === 'type3') {
        const divInfoLeft = document.createElement('div');
        divInfoLeft.className = 'type-dropdown';
        const pLeft = document.createElement('h3');
        pLeft.innerHTML = `Left section`;
        divInfoLeft.appendChild(pLeft)
        const selectContainerLeft = createDropdownAos(sectionId, item.elements[i].aos);
        divInfoLeft.appendChild(selectContainerLeft);
        infoDiv.appendChild(divInfoLeft);

        const leftDiv = document.createElement('div');
        leftDiv.className = 'editable-section';
        leftDiv.id = sectionId;
        contentEditor = item.elements[i].data;
        leftDiv.innerHTML = contentEditor;
        infoDiv.appendChild(leftDiv);
        i++;

        sectionId = `section${editorCount}`;
        editorCount++;

        const divInfoRight = document.createElement('div');
        divInfoRight.className = 'type-dropdown';
        const pRight = document.createElement('h3');
        pRight.innerHTML = `Right section`;
        divInfoRight.appendChild(pRight)
        const selectContainerRight = createDropdownAos(sectionId, item.elements[i].aos);
        divInfoRight.appendChild(selectContainerRight);
        infoDiv.appendChild(divInfoRight);

        const rightDiv = document.createElement('div');
        rightDiv.className = 'editable-section';
        rightDiv.id = sectionId;
        contentEditor = item.elements[i].data
        rightDiv.innerHTML = contentEditor;
        infoDiv.appendChild(rightDiv);
        i = 0;

        if (position !== null && position < document.getElementById('editor-container').children.length) {
          document.getElementById('editor-container').insertBefore(sectionContainer, document.getElementById('editor-container').children[position]);
        } else {
          document.getElementById('editor-container').appendChild(sectionContainer);
        }

        // Chamar addEditor para ambas as divs internas
        addEditor(leftDiv.id);
        addEditor(rightDiv.id);
      } else if (type === 'type4') {
        const divInfoLeft = document.createElement('div');
        divInfoLeft.className = 'type-dropdown';
        const pLeft = document.createElement('h3');
        pLeft.innerHTML = `Left section`;
        divInfoLeft.appendChild(pLeft)
        const selectContainerLeft = createDropdownAos(sectionId, item.elements[i].aos);
        divInfoLeft.appendChild(selectContainerLeft);
        infoDiv.appendChild(divInfoLeft);

        const leftDiv = document.createElement('div');
        leftDiv.className = 'editable-section';
        leftDiv.id = sectionId;
        contentEditor = item.elements[i].data
        leftDiv.innerHTML = contentEditor;
        infoDiv.appendChild(leftDiv);
        i++;
        sectionId = `section${editorCount}`;
        editorCount++;

        const divInfoCenter = document.createElement('div');
        divInfoCenter.className = 'type-dropdown';
        const pCenter = document.createElement('h3');
        pCenter.innerHTML = `Center section`;
        divInfoCenter.appendChild(pCenter)
        const selectContainerCenter = createDropdownAos(sectionId, item.elements[i].aos);
        divInfoCenter.appendChild(selectContainerCenter);
        infoDiv.appendChild(divInfoCenter);

        const centerDiv = document.createElement('div');
        centerDiv.className = 'editable-section';
        centerDiv.id = sectionId;
        contentEditor = item.elements[i].data
        centerDiv.innerHTML = contentEditor;
        infoDiv.appendChild(centerDiv);
        i++;

        sectionId = `section${editorCount}`;
        editorCount++;

        const divInfoRight = document.createElement('div');
        divInfoRight.className = 'type-dropdown';
        const pRight = document.createElement('h3');
        pRight.innerHTML = `Right section`;
        divInfoRight.appendChild(pRight)
        const selectContainerRight = createDropdownAos(sectionId, item.elements[i].aos);
        divInfoRight.appendChild(selectContainerRight);
        infoDiv.appendChild(divInfoRight);

        const rightDiv = document.createElement('div');
        rightDiv.className = 'editable-section';
        rightDiv.id = sectionId;
        contentEditor = item.elements[i].data
        rightDiv.innerHTML = contentEditor;
        infoDiv.appendChild(rightDiv);
        i = 0;

        if (position !== null && position < document.getElementById('editor-container').children.length) {
          document.getElementById('editor-container').insertBefore(sectionContainer, document.getElementById('editor-container').children[position]);
        } else {
          document.getElementById('editor-container').appendChild(sectionContainer);
        }

        addEditor(leftDiv.id);
        addEditor(centerDiv.id);
        addEditor(rightDiv.id);
      } else if (type === 'type5') {
        contactForm = 1;

        const divInfo = document.createElement('div');
        divInfo.className = 'type-dropdown';
        const p = document.createElement('h3');
        p.innerHTML = `Contact Form`;
        divInfo.appendChild(p)
        const selectContainer = createDropdownAos(sectionId, item.elements[0].aos);
        divInfo.appendChild(selectContainer);
        infoDiv.appendChild(divInfo);

        const div = document.createElement('div');
        div.className = 'editable-section';
        div.id = sectionId;
        contentEditor = item.elements[i].data
        div.innerHTML = contentEditor;
        infoDiv.appendChild(div);

        // Adicionar a sectionContainer ao editor-container
        if (position !== null && position < document.getElementById('editor-container').children.length) {
          document.getElementById('editor-container').insertBefore(sectionContainer, document.getElementById('editor-container').children[position]);
        } else {
          document.getElementById('editor-container').appendChild(sectionContainer);
        }

        addEditor(div.id);
      } else if (type === 'type6-left' || type === 'type6-right') {
        const divInfoLeft = document.createElement('div');
        divInfoLeft.className = 'type-dropdown';
        const pLeft = document.createElement('h3');
        pLeft.innerHTML = `Left section`;
        divInfoLeft.appendChild(pLeft)
        const selectContainerLeft = createDropdownAos(sectionId, item.elements[i].aos);
        divInfoLeft.appendChild(selectContainerLeft);
        infoDiv.appendChild(divInfoLeft);
        i++;
        const leftDiv = document.createElement('div');
        const rightDiv = document.createElement('div');

        leftDiv.className = 'editable-section';
        leftDiv.id = sectionId;
        sectionId = `section${editorCount}`;
        editorCount++;

        const divInfoRight = document.createElement('div');
        divInfoRight.className = 'type-dropdown';
        const pRight = document.createElement('h3');
        pRight.innerHTML = `Right section`;
        divInfoRight.appendChild(pRight)
        const selectContainerRight = createDropdownAos(sectionId, item.elements[i].aos);
        divInfoRight.appendChild(selectContainerRight);
        i = 0;
        rightDiv.className = 'editable-section';
        rightDiv.id = sectionId;


        infoDiv.appendChild(leftDiv);
        infoDiv.appendChild(divInfoRight);
        infoDiv.appendChild(rightDiv);

        if (position !== null && position < document.getElementById('editor-container').children.length) {
          document.getElementById('editor-container').insertBefore(sectionContainer, document.getElementById('editor-container').children[position]);
        } else {
          document.getElementById('editor-container').appendChild(sectionContainer);
        }

        const contentClass = document.createElement('div');
        contentClass.className = 'content';

        if (type === 'type6-left') {
          leftDiv.className += ' imgPoints';
          contentEditor = item.elements[i].data
          contentClass.innerHTML = contentEditor;

          const imgElement = contentClass.querySelector('img');
          const pointList = contentClass.querySelector('ul');
          const pointListId = pointList.id;

          const divAlt = addAltImageType6(imgElement);

          leftDiv.appendChild(divAlt);

          leftDiv.appendChild(contentClass);

          pointListCounter++;

          const clickHandler = (event) => {
            imageClickHandler(event, pointListId);
          };

          imgElement.addEventListener('click', clickHandler);
          imgElement.clickHandler = clickHandler;

          i++;
          contentEditor = item.elements[i].data;
          rightDiv.innerHTML = contentEditor;
          i = 0;
          addEditor(rightDiv.id);
        } else if (type === 'type6-right') {
          contentEditor = item.elements[i].data;
          leftDiv.innerHTML = contentEditor;
          i++;

          rightDiv.className += ' imgPoints';
          contentEditor = item.elements[i].data
          contentClass.innerHTML = contentEditor;
          i = 0;

          const imgElement = contentClass.querySelector('img');
          const pointList = contentClass.querySelector('ul');
          const pointListId = pointList.id;

          const divAlt = addAltImageType6(imgElement);

          rightDiv.appendChild(divAlt);

          rightDiv.appendChild(contentClass);

          pointListCounter++;

          const clickHandler = (event) => {
            imageClickHandler(event, pointListId);
          };

          imgElement.addEventListener('click', clickHandler);
          imgElement.clickHandler = clickHandler;

          addEditor(leftDiv.id);
        }



        elements.forEach((item, index) => {
          const type2 = item[0].type
          let id = '';
          if (type2 === 'type6-left') {
            id = item[0].elements[0].id
          } else if (type2 === 'type6-right') {
            id = item[0].elements[1].id
          }

          if (points.hasOwnProperty(id)) {

            const infoPoints = points[id].infoPoints;

            infoPoints.forEach(point => {
              // Cria uma nova div
              const newDiv = document.createElement('div');
              newDiv.classList.add('cd-more-info');
              newDiv.classList.add('editable-sectionPoints');
              newDiv.id = point.id;
              newDiv.innerHTML = point.data;
              pointCounter++;

              // Cria e adiciona o botão de fechar
              const closeButton = document.createElement('button');
              closeButton.classList.add('btn-close-info');
              closeButton.innerHTML = '<i class="fa-solid fa-close"></i>';
              newDiv.appendChild(closeButton);

              // Identifica o elemento DOM correspondente ao item.id
              let itemElement;

              if (type2 === 'type6-right') {
                itemElement = document.querySelector(`#${rightDiv.id}`);

              } else if (type2 === 'type6-left') {
                itemElement = document.querySelector(`#${leftDiv.id}`);
              }
              if (itemElement) {
                // Adiciona a nova div ao item atual
                const p = document.createElement('p');
                p.id = `p-${point.id}`
                console.log(point.id);
                p.innerHTML = `Texto pointer ${point.id}`
                itemElement.appendChild(p);
                itemElement.appendChild(newDiv);

                // Chama a função addEditor para adicionar o editor na div
                addEditor(newDiv.id);
              } else {
                console.error('Element not found for item.id:', id);
              }
            });
          }


          if (type2 === 'type6-left' && countType6 === 0 || type === 'type6-right' && countType6 === 0) {
            countType6++
          } else if (type2 === 'type6-right' && countType6 === 0) {
            countType6++
            pointListCounter++;
            const divId = `section${editorCount/*  - editors.length + index */}`;
            addEditor(divId);
          } else {
            const divId = `section${editorCount/*  - editors.length + index */}`;
            addEditor(divId);
            countType6 = 0;
          }
        });




      } else if (type === 'type7') {
        const divInfo = document.createElement('div'); // TODO posso colocar no type1 e 2
        divInfo.className = 'type-dropdown';
        const p = document.createElement('h3');

        p.innerHTML = `Code div`;

        divInfo.appendChild(p)
        const selectContainer = createDropdownAos(sectionId, item.elements[0].aos);
        divInfo.appendChild(selectContainer);
        infoDiv.appendChild(divInfo);

        const div = document.createElement('div');
        div.className = 'editable-section';

        div.id = sectionId;
        contentEditor = item.elements[0].data
        div.innerHTML = contentEditor;
        infoDiv.appendChild(div);

        // Adicionar a sectionContainer ao editor-container
        if (position !== null && position < document.getElementById('editor-container').children.length) {
          document.getElementById('editor-container').insertBefore(sectionContainer, document.getElementById('editor-container').children[position]);
        } else {
          document.getElementById('editor-container').appendChild(sectionContainer);
        }

        addEditor(div.id);
      }
    });
    // Adicionar a sectionContainer ao editor-container
    document.getElementById('editor-container').appendChild(sectionContainer);
  });
  sectionCount++;
}

function createButtonDeleteRow(rowDiv2) {
  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-danger';
  deleteButton.innerHTML = 'Excluir';

  const modal = document.getElementById('confirmationModal')

  if (!modal) {
    const modalContentDeleteRow = `
    <div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="confirmationModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmationModalLabel">Confirmar Exclusão</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        Tem certeza de que deseja excluir esta seção?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-danger" id="confirmDeleteButton">Excluir</button>
      </div>
    </div>
    </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalContentDeleteRow);

  }

  // Adicionar ouvinte de evento para excluir a rowDiv2 quando o botão for clicado
  deleteButton.addEventListener('click', () => {
    $('#confirmationModal').data('rowDiv', rowDiv2).modal('show');
  });
  return deleteButton
}

function addAltImageType6(imgElement) {
  const divAlt = document.createElement('div');
  divAlt.className = 'divAlt';

  const divInputAlt = document.createElement('div');
  divInputAlt.className = 'divInputAlt';

  const p = document.createElement('p');
  p.innerHTML = 'Alterar o Alt da imagem: '
  divInputAlt.appendChild(p);

  const altInput = document.createElement('input');
  altInput.type = 'text';
  altInput.style.width = '500px';
  if (imgElement) {
    altInput.value = imgElement.alt;
  } else {
    altInput.placeholder = 'Novo texto para o atributo alt';
  }
  divInputAlt.appendChild(altInput);

  altInput.addEventListener('input', function () {
    imgElement.alt = altInput.value;
  });

  const divInputDeletePoint = document.createElement('div');
  divInputDeletePoint.className = 'divInputDeletePoint';

  const pDeletePointer = document.createElement('p');
  pDeletePointer.innerHTML = 'Eliminar pointer:';
  divInputDeletePoint.appendChild(pDeletePointer);

  const pointerInput = document.createElement('input');
  pointerInput.type = 'number';
  pointerInput.placeholder = 'Indique o numero do pointer a remover';
  pointerInput.style.width = '500px';
  divInputDeletePoint.appendChild(pointerInput);

  const deletePointerButton = document.createElement('button');
  deletePointerButton.type = 'button';
  deletePointerButton.className = 'btn btn-danger';
  deletePointerButton.innerHTML = 'Eliminar';

  deletePointerButton.addEventListener('click', function () {
    const pointerValue = pointerInput.value.trim();
    $('#confirmationModalPointer').data('pointerValue', pointerValue).data('pointerInput', pointerInput).modal('show');
  });

  divInputDeletePoint.appendChild(deletePointerButton);

  divAlt.appendChild(divInputAlt)

  divAlt.appendChild(divInputDeletePoint)

  return divAlt;
}

function deletePointerModal() {
  if (!document.getElementById('confirmationModalPointer')) {
    const modalContentDeleteRow = `
      <div class="modal fade" id="confirmationModalPointer" tabindex="-1" role="dialog" aria-labelledby="confirmationModalPointerLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="confirmationModalPointerLabel">Confirmar Exclusão</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Tem certeza de que deseja excluir este pointer e a sua informação?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-danger" id="confirmDeleteButtonPointer">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalContentDeleteRow);
  }
}

deletePointerModal();

document.getElementById('confirmDeleteButtonPointer').addEventListener('click', function () {
  const pointerValue = $('#confirmationModalPointer').data('pointerValue');
  const pointerInput = $('#confirmationModalPointer').data('pointerInput');

  const pointeToDelete = document.getElementById(`point-${pointerValue}`);
  const pToDelete = document.getElementById(`p-info-pointer-${pointerValue}`);
  const infoToDelete = document.getElementById(`info-pointer-${pointerValue}`);


  if (pointeToDelete) pointeToDelete.remove();
  if (pToDelete) pToDelete.remove();
  if (infoToDelete) {
    const nextDiv = infoToDelete.nextElementSibling;
    infoToDelete.remove();
    if (nextDiv) nextDiv.remove();
  }

  const totalPoints = document.querySelectorAll('.cd-single-point');
  const totalInfoPoints = document.querySelectorAll('.cd-more-info');
  const infoPTotal = document.querySelectorAll('p[id^="p-info-pointer-"]');

  const filteredTotalPoints = filterPoints(totalPoints, pointerValue);
  const filteredTotalInfoPoints = filterPoints(totalInfoPoints, pointerValue, 'info-pointer');
  const filteredTotalInfoP = filterPoints(infoPTotal, pointerValue, 'p-info-pointer');

  decrementIds(filteredTotalPoints, pointerValue, 'point');
  decrementInfoIds(filteredTotalInfoPoints, pointerValue, 'info-pointer');
  decrementPIds(filteredTotalInfoP, pointerValue, 'p-info-pointer');

  reindexEditors(pointerValue);


  const totalPoints2 = document.querySelectorAll('.cd-single-point');
  pointCounter = totalPoints2.length;

  console.log(editors)

  $('#confirmationModalPointer').modal('hide');

  pointerInput.value = '';
});

function addNewSection(position = null) {
  sectionContainer = document.createElement('section');
  /* sectionContainer.dataset.type = type; */
  sectionContainer.id = `section-${sectionCount}`;

  const containerDiv = document.createElement('div');
  containerDiv.className = 'container';
  sectionContainer.appendChild(containerDiv);

  const rowDiv = document.createElement('div');
  rowDiv.className = 'row';
  containerDiv.appendChild(rowDiv);

  const titleSectionDiv = document.createElement('div');
  rowDiv.appendChild(titleSectionDiv);

  const h2 = document.createElement('h2');
  h2.innerHTML = `Section ${sectionCount}`;
  titleSectionDiv.appendChild(h2);

  const buttonsSection = document.createElement('div');
  buttonsSection.className = 'buttons-section';
  rowDiv.appendChild(buttonsSection);

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'Apagar Seção';
  deleteButton.className = 'delete-button btn btn-danger';
  buttonsSection.appendChild(deleteButton);
  const sectionToDelete = sectionCount;
  // Adiciona evento de clique ao botão para apagar a seção
  deleteButton.addEventListener('click', () => {
    openConfirmationModalSectionDelete(sectionToDelete);
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

  if (position !== null && position < document.getElementById('editor-container').children.length) {
    document.getElementById('editor-container').insertBefore(sectionContainer, document.getElementById('editor-container').children[position]);
  } else {
    document.getElementById('editor-container').appendChild(sectionContainer);
  }
  sectionCount++;

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
}

function imageClickHandler(event, pointList) {
  // Cria o modal de confirmação dinamicamente
  const modalHTML = `
    <div class="modal fade" id="confirmPointer" tabindex="-1" aria-labelledby="confirmPointerLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmPointerLabel">Confirmação</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Tem a certeza que quer colocar o pointer?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" id="cancelBtn">Cancelar</button>
            <button type="button" class="btn btn-primary" id="confirmBtn">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Adiciona o modal ao corpo do documento
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Abre o modal de confirmação
  $('#confirmPointer').modal('show');

  // Adiciona o manipulador de evento para o botão de confirmação
  document.getElementById('confirmBtn').addEventListener('click', () => {
    $('#confirmPointer').modal('hide'); // Fecha o modal
    addPointer(event, pointList); // Chama a função que adiciona o ponto
  }, { once: true });

  // Remove o modal do DOM quando for fechado
  $('#confirmPointer').on('hidden.bs.modal', function () {
    document.getElementById('confirmPointer').remove();
  });
}

function addPointer(event, pointList) {
  const pointList2 = document.getElementById(pointList);
  const image = event.target;
  const parentSection = image.closest('.editable-section');

  if (parentSection) {
    const rect = image.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    const pointId = `point-${pointCounter}`;
    const point = document.createElement('li');
    point.classList.add('cd-single-point');
    point.id = pointId;
    point.style.left = `${xPercent}%`;
    point.style.top = `${yPercent}%`;

    const pInfoPointer = document.createElement('p');
    pInfoPointer.innerHTML = `Texto pointer info-pointer-${pointCounter}`;
    pInfoPointer.id = `p-info-pointer-${pointCounter}`;

    const divInfoPointer = document.createElement('div');
    const infoPointerId = `info-pointer-${pointCounter}`;
    divInfoPointer.className = 'editable-sectionPoints';
    divInfoPointer.id = infoPointerId;

    const link = document.createElement('a');
    link.classList.add('cd-img-replace', 'info');
    link.href = "#0";
    link.setAttribute('data-target', infoPointerId);
    link.setAttribute('aria-label', 'Más información');
    link.innerHTML = `<i class="fa-solid fa-info"></i>${pointCounter}`;
    link.style.cursor = 'pointer';
    point.appendChild(link);

    const pulse = document.createElement('div');
    pulse.classList.add('cd-pulse');
    point.appendChild(pulse);
    pointCounter++;

    pointList2.appendChild(point);
    parentSection.appendChild(pInfoPointer);
    parentSection.appendChild(divInfoPointer);

    addEditor(divInfoPointer.id);
  } else {
    console.log('Parent section not found');
  }
}

function buildImg(imgApi, pointList) {
  const imgElement = document.createElement('img');
  imgElement.setAttribute('src', imgApi.url);
  imgElement.setAttribute('alt', 'Imagem carregada');
  imgElement.setAttribute('loading', 'lazy');
  let pictureElement;
  if (imgApi.srcset) {
    pictureElement = document.createElement('picture');
    Object.keys(imgApi.srcset).forEach(size => {
      const cleanSize = size.replace('w', ''); 
      const sourceElement = document.createElement('source');
      sourceElement.setAttribute('srcset', `${imgApi.srcset[size]} ${size}`);
      sourceElement.setAttribute('type', 'image/webp');
      sourceElement.setAttribute('media', `(max-width: ${cleanSize}px)`);
      pictureElement.appendChild(sourceElement);
    });
    pictureElement.appendChild(imgElement);
  }

  // Cria um manipulador de eventos e armazena-o na própria imagem
  const clickHandler = (event) => {
    imageClickHandler(event, pointList);
  };

  imgElement.addEventListener('click', clickHandler);
  imgElement.clickHandler = clickHandler;
  if(imgApi.srcset){
    return pictureElement;
  } else{
    return imgElement
  }
}

async function data(namePageInput) {

  try {
    let url = `${urlBase}pages/${namePageInput}`;

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
  const token = localStorage.getItem('token');
  try {
    const content = {};
    const contentPoints = {};
    const sections = document.getElementById('editor-container').querySelectorAll('section');
    const title = document.getElementById('pageTitle').value;
    const description = document.getElementById('pageDescription').value;
    const metaTitle = document.getElementById('metaTitle').value;

    sections.forEach((section, sectionIndex) => {
      const sectionId = section.id;
      const sectionColor = section.style.backgroundColor || '#fbf8f8';
      const rows = section.querySelectorAll('.row');

      content[sectionIndex] = {
        section: sectionId,
        backgroundColor: sectionColor,
        elements: []
      };
      let i = 0;
      rows.forEach((row) => {
        const infoDivs = row.querySelectorAll('.info-div');

        if (infoDivs && infoDivs.length > 0) {
          // Initialize the row object only if infoDivs is not empty
          content[sectionIndex].elements[i] = {};

          infoDivs.forEach((infoDiv, infoDivIndex) => {
            const sectionType = infoDiv.dataset.type;
            const editableSections = infoDiv.querySelectorAll('.editable-section');

            editableSections.forEach((editableSection, editableIndex) => {
              let editorData;
              const editorId = editableSection.id;
              const dropdownButton = document.querySelector(`#dropdownMenuButton-${editorId}`);
              const dropdownValue = dropdownButton ? dropdownButton.value : 'null';

              if (editableSection.classList.contains('imgPoints')) {
                const contentHtml = editableSection.querySelector('.content').innerHTML;
                editorData = contentHtml;

                const editorsPoints = editableSection.querySelectorAll('.editable-sectionPoints');
                console.log(editorsPoints)
                const editorsPointsArray = Array.from(editorsPoints);

                contentPoints[editorId] = {
                  infoPoints: []
                };

                editorsPointsArray.forEach((editorPoint) => {
                  const editorPointId = editorPoint.id;
                  console.log(editorPointId)
                  const editorDataPoints = editors[editorPointId].getData();

                  contentPoints[editorId].infoPoints.push({
                    id: editorPointId,
                    data: editorDataPoints
                  });
                });
              } else {
                editorData = editors[editorId].getData();
              }

              if (!content[sectionIndex].elements[i][infoDivIndex]) {
                content[sectionIndex].elements[i][infoDivIndex] = {
                  type: sectionType,
                  elements: []
                };
              }

              content[sectionIndex].elements[i][infoDivIndex].elements.push({
                id: editorId,
                data: editorData,
                aos: dropdownValue
              });
            });
          });
          i++;
        }
      });
    });

    console.log(content)
    console.log(contentPoints)

    const requestBody = {
      namePage: namePage,
      section: "default_section", // Ajuste conforme necessário
      content: content,
      contentPoints: contentPoints,
      title: title,
      description: description,
      metaTitle: metaTitle
    };


    const section = "default_section";

    const sectionUrl = baseUrl + section;
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(sectionUrl, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      window.location.href = 'teste.html';
    } else {
      console.error(`Erro ao enviar dados da seção ${requestBody.section}. Status: ${response.status}`);
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

buttonNamePage.addEventListener('click', async function () {
  namePage = namePageDropdown.value;
  console.log(namePage);

  await data(namePage).then(dataFromBackend => {
    console.log(dataFromBackend)
    if (dataFromBackend && dataFromBackend.success && dataFromBackend.data.length > 0) {
      localStorage.setItem('namePage', namePage);
      const contentData = dataFromBackend.data[0].content;
      const contentPoints = dataFromBackend.data[0].contentPoints;
      const contentPointsString = JSON.parse(contentPoints);

      if (Array.isArray(contentData) && contentData.length > 0) {
        contentData.forEach((item, index) => {
          getSection(item.elements, item.backgroundColor, contentPointsString);
        });
      }

      namePageLogin.style.display = 'none';

      titleEdit.style.display = 'block';
      titleH1.innerText = `Editar Página ${namePage}`;

      buttonsEdit.style.display = 'flex';
      editorContainer.style.display = 'block';
      titleDescriptionId.style.display = 'block';

      const title = document.getElementById('pageTitle');
      const description = document.getElementById('pageDescription');
      const metaTitle = document.getElementById('metaTitle');
      title.value = dataFromBackend.data[0].title;
      description.value = dataFromBackend.data[0].description;
      metaTitle.value = dataFromBackend.data[0].metaTitle;
    }
    else {
      const messageDiv = document.getElementById('messageNamePage');
      messageDiv.innerHTML = '<div class="alert alert-warning">Página nao encontrada</div>';
    }

  });
});

buttonNewPage.addEventListener('click', function () {
  const newPageName = newPageNameInput.value;
  if (newPageName) {
    const data = {
      namePage: newPageName
    };
    const token = localStorage.getItem('token');

    fetch(`${urlBase}pages/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Nova página criada:', data.data);
          messageNewPage.innerHTML = '<div class="alert alert-success">Nova página criada com sucesso.</div>';
          namePageDropdown.innerHTML = '<option value="" disabled selected>Selecione uma página</option>';
          fetchNamePages(); // Atualizar o dropdown
        } else {
          console.log(data)
          messageNewPage.innerHTML = `<div class="alert alert-warning">${data.message}</div>`;
        }
      })
      .catch(error => {
        console.error('Erro:', error);
        messageNewPage.innerHTML = `<div class="alert alert-warning">${error.message}</div>`;
      });
  } else {
    messageNewPage.innerHTML = '<div class="alert alert-warning">Por favor, insira um nome para a nova página.</div>';
  }
});

document.getElementById('buttonLogin').addEventListener('click', async function () {
  messageDiv.innerHTML = '';
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const data = await login(username, password);

  const token = data.access_token;
  if (token) {
    localStorage.setItem('token', token);
    const expirationTime = new Date().getTime() + data.expires_in * 1000;
    localStorage.setItem('expirationTime', expirationTime.toString());

    namePageLogin.style.display = 'block';
    loginForm.style.display = 'none';

    fetchNamePages()

    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  }
});

function checkRefreshToken() {
  const expirationTimeString = localStorage.getItem('expirationTime');
  const expirationTime = parseInt(expirationTimeString);

  const currentTime = new Date().getTime();
  const remainingTime = expirationTime - currentTime;

  if (expirationTime > currentTime && currentTime >= expirationTime - remainingTime * 0.1) {
    const refreshTime = remainingTime * 0.9;
    console.log('Agendando refreshToken para', refreshTime, 'milissegundos');
    setTimeout(() => refreshToken(localStorage.getItem('token')), refreshTime);
  } else {
    const remainingTime = expirationTime - currentTime;

    const refreshTime = remainingTime * 0.70;
    setTimeout(() => refreshToken(localStorage.getItem('token')), refreshTime);
  }
}

async function refreshToken(token) {
  try {
    const url = `${urlBase}auths/refresh`;
    const refreshResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!refreshResponse.ok) {
      throw new Error('Erro ao renovar o token');
    }

    const refreshedData = await refreshResponse.json();
    const newToken = refreshedData.access_token;

    localStorage.setItem('token', newToken);

    console.log('Token renovado:', newToken);

    const refreshedExpirationTime = new Date().getTime() + refreshedData.expires_in * 1000;
    localStorage.setItem('expirationTime', refreshedExpirationTime.toString());

    const expirationTimeString = localStorage.getItem('expirationTime');
    const expirationTime = parseInt(expirationTimeString);
    const currentTime = new Date().getTime();

    const remainingTime = expirationTime - currentTime;

    const refreshTime = remainingTime * 0.90;

    setTimeout(() => refreshToken(newToken), refreshTime);
  } catch (error) {
    console.error('Erro ao renovar o token:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('namePage');
    namePageDropdown.innerHTML = '<option value="" disabled selected>Selecione uma página</option>';

    loginForm.style.display = 'block';
    titleEdit.style.display = 'none';
    namePageLogin.style.display = 'none';
    buttonsEdit.style.display = 'none';
    editorContainer.style.display = 'none';
    titleDescriptionId.style.display = 'none';
  }
}

async function login(username, password) {
  const url = `${urlBase}auths/login`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: username,
      password: password,
    }),
  });

  const messageDiv = document.getElementById('messageApiLogin');
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    messageDiv.innerHTML = '<div class="alert alert-warning">Erro de autenticação</div>';
  }
}

async function fetchNamePages() {
  let url = `${urlBase}pages/getNamePages`;
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (data.success) {
      data.data.forEach(page => {
        const option = document.createElement('option');
        option.value = page.namePage;
        option.textContent = page.namePage;
        namePageDropdown.appendChild(option);
      });
    } else {
      messageNamePage.textContent = 'Erro ao carregar as páginas.';
    }
  } catch (error) {
    console.error('Erro:', error);
    messageNamePage.textContent = 'Erro ao carregar as páginas.';
  }
}

async function logout() {

  const url = `${urlBase}auths/logout`;

  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });

  if (response.status === 200) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('namePage');
    namePageDropdown.innerHTML = '<option value="" disabled selected>Selecione uma página</option>';

    loginForm.style.display = 'block';
    titleEdit.style.display = 'none';
    namePageLogin.style.display = 'none';
    buttonsEdit.style.display = 'none';
    editorContainer.style.display = 'none';
    titleDescriptionId.style.display = 'none';
  }
};

document.getElementById('buttonLogout').addEventListener('click', async function () {
  logout();
});

document.getElementById('buttonChangePage').addEventListener('click', async function () {
  localStorage.removeItem('namePage');
  editorContainer.innerHTML = '';
  editorCount = 0;
  sectionCount = 0;
  sectionId;
  editors = {};
  sectionContainer;
  pointCounter = 0;
  pointListCounter = 0;
  contactForm = 0;
  uploadDataStore = {};
  namePageLogin.style.display = 'block';
  titleEdit.style.display = 'none';

  buttonsEdit.style.display = 'none';
  editorContainer.style.display = 'none';
  titleDescriptionId.style.display = 'none';
});

document.getElementById('buttonRegisteUser').addEventListener('click', async function () {
  const username = document.getElementById('userNameRegisteUser').value;
  const password = document.getElementById('passwordRegisteUser').value;
  const password_confirmation = document.getElementById('password_confirmation').value;

  await registerUser(username, password, password_confirmation);

})

$(document).ready(function () {
  $('#buttonRegister').click(function () {
    $('#registeUserModal').modal('show');
  });

  $('#openUserListModal').click(function () {
    $('#userListModal').modal('show');
  });
});

async function registerUser(username, password, password_confirmation) {
  const url = `${urlBase}users/register`;

  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Enviar credenciais no corpo da solicitação
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      name: username,
      password: password,
      password_confirmation: password_confirmation
    }),
  });

  const messageDiv = document.getElementById('messageApiRegisteUser');
  if (response.ok) {
    const data = await response.json();
    messageDiv.style.display = 'block';
    messageDiv.innerHTML = '<div class="alert alert-success">Utilizador Registado com sucesso</div>';
  } else {
    messageDiv.style.display = 'block';
    messageDiv.innerHTML = '<div class="alert alert-warning">Erro de registo</div>';
  }
}

document.getElementById('closeRegisteUser1').addEventListener('click', function () {
  document.getElementById('userNameRegisteUser').value = '';
  document.getElementById('passwordRegisteUser').value = '';
  document.getElementById('password_confirmation').value = '';
  document.getElementById('messageApiRegisteUser').style.display = 'none';
});

document.getElementById('closeRegisteUser2').addEventListener('click', function () {
  document.getElementById('userNameRegisteUser').value = '';
  document.getElementById('passwordRegisteUser').value = '';
  document.getElementById('password_confirmation').value = '';
  document.getElementById('messageApiRegisteUser').style.display = 'none';
});

async function loadUserList() {
  const url = `${urlBase}users`;

  const token = localStorage.getItem('token');
  console.log(token)

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });
  console.log(response)

  if (!response.ok) {
    throw new Error('Erro ao obter a lista de utilizadors');
  }

  const userData = await response.json();

  const userListElement = document.getElementById('userList');
  userListElement.innerHTML = '';

  userData.users.forEach(user => {
    const divUser = document.createElement('div');
    const divItem = document.createElement('div');
    divItem.textContent = `ID: ${user.id}, Nome: ${user.name}`;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('btn', 'btn-primary');

    editButton.addEventListener('click', () => {
      divUser.style.border = '1px solid black'
      const divEdit = document.createElement('div');
      const divEditButtons = document.createElement('div');
      const divEditSection = document.createElement('div');


      const inputName = document.createElement('input');
      inputName.type = 'text';
      inputName.id = 'name';
      inputName.name = 'name';
      inputName.className = 'form-control';
      inputName.setAttribute('aria-describedby', 'basic-addon1');
      inputName.required = true;

      const inputPassword = document.createElement('input');
      inputPassword.type = 'password';
      inputPassword.id = 'password';
      inputPassword.name = 'password';
      inputPassword.className = 'form-control';
      inputPassword.required = true;

      const inputPasswordConfirmation = document.createElement('input');
      inputPasswordConfirmation.type = 'password';
      inputPasswordConfirmation.id = 'passwordConfirmation';
      inputPasswordConfirmation.name = 'passwordConfirmation';
      inputPasswordConfirmation.className = 'form-control';
      inputPasswordConfirmation.required = true;

      const name = document.createElement('p');
      const password = document.createElement('p');
      const passwordConfirmation = document.createElement('p');
      inputName.value = user.name;
      name.innerText = 'Name:'
      password.innerText = 'Password:'
      passwordConfirmation.innerText = 'Confirm Password:'
      const cancelEditButton = document.createElement('button');
      cancelEditButton.textContent = 'Cancelar';

      const saveEdit = document.createElement('button');
      saveEdit.textContent = 'Guardar alterações';
      saveEdit.addEventListener('click', () => {
        const newName = inputName.value;
        const newPassword = inputPassword.value;
        const newPasswordConfirmation = inputPasswordConfirmation.value;

        handleEditUser(user.id, newName, newPassword, newPasswordConfirmation)
      });

      cancelEditButton.addEventListener('click', () => {
        divUser.removeChild(divEditSection);
        divUser.style.border = '0';
        editButton.disabled = false;
      });

      divEdit.appendChild(name);
      divEdit.appendChild(inputName);
      divEdit.appendChild(password);
      divEdit.appendChild(inputPassword);
      divEdit.appendChild(passwordConfirmation);
      divEdit.appendChild(inputPasswordConfirmation);

      divEditButtons.style.marginTop = '20px';
      divEditButtons.appendChild(saveEdit);
      divEditButtons.appendChild(cancelEditButton);

      divEditSection.appendChild(divEdit);
      divEditSection.appendChild(divEditButtons);
      divUser.appendChild(divEditSection);
      editButton.disabled = true;

    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-primary');

    deleteButton.addEventListener('click', () => {
      divUser.style.border = '1px solid black'
      const divDeleteButtons = document.createElement('div');
      const menssageConfirmeDelete = document.createElement('p');

      menssageConfirmeDelete.innerText = 'Are you sure?'
      const deleteButtonFinal = document.createElement('button');
      deleteButtonFinal.textContent = 'Confirm Delete';
      deleteButtonFinal.addEventListener('click', () => {
        handleDeleteUser(user.id)
      });
      divDeleteButtons.classList.add('confirm-delete');
      divDeleteButtons.appendChild(menssageConfirmeDelete);
      divDeleteButtons.appendChild(deleteButtonFinal);
      divUser.appendChild(divDeleteButtons);
      editButton.disabled = true;
    });

    const divButtons = document.createElement('div');
    divButtons.appendChild(editButton);
    divButtons.appendChild(deleteButton);

    divItem.appendChild(divButtons);
    divItem.classList.add('user');

    divUser.appendChild(divItem);
    userListElement.appendChild(divUser);

  });

};

document.getElementById('openUserListModal').addEventListener('click', async function () {
  loadUserList();
});

const messageDiv = document.getElementById('messageApiUsers');
const closeButton1 = document.getElementById('closeModalUsers1');
const closeButton2 = document.getElementById('closeModalUsers2');
closeButton1.addEventListener('click', clearMessage);
closeButton2.addEventListener('click', clearMessage);
function clearMessage() {
  messageDiv.innerHTML = '';
}

function handleDeleteUser(userId) {
  const url = `${urlBase}users/${userId}`;
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token não encontrado. utilizador não autenticado.');
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  fetch(url, {
    method: 'DELETE',
    headers: headers,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro ao excluir utilizador com ID ${userId}`);
      }
      return response.json();
    })
    .then(data => {
      const closeModalUsers = document.getElementById('closeModalUsers2');
      closeModalUsers.click();
      localStorage.removeItem('token');
      document.getElementById('header-save').style.display = 'none';
      readOnly = true;

      destruirEditores();

      editorBuild();
    })
    .catch(error => {
      console.error('Erro durante a exclusão do utilizador:', error.message);
      // Adicione aqui lógica de tratamento de erro, se necessário
    });
}

function handleEditUser(userId, newName, newPassword, newPasswordConfirmation) {
  const url = `${urlBase}users/${userId}`;
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token não encontrado. utilizador não autenticado.');
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const dataToSend = {};

  if (newName !== '') {
    dataToSend.name = newName;
  }

  if (newPassword !== '' && newPasswordConfirmation !== '') {
    dataToSend.password = newPassword;
    dataToSend.password_confirmation = newPasswordConfirmation;
  }

  fetch(url, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(dataToSend),
  })
    .then(response => response.json())
    .then(data => {
      const messageDiv = document.getElementById('messageApiUsers');
      if (data.status === 'success') {
        messageDiv.innerHTML = '<div class="alert alert-success">' + data.message + '</div>';
        loadUserList();
      } else {
        let errorMessageHTML = '<div class="alert alert-warning">';
        errorMessageHTML += '<p>' + data.error + '</p>';
        errorMessageHTML += '</div>';
        messageDiv.innerHTML = errorMessageHTML;
      }
    })
    .catch(error => {
      console.error('Erro durante a edição do utilizador:', error.message);
    });
}

