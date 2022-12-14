let preguntas_aleatorias = true;
let mostrar_pantalla_juego_terminado = true;
let reiniciar_puntos_al_principio = true;
var imagen = document.getElementById("imagen")

window.onload = function () {
  base_preguntas = readText("base-preguntas.json");
  interprete_bp = JSON.parse(base_preguntas);
  elegirPreguntaAleatoria();
};

let pregunta;
let posibles_respuestas;
btn_correspondiente = [
  select_id("boton1"),
  select_id("boton2"),
  select_id("boton3"),
  select_id("boton4")
];
let npreguntas = [];

let preguntas_hechas = 0;
let preguntas_correctas = 0;

function elegirPreguntaAleatoria() {
  let n;
  if (preguntas_aleatorias) {
    n = Math.floor(Math.random() * interprete_bp.length);
  } else {
    n = 0;
  }

  while (npreguntas.includes(n)) {
    n++;
    if (n >= interprete_bp.length) {
      n = 0;
    }
    if (npreguntas.length == interprete_bp.length) {
      //Reinicio
      if (mostrar_pantalla_juego_terminado) {
        swal.fire({
          title: "Juego terminado",
          text:
            "Puntos: " + n*10,
          icon: "succes"
        });
      }
      if (reiniciar_puntos_al_principio) {
        preguntas_correctas = 0
        preguntas_hechas = 0
      }
      npreguntas = [];
    }
  }
  npreguntas.push(n);
  preguntas_hechas++;

  elegirPregunta(n);
}

function elegirPregunta(n) {
  pregunta = interprete_bp[n];
  select_id("seleccion").innerHTML = pregunta.seleccion;
  select_id("pregunta").innerHTML = pregunta.pregunta;
  select_id("numero").innerHTML = n;
  let pc = preguntas_correctas;
  if (preguntas_hechas > 1) {
    select_id("puntaje").innerHTML = pc + "/" + (preguntas_hechas - 1);
  } else {
    select_id("puntaje").innerHTML = "";
  }

  style("imagen").objectFit = pregunta.objectFit;
  desordenarRespuestas(pregunta);
  if (pregunta.imagen) {
    select_id("imagen").setAttribute("src", pregunta.imagen);
    style("imagen").height = "350px";
    style("imagen").width = "100%";
  } else {
    style("imagen").height = "0px";
    style("imagen").width = "0px";
    setTimeout(() => {
      select_id("imagen").setAttribute("src", "");
    }, 500);
  }
}

function desordenarRespuestas(pregunta) {
  posibles_respuestas = [
    pregunta.respuesta,
    pregunta.incorrecta1,
    pregunta.incorrecta2,
    pregunta.incorrecta3,
  ];
  posibles_respuestas.sort(() => Math.random() - 0.5);

  select_id("boton1").innerHTML = posibles_respuestas[0];
  select_id("boton2").innerHTML = posibles_respuestas[1];
  select_id("boton3").innerHTML = posibles_respuestas[2];
  select_id("boton4").innerHTML = posibles_respuestas[3];
}

let suspender_botones = false;

function apretar_boton(i) {
  if (suspender_botones) {
    return;
  }
  suspender_botones = true;
  if (posibles_respuestas[i] == pregunta.respuesta) {
    preguntas_correctas++;
    btn_correspondiente[i].style.background = "green";
  } else {
    btn_correspondiente[i].style.background = "red";
  }
  for (let j = 0; j < 4; j++) {
    if (posibles_respuestas[j] == pregunta.respuesta) {
      btn_correspondiente[j].style.background = "green";
      break;
    }
  }
  setTimeout(() => {
    reiniciar();
    suspender_botones = false;
  }, 900);
}

// let p = prompt("numero")

function reiniciar() {
  for (const btn of btn_correspondiente) {
    btn.style.backgroundImage = "url('Fondo/bannerfondo.jpg')";
  }
  elegirPreguntaAleatoria();
}

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}

function readText(ruta_local) {
  var texto = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", ruta_local, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    texto = xmlhttp.responseText;
  }
  return texto;
}
