const btnMenu = document.getElementById('btn-menu');
const barraLateral = document.querySelector('.barra-lateral');

btnMenu.addEventListener('click', () => {
  barraLateral.classList.toggle('active');
});

const carrerasGrid = document.querySelector('.carreras-grid');
let carreraSeleccionada = null;
let infoMostrada = null;

// Objeto con la información de cada carrera
const infoCarreras = {
  sistemas: {
    titulo: 'Ingeniería de Sistemas',
    descripcion: 'La Ingeniería de Sistemas se encarga del análisis, diseño, implementación y gestión de sistemas informáticos y tecnológicos. Formamos profesionales capaces de integrar hardware, software, redes y datos para resolver problemas en organizaciones.',
    imagen: 'img/ingenieriadesistemas.jpg',
    titulo_otorgado_bachiller: 'Bachiller universitario de Ingeniería de Sistemas',
    titulo_otorgado_profesional: 'Título profesional de Ingeniero de Sistemas',
    duracion: '5 años',
    mallaCurricularPDF: 'pdf/Malla Curricular- Ingenieria de Sistemas.pdf'
  },
  software: {
    titulo: 'Ingeniería de Software',
    descripcion: 'La Ingeniería de Software se enfoca en el diseño, desarrollo, mantenimiento y gestión de programas informáticos y sistemas digitales. Formamos  profesionales capaces de crear aplicaciones, páginas web, sistemas empresariales y soluciones tecnológicas para distintos sectores.',
    imagen: 'img/ingenieriadesoftware.jpg',
    titulo_otorgado_bachiller: 'Bachiller universitario de Ingeniería de Software',
    titulo_otorgado_profesional: 'Título profesional de Ingeniero de Software',
    duracion: '5 años',
    mallaCurricularPDF: 'pdf/Malla Curricular- Ingenieria de Software.pdf'
  },
  datos: {
    titulo: 'Ciencia de Datos',
    descripcion: 'La Ciencia de Datos combina estadística, programación y análisis para extraer conocimiento útil a partir de grandes volúmenes de datos. Formamos profesionales capaces de tomar decisiones basadas en evidencia, desarrollar modelos predictivos y optimizar procesos.',
    imagen: 'img/cienciadedatos.jpg',
    titulo_otorgado_bachiller: 'Bachiller universitario de Ingeniería de Ciencia de datos',
    titulo_otorgado_profesional: 'Título profesional de Ingeniero de Ciencia de datos',
    duracion: '5 años',
    mallaCurricularPDF: 'pdf/Malla Curricular – Ingeniería de Ciencia de Datos.pdf'
  },
  ciberseguridad: {
    titulo: 'Ciberseguridad',
    descripcion: 'La Ciberseguridad se encarga de proteger sistemas, redes y datos frente a amenazas digitales. Formamos profesionales capacitados para prevenir ataques informáticos, detectar vulnerabilidades y responder ante incidentes de seguridad.',
    imagen: 'img/ciberseguridad.jpg',
    titulo_otorgado_bachiller: 'Bachiller universitario de Ingeniería de Ciberseguridad',
    titulo_otorgado_profesional: 'Título profesional de Ingeniero de Ciberseguridad',
    duracion: '5 años',
    mallaCurricularPDF: 'pdf/Malla Curricular- Ingenieria de Ciberseguridad.pdf'
  },
  web: {
    titulo: 'Desarrollo Web',
    descripcion: 'El Desarrollo Web se enfoca en la creación de sitios y aplicaciones web. Formamos profesionales capaces de diseñar, programar y mantener plataformas digitales modernas, funcionales y adaptadas a diferentes dispositivos.',
    imagen: 'img/desarrolloweb.jpeg',
    titulo_otorgado_bachiller: 'Bachiller universitario de Ingeniería de Desarrollo Web',
    titulo_otorgado_profesional: 'Título profesional de Ingeniero de Desarrollo Web',
    duracion: '5 años',
    mallaCurricularPDF: 'pdf/Malla Curricular– Ingeniería de Desarrollo Web.pdf'
  },
  ia: {
    titulo: 'Inteligencia Artificial',
    descripcion: 'La Inteligencia Artificial se enfoca en el desarrollo de sistemas que pueden aprender, razonar y tomar decisiones. Formamos profesionales capaces de diseñar algoritmos inteligentes, automatizar procesos y crear soluciones innovadoras con tecnologías avanzadas.',
    imagen: 'img/inteligenciaartificial.jpg',
    titulo_otorgado_bachiller: 'Bachiller universitario de Ingeniería de Inteligencia Artificial',
    titulo_otorgado_profesional: 'Título profesional de Ingeniero de Inteligencia Artificial',
    duracion: '5 años',
    mallaCurricularPDF: 'pdf/Malla Curricular- Ingenieria de Inteligencia Artificial.pdf'
  },
  redes: {
    titulo: 'Redes y Telecomunicaciones',
    descripcion: 'La carrera de Redes y Telecomunicaciones se centra en el diseño, instalación, administración y seguridad de redes de comunicación. Formamos profesionales capaces de conectar personas y sistemas a través de tecnologías modernas como internet, fibra óptica, redes móviles y más.',
    imagen: 'img/redesytelecomunicaciones.jpg',
    titulo_otorgado_bachiller: 'Bachiller universitario de Ingeniería de Redes y Telecomunicaciones',
    titulo_otorgado_profesional: 'Título profesional de Ingeniero de Redes y Telecomunicaciones',
    duracion: '5 años',
    mallaCurricularPDF: 'pdf/Malla Curricular– Ingeniería de Redes y Telecomunicaciones.pdf'
  },
  electronica: {
    titulo: 'Ingeniería Electrónica',
    descripcion: 'La Ingeniería Electrónica se enfoca en el diseño, análisis y desarrollo de sistemas electrónicos. Formamos profesionales capaces de trabajar con circuitos, sensores, microcontroladores y tecnologías que se utilizan en la automatización, telecomunicaciones, robótica y más.',
    imagen: 'img/ingenieriaelectronica.jpg',
    titulo_otorgado_bachiller: 'Bachiller universitario de Ingeniería de Electrónica',
    titulo_otorgado_profesional: 'Título profesional de Ingeniero de Electrónica',
    duracion: '5 años',
    mallaCurricularPDF: 'pdf/Malla Curricular– Ingeniería Electrónica .pdf'
  },
  ti: {
    titulo: 'Administración de TI',
    descripcion: 'En la carrera de Administración de Tecnologías de la Información formamos profesionales capaces de gestionar los recursos tecnológicos de una organización. Donde se combina conocimientos de informática y gestión empresarial para alinear la tecnología con los objetivos estratégicos.',
    imagen: 'img/administradordeti.jpg',
    titulo_otorgado_bachiller: 'Bachiller universitario de Ingeniería de Administración de TI',
    titulo_otorgado_profesional: 'Título profesional de Ingeniero de Administración de TI',
    duracion: '5 años',
    mallaCurricularPDF: 'pdf/Malla Curricular– Ingeniería de Administración de Tecnologías de la Información (TI).pdf'
  },
  robotica: {
    titulo: 'Robótica y Automatización',
    descripcion: 'La carrera de Robótica y Automatización se enfoca en el diseño, construcción y control de sistemas robóticos e industriales automatizados. Formamos profesionales capaces de integrar electrónica, programación y control para crear soluciones inteligentes que optimicen procesos.',
    imagen: 'img/roboticayautomatizacion.webp',
    titulo_otorgado_bachiller: 'Bachiller universitario de Ingeniería de Robótica y Automatización',
    titulo_otorgado_profesional: 'Título profesional de Ingeniero de Robótica y Automatización',
    duracion: '5 años',
    mallaCurricularPDF: 'pdf/Malla Curricular– Ingeniería de Robótica y Automatización.pdf'
  }
};

