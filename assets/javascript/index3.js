const urlBase = 'http://localhost:8000/';/*https://landingpages.svr6.appsfarma.com/  */
/* const namePage = 'TesteCKEDITOR3' */

document.addEventListener('DOMContentLoaded', async function () {
  AOS.init();
  await data().then(dataFromBackend => {
    console.log(dataFromBackend);
    if (dataFromBackend && dataFromBackend.success && dataFromBackend.data.length > 0) {
      const description = dataFromBackend.data[0].description;
      const title = dataFromBackend.data[0].title;
      const metaTitle = dataFromBackend.data[0].metaTitle;
      const contentPoints = dataFromBackend.data[0].contentPoints;
      const contentPointsString = JSON.parse(contentPoints);

      document.title = metaTitle;

      const titleH1 = document.getElementById('title');
      titleH1.innerHTML = title;

      // Cria ou atualiza a meta descrição
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);


      // Atualiza as meta tags Open Graph
      const ogTitleMeta = document.querySelector('meta[property="og:title"]');
      if (ogTitleMeta) {
        ogTitleMeta.setAttribute('content', title);
      }

      const ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
      if (ogDescriptionMeta) {
        ogDescriptionMeta.setAttribute('content', description);
      }

      const ogSiteNameMeta = document.querySelector('meta[property="og:site_name"]');
      if (ogSiteNameMeta) {
        ogSiteNameMeta.setAttribute('content', metaTitle);
      }

      const contentData = dataFromBackend.data[0].content;
      // Limpar o container antes de adicionar as novas seções
      const displayContainer = document.getElementById('display-container');
      displayContainer.innerHTML = '';

      // Construir e adicionar as seções ao DOM
      contentData.forEach((sectionData, sectionIndex) => {
        const { backgroundColor, elements } = sectionData;

        // Criar a seção pai
        const sectionDiv = document.createElement('section');
        sectionDiv.style.backgroundColor = backgroundColor;
        sectionDiv.id = `section-${sectionIndex}`;


        const containerDiv = document.createElement('div');
        containerDiv.className = 'container';
        sectionDiv.appendChild(containerDiv);
        // Adicionar a seção ao container principal
        displayContainer.appendChild(sectionDiv);

        // Adicionar cada subarray de elementos como uma nova row
        elements.forEach((elementArray, rowIndex) => {
          // Criar a estrutura da row do Bootstrap
          const rowDiv = document.createElement('div');
          rowDiv.className = 'row';
          rowDiv.id = `row-${sectionIndex}-${rowIndex}`;
          containerDiv.appendChild(rowDiv);

          // Adicionar cada elemento do subarray à row correspondente
          elementArray.forEach((elementGroup) => {
            const { type, elements: groupElements } = elementGroup;
            let countSide = 0;

            // Verificar se groupElements é um array antes de chamar forEach
            if (Array.isArray(groupElements)) {
              groupElements.forEach((element) => {
                const colDiv = document.createElement('div');
                colDiv.className = `editable-section`;
                colDiv.id = `${element.id}`;

                if (type === 'type1') {
                  if (element.aos === 'null') {
                    colDiv.className += ' col-md-12';
                  } else {
                    colDiv.className += ' col-md-12 aos-init aos-animate';
                    colDiv.setAttribute('data-aos', element.aos);
                    colDiv.setAttribute('data-aos-duration', '800');
                  }
                  colDiv.innerHTML = element.data;
                } else if (type === 'type2') {
                  if (element.aos === 'null') {
                    colDiv.className += ' col-md-8';
                  } else {
                    colDiv.className += ' col-md-8 aos-init aos-animate';
                    colDiv.setAttribute('data-aos', element.aos);
                    colDiv.setAttribute('data-aos-duration', '800');
                  }
                  colDiv.innerHTML = element.data;

                } else if (type === 'type3') {
                  if (element.aos === 'null') {
                    colDiv.className += ' col-md-6';
                  } else {
                    colDiv.className += ' col-md-6 aos-init aos-animate';
                    colDiv.setAttribute('data-aos', element.aos);
                    colDiv.setAttribute('data-aos-duration', '800');
                  }
                  colDiv.innerHTML = element.data;
                } else if (type === 'type4') {
                  if (element.aos === 'null') {
                    colDiv.className += ' col-md-4';
                  } else {
                    colDiv.className += ' col-md-4 aos-init aos-animate';
                    colDiv.setAttribute('data-aos', element.aos);
                    colDiv.setAttribute('data-aos-duration', '800');
                  }
                  colDiv.innerHTML = element.data;
                } else if (type === 'type5') {
                  if (element.aos === 'null') {
                    colDiv.className += ' col-md-8';
                  } else {
                    colDiv.className += ' col-md-8 aos-init aos-animate';
                    colDiv.setAttribute('data-aos', element.aos);
                    colDiv.setAttribute('data-aos-duration', '800');
                  }
                  let modalContent;
                  const lang = document.documentElement.lang;
                  if(lang === 'es-ES'){
                       modalContent = `<div class="modal fade" id="contactModal" tabindex="-1" aria-hidden="true">
                                              <div class="modal-dialog">
                                                <div class="modal-content">
                                                  <div class="modal-header">
                                                    <h5>Ponte en contacto con nosotros</h5>
                                                    <button id="closeModalContact1" type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                      <span aria-hidden="true">&times;</span>
                                                    </button>
                                                  </div>
                                                  <div class="modal-body">
                                                    <form id="contact-form">
                                                      <p>Deja tus datos y nos pondremos en contacto contigo sin compromiso.</p>
                                                      <div>
                                                        <label for="name">Nome</label>
                                                        <input type="text" id="name" name="name" class="form-control" placeholder="Nome" required>
                                                      </div>
                                                      <br>
                                                      <div>
                                                        <label for="email">E-mail</label>
                                                        <input type="email" id="email" name="email" class="form-control" placeholder="E-mail" required>
                                                      </div>
                                                      <br>
                                                      <div>
                                                        <label for="city">Ciudad/localidad</label>
                                                        <input type="text" id="city" name="city" class="form-control" placeholder="Ciudad/localidad" required>
                                                      </div>
                                                      <br>
                                                      <div>
                                                        <label for="phoneNumber">Teléfono</label>
                                                        <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="Teléfono" class="form-control" required>
                                                      </div>
                                                      <br>
                                                      <div>
                                                        <label for="company">Tipo de Empresa</label>
                                                        <input type="text" id="company" name="company" class="form-control" placeholder="Tipo de Empresa" required>
                                                      </div>
                                                      <br>
                                                      <div>
                                                        <label for="message">Mensaje</label>
                                                        <textarea id="message" name="message" placeholder="Mensagem" required class="form-control"></textarea>
                                                      </div>
                                                      <br>
                                                      <div class="checkbox">
                                                        <input type="checkbox" id="politics" name="politics" required>
                                                        <label for="politics">He leído y acepto la <a href="https://wemakeit.es/politica-de-privacidade/">política de privacidad</a></label>
                                                      </div>
                                                      <div class="div-loader">
                                                        <div class="loader" id="loaderEmail" style="display: none;"></div>
                                                      </div>
                                                      <div id="messageApiContact"></div>
                                                    </form>
                                                  </div>
                                                  <div class="modal-footer">
                                                    <button id="closeModalContact2" type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                                    <button id="buttonContact" class="btn btn-primary" disabled>Contáctenos Ahora!</button>
                                                    <div id="recaptchaContainer"></div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>`;
                  } else if(lang === 'pt-PT'){
                    modalContent = `<div class="modal fade" id="contactModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5>Entre em contacto connosco</h5>
                          <button id="closeModalContact1" type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <form id="contact-form">
                            <p>Deixe os seus dados e nós entraremos em contacto consigo sem qualquer compromisso.</p>
                            <div>
                              <label for="name">Nome</label>
                              <input type="text" id="name" name="name" class="form-control" placeholder="Nome" required>
                            </div>
                            <br>
                            <div>
                              <label for="email">E-mail</label>
                              <input type="email" id="email" name="email" class="form-control" placeholder="E-mail" required>
                            </div>
                            <br>
                            <div>
                              <label for="city">Cidade/localidade</label>
                              <input type="text" id="city" name="city" class="form-control" placeholder="Cidade/localidade" required>
                            </div>
                            <br>
                            <div>
                              <label for="phoneNumber">Telefone</label>
                              <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="Telefone" class="form-control" required>
                            </div>
                            <br>
                            <div>
                              <label for="company">Tipo de Empresa</label>
                              <input type="text" id="company" name="company" class="form-control" placeholder="Tipo de Empresa" required>
                            </div>
                            <br>
                            <div>
                              <label for="message">Mensagem</label>
                              <textarea id="message" name="message" placeholder="Mensagem" required class="form-control"></textarea>
                            </div>
                            <br>
                            <div class="checkbox">
                              <input type="checkbox" id="politics" name="politics" required>
                              <label for="politics">Li e aceito a <a href="https://wemakeit.es/pt-pt/politica-de-privacidade/">política de
                                privacidade</a></label>
                            </div>
                            <div class="div-loader">
                              <div class="loader" id="loaderEmail" style="display: none;"></div>
                            </div>
                            <div id="messageApiContact"></div>
                          </form>
                        </div>
                        <div class="modal-footer">
                          <button id="closeModalContact2" type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                          <button id="buttonContact" class="btn btn-primary" disabled>Contacte-nos Agora!</button>
                          <div id="recaptchaContainer"></div>
                        </div>
                      </div>
                    </div>
                  </div>`;
                  }
               

                  document.body.insertAdjacentHTML('beforeend', modalContent);

                  const buttonToOpenModal = document.createElement('button');
                  if(lang === 'es-ES'){
                    buttonToOpenModal.innerHTML = 'Contáctanos para más información.';
                  } else if (lang === 'pt-PT'){
                    buttonToOpenModal.innerHTML = 'Contacte-nos Para Mais Informações ';
                  }
                  buttonToOpenModal.className = 'button-contact';
                  buttonToOpenModal.setAttribute('data-toggle', 'modal');
                  buttonToOpenModal.setAttribute('data-target', `#contactModal`);

                  buttonToOpenModal.addEventListener('click', function () {
                    // Abre o modal
                    $('#contactModal').modal('show');

                    const recaptchaContainer = document.querySelector('.grecaptcha-badge')
                    recaptchaContainer.style.visibility = 'visible';
                  });

                  $('#contactModal').on('hidden.bs.modal', function (e) {
                    const recaptchaContainer = document.querySelector('.grecaptcha-badge');
                    recaptchaContainer.style.visibility = 'hidden';
                  });


                  const script = document.createElement('script');
                  script.src = 'assets/javascript/contact.js';
                  document.body.appendChild(script);
                  colDiv.innerHTML = element.data;
                  colDiv.appendChild(buttonToOpenModal);
                  colDiv.style.alignItems = 'center';
                } else if (type === 'type6-left' || type === 'type6-right') {

                  if (element.aos === 'null') {
                    colDiv.className += ' col-md-6 ';
                  } else {
                    colDiv.className += ' col-md-6 aos-init aos-animate';
                    colDiv.setAttribute('data-aos', element.aos);
                    colDiv.setAttribute('data-aos-duration', '800');
                  }
                  if (type === 'type6-left' && countSide === 0) {
                    colDiv.className += ' imgPoints img-full-width';
                    countSide++
                  } else if (type === 'type6-left' && countSide === 1) {
                    countSide = 0;
                  }
                  if (type === 'type6-right' && countSide === 0) {
                    countSide++
                  } else if (type === 'type6-right' && countSide === 1) {
                    colDiv.className += ' imgPoints img-full-width';
                    countSide = 0;
                  }
                  const contentDiv = document.createElement('div');
                  contentDiv.className = `content`;
                  contentDiv.innerHTML = element.data;
                  colDiv.appendChild(contentDiv);
                } else if (type === 'type7') {
                  if (element.aos === 'null') {
                    colDiv.className += ' col-md-8';
                  } else {
                    colDiv.className += ' col-md-8 aos-init aos-animate';
                    colDiv.setAttribute('data-aos', element.aos);
                    colDiv.setAttribute('data-aos-duration', '800');
                  }

                  // Função para remover as tags <pre> e <code> e decodificar o HTML
                  function extractHtmlContent(rawContent) {
                    // Extrair a classe da tag <code>
                    const codeClassMatch = rawContent.match(/<code class="language-([a-z]+)">/);
                    let language = '';
                    if (codeClassMatch) {
                      language = codeClassMatch[1];
                    }

                    // Remover as tags <pre> e <code class="language-*">
                    const content = rawContent.replace(/<\/?pre>/g, '').replace(/<\/?code.*?>/g, '');

                    // Decodificar as entidades HTML para obter o HTML real
                    const parser = new DOMParser();
                    const decodedString = parser.parseFromString(content, 'text/html').documentElement.textContent;

                    return { decodedString, language };
                  }

                  // Extrair o conteúdo HTML e a linguagem
                  const { decodedString: htmlContent, language } = extractHtmlContent(element.data);

                  // Inserir o conteúdo HTML no colDiv

                  // Executar ações específicas com base na linguagem
                  switch (language) {
                    case 'css':
                      const styleElement = document.createElement('style');
                      styleElement.appendChild(document.createTextNode(htmlContent));
                      document.head.appendChild(styleElement);
                      break;
                    case 'html':
                      colDiv.innerHTML = htmlContent;
                      break;
                    case 'javascript':
                      const scriptElement = document.createElement('script');
                      scriptElement.setAttribute('defer', 'defer');
                      scriptElement.appendChild(document.createTextNode(htmlContent));
                      document.body.appendChild(scriptElement);
                      break;
                    default:
                      console.log('Unknown language detected');
                      break;
                  }
                }

                if (contentPointsString.hasOwnProperty(colDiv.id)) {
                  const infoPoints = contentPointsString[colDiv.id].infoPoints;

                  infoPoints.forEach(point => {
                    const divButton = document.createElement('div');
                    divButton.className = 'divButton';

                    const closeButton = document.createElement('button');
                    closeButton.classList.add('btn-close-info');
                    closeButton.innerHTML = '<i class="fa-solid fa-close"></i>';

                    divButton.appendChild(closeButton);

                    const newDiv = document.createElement('div');
                    newDiv.classList.add('cd-more-info');
                    newDiv.id = point.id;

                    newDiv.appendChild(divButton);

                    const contentDiv = document.createElement('div');
                    contentDiv.innerHTML = point.data;
                    newDiv.appendChild(contentDiv);

                    colDiv.appendChild(newDiv);
                  });
                } 
                rowDiv.appendChild(colDiv);
              });
            }
          });
        });
      });
    }
  });

  function toggleMoreInfo(event) {
    var button = event.currentTarget;
    var targetId = button.getAttribute('data-target');
    var targetMoreInfo = document.getElementById(targetId);

    if (targetMoreInfo) {
      var allMoreInfos = document.querySelectorAll('.cd-more-info');

      allMoreInfos.forEach(function (info) {
        if (info !== targetMoreInfo) {
          info.style.display = 'none';
          var relatedButton = document.querySelector('[data-target="' + info.id + '"]');
          if (relatedButton) {
            relatedButton.innerHTML = '<i class="fa-solid fa-info"></i>';
          }
        }
      });

      targetMoreInfo.style.display = (targetMoreInfo.style.display === 'block') ? 'none' : 'block';
      /* button.innerHTML = (targetMoreInfo.style.display === 'block') ? '<i class="fa-solid fa-close"></i>' : '<i class="fa-solid fa-info"></i>'; */
    }
  }

  var buttons = document.querySelectorAll('.cd-single-point a.info');
  buttons.forEach(function (button) {
    button.innerHTML = '<i class="fa-solid fa-info"></i>';
    button.addEventListener('click', toggleMoreInfo);
  });

  const buttonsCloseInfo = document.querySelectorAll('.btn-close-info');

  // Adiciona um event listener para cada botão
  buttonsCloseInfo.forEach(button => {
    button.addEventListener('click', function () {
      hideInfos();
      /*  changeIcon() */
    });
  });

  function hideInfos() {
    const infos = document.querySelectorAll('.cd-more-info');
    infos.forEach(info => {
      info.style.display = 'none';
    });
  }

  document.getElementById('openMenu').addEventListener('click', function () {
    document.getElementById('offcanvasMenu').classList.add('show');
  });

  document.getElementById('closeMenu').addEventListener('click', function () {
    document.getElementById('offcanvasMenu').classList.remove('show');
  });

});

document.addEventListener('scroll', function () {
  AOS.refresh();
});


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

