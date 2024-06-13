const urlBase = 'http://localhost:8000/';/*https://landingpages.svr6.appsfarma.com/  */
const namePage = 'TesteCKEDITOR2'

document.addEventListener('DOMContentLoaded', async function () {
  await data().then(dataFromBackend => {
    if (dataFromBackend && dataFromBackend.success && dataFromBackend.data.length > 0) {
      const description = dataFromBackend.data[0].description;
      const title = dataFromBackend.data[0].title

      document.title = title;

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

      const contentData = dataFromBackend.data[0].content;
      // Limpar o container antes de adicionar as novas seções
      const displayContainer = document.getElementById('display-container');
      displayContainer.innerHTML = '';

      // Construir e adicionar as seções ao DOM
      Object.keys(contentData).forEach(sectionIndex => {
        const sectionData = contentData[sectionIndex];
        const { type, backgroundColor, elements } = sectionData;

        // Criar a seção pai
        const sectionDiv = document.createElement('section');
        sectionDiv.className = 'section';
        sectionDiv.style.backgroundColor = backgroundColor;
        sectionDiv.id = `section-${sectionIndex}`;

        // Criar a estrutura do container do Bootstrap
        sectionDiv.innerHTML = `
      <div class="container">
        <div class="row" id="row-${sectionIndex}">
        </div>
      </div>
    `;

        // Adicionar cada elemento à row correspondente
        const rowDiv = sectionDiv.querySelector(`#row-${sectionIndex}`);
        /* const elementCount = elements.length; */

        elements.forEach((element, index) => {
          const colDiv = document.createElement('div');
          colDiv.className = `editable-section`;
          colDiv.id = `section-${sectionIndex}-${index}`;
          colDiv.innerHTML = element.data;

          if (sectionData.type === 'type1') {
            colDiv.className += ' col-md-12';
          } else if (sectionData.type === 'type2') {
            colDiv.className += ' col-md-8';
          } else if (sectionData.type === 'type3') {
            colDiv.className += ' col-md-6';
          } else if (sectionData.type === 'type4') {
            colDiv.className += ' col-md-4';
          } else if (sectionData.type === 'type5') {
            colDiv.className += ' col-md-8';
            const modalContent = `<div class="modal fade" id="contactModal" tabindex="-1" aria-hidden="true">
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
                                  </div>
                                `;

            // Adicionar o modal ao final do corpo do documento
            document.body.insertAdjacentHTML('beforeend', modalContent);

            const buttonToOpenModal = document.createElement('button');
            buttonToOpenModal.innerHTML = 'Contacte-nos Para Mais Informações ';
            buttonToOpenModal.className = 'btn btn-primary';
            buttonToOpenModal.setAttribute('data-toggle', 'modal');
            buttonToOpenModal.setAttribute('data-target', `#contactModal`);

            colDiv.appendChild(buttonToOpenModal);
            const script = document.createElement('script');
            script.src = 'assets/javascript/contact.js';
            document.body.appendChild(script);
          }
          rowDiv.appendChild(colDiv);
        });


        // Adicionar a seção ao container principal
        displayContainer.appendChild(sectionDiv);
      });
    }
  });
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

let saveBt = document.getElementById('edit-button');
saveBt.addEventListener('click', async function () {
  window.location.href = 'edit.html';
});

