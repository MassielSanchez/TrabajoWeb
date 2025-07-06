function switchTab(event, tabName) {
      // Ocultar todos los contenidos de tabs
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach(content => {
        content.classList.remove('active');
      });

      // Desactivar todos los tabs
      const tabs = document.querySelectorAll('.tab');
      tabs.forEach(tab => {
        tab.classList.remove('active');
      });

      // Activar el tab seleccionado
      event.currentTarget.classList.add('active');
      document.getElementById(tabName).classList.add('active');
    }

    function toggleCourse(element) {
      const courseCard = element.closest('.course-card');
      courseCard.classList.toggle('expanded');
    }

    function calculateFinalGrade(input) {
      const row = input.closest('tr');
      const inputs = row.querySelectorAll('.grade-input');
      const finalGradeCell = row.querySelector('.final-grade');
      const statusCell = row.querySelector('.status-badge');
      
      // Obtener las notas
      const pc = parseFloat(inputs[0].value) || 0;
      const participation = parseFloat(inputs[1].value) || 0;
      const theory = parseFloat(inputs[2].value) || 0;
      const finalExam = parseFloat(inputs[3].value) || 0;
      
      // Calcular promedio ponderado
      const finalGrade = (pc * 0.30) + (participation * 0.10) + (theory * 0.40) + (finalExam * 0.20);
      
      // Actualizar promedio final
      finalGradeCell.textContent = finalGrade.toFixed(1);
      
      // Actualizar estado
      if (finalGrade >= 11) {
        statusCell.textContent = 'Aprobado';
        statusCell.className = 'status-badge status-approved';
      } else {
        statusCell.textContent = 'Desaprobado';
        statusCell.className = 'status-badge status-failed';
      }
    }

    function saveGrades() {
      // Simular guardado de calificaciones
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
      `;
      notification.textContent = 'Calificaciones guardadas exitosamente';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }

    function openAddStudentModal() {
      document.getElementById('addStudentModal').style.display = 'block';
    }

    function closeAddStudentModal() {
      document.getElementById('addStudentModal').style.display = 'none';
      document.getElementById('addStudentForm').reset();
    }

    // Manejar formulario de agregar estudiante
    document.getElementById('addStudentForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('studentName').value;
      const code = document.getElementById('studentCode').value;
      const email = document.getElementById('studentEmail').value;
      
      // Agregar nueva fila a la tabla
      const tableBody = document.getElementById('studentsTableBody');
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${name}</td>
        <td>${code}</td>
        <td><input type="number" class="grade-input" min="0" max="20" value="0" onchange="calculateFinalGrade(this)"></td>
        <td><input type="number" class="grade-input" min="0" max="20" value="0" onchange="calculateFinalGrade(this)"></td>
        <td><input type="number" class="grade-input" min="0" max="20" value="0" onchange="calculateFinalGrade(this)"></td>
        <td><input type="number" class="grade-input" min="0" max="20" value="0" onchange="calculateFinalGrade(this)"></td>
        <td class="final-grade">0.0</td>
        <td><span class="status-badge status-pending">Pendiente</span></td>
      `;
      
      tableBody.appendChild(newRow);
      closeAddStudentModal();
      
      // Mostrar notificación
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
      `;
      notification.textContent = `Estudiante ${name} agregado exitosamente`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    });

    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
      const modal = document.getElementById('addStudentModal');
      if (event.target === modal) {
        closeAddStudentModal();
      }
    }

    // Agregar estilos para animaciones
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);