// Función para crear dinámicamente la información de una carrera
function crearInfoCarrera(info) {
  const div = document.createElement('div');
  div.classList.add('info-carrera-dinamico');

  if (info.titulo === 'Ingeniería de Sistemas') {
    div.classList.add('info-sistemas');
  }

  let mallaHTML = '';
  if (info.mallaCurricularPDF) {
    mallaHTML = `<p><a href="${info.mallaCurricularPDF}" target="_blank" rel="noopener">Ver Malla Curricular</a></p>`;
  }

  div.innerHTML = `
    <h3>${info.titulo}</h3>
    <p>${info.descripcion}</p>
    <img src="${info.imagen}" alt="Imagen de ${info.titulo}" class="imagen-carrera">
    <div class="titulos-otorgados">
      <h4>Títulos que otorgamos:</h4>
      <ul>
        <li>${info.titulo_otorgado_bachiller}</li>
        <li>${info.titulo_otorgado_profesional}</li>
      </ul>
    </div>
    <p><strong>Duración:</strong> ${info.duracion}</p>
    ${mallaHTML}
  `;

  return div;
}

carrerasGrid.addEventListener('click', (event) => {
  const carreraElemento = event.target.closest('.carrera');
  if (!carreraElemento) return;

  const carreraId = carreraElemento.dataset.carrera;

  if (carreraSeleccionada === carreraElemento) {
    if (infoMostrada) {
      infoMostrada.remove();
      infoMostrada = null;
    }
    carreraSeleccionada = null;
  } else {
    const info = infoCarreras[carreraId];
    if (info) {
      if (infoMostrada) {
        infoMostrada.remove();
      }

      const nuevoInfoDiv = crearInfoCarrera(info);
      carreraElemento.parentNode.insertBefore(nuevoInfoDiv, carreraElemento.nextSibling);

      infoMostrada = nuevoInfoDiv;
      carreraSeleccionada = carreraElemento;
    } else {
      if (infoMostrada) {
        infoMostrada.remove();
        infoMostrada = null;
      }
      carreraSeleccionada = null;
    }
  }
});
