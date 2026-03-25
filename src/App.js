/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import * as XLSX from "xlsx";
/* EmailJS: descomentar cuando esté aprobado */
/* import emailjs from "@emailjs/browser"; */

/* ══════════════════════════════════════════════════════════════
   DESIGN SYSTEM — Luxury Corporate
   Brand: #7823DC (dominant violet)
   ══════════════════════════════════════════════════════════════ */
var T = {
  brand:"#7823DC", brandDark:"#5A1BA6", brandLight:"#9B4DFF", brandGhost:"rgba(120,35,220,0.06)", brandGhost2:"rgba(120,35,220,0.12)",
  gold:"#C6973B", goldLight:"#E8C872",
  white:"#FFFFFF", offWhite:"#F7F6F9", cream:"#FAFAFA", snow:"#F0EFF4",
  dark:"#1E1E1E", darkCard:"#2A2A2A", darkBorder:"#2D2540",
  gray900:"#1C1C1E", gray700:"#3A3A3C", gray500:"#636366", gray400:"#8E8E93", gray300:"#C7C7CC", gray200:"#E5E5EA", gray100:"#F2F2F7",
  green:"#1B9E5E", greenLight:"#D1FAE5", red:"#C9303E", amber:"#D4860A",
  teal:"#0891B2",
  ch0:"#D2D2D2", ch1:"#787878", ch2:"#D2D2D2", ch3:"#C8A5F0", ch4:"#7823DC",
  e0:"#B8B8C0", e1:"#787878", e2:"#D2D2D2", e3:"#C8A5F0", e4:"#7823DC",
  lk1:"#E48888", lk2:"#F0B8B8", lk3:"#B8D4B8", lk4:"#A3D9A5", lk0:"stripe",
  lkCh0:"#D2D2D2", lkCh1:"#787878", lkCh2:"#D2D2D2", lkCh3:"#C8A5F0", lkCh4:"#7823DC",
  font:"'Helvetica Neue', Helvetica, Arial, sans-serif", fontBody:"'Helvetica Neue', Helvetica, Arial, sans-serif",
  shadow:"0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)", shadowLg:"0 8px 32px rgba(0,0,0,0.12)"
};

/* ══════════ QUESTION BANKS ══════════ */
var ESTADIOS = [
  {id:"1E",tema:"Orden del día",e1:"No existe o los miembros de la Junta Directiva no tienen conocimiento previo de los puntos del orden del día de las sesiones.",e2:"Los puntos del orden del día de las sesiones priorizan temas operativos por encima de temas estratégicos.",e3:"Los puntos del orden del día de las sesiones priorizan temas estratégicos por encima de temas operativos y asignan una mayor proporción de tiempo a la discusión que a la presentación.",e4:"Los puntos del orden del día de las sesiones priorizan temas estratégicos por encima de temas operativos y asignan una mayor proporción de tiempo a la discusión que a la presentación. El orden del día de las sesiones está alineado con la agenda anual de la Junta Directiva."},
  {id:"2E",tema:"Periodicidad y duración de las sesiones de Junta Directiva",e1:"La periodicidad y duración actual de las sesiones no son apropiadas para cumplir con las labores de la Junta Directiva.",e2:"La periodicidad de las sesiones es apropiada para cumplir con las labores de la Junta Directiva. Sin embargo, la duración y la forma en que se desarrollan actualmente no resultan efectivas.",e3:"La periodicidad y la duración de las sesiones son apropiadas para cumplir con las labores de la Junta Directiva; sin embargo, la manera en que se llevan a cabo las sesiones no es aún efectiva.",e4:"La periodicidad y duración actual de las sesiones de la Junta Directiva son apropiadas para cumplir con las labores de la Junta y la manera cómo se llevan a cabo resultan efectivas."},
  {id:"3E",tema:"Calidad de la información enviada de manera previa a las reuniones de la Junta Directiva",e1:"La información que reciben los miembros de Junta es incompleta, extensa o su formato hace difícil su estudio.",e2:"La información que reciben los miembros de Junta es completa pero no está priorizada, resumida y su formato no es amigable.",e3:"La información entregada es completa, priorizada y resumida pero su formato hace difícil su estudio.",e4:"La información que reciben los miembros de Junta es completa, oportuna, priorizada, resumida y en un formato amigable. Se sostiene al menos una discusión en cada período para retroalimentar a la administración y generar lineamientos respecto a la información recibida."},
  {id:"4E",tema:"Cultura abierta al debate",e1:"La participación de los Directores en las sesiones de la Junta Directiva no es activa.",e2:"Existe participación activa de algunos miembros de la Junta Directiva.",e3:"Existe participación activa de algunos miembros de la Junta Directiva. El Presidente de la Junta Directiva estimula la participación abierta de los Directores dentro de las sesiones. Las discusiones generadas están enmarcadas por el respeto y la tolerancia de las opiniones de todos los miembros.",e4:"Existe participación activa de todos los miembros de la Junta Directiva. El Presidente de la Junta Directiva estimula la participación de los Directores y fomenta una cultura abierta al debate que permite la contribución de sus miembros y de sus puntos de vista objetivos. Las discusiones generadas están enmarcadas por el respeto y la tolerancia de las opiniones de todos los miembros. Se fomentan debates serios, profundos y profesionales."},
  {id:"5E",tema:"Tecnología y transformación digital",e1:"Los asuntos tecnológicos son considerados de carácter operativo y no los conoce la Junta Directiva.",e2:"La Junta Directiva conoce los temas de tecnología, pero los aborda de forma reactiva. No existe una comprensión de los riesgos y oportunidades asociados a la digitalización.",e3:"La Junta Directiva incorpora de manera periódica los temas tecnológicos y de transformación digital en su agenda. Existe una comprensión parcial de los riesgos y oportunidades asociados a la digitalización.",e4:"La Junta Directiva incorpora de manera periódica los temas tecnológicos y de transformación digital en su agenda. La Junta Directiva promueve una visión de largo plazo sobre la competitividad digital; la tecnología es entendida como un habilitador clave del modelo de negocio. Existe una comprensión de los riesgos y oportunidades asociados a la digitalización."},
  {id:"6E",tema:"Dedicación de los miembros",e1:"Ninguno de los miembros de la Junta Directiva dedica el tiempo suficiente para estudiar los asuntos del orden del día. La Junta Directiva se informa con las presentaciones realizadas en la sesión.",e2:"Algunos de los miembros de la Junta Directiva dedican el tiempo suficiente para estudiar los asuntos del orden del día.",e3:"La mayoría de los miembros de la Junta Directiva dedican el tiempo suficiente para estudiar los asuntos del orden del día.",e4:"Todos los miembros de la Junta Directiva dedican el tiempo suficiente para estudiar los asuntos del orden del día. Los Directores formulan preguntas y preparan posturas previas a las sesiones."},
  {id:"7E",tema:"Liderazgo y dirección de las sesiones de la Junta",e1:"El Presidente de la Compañía prepara el orden del día de cada sesión y dirige las sesiones de la Junta.",e2:"El Presidente de la Junta Directiva prepara con el Presidente de la Compañía el orden del día de cada sesión de la Junta. Sin embargo, el Presidente de la Compañía es quien dirige las sesiones.",e3:"El Presidente de la Junta Directiva prepara el orden del día para cada sesión con el Presidente de la Compañía. El Presidente de la Junta Directiva es quien dirige las sesiones.",e4:"El Presidente de la Junta Directiva prepara con el Presidente de la Compañía el orden del día de cada sesión de la Junta. El Presidente de la Junta Directiva es quien dirige las sesiones, fomentando la participación de los miembros, ayudando a concluir las discusiones y asegurando que se cumplan los tiempos y los puntos de las sesiones. El Presidente de la Junta Directiva promueve el diálogo y actúa como la voz de la Junta Directiva frente al Presidente de la Compañía y al equipo directivo."},
  {id:"8E",tema:"Interacción entre miembros de Junta Directiva",e1:"La relación entre los miembros de la Junta Directiva no se caracteriza por el respeto y la tolerancia a las opiniones de los demás.",e2:"La relación entre los miembros de la Junta Directiva está basada en el respeto y la tolerancia a las opiniones de los demás.",e3:"La relación entre los miembros de la Junta Directiva está basada en el respeto y la tolerancia a las opiniones de los demás. Existe confianza entre algunos de los miembros de la Junta Directiva.",e4:"La relación entre los miembros de la Junta Directiva está basada en el respeto y la tolerancia a las opiniones de los demás. Existe confianza entre todos los miembros de la Junta Directiva y la opinión de todos los miembros es igualmente respetada. Todos los miembros participan en igualdad de condiciones."},
  {id:"9E",tema:"Plan Anual de Trabajo",e1:"No existe un Plan Anual de Trabajo de temas para la Junta Directiva.",e2:"Existe un Plan Anual de Trabajo de temas para la Junta Directiva. El diseño del Plan Anual de Trabajo es liderado por el Primer Ejecutivo.",e3:"Existe un Plan Anual de Trabajo de temas para la Junta Directiva. El diseño del Plan Anual de Trabajo es liderado por el Primer Ejecutivo. El Plan Anual de Trabajo responde a la estrategia de la empresa y a sus objetivos.",e4:"Existe un Plan Anual de Trabajo de temas para la Junta Directiva. El diseño es liderado por el Presidente de la Junta Directiva y todos los miembros son partícipes. El Plan Anual de Trabajo responde a la estrategia de la empresa y a sus objetivos."},
  {id:"10E",tema:"Diversidad de perfiles de Junta",e1:"La combinación de habilidades de los miembros de la Junta Directiva es insuficiente y no genera el valor esperado para la compañía.",e2:"La combinación de habilidades de los miembros de la Junta Directiva es aceptable, pero se necesitan ciertos perfiles para satisfacer las necesidades de la compañía.",e3:"La combinación de habilidades de los miembros de la Junta Directiva es adecuada; sin embargo, se necesita un perfil específico para satisfacer las necesidades de la compañía.",e4:"La combinación de habilidades de los miembros de la Junta Directiva es ideal y genera valor para la compañía."},
  {id:"11E",tema:"Interacción entre Junta Directiva y la Secretaría General",e1:"La Secretaría General actúa como apoyo administrativo: envía convocatorias, consolida insumos y coordina la preparación logística y documental básica.",e2:"Además de lo anterior, la Secretaría General coordina la preparación de materiales y agendas mediante un flujo organizado y oportuno de información.",e3:"Además de lo anterior, la Secretaría General establece un proceso formal para asegurar el suministro de materiales, calidad y oportunidad en la información.",e4:"Además de lo anterior, la Secretaría General es articuladora clave del funcionamiento de la Junta: asegura información clara, oportuna y estratégica; anticipa necesidades; coordina con el Presidente de la JD el Plan de Trabajo Anual."},
  {id:"12E",tema:"Gestión de conflictos de interés",e1:"No existe una definición clara de lo que constituye un conflicto de interés.",e2:"La Administración es quien define y decide lo que constituye un conflicto de interés de manera reactiva.",e3:"Existe documentación clara en la cual la Junta conoce cuáles situaciones constituyen un conflicto de interés.",e4:"La Junta gestiona los conflictos de interés de manera proactiva, transparente y sistemática."},
  {id:"13E",tema:"Interacción entre Presidente de la Junta Directiva y Presidente de la compañía",e1:"No existe respeto ni reconocimiento de liderazgo entre el Presidente de la Junta y el Presidente de la Compañía.",e2:"Existe respeto y reconocimiento de liderazgo entre el Presidente de la Junta Directiva y el Presidente de la Compañía.",e3:"Existe respeto y reconocimiento de liderazgo entre el Presidente de la Junta Directiva y el Presidente de la Compañía. El Presidente de la Junta Directiva actúa como puente.",e4:"Existe respeto y reconocimiento de liderazgo entre el Presidente de la Junta y el Presidente de la Compañía. El Presidente actúa como puente y apoyo consejero."},
  {id:"14E",tema:"Interacción entre Junta Directiva y Alta Gerencia",e1:"No existe respeto ni reconocimiento de liderazgo entre la Junta Directiva y la Alta Gerencia.",e2:"Existe respeto y reconocimiento de liderazgo entre la Junta Directiva y la Alta Gerencia. Sin embargo, en ocasiones la Junta siente que sus peticiones no son ejecutadas efectivamente.",e3:"Existe respeto y reconocimiento de liderazgo entre la Junta Directiva y la Alta Gerencia. La Junta siente que sus peticiones siempre son ejecutadas efectivamente.",e4:"Existe respeto y reconocimiento de liderazgo entre la Junta Directiva y la Alta Gerencia. La relación se traduce en un trabajo fluido donde la Junta es percibida como consejero."},
  {id:"15E",tema:"Estrategia de sucesión del Presidente de la Compañía",e1:"La Junta no ha discutido formalmente el Plan de Sucesión para la Alta Dirección.",e2:"El Presidente de la Compañía reporta los posibles candidatos para la sucesión de la Alta Dirección.",e3:"El Presidente de la Compañía reporta posibles candidatos a la Alta Dirección y la Junta Directiva los monitorea.",e4:"La Junta Directiva define y monitorea los posibles sucesores de la Alta Dirección. Durante el último período hubo al menos una discusión formal al respecto."},
  {id:"16E",tema:"Funciones generales y funciones específicas de la Junta Directiva",e1:"Los miembros de la Junta Directiva no están al tanto de las políticas de talento humano, gestión de riesgos, planeación financiera, estrategia y la cultura organizacional.",e2:"Las políticas de talento humano, riesgos, planeación financiera, estrategia y cultura organizacional estuvieron a cargo del Presidente de la Compañía.",e3:"En la Junta Directiva se revisan las políticas de recursos humanos, riesgos, planeación financiera, estrategia y cultura organizacional.",e4:"La Junta Directiva dedica sesiones exclusivas a discutir y revisar las políticas de talento humano, riesgos, planeación financiera, estrategia y cultura organizacional."},
  {id:"17E",tema:"Comités de la Junta Directiva",e1:"La Junta Directiva no cuenta con comités que apoyen la toma de decisiones.",e2:"La Junta Directiva cuenta con comités que apoyan la toma de decisiones. Sin embargo, no todos los comités existentes son necesarios o hacen falta algunos adicionales.",e3:"La Junta Directiva cuenta con comités que apoyan la toma de decisiones. Los comités existentes son suficientes para la labor estratégica. Sin embargo, el funcionamiento de todos estos no es eficiente.",e4:"La Junta Directiva cuenta con comités que apoyan la toma de decisiones. Los comités existentes son suficientes y su funcionamiento es eficiente."},
  {id:"18E",tema:"Relevancia de los comités",e1:"No existen comités o el número de sesiones anuales de los comités no es suficiente para el cumplimiento de sus funciones.",e2:"El número de sesiones anuales de los comités es suficiente para el cumplimiento de sus funciones. Se les delega efectivamente el análisis a profundidad de temas específicos.",e3:"El número de sesiones anuales de los comités es suficiente. Los comités tienen discusiones efectivas y llegan a recomendaciones acertadas.",e4:"El número de sesiones anuales de los comités es suficiente. Los comités tienen discusiones efectivas y sus recomendaciones son comunicadas a la Junta Directiva y aportan a la toma de decisiones."},
  {id:"19E",tema:"Diseño y definición del Plan Estratégico de la Empresa",e1:"La Administración, liderada por el Presidente, es quien diseña y define el Plan Estratégico. La Junta Directiva es informada de su ejecución.",e2:"La Administración diseña y define el Plan Estratégico. La Junta Directiva aprueba la estrategia y monitorea su ejecución.",e3:"La Administración diseña y define el Plan Estratégico. La Junta Directiva aprueba la estrategia, monitorea su ejecución y contribuye en la definición de objetivos.",e4:"La Junta Directiva es proactiva en liderar y participar activamente con la Administración en el diseño del Plan Estratégico. La Junta monitorea constantemente su ejecución."},
  {id:"20E",tema:"Distribución y profundidad de temas vistos en el Plan Anual de la Junta Directiva",e1:"No hay una planeación clara alrededor de la frecuencia y profundidad en que se tratan los distintos mercados y operaciones.",e2:"No hay una planeación clara alrededor de la frecuencia y profundidad en que se tratan los distintos mercados y operaciones.",e3:"Existe una planeación clara alrededor de la frecuencia y la profundidad en la que se tratan los distintos mercados, según lo acordado por la Junta Directiva.",e4:"Existe una planeación clara alrededor de la frecuencia y la profundidad en la que se tratan los distintos mercados. Los retos y oportunidades particulares se analizan comparativamente al menos una vez al año."},
  {id:"21E",tema:"Gestión de riesgo",e1:"No se cuenta con un comité responsable de monitorear los riesgos de la compañía.",e2:"El comité responsable monitorea y analiza los riesgos de la empresa. Este reporta ocasionalmente a la Junta Directiva.",e3:"La Junta Directiva define el mapa de riesgos de la empresa. El comité responsable monitorea y reporta constantemente a la Junta Directiva.",e4:"La agenda anual incluye una sesión para definir los riesgos estratégicos de la empresa, el mapa de riesgos y sus indicadores de seguimiento."},
  {id:"22E",tema:"Sostenibilidad",e1:"Los miembros de la Junta desconocen el concepto de sostenibilidad y/o en las sesiones no se tratan temas asociados a la sostenibilidad.",e2:"Los miembros de la Junta conocen el concepto de sostenibilidad, pero no se tratan temas asociados a la sostenibilidad en las sesiones.",e3:"Los miembros de la Junta manejan el tema de sostenibilidad a profundidad; sin embargo, no se tiene una postura clara frente a las políticas de sostenibilidad.",e4:"Los miembros de la Junta manejan el tema de sostenibilidad a profundidad y se tiene una postura clara frente a las políticas de sostenibilidad que se ve reflejada en proyectos e iniciativas puntuales."},
  {id:"23E",tema:"Envío de información pre-junta",e1:"La información entregada es incompleta, extensa y su formato hace difícil su estudio.",e2:"La información entregada es completa, oportuna, priorizada y resumida. La información se recibe con al menos tres días hábiles de antelación.",e3:"La información entregada es completa, oportuna, priorizada, resumida y en un formato amigable. La información se recibe con al menos cinco días hábiles de antelación.",e4:"La información entregada es completa, oportuna, priorizada, resumida y en un formato amigable. Se recibe con al menos cinco días hábiles de antelación y se realiza al menos una discusión en cada periodo para retroalimentar al Presidente."}
];

var AFIRMACIONES = [
  {id:"1A",sec:"Afirmaciones",tema:"Roles de los miembros de la Junta Directiva",texto:"Los miembros de la Junta Directiva tienen claramente entendidos y apropiados sus roles, responsabilidades y derechos de decisión dentro de la relación Matriz–Filial."},
  {id:"2A",sec:"Afirmaciones",tema:"Secretaría General",texto:"La Secretaría General vela por la legalidad formal de las actuaciones de la Junta Directiva y garantiza que sus procedimientos y reglas de gobierno sean respetados."},
  {id:"3A",sec:"Afirmaciones",tema:"Formato híbrido de las sesiones",texto:"El formato de las sesiones híbridas es adecuado para la dinámica e interacción de la Junta Directiva."},
  {id:"4A",sec:"Afirmaciones",tema:"Lineamientos Matriz - Filial",texto:"Los lineamientos y prioridades definidos por la matriz se comunican oportunamente a la Junta Directiva."},
  {id:"5A",sec:"Afirmaciones",tema:"Coherencia corporativa y competitiva",texto:"Las decisiones adoptadas por la Junta Directiva están alineadas con las directrices impartidas por la matriz, de modo que se asegura la coherencia corporativa y competitiva."},
  {id:"6A",sec:"Afirmaciones",tema:"Participación de miembros suplentes",texto:"La participación de los suplentes en las sesiones aporta valor a las discusiones de la Junta Directiva."},
  {id:"7A",sec:"Afirmaciones",tema:"Rol de los miembros independientes",texto:"Los miembros independientes conocen los requerimientos de su rol y están empoderados. Esto se evidencia en las discusiones de la Junta Directiva."}
];

var COMITE_AFIRMACIONES_STD = [
  {id:"8C",tema:"Periodicidad",texto:"El Comité sesiona con la periodicidad adecuada para cumplir con sus funciones."},
  {id:"9C",tema:"Plan Anual de Trabajo",texto:"El Comité tiene un plan anual que asegura que se cubran los temas necesarios para cumplir sus funciones."},
  {id:"10C",tema:"Presidente del Comité",texto:"El Presidente del Comité comunica formalmente a la Junta Directiva las recomendaciones y decisiones del Comité."},
  {id:"11C",tema:"Material prelectura",texto:"Los miembros del Comité reciben material de prelectura suficiente y oportuno que permite un análisis profundo y pertinente."},
  {id:"12C",tema:"Recomendaciones a la Junta Directiva",texto:"Las recomendaciones y resultados del Comité se comunican a la Junta Directiva de manera oportuna, clara y suficientemente transparente."},
  {id:"13C",tema:"Composición del Comité",texto:"La combinación de habilidades y perfiles de los miembros corresponde al objetivo y funciones del Comité."}
];

var ABIERTAS_COMITE = [
  {id:"1P",sec:"Comités",tema:"Comentarios sobre Comités",pregunta:"Con respecto a los Comités en los que NO es miembro, ¿tiene algún comentario?",tipo:"texto"},
  {id:"2P",sec:"Comités",tema:"Suficiencia de Comités",pregunta:"¿Considera que existen todos los Comités necesarios? En caso contrario, indique cuáles adicionaría o eliminaría y por qué.",tipo:"texto"}
];

var ABIERTAS = [
  {id:"3P",sec:"Preguntas abiertas",tema:"Perfil nuevo miembro",pregunta:"¿Qué perfil, experiencia y/o capacidades debería tener un nuevo miembro para aportar a la estrategia de la Compañía en el mediano y largo plazo?",tipo:"texto"},
  {id:"4PC",sec:"Preguntas Críticas",tema:"Preguntas críticas",pregunta:"¿Cuáles son las tres (3) preguntas críticas o clave que usted, como miembro de la Junta Directiva, considera deben ser abordadas durante los próximos doce (12) meses? Por favor formúlelas como pregunta y sea específico.",tipo:"triple_text"},
  {id:"5PA",sec:"Plan de acción",tema:"Áreas de conocimiento",pregunta:"Del siguiente listado de áreas de conocimiento, por favor seleccione las tres (3) temáticas sobre las que considera que necesita aprender más.",tipo:"choose3"},
  {id:"6AC",sec:"Plan de acción",tema:"Plan de acción estratégico",pregunta:"Seleccione los tres (3) temas estratégicos y/o retos que usted considera de mayor relevancia para incluir en el plan anual de la Junta Directiva para los próximos tres (3) años:",tipo:"choose3"}
];


/* ══════════ TERMINOLOGÍA POR PAÍS ══════════ */
var TERM_PRESETS = {
  "Colombia": {organo:"Junta Directiva",presidente:"Presidente de la Junta Directiva",miembros:"miembros de la Junta Directiva",secretaria:"Secretaría de Junta",sesiones:"sesiones de Junta"},
  "México": {organo:"Consejo de Administración",presidente:"Presidente del Consejo",miembros:"consejeros",secretaria:"Secretaría del Consejo",sesiones:"sesiones del Consejo"},
  "Guatemala": {organo:"Consejo de Administración",presidente:"Presidente del Consejo",miembros:"consejeros",secretaria:"Secretaría del Consejo",sesiones:"sesiones del Consejo"},
  "Perú": {organo:"Directorio",presidente:"Presidente del Directorio",miembros:"directores",secretaria:"Secretaría del Directorio",sesiones:"sesiones del Directorio"}
};
var TERM_DEFAULT = {organo:"Junta Directiva",presidente:"Presidente de la Junta Directiva",miembros:"miembros de la Junta Directiva",secretaria:"Secretaría de Junta",sesiones:"sesiones de Junta"};

/* Detecta si el órgano es masculino (Consejo, Directorio) o femenino (Junta) */
function organoMasc(organo) {
  if(!organo) return false;
  var o = organo.toLowerCase();
  return o.indexOf("consejo") !== -1 || o.indexOf("directorio") !== -1 || o.indexOf("comité") !== -1;
}

function applyTerms(text, terms) {
  if(!text||!terms) return text;
  var t = terms;
  var masc = organoMasc(t.organo);
  var art    = masc ? "el"  : "la";
  var artDe  = masc ? "del" : "de la";
  var artA   = masc ? "al"  : "a la";
  var artCap = masc ? "El"  : "La";
  var artDeCap = masc ? "Del" : "De la";
  var artACap  = masc ? "Al"  : "A la";
  return text
    .replace(/Presidente de la Junta Directiva/g, t.presidente)
    .replace(/Presidente de la JD/g, t.presidente)
    .replace(/Presidente de la Junta/g, t.presidente)
    .replace(/miembros de la Junta Directiva/g, t.miembros)
    .replace(/miembros de Junta Directiva/g, t.miembros)
    .replace(/miembros de Junta/g, t.miembros)
    .replace(/Miembros de Junta/g, t.miembros.charAt(0).toUpperCase()+t.miembros.slice(1))
    .replace(/Secretaría de Junta/g, t.secretaria)
    .replace(/sesiones de la Junta Directiva/g, t.sesiones)
    .replace(/sesiones de Junta Directiva/g, t.sesiones)
    .replace(/sesiones de Junta/g, t.sesiones)
    .replace(/Junta Directiva/g, t.organo)
    .replace(/a la Junta(| )/g, function(m,s){return artA+" "+t.organo+s})
    .replace(/A la Junta(| )/g, function(m,s){return artACap+" "+t.organo+s})
    .replace(/de la Junta(| )/g, function(m,s){return artDe+" "+t.organo+s})
    .replace(/De la Junta(| )/g, function(m,s){return artDeCap+" "+t.organo+s})
    .replace(/la Junta(| )/g, function(m,s){return art+" "+t.organo+s})
    .replace(/La Junta(| )/g, function(m,s){return artCap+" "+t.organo+s})
    .replace(/de Junta(\b|,|\.|;| |$)/g, function(m,s){return artDe+" "+t.organo+s})
    .replace(/De Junta(\b|,|\.|;| |$)/g, function(m,s){return artDeCap+" "+t.organo+s});
}

/* ══════════ INSTRUCCIONES POR SECCIÓN ══════════ */
var INSTR_DEFAULT = {
  general: "Bienvenido a la herramienta de captura de información para la evaluación de desempeño de la Junta Directiva de {empresa}.\n\nA continuación, le compartimos las consideraciones que deberá tener en cuenta:\n\n• La herramienta estará disponible desde {fechaInicio} hasta {fechaFin}. Le recomendamos responder en un solo intento para evitar la pérdida de información.\n\n• Completar el cuestionario le tomará entre {durMin} y {durMax} minutos.\n\n• Le recomendamos diligenciarlo desde un computador o tableta. Por favor, no utilice su teléfono celular.\n\n• Asegúrese de marcar o completar el número de campos especificado en cada pregunta. De lo contrario, la herramienta no le permitirá avanzar.\n\n• Antes de hacer clic en \"Finalizar\", podrá modificar sus respuestas usando los botones \"Anterior\" y \"Siguiente\".\n\n• La información recopilada será completamente confidencial y se utilizará únicamente para obtener una visión del funcionamiento de la Junta Directiva como equipo de alto desempeño.",
  estadios: "A continuación, encontrará una serie de preguntas relacionadas con distintas áreas de desempeño de la Junta Directiva. Cada una presenta cuatro Estadios de Excelencia.\n\nLos Estadios corresponden a cuatro etapas de madurez: Etapa 1 (etapa inicial), Etapa 2 (cumplimiento local), Etapa 3 (estándares internacionales) y Etapa 4 (desempeño superior).\n\nSeleccione el estadio que considere más alineado con la situación actual. Si no cuenta con información suficiente, seleccione la opción \"No tengo suficiente información\".",
  afirmaciones: "A continuación, encontrará una serie de afirmaciones relacionadas con el funcionamiento actual de la Junta Directiva y de sus Comités de Apoyo. Para cada afirmación, por favor elija una de las cinco opciones.",
  comites: "Funcionamiento de los Comités de Apoyo. Responda las siguientes preguntas para aquellos Comités de los que sea miembro."
};

var aLabels=["Sin información","Totalmente en desacuerdo","En desacuerdo","De acuerdo","Totalmente de acuerdo"];
var EMAILJS_SERVICE="YOUR_SERVICE_ID";
var EMAILJS_TEMPLATE="YOUR_TEMPLATE_ID";
var EMAILJS_PUBLIC="YOUR_PUBLIC_KEY";
var AFIRMACION_INSTRUCTION="Las afirmaciones deben redactarse siempre en positivo, de forma que un mayor nivel de acuerdo refleje un mejor desempeño.";

/* ══════════ KEARNEY LOGO SVG ══════════ */
function KearneyLogo(p){
  var s=p.size||100;var c=p.color||T.white;
  return(<svg width={s} height={Math.round(s*0.22)} viewBox="0 0 460 100" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="72" fill={c} fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="62" fontWeight="600" letterSpacing="12">KEARNEY</text></svg>);
}

/* ══════════ ROUTING ══════════ */
function App(){
  var _hr=useState(window.location.hash);var hash=_hr[0];var setHash=_hr[1];
  // Auto-redirect /admin path to /#/admin
  useEffect(function(){
    if(window.location.pathname==="/admin"||window.location.pathname.startsWith("/admin")){
      window.location.replace("/#/admin");
    }
    function onHash(){setHash(window.location.hash)}
    window.addEventListener("hashchange",onHash);
    return function(){window.removeEventListener("hashchange",onHash)};
  },[]);
  var isAdmin=hash==="#/admin"||hash.startsWith("#/admin");
  var isPreview=hash.startsWith("#/preview/");
  if(isAdmin) return <AdminPanel/>;
  if(isPreview){var previewId=hash.replace("#/preview/","");return <EvalPanel previewId={previewId} preview={true}/>;}
  return <EvalPanel/>;
}
export default App;

/* ══════════ SHARED UI ══════════ */
function Cd(p){return <div style={Object.assign({},{background:T.white,borderRadius:12,padding:24,border:"1px solid "+T.gray200,boxShadow:T.shadow},p.style||{})}>{p.children}</div>}
function St(p){return <Cd style={{textAlign:"center",padding:"20px 12px"}}><div style={{fontSize:13,color:T.gray400,marginBottom:4,fontWeight:500}}>{p.l}</div><div style={{fontFamily:T.font,fontSize:28,fontWeight:400,color:p.c||T.gray900}}>{p.v}</div></Cd>}
function Ck(p){return <div style={{width:18,height:18,borderRadius:4,border:"2px solid "+(p.on?T.brand:T.gray300),background:p.on?T.brand:T.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.on&&<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}</div>}
function Lg(p){return <div style={{display:"flex",gap:16,marginBottom:16,flexWrap:"wrap"}}>{p.items.map(function(i){return <div key={i.l} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:T.gray500}}><div style={{width:12,height:12,borderRadius:3,background:i.c}}/>{i.l}</div>})}</div>}
function MandBadge(p){return p.on?<span style={{fontSize:10,fontWeight:700,color:T.red,background:"rgba(201,48,62,0.08)",padding:"2px 8px",borderRadius:4,marginLeft:8}}>Obligatoria</span>:null}

/* ── Stripe pattern for "Sin info" ── */
function StripeBg(){return(<div style={{position:"absolute",inset:0,opacity:0.15,backgroundImage:"repeating-linear-gradient(45deg,#888 0,#888 1px,transparent 0,transparent 50%)",backgroundSize:"8px 8px"}}/>)}

/* ── Horizontal Likert for respondent ── */
function LikertHorizontal(p){
  var opts=[{v:0,l:"Sin\ninfo",c:T.lkCh0},{v:1,l:"Totalmente\nen Desacuerdo",c:T.lkCh1},{v:2,l:"En\nDesacuerdo",c:T.lkCh2},{v:3,l:"De\nAcuerdo",c:T.lkCh3},{v:4,l:"Totalmente\nde Acuerdo",c:T.lkCh4}];
  return(<div style={{display:"flex",gap:8,marginTop:8}}>{opts.map(function(o){
    var on=p.value===o.v;var isStripe=o.v===0;
    var bg=on?(isStripe?"#e0e0e0":o.c):T.offWhite;
    var fg=on?(o.v===4?"#fff":(o.v===0?"#555":"#333")):T.gray400;
    return(<div key={o.v} onClick={function(){p.onChange(o.v)}} style={{flex:o.v===0?0.7:1,padding:"12px 6px",borderRadius:10,border:"2px solid "+(on?o.c:T.gray200),background:bg,cursor:"pointer",textAlign:"center",transition:"all 0.15s ease",minWidth:o.v===0?80:0,position:"relative",overflow:"hidden"}}>
      {isStripe&&!on&&<StripeBg/>}
      <div style={{position:"relative",zIndex:1}}><div style={{fontSize:20,marginBottom:6}}>{on?"●":"○"}</div><div style={{fontSize:11,fontWeight:on?700:500,color:fg,lineHeight:1.3,whiteSpace:"pre-line"}}>{o.l}</div></div>
    </div>);
  })}</div>);
}

/* ── Complement box ── */
function ComplementBox(p){
  var _exp=useState(false);var exp=_exp[0];var setExp=_exp[1];
  return(<div style={{marginTop:12}}>
    <div onClick={function(){setExp(!exp)}} style={{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,color:T.gray500,padding:"6px 12px",borderRadius:6,background:T.offWhite,border:"1px solid "+T.gray200}}>
      <span style={{fontSize:14}}>{exp?"▾":"▸"}</span><span>Complemente su respuesta (opcional)</span>
    </div>
    {exp&&<textarea value={p.value||""} onChange={function(e){p.onChange(e.target.value)}} placeholder="Si desea, agregue un comentario adicional..." style={{width:"100%",minHeight:80,padding:"12px",borderRadius:8,border:"1px solid "+T.gray200,background:T.white,color:T.gray900,fontSize:13,outline:"none",resize:"vertical",fontFamily:T.fontBody,lineHeight:1.5,boxSizing:"border-box",marginTop:8}} onFocus={function(e){e.target.style.borderColor=T.brand}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/>}
  </div>);
}

/* ── Horizontal bar chart for ADMIN results ── */
function ChBar(p){
  var total=p.dist.reduce(function(s,v){return s+v},0)||1;
  var colors=p.estadio?[T.ch0,T.ch1,T.ch2,T.ch3,T.ch4]:[T.ch0,T.ch1,T.ch2,T.ch3,T.ch4];
  var adj=p.sens||0;
  var adjAvg=p.avg>0?Math.min(4,Math.max(0,p.avg*(1+adj/100))):0;
  return(<div style={{marginBottom:12}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
      <div style={{flex:1,fontSize:12,color:T.gray700,fontWeight:500}}>{p.label}</div>
      <div style={{fontSize:13,fontWeight:700,color:T.brand,minWidth:32,textAlign:"right"}}>{adjAvg>0?adjAvg.toFixed(1):"—"}</div>
    </div>
    <div style={{display:"flex",height:20,borderRadius:4,overflow:"hidden",background:T.gray100}}>
      {p.dist.map(function(count,i){
        var pct=(count/total)*100;
        if(pct<0.5) return null;
        return(<div key={i} style={{width:pct+"%",background:colors[i],display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:i===4?"#fff":"rgba(0,0,0,0.6)",fontWeight:600,transition:"width 0.3s"}}>{count>0?count:""}</div>);
      })}
    </div>
  </div>);
}

/* ══════════════════════════════════════════════════════════════
   ADMIN PANEL
   ══════════════════════════════════════════════════════════════ */
function AdminPanel(){
  var _view=useState("dashboard");var view=_view[0];var setView=_view[1];
  var _activeEval=useState(null);var activeEval=_activeEval[0];var setActiveEval=_activeEval[1];
  function openEval(ev){setActiveEval(ev);setView("manage")}
  function goHome(){setView("dashboard");setActiveEval(null)}
  return(<div style={{minHeight:"100vh",background:T.offWhite,fontFamily:T.fontBody,color:T.gray900}}>
    <header style={{background:T.white,borderBottom:"1px solid "+T.gray200,padding:"0 24px",position:"sticky",top:0,zIndex:100}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
        <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={goHome}>
          <KearneyLogo size={100} color={T.dark}/>
          <div style={{width:1,height:24,background:T.gray200,margin:"0 4px"}}/>
          <div style={{fontFamily:T.font,fontSize:15,fontWeight:400,color:T.gray500}}>Panel Administrativo</div>
        </div>
        {view!=="dashboard"&&<button onClick={goHome} style={{padding:"8px 16px",borderRadius:6,border:"1px solid "+T.gray200,background:T.white,color:T.gray700,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:T.fontBody}}>{"←"} Mis Evaluaciones</button>}
      </div>
    </header>
    <main style={{maxWidth:1100,margin:"0 auto",padding:"28px 24px 60px"}}>
      {view==="dashboard"&&<AdminDashboard onCreate={function(){setView("create")}} onOpen={openEval}/>}
      {view==="create"&&<AdminCreate onDone={function(ev){openEval(ev)}} onBack={goHome}/>}
      {view==="manage"&&activeEval&&<AdminManage evalData={activeEval} onBack={goHome}/>}
    </main>
  </div>);
}

/* === ADMIN DASHBOARD === */
function AdminDashboard(p){
  var _evals=useState([]);var evals=_evals[0];var setEvals=_evals[1];
  var _loading=useState(true);var loading=_loading[0];var setLoading=_loading[1];
  var _rc=useState({});var rc=_rc[0];var setRc=_rc[1];
  useEffect(function(){
    supabase.from("evaluations").select("*").order("at",{ascending:false}).then(function(res){if(res.data)setEvals(res.data);setLoading(false)});
    supabase.from("responses").select("eval_id").then(function(res){if(res.data){var c={};res.data.forEach(function(r){c[r.eval_id]=(c[r.eval_id]||0)+1});setRc(c)}});
  },[]);

  function launchEval(ev,e){
    e.stopPropagation();
    supabase.from("evaluations").update({estado:"activa"}).eq("id",ev.id).then(function(res){
      if(!res.error){setEvals(evals.map(function(x){return x.id===ev.id?Object.assign({},x,{estado:"activa"}):x}))}
    });
  }

  function getEstado(ev){
    var co=ev.co||{};
    if(ev.estado==="borrador"||(!ev.estado&&!ev.at)) return "borrador";
    var now=new Date();
    if(co.fechaFin&&now>new Date(co.fechaFin)) return "cerrada";
    if(co.fechaInicio&&now<new Date(co.fechaInicio)) return "pendiente";
    return ev.estado||"activa";
  }

  var estadoStyles={
    borrador:{bg:"rgba(212,134,10,0.1)",color:"#D4860A",label:"Borrador"},
    activa:{bg:T.greenLight,color:T.green,label:"Activa"},
    pendiente:{bg:"rgba(8,145,178,0.1)",color:T.teal,label:"Pendiente"},
    cerrada:{bg:T.gray100,color:T.gray400,label:"Cerrada"}
  };

  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28}}>
      <div><h1 style={{fontFamily:T.font,fontSize:32,fontWeight:400,margin:"0 0 6px"}}>Mis Evaluaciones</h1><p style={{color:T.gray500,fontSize:14,margin:0}}>{evals.length} evaluación{evals.length!==1?"es":""} creada{evals.length!==1?"s":""}</p></div>
      <button onClick={p.onCreate} style={{padding:"12px 24px",borderRadius:8,border:"none",background:T.brand,color:"#fff",cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:T.fontBody}}>+ Nueva Evaluación</button>
    </div>
    {loading&&<Cd style={{textAlign:"center",padding:48,color:T.gray400}}><p>Cargando...</p></Cd>}
    {!loading&&evals.length===0&&<Cd style={{textAlign:"center",padding:60,color:T.gray400}}><div style={{fontSize:48,marginBottom:12}}>{"📊"}</div><p style={{fontSize:16,margin:"0 0 8px",fontWeight:500}}>No hay evaluaciones aún</p><button onClick={p.onCreate} style={{padding:"12px 28px",borderRadius:8,border:"none",background:T.brand,color:"#fff",cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:T.fontBody}}>Crear Primera Evaluación</button></Cd>}
    {!loading&&evals.length>0&&<div style={{display:"flex",flexDirection:"column",gap:8}}>{evals.map(function(ev){
      var co=ev.co||{};var nR=rc[ev.id]||0;
      var date=ev.at?new Date(ev.at).toLocaleDateString("es-CO",{day:"numeric",month:"short",year:"numeric"}):"—";
      var est=getEstado(ev);var estStyle=estadoStyles[est]||estadoStyles.activa;
      var isBorrador=est==="borrador";
      return(<div key={ev.id} style={{background:T.white,borderRadius:12,border:"1px solid "+(isBorrador?"#D4860A":T.gray200),padding:"20px 24px",cursor:"pointer",boxShadow:T.shadow,display:"flex",alignItems:"center",gap:20}} onClick={function(){p.onOpen(ev)}} onMouseEnter={function(e){e.currentTarget.style.borderColor=T.brand}} onMouseLeave={function(e){e.currentTarget.style.borderColor=isBorrador?"#D4860A":T.gray200}}>
        <div style={{width:48,height:48,borderRadius:12,background:T.brandGhost2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><div style={{fontFamily:T.font,fontSize:20,color:T.brand}}>{co.nombre?co.nombre[0].toUpperCase():"E"}</div></div>
        <div style={{flex:1}}>
          <div style={{fontSize:16,fontWeight:600}}>{co.nombre||"Sin nombre"}</div>
          <div style={{fontSize:13,color:T.gray400,marginTop:2}}>{co.pais||""}{co.sector?" · "+co.sector:""} · {date}</div>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:600,color:nR>0?T.green:T.gray300}}>{nR}</div><div style={{fontSize:11,color:T.gray400}}>Respuestas</div></div>
          <div style={{fontSize:11,padding:"6px 12px",borderRadius:20,background:estStyle.bg,color:estStyle.color,fontWeight:600}}>{estStyle.label}</div>
          {isBorrador&&<button onClick={function(e){launchEval(ev,e)}} style={{padding:"8px 16px",borderRadius:8,border:"none",background:T.brand,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:T.fontBody}}>🚀 Lanzar</button>}
        </div>
      </div>);
    })}</div>}
  </div>);
}

function AdminCreate(p){
  var _st=useState(0);var step=_st[0];var setStep=_st[1];
  var _co=useState({nombre:"",pais:"",sector:"",anio:"",equipo:"",terminologia:Object.assign({},TERM_DEFAULT),fechaInicio:"",fechaFin:"",durMin:"30",durMax:"45",contactos:[{nombre:"",correo:"",telefono:""}],instrucciones:Object.assign({},INSTR_DEFAULT)});var co=_co[0];var setCo=_co[1];
  var _sel=useState({estadios:[],afirmaciones:[],abiertas:[]});var sel=_sel[0];var setSel=_sel[1];
  var _mand=useState({});var mandatory=_mand[0];var setMandatory=_mand[1];
  var _ca=useState([]);var customAfirm=_ca[0];var setCustomAfirm=_ca[1];
  var _cm=useState([]);var comites=_cm[0];var setComites=_cm[1];
  var _cca=useState([]);var customComiteAfirm=_cca[0];var setCustomComiteAfirm=_cca[1];
  var _list5PA=useState([]);var list5PA=_list5PA[0];var setList5PA=_list5PA[1];
  var _list6AC=useState([]);var list6AC=_list6AC[0];var setList6AC=_list6AC[1];
  var _sca=useState([]);var selComiteAbiertas=_sca[0];var setSelComiteAbiertas=_sca[1];

  function generate(){
    var id="ev"+Date.now().toString(36)+Math.random().toString(36).substr(2,4);
    var payload={id:id,co:co,sel:sel,mandatory:mandatory,comites:comites,custom_afirmaciones:customAfirm,custom_comite_afirmaciones:customComiteAfirm,"list5PA":list5PA,"list6AC":list6AC,selComiteAbiertas:selComiteAbiertas,terminologia:co.terminologia||TERM_DEFAULT,estado:"borrador"};
    supabase.from("evaluations").insert(payload).then(function(res){
      if(!res.error){p.onDone(Object.assign({},payload,{at:new Date().toISOString()}))}
      else{console.error("Supabase error:",JSON.stringify(res.error));alert("Error: "+res.error.message)}
    });
  }
  var navs=[{s:0,l:"Empresa"},{s:1,l:"Preguntas"},{s:2,l:"Comités"},{s:3,l:"Abiertas"},{s:4,l:"Vista Previa"}];
  return(<div>
    <div style={{display:"flex",gap:1,background:T.gray200,borderRadius:10,padding:2,marginBottom:24}}>{navs.map(function(n){var active=step===n.s;return <button key={n.s} onClick={function(){if(n.s<=step)setStep(n.s)}} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:active?T.white:"transparent",color:active?T.brand:T.gray500,cursor:n.s<=step?"pointer":"default",fontSize:13,fontWeight:600,fontFamily:T.fontBody,boxShadow:active?T.shadow:"none"}}>{n.l}</button>})}</div>
    {step===0&&<A0 co={co} setCo={setCo} go={function(){setStep(1)}}/>}
    {step===1&&<A1 sel={sel} setSel={setSel} mandatory={mandatory} setMandatory={setMandatory} customAfirm={customAfirm} setCustomAfirm={setCustomAfirm} go={function(){setStep(2)}} back={function(){setStep(0)}}/>}
    {step===2&&<A2Comites comites={comites} setComites={setComites} customComiteAfirm={customComiteAfirm} setCustomComiteAfirm={setCustomComiteAfirm} mandatory={mandatory} setMandatory={setMandatory} selComiteAbiertas={selComiteAbiertas} setSelComiteAbiertas={setSelComiteAbiertas} go={function(){setStep(3)}} back={function(){setStep(1)}}/>}
    {step===3&&<A3Abiertas sel={sel} setSel={setSel} mandatory={mandatory} setMandatory={setMandatory} list5PA={list5PA} setList5PA={setList5PA} list6AC={list6AC} setList6AC={setList6AC} go={function(){setStep(4)}} back={function(){setStep(2)}}/>}
    {step===4&&<A4Preview co={co} sel={sel} comites={comites} customAfirm={customAfirm} customComiteAfirm={customComiteAfirm} mandatory={mandatory} list5PA={list5PA} list6AC={list6AC} gen={generate} back={function(){setStep(3)}}/>}
  </div>);
}

/* === ADMIN MANAGE === */
function AdminManage(p){
  var ev=p.evalData;
  var _tab=useState("tracking");var tab=_tab[0];var setTab=_tab[1];
  var _rs=useState([]);var resps=_rs[0];var setResps=_rs[1];
  var _ev=useState(ev);var evalData=_ev[0];var setEvalData=_ev[1];
  useEffect(function(){
    function fetchR(){supabase.from("responses").select("*").eq("eval_id",ev.id).then(function(res){if(res.data)setResps(res.data.map(function(r){return{evalId:r.eval_id,respondent:r.respondent,answers:r.answers,submittedAt:r.submitted_at}}))})}
    fetchR();var i=setInterval(fetchR,5000);return function(){clearInterval(i)};
  },[ev.id]);

  var isBorrador=!evalData.estado||evalData.estado==="borrador";
  var isLanzada=evalData.estado==="activa"||evalData.estado==="cerrada";

  function launch(){
    if(!window.confirm("¿Confirmas el lanzamiento? Los encuestados podrán acceder con el código de acceso.")) return;
    supabase.from("evaluations").update({estado:"activa"}).eq("id",ev.id).then(function(res){
      if(!res.error) setEvalData(Object.assign({},evalData,{estado:"activa"}));
    });
  }

  function previewEval(){
    var url=window.location.origin+"/#/preview/"+ev.id;
    window.open(url,"_blank");
  }

  var tabs=[{k:"tracking",l:"Seguimiento"},{k:"results",l:"Resultados"},{k:"informe",l:"📄 Informe PDF"}];
  return(<div>
    <div style={{marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div><h1 style={{fontFamily:T.font,fontSize:28,fontWeight:400,margin:"0 0 4px"}}>{evalData.co?evalData.co.nombre:"Evaluación"}</h1><p style={{color:T.gray500,fontSize:14,margin:0}}>{evalData.co?evalData.co.pais:""}{evalData.co&&evalData.co.sector?" · "+evalData.co.sector:""}</p></div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button onClick={previewEval} style={{padding:"9px 18px",borderRadius:8,border:"1px solid "+T.brand,background:T.white,color:T.brand,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>👁 Vista previa</button>
        {!isLanzada&&<button onClick={launch} style={{padding:"9px 18px",borderRadius:8,border:"none",background:T.brand,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>🚀 Lanzar encuesta</button>}
        {isLanzada&&<div style={{padding:"7px 14px",borderRadius:8,background:T.greenLight,color:T.green,fontSize:12,fontWeight:600}}>✓ Lanzada</div>}
      </div>
    </div>
    {!isLanzada&&<div style={{padding:"10px 16px",borderRadius:8,background:"rgba(212,134,10,0.08)",border:"1px solid rgba(212,134,10,0.3)",marginBottom:16,fontSize:13,color:"#D4860A",fontWeight:500}}>📝 Esta evaluación aún no ha sido lanzada formalmente. Haz clic en "Lanzar encuesta" para activarla oficialmente.</div>}
    {isLanzada&&resps.length>0&&<div style={{padding:"10px 16px",borderRadius:8,background:"rgba(201,48,62,0.06)",border:"1px solid rgba(201,48,62,0.2)",marginBottom:16,fontSize:13,color:T.red,fontWeight:500}}>⚠️ Hay {resps.length} respuesta{resps.length!==1?"s":""} registrada{resps.length!==1?"s":""}. Los cambios que realices afectarán a encuestados activos.</div>}
    <div style={{display:"flex",gap:1,background:T.gray200,borderRadius:10,padding:2,marginBottom:24}}>{tabs.map(function(t){return <button key={t.k} onClick={function(){setTab(t.k)}} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:tab===t.k?T.white:"transparent",color:tab===t.k?T.brand:T.gray500,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody,boxShadow:tab===t.k?T.shadow:"none"}}>{t.l}</button>})}</div>
    {tab==="tracking"&&<A5Track evalId={ev.id} resps={resps} co={evalData.co||{}}/>}
    {tab==="results"&&<A6Results resps={resps} co={evalData.co||{}} sel={evalData.sel||{}} comites={evalData.comites||[]} customAfirm={evalData.custom_afirmaciones||[]} customComiteAfirm={evalData.custom_comite_afirmaciones||[]}/>}
    {tab==="informe"&&<A7Informe resps={resps} co={evalData.co||{}} sel={evalData.sel||{}} comites={evalData.comites||[]} customAfirm={evalData.custom_afirmaciones||[]} customComiteAfirm={evalData.custom_comite_afirmaciones||[]}/>}
  </div>);
}

function A0(p){
  var co=p.co;
  var ok=co.nombre&&co.pais&&co.anio&&co.fechaInicio&&co.fechaFin;
  function handlePaisChange(pais){
    var preset=TERM_PRESETS[pais]||TERM_DEFAULT;
    p.setCo(Object.assign({},co,{pais:pais,terminologia:Object.assign({},preset)}));
  }
  function handleTermChange(key,val){
    var t=Object.assign({},co.terminologia||TERM_DEFAULT);t[key]=val;
    p.setCo(Object.assign({},co,{terminologia:t}));
  }
  function handleInstrChange(key,val){
    var instr=Object.assign({},co.instrucciones||INSTR_DEFAULT);instr[key]=val;
    p.setCo(Object.assign({},co,{instrucciones:instr}));
  }
  function handleContacto(i,key,val){
    var cs=(co.contactos||[{nombre:"",correo:"",telefono:""}]).slice();
    cs[i]=Object.assign({},cs[i],{[key]:val});
    p.setCo(Object.assign({},co,{contactos:cs}));
  }
  function addContacto(){
    var cs=(co.contactos||[{nombre:"",correo:"",telefono:""}]).slice();
    if(cs.length<2)cs.push({nombre:"",correo:"",telefono:""});
    p.setCo(Object.assign({},co,{contactos:cs}));
  }
  function removeContacto(i){
    var cs=(co.contactos||[]).slice();cs.splice(i,1);
    p.setCo(Object.assign({},co,{contactos:cs}));
  }
  var term=co.terminologia||TERM_DEFAULT;
  var instr=co.instrucciones||INSTR_DEFAULT;
  var contactos=co.contactos||[{nombre:"",correo:"",telefono:""}];
  var iS={width:"100%",padding:"12px 16px",borderRadius:8,border:"1px solid "+T.gray200,background:T.white,color:T.gray900,fontSize:14,outline:"none",fontFamily:T.fontBody,boxSizing:"border-box"};
  var lS={fontSize:11,fontWeight:600,color:T.gray500,display:"block",marginBottom:6,letterSpacing:0.8};
  return(<div style={{maxWidth:620,margin:"40px auto"}}>
    <div style={{marginBottom:24}}><h1 style={{fontFamily:T.font,fontSize:28,fontWeight:400,margin:"0 0 6px"}}>Caracterización de la Empresa</h1><p style={{color:T.gray500,fontSize:14,margin:0}}>Configure los datos de la organización a evaluar</p></div>

    <Cd style={{marginBottom:16}}>
      <div style={{fontSize:13,fontWeight:600,color:T.brand,marginBottom:16}}>Datos generales</div>
      {[{k:"nombre",l:"NOMBRE DE LA EMPRESA",p:"Empresa X S.A.",req:true},{k:"sector",l:"SECTOR",p:"Energía, Financiero"},{k:"anio",l:"AÑO DE EVALUACIÓN",p:"2026",req:true},{k:"equipo",l:"EQUIPO CONSULTOR",p:"Eulalia Sanín, Gloria Arango"}].map(function(f){return <div key={f.k} style={{marginBottom:16}}><label style={lS}>{f.l}{f.req?" *":""}</label><input value={co[f.k]||""} onChange={function(e){p.setCo(Object.assign({},co,{[f.k]:e.target.value}))}} placeholder={f.p} style={iS} onFocus={function(e){e.target.style.borderColor=T.brand}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/></div>})}
      <div style={{marginBottom:16}}><label style={lS}>PAÍS *</label>
        <select value={co.pais||""} onChange={function(e){handlePaisChange(e.target.value)}} style={Object.assign({},iS,{color:co.pais?T.gray900:T.gray400})}>
          <option value="">Seleccione un país...</option>
          {["Colombia","México","Guatemala","Perú","Chile","Argentina","Ecuador","Brasil","Bolivia","Venezuela","Costa Rica","Panamá","Honduras","El Salvador","Nicaragua","República Dominicana","Paraguay","Uruguay","Otro"].map(function(px){return <option key={px} value={px}>{px}</option>})}
        </select>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:16}}>
        <div style={{flex:1}}><label style={lS}>DURACIÓN ESTIMADA MÍNIMA (min)</label><input type="number" value={co.durMin||"30"} onChange={function(e){p.setCo(Object.assign({},co,{durMin:e.target.value}))}} placeholder="30" style={iS} onFocus={function(e){e.target.style.borderColor=T.brand}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/></div>
        <div style={{flex:1}}><label style={lS}>DURACIÓN ESTIMADA MÁXIMA (min)</label><input type="number" value={co.durMax||"45"} onChange={function(e){p.setCo(Object.assign({},co,{durMax:e.target.value}))}} placeholder="45" style={iS} onFocus={function(e){e.target.style.borderColor=T.brand}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/></div>
      </div>
      <button onClick={p.go} disabled={!ok} style={{width:"100%",padding:"14px",borderRadius:8,border:"none",background:ok?T.brand:T.gray200,color:ok?"#fff":T.gray400,fontSize:15,fontWeight:600,cursor:ok?"pointer":"not-allowed",fontFamily:T.fontBody}}>Continuar</button>
    </Cd>

    <Cd style={{marginBottom:16,borderLeft:"4px solid "+T.amber}}>
      <div style={{fontSize:13,fontWeight:600,color:T.amber,marginBottom:4}}>Disponibilidad de la encuesta *</div>
      <p style={{fontSize:12,color:T.gray500,margin:"0 0 14px",lineHeight:1.5}}>Define el rango de fechas en que los encuestados podrán acceder.</p>
      <div style={{display:"flex",gap:12}}>
        <div style={{flex:1}}><label style={lS}>FECHA Y HORA DE INICIO *</label><input type="datetime-local" value={co.fechaInicio||""} onChange={function(e){p.setCo(Object.assign({},co,{fechaInicio:e.target.value}))}} style={iS} onFocus={function(e){e.target.style.borderColor=T.amber}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/></div>
        <div style={{flex:1}}><label style={lS}>FECHA Y HORA DE CIERRE *</label><input type="datetime-local" value={co.fechaFin||""} onChange={function(e){p.setCo(Object.assign({},co,{fechaFin:e.target.value}))}} style={iS} onFocus={function(e){e.target.style.borderColor=T.amber}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/></div>
      </div>
    </Cd>

    <Cd style={{marginBottom:16,borderLeft:"4px solid "+T.teal}}>
      <div style={{fontSize:13,fontWeight:600,color:T.teal,marginBottom:4}}>Personas de contacto</div>
      <p style={{fontSize:12,color:T.gray500,margin:"0 0 14px",lineHeight:1.5}}>Aparecen en el header de la encuesta para que los participantes resuelvan dudas.</p>
      {contactos.map(function(c,i){return <div key={i} style={{marginBottom:10,padding:12,background:T.offWhite,borderRadius:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:12,fontWeight:600,color:T.gray500}}>Contacto {i+1}</span>
          {i>0&&<button onClick={function(){removeContacto(i)}} style={{background:"none",border:"none",color:T.red,cursor:"pointer",fontSize:13,fontWeight:700}}>Eliminar</button>}
        </div>
        <div style={{display:"flex",gap:10}}>
          <div style={{flex:2}}><label style={lS}>NOMBRE</label><input value={c.nombre||""} onChange={function(e){handleContacto(i,"nombre",e.target.value)}} placeholder="Nombre completo" style={iS} onFocus={function(e){e.target.style.borderColor=T.teal}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/></div>
          <div style={{flex:2}}><label style={lS}>CORREO</label><input value={c.correo||""} onChange={function(e){handleContacto(i,"correo",e.target.value)}} placeholder="correo@kearney.com" style={iS} onFocus={function(e){e.target.style.borderColor=T.teal}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/></div>
          <div style={{flex:1.5}}><label style={lS}>TELÉFONO</label><input value={c.telefono||""} onChange={function(e){handleContacto(i,"telefono",e.target.value)}} placeholder="+57 300..." style={iS} onFocus={function(e){e.target.style.borderColor=T.teal}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/></div>
        </div>
      </div>})}
      {contactos.length<2&&<button onClick={addContacto} style={{padding:"8px 16px",borderRadius:6,border:"1px dashed "+T.teal,background:"transparent",color:T.teal,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:T.fontBody}}>+ Agregar segundo contacto</button>}
    </Cd>

    <Cd style={{marginBottom:16,borderLeft:"4px solid "+T.brand,background:"rgba(120,35,220,0.02)"}}>
      <div style={{fontSize:13,fontWeight:600,color:T.brand,marginBottom:4}}>Terminología del órgano de gobierno</div>
      <p style={{fontSize:12,color:T.gray500,margin:"0 0 14px",lineHeight:1.5}}>Se precarga según el país. Puedes editarla si la empresa usa términos distintos.</p>
      {[{k:"organo",l:"NOMBRE DEL ÓRGANO",p:"Junta Directiva"},{k:"presidente",l:"PRESIDENTE DEL ÓRGANO",p:"Presidente de la Junta Directiva"},{k:"miembros",l:"MIEMBROS (en minúscula)",p:"miembros de la Junta Directiva"},{k:"secretaria",l:"SECRETARÍA",p:"Secretaría de Junta"},{k:"sesiones",l:"SESIONES (en minúscula)",p:"sesiones de Junta"}].map(function(f){return <div key={f.k} style={{marginBottom:10}}>
        <label style={{fontSize:10,fontWeight:600,color:T.gray500,display:"block",marginBottom:4,letterSpacing:0.8}}>{f.l}</label>
        <input value={term[f.k]||""} onChange={function(e){handleTermChange(f.k,e.target.value)}} placeholder={f.p} style={Object.assign({},iS,{fontSize:13})} onFocus={function(e){e.target.style.borderColor=T.brand}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/>
      </div>})}
    </Cd>

    <Cd style={{borderLeft:"4px solid "+T.green,background:"rgba(27,158,94,0.02)"}}>
      <div style={{fontSize:13,fontWeight:600,color:T.green,marginBottom:4}}>Instrucciones para encuestados</div>
      <p style={{fontSize:12,color:T.gray500,margin:"0 0 14px",lineHeight:1.5}}>Textos que verán los participantes al inicio de cada sección. Puedes editarlos.</p>
      {[{k:"general",l:"PANTALLA DE BIENVENIDA",rows:6},{k:"estadios",l:"SECCIÓN ESTADIOS DE EXCELENCIA",rows:4},{k:"afirmaciones",l:"SECCIÓN AFIRMACIONES",rows:3},{k:"comites",l:"SECCIÓN COMÍTES",rows:2}].map(function(f){return <div key={f.k} style={{marginBottom:14}}>
        <label style={{fontSize:10,fontWeight:600,color:T.gray500,display:"block",marginBottom:4,letterSpacing:0.8}}>{f.l}</label>
        <textarea value={instr[f.k]||""} onChange={function(e){handleInstrChange(f.k,e.target.value)}} rows={f.rows} style={{width:"100%",padding:"10px 14px",borderRadius:7,border:"1px solid "+T.gray200,fontSize:12,outline:"none",fontFamily:T.fontBody,boxSizing:"border-box",resize:"vertical",lineHeight:1.5,color:T.gray700}} onFocus={function(e){e.target.style.borderColor=T.green}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/>
      </div>})}
    </Cd>
  </div>);
}

/* ═══ ADMIN STEP 1: PREGUNTAS ═══ */
function A1(p){
  var sel=p.sel;var _t=useState("estadios");var tab=_t[0];var setTab=_t[1];var _e=useState(null);var exp=_e[0];var setExp=_e[1];
  var _modal=useState(false);var showModal=_modal[0];var setShowModal=_modal[1];
  var _newTema=useState("");var newTema=_newTema[0];var setNewTema=_newTema[1];
  var _newTexto=useState("");var newTexto=_newTexto[0];var setNewTexto=_newTexto[1];

  function tog(t,id){var c=sel[t];p.setSel(Object.assign({},sel,{[t]:c.includes(id)?c.filter(function(x){return x!==id}):c.concat([id])}))}
  function all(t){var a=t==="estadios"?ESTADIOS:getAllAfirmaciones();p.setSel(Object.assign({},sel,{[t]:a.map(function(q){return q.id})}))}
  function clr(t){p.setSel(Object.assign({},sel,{[t]:[]}))}
  function toggleMand(id){var m=Object.assign({},p.mandatory);if(m[id])delete m[id];else m[id]=true;p.setMandatory(m)}
  function getAllAfirmaciones(){return AFIRMACIONES.concat(p.customAfirm)}
  function addCustomAfirm(){
    if(!newTema.trim()||!newTexto.trim()) return;
    var id="CA"+(p.customAfirm.length+1);
    var nw={id:id,sec:"Afirmaciones",tema:newTema.trim(),texto:newTexto.trim(),custom:true};
    p.setCustomAfirm(p.customAfirm.concat([nw]));
    p.setSel(Object.assign({},sel,{afirmaciones:sel.afirmaciones.concat([id])}));
    setNewTema("");setNewTexto("");setShowModal(false);
  }
  var allAfirm=getAllAfirmaciones();
  var tot=sel.estadios.length+sel.afirmaciones.length;
  var tabs=[{k:"estadios",l:"Estadios de Excelencia",n:sel.estadios.length,t:ESTADIOS.length},{k:"afirmaciones",l:"Afirmaciones",n:sel.afirmaciones.length,t:allAfirm.length}];
  var qs=tab==="estadios"?ESTADIOS:allAfirm;

  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24}}><div><h1 style={{fontFamily:T.font,fontSize:28,fontWeight:400,margin:"0 0 4px"}}>Selección de Preguntas</h1><p style={{color:T.gray500,fontSize:14,margin:0}}>{tot} preguntas seleccionadas</p></div><div style={{display:"flex",gap:8}}><button onClick={p.back} style={{padding:"10px 20px",borderRadius:8,border:"1px solid "+T.gray200,background:T.white,color:T.gray700,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>Atrás</button><button onClick={p.go} disabled={!tot} style={{padding:"10px 20px",borderRadius:8,border:"none",background:tot?T.brand:T.gray200,color:tot?"#fff":T.gray400,cursor:tot?"pointer":"not-allowed",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>Siguiente: Comités</button></div></div>
    <div style={{display:"flex",gap:1,background:T.gray200,borderRadius:10,padding:2,marginBottom:20}}>{tabs.map(function(t){return <button key={t.k} onClick={function(){setTab(t.k)}} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:tab===t.k?T.white:"transparent",color:tab===t.k?T.brand:T.gray500,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody,boxShadow:tab===t.k?T.shadow:"none"}}>{t.l} ({t.n}/{t.t})</button>})}</div>
    <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
      <button onClick={function(){all(tab)}} style={{padding:"7px 16px",borderRadius:6,border:"1px solid "+T.brand,background:T.brandGhost,color:T.brand,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:T.fontBody}}>Seleccionar todas</button>
      <button onClick={function(){clr(tab)}} style={{padding:"7px 16px",borderRadius:6,border:"1px solid "+T.gray200,background:T.white,color:T.gray500,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:T.fontBody}}>Limpiar</button>
      {tab==="afirmaciones"&&<button onClick={function(){setShowModal(true)}} style={{padding:"7px 16px",borderRadius:6,border:"1px solid "+T.gold,background:"rgba(198,151,59,0.08)",color:T.gold,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:T.fontBody}}>+ Crear Afirmación</button>}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:4}}>{qs.map(function(q){var on=sel[tab].includes(q.id);var isE=exp===q.id;var isMand=!!p.mandatory[q.id];return(<div key={q.id} style={{background:T.white,borderRadius:10,border:"1px solid "+(on?T.brand:T.gray200),overflow:"hidden",boxShadow:on?"0 0 0 1px "+T.brand:"none"}}>
      <div style={{display:"flex",alignItems:"center",padding:"14px 16px",cursor:"pointer",gap:12}} onClick={function(){tog(tab,q.id)}}><Ck on={on}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.gray900}}>{q.id}. {q.tema}{q.custom?" ✦":""}<MandBadge on={isMand}/></div></div>
        {on&&<button onClick={function(e){e.stopPropagation();toggleMand(q.id)}} style={{padding:"4px 10px",borderRadius:5,border:"1px solid "+(isMand?T.red:T.gray300),background:isMand?"rgba(201,48,62,0.06)":T.white,color:isMand?T.red:T.gray500,cursor:"pointer",fontSize:10,fontFamily:T.fontBody,fontWeight:600}}>{isMand?"Quitar oblig.":"Obligatoria"}</button>}
        {tab==="estadios"&&<button onClick={function(e){e.stopPropagation();setExp(isE?null:q.id)}} style={{padding:"4px 10px",borderRadius:5,border:"1px solid "+T.gray200,background:T.gray100,color:T.gray500,cursor:"pointer",fontSize:11,fontFamily:T.fontBody}}>{isE?"Ocultar":"Detalle"}</button>}
      </div>
      {tab==="estadios"&&isE&&<div style={{padding:"0 16px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{[{l:"Estadio 1",t:q.e1,c:T.e1},{l:"Estadio 2",t:q.e2,c:T.e2},{l:"Estadio 3",t:q.e3,c:T.e3},{l:"Estadio 4",t:q.e4,c:T.e4}].map(function(s){return <div key={s.l} style={{padding:12,borderRadius:8,background:T.offWhite,borderLeft:"3px solid "+s.c}}><div style={{fontSize:11,fontWeight:700,color:s.c,marginBottom:4}}>{s.l}</div><div style={{fontSize:12,color:T.gray500,lineHeight:1.5}}>{s.t}</div></div>})}</div>}
      {tab==="afirmaciones"&&<div style={{padding:"0 16px 14px 50px",fontSize:13,color:T.gray500,lineHeight:1.5}}>{q.texto}</div>}
    </div>)})}</div>

    {showModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={function(){setShowModal(false)}}>
      <div style={{background:T.white,borderRadius:16,padding:32,maxWidth:560,width:"90%",boxShadow:T.shadowLg}} onClick={function(e){e.stopPropagation()}}>
        <h2 style={{fontFamily:T.font,fontSize:22,fontWeight:400,margin:"0 0 8px"}}>Crear Nueva Afirmación</h2>
        <div style={{padding:"12px 16px",background:"rgba(198,151,59,0.06)",borderRadius:8,borderLeft:"3px solid "+T.gold,marginBottom:20}}><p style={{fontSize:12,color:T.gray500,lineHeight:1.6,margin:0}}>{AFIRMACION_INSTRUCTION}</p></div>
        <div style={{marginBottom:16}}><label style={{fontSize:11,fontWeight:600,color:T.gray500,display:"block",marginBottom:6,letterSpacing:0.8}}>TEMA *</label><input value={newTema} onChange={function(e){setNewTema(e.target.value)}} placeholder="Ej: Evaluación del desempeño" style={{width:"100%",padding:"12px 16px",borderRadius:8,border:"1px solid "+T.gray200,fontSize:14,outline:"none",fontFamily:T.fontBody,boxSizing:"border-box"}} onFocus={function(e){e.target.style.borderColor=T.brand}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/></div>
        <div style={{marginBottom:20}}><label style={{fontSize:11,fontWeight:600,color:T.gray500,display:"block",marginBottom:6,letterSpacing:0.8}}>AFIRMACIÓN (en positivo) *</label><textarea value={newTexto} onChange={function(e){setNewTexto(e.target.value)}} rows={4} style={{width:"100%",padding:"12px 16px",borderRadius:8,border:"1px solid "+T.gray200,fontSize:14,outline:"none",fontFamily:T.fontBody,boxSizing:"border-box",resize:"vertical",lineHeight:1.6}} onFocus={function(e){e.target.style.borderColor=T.brand}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/></div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button onClick={function(){setShowModal(false)}} style={{padding:"10px 20px",borderRadius:8,border:"1px solid "+T.gray200,background:T.white,color:T.gray700,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>Cancelar</button><button onClick={addCustomAfirm} disabled={!newTema.trim()||!newTexto.trim()} style={{padding:"10px 24px",borderRadius:8,border:"none",background:newTema.trim()&&newTexto.trim()?T.brand:T.gray200,color:newTema.trim()&&newTexto.trim()?"#fff":T.gray400,cursor:newTema.trim()&&newTexto.trim()?"pointer":"not-allowed",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>Crear Afirmación</button></div>
      </div>
    </div>}
  </div>);
}

/* ═══ ADMIN STEP 2: COMITÉS ═══ */
function A2Comites(p){
  var comites=p.comites;
  var _addName=useState("");var addName=_addName[0];var setAddName=_addName[1];
  var _editIdx=useState(null);var editIdx=_editIdx[0];var setEditIdx=_editIdx[1];
  var _modal=useState(false);var showModal=_modal[0];var setShowModal=_modal[1];
  var _modalForComite=useState(null);var modalForComite=_modalForComite[0];var setModalForComite=_modalForComite[1];
  var _newCTema=useState("");var newCTema=_newCTema[0];var setNewCTema=_newCTema[1];
  var _newCTexto=useState("");var newCTexto=_newCTexto[0];var setNewCTexto=_newCTexto[1];

  function addComite(){if(!addName.trim())return;var id="COM"+(comites.length+1);p.setComites(comites.concat([{id:id,nombre:addName.trim(),afirmaciones:COMITE_AFIRMACIONES_STD.map(function(a){return a.id})}]));setAddName("");}
  function removeComite(idx){p.setComites(comites.filter(function(_,i){return i!==idx}))}
  function toggleAfirmInComite(comIdx,afirmId){var updated=comites.map(function(c,i){if(i!==comIdx)return c;var has=c.afirmaciones.includes(afirmId);return Object.assign({},c,{afirmaciones:has?c.afirmaciones.filter(function(x){return x!==afirmId}):c.afirmaciones.concat([afirmId])})});p.setComites(updated)}
  function allComiteAfirm(){return COMITE_AFIRMACIONES_STD.concat(p.customComiteAfirm)}
  function addCustomComiteAfirm(){
    if(!newCTema.trim()||!newCTexto.trim())return;
    var id="CCA"+(p.customComiteAfirm.length+1);
    var nw={id:id,tema:newCTema.trim(),texto:newCTexto.trim(),custom:true};
    p.setCustomComiteAfirm(p.customComiteAfirm.concat([nw]));
    if(modalForComite!==null){var updated=comites.map(function(c,i){if(i!==modalForComite)return c;return Object.assign({},c,{afirmaciones:c.afirmaciones.concat([id])})});p.setComites(updated)}
    setNewCTema("");setNewCTexto("");setShowModal(false);setModalForComite(null);
  }
  function toggleMandComite(id){var m=Object.assign({},p.mandatory);if(m[id])delete m[id];else m[id]=true;p.setMandatory(m)}
  var allAfirms=allComiteAfirm();
  var totalQ=comites.reduce(function(s,c){return s+c.afirmaciones.length},0);

  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24}}>
      <div><h1 style={{fontFamily:T.font,fontSize:28,fontWeight:400,margin:"0 0 4px"}}>Comités de Apoyo</h1><p style={{color:T.gray500,fontSize:14,margin:0}}>{comites.length} comité{comites.length!==1?"s":""} — {totalQ} afirmaciones</p></div>
      <div style={{display:"flex",gap:8}}><button onClick={p.back} style={{padding:"10px 20px",borderRadius:8,border:"1px solid "+T.gray200,background:T.white,color:T.gray700,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>Atrás</button><button onClick={p.go} style={{padding:"10px 20px",borderRadius:8,border:"none",background:T.brand,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>Siguiente: Abiertas</button></div>
    </div>
    <Cd style={{marginBottom:20,borderLeft:"4px solid "+T.teal}}>
      <div style={{fontSize:11,fontWeight:600,color:T.gray500,letterSpacing:0.8,marginBottom:10}}>AGREGAR COMITÉ</div>
      <div style={{display:"flex",gap:8}}><input value={addName} onChange={function(e){setAddName(e.target.value)}} onKeyDown={function(e){if(e.key==="Enter")addComite()}} placeholder="Nombre del Comité (ej: Comité de Auditoría)" style={{flex:1,padding:"12px 16px",borderRadius:8,border:"1px solid "+T.gray200,fontSize:14,outline:"none",fontFamily:T.fontBody}} onFocus={function(e){e.target.style.borderColor=T.teal}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/><button onClick={addComite} disabled={!addName.trim()} style={{padding:"12px 24px",borderRadius:8,border:"none",background:addName.trim()?T.teal:T.gray200,color:addName.trim()?"#fff":T.gray400,cursor:addName.trim()?"pointer":"not-allowed",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>Agregar</button></div>
    </Cd>
    <Cd style={{marginBottom:16,borderLeft:"4px solid "+T.green,background:"rgba(27,158,94,0.03)"}}>
      <div style={{fontSize:12,fontWeight:600,color:T.green,marginBottom:8}}>Preguntas abiertas sobre Comités</div>
      {ABIERTAS_COMITE.map(function(q){var on=(p.selComiteAbiertas||[]).includes(q.id);var isMand=!!p.mandatory[q.id];
        return <div key={q.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",borderRadius:8,marginBottom:4,background:on?"rgba(27,158,94,0.06)":T.white,border:"1px solid "+(on?T.green:T.gray100),cursor:"pointer"}} onClick={function(){var cur=p.selComiteAbiertas||[];p.setSelComiteAbiertas(cur.includes(q.id)?cur.filter(function(x){return x!==q.id}):cur.concat([q.id]))}}>
          <Ck on={on}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{q.id}. {q.tema}<MandBadge on={isMand}/></div><div style={{fontSize:12,color:T.gray500,lineHeight:1.5,marginTop:2}}>{q.pregunta}</div></div>
          {on&&<button onClick={function(e){e.stopPropagation();toggleMandComite(q.id)}} style={{padding:"4px 8px",borderRadius:5,border:"1px solid "+(isMand?T.red:T.gray300),background:isMand?"rgba(201,48,62,0.06)":T.white,color:isMand?T.red:T.gray500,cursor:"pointer",fontSize:9,fontFamily:T.fontBody,fontWeight:600,flexShrink:0}}>{isMand?"Quitar":"Oblig."}</button>}
        </div>
      })}
    </Cd>
    {comites.map(function(com,ci){var isExp=editIdx===ci;
      return(<Cd key={com.id} style={{marginBottom:12,border:"1px solid "+(isExp?T.teal:T.gray200)}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:isExp?16:0}}>
          <div style={{width:40,height:40,borderRadius:10,background:"rgba(8,145,178,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:T.teal,fontWeight:700,fontSize:14,flexShrink:0}}>{ci+1}</div>
          <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600}}>{com.nombre}</div><div style={{fontSize:12,color:T.gray400}}>{com.afirmaciones.length} afirmaciones</div></div>
          <button onClick={function(){setEditIdx(isExp?null:ci)}} style={{padding:"6px 14px",borderRadius:6,border:"1px solid "+(isExp?T.teal:T.gray200),background:isExp?"rgba(8,145,178,0.08)":T.white,color:isExp?T.teal:T.gray500,cursor:"pointer",fontSize:12,fontFamily:T.fontBody,fontWeight:600}}>{isExp?"Cerrar":"Configurar"}</button>
          <button onClick={function(){removeComite(ci)}} style={{padding:"6px 12px",borderRadius:6,border:"1px solid "+T.red,background:"rgba(201,48,62,0.04)",color:T.red,cursor:"pointer",fontSize:12,fontFamily:T.fontBody}}>Eliminar</button>
        </div>
        {isExp&&<div>
          <div style={{fontSize:12,fontWeight:600,color:T.gray500,marginBottom:8,letterSpacing:0.5}}>AFIRMACIONES DEL COMITÉ</div>
          {allAfirms.map(function(af){var on=com.afirmaciones.includes(af.id);var isMand=!!p.mandatory[af.id];
            return <div key={af.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",borderRadius:8,marginBottom:4,background:on?"rgba(8,145,178,0.06)":T.offWhite,border:"1px solid "+(on?T.teal:T.gray100),cursor:"pointer"}} onClick={function(){toggleAfirmInComite(ci,af.id)}}>
              <Ck on={on}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{af.tema}<MandBadge on={isMand}/></div><div style={{fontSize:12,color:T.gray500,lineHeight:1.5,marginTop:2}}>{af.texto}</div></div>
              {on&&<button onClick={function(e){e.stopPropagation();toggleMandComite(af.id)}} style={{padding:"4px 8px",borderRadius:5,border:"1px solid "+(isMand?T.red:T.gray300),background:isMand?"rgba(201,48,62,0.06)":T.white,color:isMand?T.red:T.gray500,cursor:"pointer",fontSize:9,fontFamily:T.fontBody,fontWeight:600,flexShrink:0}}>{isMand?"Quitar":"Oblig."}</button>}
            </div>
          })}
          <button onClick={function(){setShowModal(true);setModalForComite(ci)}} style={{marginTop:8,padding:"7px 16px",borderRadius:6,border:"1px dashed "+T.teal,background:"transparent",color:T.teal,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:T.fontBody}}>+ Crear afirmación personalizada</button>
        </div>}
      </Cd>);
    })}
    {showModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={function(){setShowModal(false);setModalForComite(null)}}>
      <div style={{background:T.white,borderRadius:16,padding:32,maxWidth:560,width:"90%",boxShadow:T.shadowLg}} onClick={function(e){e.stopPropagation()}}>
        <h2 style={{fontFamily:T.font,fontSize:22,fontWeight:400,margin:"0 0 20px"}}>Crear Afirmación para Comité</h2>
        <div style={{marginBottom:16}}><label style={{fontSize:11,fontWeight:600,color:T.gray500,display:"block",marginBottom:6,letterSpacing:0.8}}>TEMA *</label><input value={newCTema} onChange={function(e){setNewCTema(e.target.value)}} style={{width:"100%",padding:"12px 16px",borderRadius:8,border:"1px solid "+T.gray200,fontSize:14,outline:"none",fontFamily:T.fontBody,boxSizing:"border-box"}}/></div>
        <div style={{marginBottom:20}}><label style={{fontSize:11,fontWeight:600,color:T.gray500,display:"block",marginBottom:6,letterSpacing:0.8}}>AFIRMACIÓN *</label><textarea value={newCTexto} onChange={function(e){setNewCTexto(e.target.value)}} rows={4} style={{width:"100%",padding:"12px 16px",borderRadius:8,border:"1px solid "+T.gray200,fontSize:14,outline:"none",fontFamily:T.fontBody,boxSizing:"border-box",resize:"vertical"}}/></div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button onClick={function(){setShowModal(false);setModalForComite(null)}} style={{padding:"10px 20px",borderRadius:8,border:"1px solid "+T.gray200,background:T.white,color:T.gray700,cursor:"pointer",fontSize:13,fontFamily:T.fontBody}}>Cancelar</button><button onClick={addCustomComiteAfirm} disabled={!newCTema.trim()||!newCTexto.trim()} style={{padding:"10px 24px",borderRadius:8,border:"none",background:newCTema.trim()&&newCTexto.trim()?T.teal:T.gray200,color:newCTema.trim()&&newCTexto.trim()?"#fff":T.gray400,cursor:newCTema.trim()&&newCTexto.trim()?"pointer":"not-allowed",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>Crear</button></div>
      </div>
    </div>}
  </div>);
}

/* ═══ ADMIN STEP 3: ABIERTAS ═══ */
function A3Abiertas(p){
  var sel=p.sel;
  var _newItem5=useState("");var newItem5=_newItem5[0];var setNewItem5=_newItem5[1];
  var _newItem6=useState("");var newItem6=_newItem6[0];var setNewItem6=_newItem6[1];
  function tog(id){var ab=sel.abiertas;p.setSel(Object.assign({},sel,{abiertas:ab.includes(id)?ab.filter(function(x){return x!==id}):ab.concat([id])}))}
  function toggleMand(id){var m=Object.assign({},p.mandatory);if(m[id])delete m[id];else m[id]=true;p.setMandatory(m)}
  function addItem(list,setList,val,setVal){if(!val.trim())return;setList(list.concat([val.trim()]));setVal("")}
  function removeItem(list,setList,i){setList(list.filter(function(_,idx){return idx!==i}))}

  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24}}><div><h1 style={{fontFamily:T.font,fontSize:28,fontWeight:400,margin:"0 0 4px"}}>Preguntas Abiertas</h1><p style={{color:T.gray500,fontSize:14,margin:0}}>{sel.abiertas.length} seleccionadas</p></div><div style={{display:"flex",gap:8}}><button onClick={p.back} style={{padding:"10px 20px",borderRadius:8,border:"1px solid "+T.gray200,background:T.white,color:T.gray700,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>Atrás</button><button onClick={p.go} style={{padding:"10px 20px",borderRadius:8,border:"none",background:T.brand,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>Siguiente: Vista Previa</button></div></div>
    <Cd style={{marginBottom:16,borderLeft:"4px solid "+T.teal,background:"rgba(8,145,178,0.03)"}}><p style={{fontSize:12,color:T.gray500,margin:0,lineHeight:1.5}}><strong>Nota:</strong> Las preguntas 1P y 2P (sobre Comités) se configuran en la sección de Comités.</p></Cd>
    {ABIERTAS.map(function(q){var on=sel.abiertas.includes(q.id);var isMand=!!p.mandatory[q.id];
      return(<Cd key={q.id} style={{marginBottom:12,border:"1px solid "+(on?T.green:T.gray200),padding:0,overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",padding:"14px 16px",cursor:"pointer",gap:12}} onClick={function(){tog(q.id)}}>
          <Ck on={on}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{q.id}. {q.tema}<MandBadge on={isMand}/></div><div style={{fontSize:12,color:T.gray500,marginTop:4,lineHeight:1.5}}>{q.pregunta}</div>
          {q.tipo==="choose3"&&<div style={{fontSize:11,color:T.teal,marginTop:4,fontWeight:600}}>Tipo: El encuestado elige 3 de una lista + Otros</div>}
          {q.tipo==="triple_text"&&<div style={{fontSize:11,color:T.amber,marginTop:4,fontWeight:600}}>Tipo: 3 recuadros de texto obligatorios</div>}
          </div>
          {on&&<button onClick={function(e){e.stopPropagation();toggleMand(q.id)}} style={{padding:"4px 10px",borderRadius:5,border:"1px solid "+(isMand?T.red:T.gray300),background:isMand?"rgba(201,48,62,0.06)":T.white,color:isMand?T.red:T.gray500,cursor:"pointer",fontSize:10,fontFamily:T.fontBody,fontWeight:600}}>{isMand?"Quitar oblig.":"Obligatoria"}</button>}
        </div>
        {on&&q.id==="5PA"&&<div style={{padding:"0 16px 16px",borderTop:"1px solid "+T.gray100}}>
          <div style={{fontSize:12,fontWeight:600,color:T.gray500,margin:"12px 0 8px",letterSpacing:0.5}}>LISTA DE TEMAS ({p.list5PA.length} items)</div>
          {p.list5PA.map(function(item,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:T.offWhite,borderRadius:6,marginBottom:4}}><span style={{flex:1,fontSize:13}}>{item}</span><button onClick={function(){removeItem(p.list5PA,p.setList5PA,i)}} style={{background:"none",border:"none",color:T.red,cursor:"pointer",fontSize:14,fontWeight:700}}>{"×"}</button></div>})}
          <div style={{display:"flex",gap:6,marginTop:6}}><input value={newItem5} onChange={function(e){setNewItem5(e.target.value)}} onKeyDown={function(e){if(e.key==="Enter"){addItem(p.list5PA,p.setList5PA,newItem5,setNewItem5)}}} placeholder="Agregar área de formación..." style={{flex:1,padding:"8px 12px",borderRadius:6,border:"1px solid "+T.gray200,fontSize:13,outline:"none",fontFamily:T.fontBody}}/><button onClick={function(){addItem(p.list5PA,p.setList5PA,newItem5,setNewItem5)}} style={{padding:"8px 16px",borderRadius:6,border:"none",background:T.teal,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>+</button></div>
        </div>}
        {on&&q.id==="6AC"&&<div style={{padding:"0 16px 16px",borderTop:"1px solid "+T.gray100}}>
          <div style={{fontSize:12,fontWeight:600,color:T.gray500,margin:"12px 0 8px",letterSpacing:0.5}}>LISTA DE TEMAS ({p.list6AC.length} items)</div>
          {p.list6AC.map(function(item,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:T.offWhite,borderRadius:6,marginBottom:4}}><span style={{flex:1,fontSize:13}}>{item}</span><button onClick={function(){removeItem(p.list6AC,p.setList6AC,i)}} style={{background:"none",border:"none",color:T.red,cursor:"pointer",fontSize:14,fontWeight:700}}>{"×"}</button></div>})}
          <div style={{display:"flex",gap:6,marginTop:6}}><input value={newItem6} onChange={function(e){setNewItem6(e.target.value)}} onKeyDown={function(e){if(e.key==="Enter"){addItem(p.list6AC,p.setList6AC,newItem6,setNewItem6)}}} placeholder="Agregar tema estratégico..." style={{flex:1,padding:"8px 12px",borderRadius:6,border:"1px solid "+T.gray200,fontSize:13,outline:"none",fontFamily:T.fontBody}}/><button onClick={function(){addItem(p.list6AC,p.setList6AC,newItem6,setNewItem6)}} style={{padding:"8px 16px",borderRadius:6,border:"none",background:T.teal,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>+</button></div>
        </div>}
      </Cd>);
    })}
  </div>);
}

/* ═══ ADMIN STEP 4: VISTA PREVIA ═══ */
function A4Preview(p){
  var co=p.co;var sel=p.sel;
  var totPreg=sel.estadios.length+sel.afirmaciones.length+sel.abiertas.length;
  var totComiteQ=p.comites.reduce(function(s,c){return s+c.afirmaciones.length},0);
  var nMand=Object.keys(p.mandatory).filter(function(k){return p.mandatory[k]}).length;
  return(<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24}}><div><h1 style={{fontFamily:T.font,fontSize:28,fontWeight:400,margin:"0 0 4px"}}>Vista Previa</h1><p style={{color:T.gray500,fontSize:14,margin:0}}>{co.nombre} — {totPreg+totComiteQ} preguntas totales ({nMand} obligatorias)</p></div><div style={{display:"flex",gap:8}}><button onClick={p.back} style={{padding:"10px 20px",borderRadius:8,border:"1px solid "+T.gray200,background:T.white,color:T.gray700,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>Atrás</button><button onClick={p.gen} style={{padding:"10px 24px",borderRadius:8,border:"none",background:T.brand,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>Generar Enlace de Evaluación</button></div></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>{[{l:"Estadios",n:sel.estadios.length,c:T.brand},{l:"Afirmaciones",n:sel.afirmaciones.length,c:T.gold},{l:"Comités",n:p.comites.length+" ("+totComiteQ+")",c:T.teal},{l:"Abiertas",n:sel.abiertas.length,c:T.green}].map(function(x){return <Cd key={x.l} style={{textAlign:"center",padding:"24px 12px",borderTop:"3px solid "+x.c}}><div style={{fontFamily:T.font,fontSize:30,fontWeight:400,color:x.c}}>{x.n}</div><div style={{fontSize:12,color:T.gray500,marginTop:4}}>{x.l}</div></Cd>})}</div>
    {p.list5PA.length>0&&<Cd style={{marginBottom:12}}><h4 style={{fontSize:13,fontWeight:600,color:T.teal,margin:"0 0 8px"}}>5PA — Áreas de Formación ({p.list5PA.length})</h4><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{p.list5PA.map(function(t,i){return <span key={i} style={{fontSize:12,padding:"4px 10px",borderRadius:6,background:T.offWhite,border:"1px solid "+T.gray200}}>{t}</span>})}</div></Cd>}
    {p.list6AC.length>0&&<Cd style={{marginBottom:12}}><h4 style={{fontSize:13,fontWeight:600,color:T.teal,margin:"0 0 8px"}}>6AC — Temas Estratégicos ({p.list6AC.length})</h4><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{p.list6AC.map(function(t,i){return <span key={i} style={{fontSize:12,padding:"4px 10px",borderRadius:6,background:T.offWhite,border:"1px solid "+T.gray200}}>{t}</span>})}</div></Cd>}
    <Cd style={{padding:0,overflow:"hidden"}}><div style={{background:T.brand,padding:"32px 28px",textAlign:"center"}}><div style={{marginBottom:10,opacity:0.8}}><KearneyLogo size={120} color={T.white}/></div><h2 style={{fontFamily:T.font,fontSize:22,fontWeight:400,color:"#fff",margin:"0 0 6px"}}>Evaluación de Junta Directiva</h2><p style={{color:"rgba(255,255,255,0.7)",fontSize:14,margin:0}}>{co.nombre}{co.pais?" — "+co.pais:""}</p></div><div style={{padding:"24px 28px",textAlign:"center",color:T.gray500,fontSize:14}}>{totPreg+totComiteQ} preguntas listas para ser respondidas</div></Cd>
  </div>);
}

/* ═══ ADMIN STEP 5: SEGUIMIENTO ═══ */
function A5Track(p){
  var _c=useState(false);var copied=_c[0];var setCopied=_c[1];
  function copy(){if(p.evalId){navigator.clipboard.writeText(p.evalId).catch(function(){});setCopied(true);setTimeout(function(){setCopied(false)},2000)}}
  return(<div>
    {p.evalId&&<Cd style={{borderLeft:"4px solid "+T.brand,marginBottom:24}}><div style={{fontSize:11,fontWeight:600,color:T.gray500,letterSpacing:0.8,marginBottom:10}}>CÓDIGO DE EVALUACIÓN</div><div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{flex:1,padding:"14px 18px",borderRadius:8,background:T.offWhite,border:"1px solid "+T.gray200,fontSize:20,fontFamily:"monospace",color:T.brand,textAlign:"center",fontWeight:700,letterSpacing:3}}>{p.evalId}</div><button onClick={copy} style={{padding:"14px 20px",borderRadius:8,border:"none",background:copied?T.green:T.brand,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody}}>{copied?"Copiado ✓":"Copiar"}</button></div><p style={{fontSize:12,color:T.gray400,margin:"10px 0 0"}}>Comparta este código con los evaluados.</p></Cd>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}><St l="Respuestas recibidas" v={p.resps.length} c={T.green}/><St l="Estado" v={p.resps.length>0?"Activa":"Pendiente"} c={T.brand}/><St l="Tasa de respuesta" v={p.resps.length>0?Math.round(p.resps.length/15*100)+"%":"—"}/></div>
    <Cd>{p.resps.length===0?<div style={{textAlign:"center",padding:40,color:T.gray400}}><p>Las respuestas aparecerán aquí en tiempo real</p></div>
      :p.resps.map(function(r,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:10,background:T.offWhite,marginBottom:6}}><div style={{width:40,height:40,borderRadius:"50%",background:T.brand,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:15,color:"#fff"}}>{r.respondent&&r.respondent.nombre?r.respondent.nombre[0]:"?"}</div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{r.respondent?r.respondent.nombre:"Anónimo"}</div><div style={{fontSize:12,color:T.gray400}}>{r.respondent?r.respondent.cargo:""}</div></div><div style={{fontSize:12,color:T.green,fontWeight:600,background:T.greenLight,padding:"4px 12px",borderRadius:20}}>Completada</div></div>})}
    </Cd>
  </div>);
}

/* ══════════ EXCEL EXPORT ══════════ */
function exportExcel(resps,co,sel,comites,customAfirm,customComiteAfirm){
  var wb=XLSX.utils.book_new();
  var allAfirm=AFIRMACIONES.concat(customAfirm||[]);
  var allComiteAfirm=COMITE_AFIRMACIONES_STD.concat(customComiteAfirm||[]);
  var eLabels=["Sin información","Estadio 1","Estadio 2","Estadio 3","Estadio 4"];
  var eIds=(sel&&sel.estadios)||[];
  if(eIds.length){
    var eHeaders=["Respondente","Cargo","Rol","Correo"];
    var eQs=ESTADIOS.filter(function(q){return eIds.includes(q.id)});
    eQs.forEach(function(q){eHeaders.push(q.id+" - "+q.tema);eHeaders.push(q.id+" Complemento")});
    var eRows=resps.map(function(r){var row=[r.respondent?r.respondent.nombre:"",r.respondent?r.respondent.cargo:"",r.respondent?r.respondent.rol:"",r.respondent?r.respondent.correo:""];eQs.forEach(function(q){var v=r.answers&&r.answers.estadios?r.answers.estadios[q.id]:"";row.push(v!==undefined&&v!==null&&v!==""?eLabels[v]||v:"");row.push(r.answers&&r.answers.complements?r.answers.complements[q.id]||"":"")});return row});
    var eWs=XLSX.utils.aoa_to_sheet([eHeaders].concat(eRows));XLSX.utils.book_append_sheet(wb,eWs,"Estadios");
  }
  var aIds=(sel&&sel.afirmaciones)||[];
  if(aIds.length){
    var aHeaders=["Respondente","Cargo","Rol","Correo"];
    var aQs=allAfirm.filter(function(q){return aIds.includes(q.id)});
    aQs.forEach(function(q){aHeaders.push(q.id+" - "+q.tema);aHeaders.push(q.id+" Complemento")});
    var aRows=resps.map(function(r){var row=[r.respondent?r.respondent.nombre:"",r.respondent?r.respondent.cargo:"",r.respondent?r.respondent.rol:"",r.respondent?r.respondent.correo:""];aQs.forEach(function(q){var v=r.answers&&r.answers.afirmaciones?r.answers.afirmaciones[q.id]:"";row.push(v!==undefined&&v!==null&&v!==""?aLabels[v]||v:"");row.push(r.answers&&r.answers.complements?r.answers.complements[q.id]||"":"")});return row});
    var aWs=XLSX.utils.aoa_to_sheet([aHeaders].concat(aRows));XLSX.utils.book_append_sheet(wb,aWs,"Afirmaciones");
  }
  (comites||[]).forEach(function(com){
    var cHeaders=["Respondente","Cargo"];
    var cQs=com.afirmaciones.map(function(afId){return allComiteAfirm.find(function(a){return a.id===afId})}).filter(Boolean);
    cQs.forEach(function(q){cHeaders.push(q.id+" - "+q.tema);cHeaders.push(q.id+" Complemento")});
    var cRows=resps.map(function(r){var row=[r.respondent?r.respondent.nombre:"",r.respondent?r.respondent.cargo:""];cQs.forEach(function(q){var v=r.answers&&r.answers.comites&&r.answers.comites[com.id]?r.answers.comites[com.id][q.id]:"";row.push(v!==undefined&&v!==null&&v!==""?aLabels[v]||v:"");row.push(r.answers&&r.answers.complements?r.answers.complements[q.id]||"":"")});return row});
    var cWs=XLSX.utils.aoa_to_sheet([cHeaders].concat(cRows));XLSX.utils.book_append_sheet(wb,cWs,com.nombre.substring(0,31));
  });
  var oIds=(sel&&sel.abiertas)||[];
  if(oIds.length){
    var oHeaders=["Respondente","Cargo","Pregunta","Respuesta"];var oRows=[];
    resps.forEach(function(r){var ab=r.answers&&r.answers.abiertas?r.answers.abiertas:{};Object.keys(ab).forEach(function(id){if(!ab[id])return;var q=ABIERTAS.find(function(p){return p.id===id})||ABIERTAS_COMITE.find(function(p){return p.id===id});var tema=q?q.tema:id;var val=ab[id];if(typeof val==="object"&&val.t1){oRows.push([r.respondent?r.respondent.nombre:"",r.respondent?r.respondent.cargo:"",tema+" (1)",val.t1]);oRows.push([r.respondent?r.respondent.nombre:"",r.respondent?r.respondent.cargo:"",tema+" (2)",val.t2||""]);oRows.push([r.respondent?r.respondent.nombre:"",r.respondent?r.respondent.cargo:"",tema+" (3)",val.t3||""])}else if(Array.isArray(val)){oRows.push([r.respondent?r.respondent.nombre:"",r.respondent?r.respondent.cargo:"",tema,val.join(", ")])}else{oRows.push([r.respondent?r.respondent.nombre:"",r.respondent?r.respondent.cargo:"",tema,val])}})});
    var oWs=XLSX.utils.aoa_to_sheet([oHeaders].concat(oRows));XLSX.utils.book_append_sheet(wb,oWs,"Abiertas");
  }
  var sumRows=[["Empresa",co.nombre||""],["País",co.pais||""],["Sector",co.sector||""],["Año",co.anio||""],["Equipo consultor",co.equipo||""],["Total participantes",resps.length],["Promedio Estadios",procE(resps,sel).avg?procE(resps,sel).avg.toFixed(2):"N/A"],["Promedio Afirmaciones",procA(resps,sel,allAfirm).avg?procA(resps,sel,allAfirm).avg.toFixed(2):"N/A"]];
  var sumWs=XLSX.utils.aoa_to_sheet([["Métrica","Valor"]].concat(sumRows));XLSX.utils.book_append_sheet(wb,sumWs,"Resumen");
  XLSX.writeFile(wb,"Resultados_"+(co.nombre||"Evaluacion").replace(/[^a-zA-Z0-9]/g,"_")+".xlsx");
}

/* ═══ ADMIN STEP 6: RESULTADOS ═══ */
function A6Results(p){
  var _v=useState("estadios");var view=_v[0];var setView=_v[1];
  var _s=useState(0);var sens=_s[0];var setSens=_s[1];
  if(!p.resps.length)return <div style={{textAlign:"center",padding:60}}><h2 style={{fontFamily:T.font,fontSize:24,fontWeight:400}}>Sin respuestas</h2></div>;
  var allAfirm=AFIRMACIONES.concat(p.customAfirm||[]);
  var allComiteAfirm=COMITE_AFIRMACIONES_STD.concat(p.customComiteAfirm||[]);
  var eD=procE(p.resps,p.sel);var aD=procA(p.resps,p.sel,allAfirm);var oD=procO(p.resps,p.sel);
  var cD=procC(p.resps,p.comites||[],allComiteAfirm);
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:4}}>
      <h1 style={{fontFamily:T.font,fontSize:28,fontWeight:400,margin:0}}>Análisis de Resultados</h1>
      <button onClick={function(){exportExcel(p.resps,p.co,p.sel,p.comites,p.customAfirm,p.customComiteAfirm)}} style={{padding:"10px 20px",borderRadius:8,border:"none",background:T.green,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody,display:"flex",alignItems:"center",gap:6}}>📥 Descargar Excel</button>
    </div>
    <p style={{color:T.gray500,fontSize:14,margin:"0 0 20px"}}>{p.co.nombre} — N = {p.resps.length}</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}><St l="Participantes" v={p.resps.length} c={T.brand}/><St l="Prom. Estadios" v={eD.avg?eD.avg.toFixed(1):"—"} c={T.ch4}/><St l="Prom. Afirmaciones" v={aD.avg?aD.avg.toFixed(1):"—"} c={T.gold}/><St l="Comités" v={(p.comites||[]).length} c={T.teal}/></div>
    <div style={{display:"flex",gap:1,background:T.gray200,borderRadius:10,padding:2,marginBottom:20}}>{[{k:"estadios",l:"Estadios"},{k:"afirmaciones",l:"Afirmaciones"},{k:"comites",l:"Comités"},{k:"abiertas",l:"Abiertas"}].map(function(v){return <button key={v.k} onClick={function(){setView(v.k)}} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:view===v.k?T.white:"transparent",color:view===v.k?T.brand:T.gray500,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody,boxShadow:view===v.k?T.shadow:"none"}}>{v.l}</button>})}</div>
    {(view==="estadios"||view==="afirmaciones"||view==="comites")&&<Cd style={{marginBottom:16,padding:"14px 20px"}}><div style={{display:"flex",alignItems:"center",gap:16}}><span style={{fontSize:12,fontWeight:600,color:T.gray500}}>Análisis de Sensibilidad</span><input type="range" min="-10" max="10" value={sens} onChange={function(e){setSens(Number(e.target.value))}} style={{flex:1,accentColor:T.brand}}/><span style={{fontSize:13,fontWeight:700,color:sens>0?T.green:sens<0?T.red:T.gray400,minWidth:50,textAlign:"right"}}>{sens>0?"+":""}{sens}%</span></div></Cd>}
    {view==="estadios"&&<Cd><h3 style={{fontFamily:T.font,fontSize:20,fontWeight:400,margin:"0 0 4px",color:T.brand}}>Estadios de Excelencia</h3><p style={{fontSize:13,color:T.gray400,margin:"0 0 12px"}}>N = {eD.n}</p><Lg items={[{c:T.ch0,l:"Sin información"},{c:T.ch1,l:"Estadio 1"},{c:T.ch2,l:"Estadio 2"},{c:T.ch3,l:"Estadio 3"},{c:T.ch4,l:"Estadio 4"}]}/>{eD.qs.sort(function(a,b){return b.avg-a.avg}).map(function(q){return <ChBar key={q.id} label={q.tema} dist={q.dist} avg={q.avg} sens={sens} estadio/>})}</Cd>}
    {view==="afirmaciones"&&<Cd><h3 style={{fontFamily:T.font,fontSize:20,fontWeight:400,margin:"0 0 12px",color:T.gold}}>Afirmaciones</h3><Lg items={[{c:T.ch0,l:"Sin info"},{c:T.ch1,l:"Tot.Desac."},{c:T.ch2,l:"Desac."},{c:T.ch3,l:"Acuerdo"},{c:T.ch4,l:"Tot.Acuerdo"}]}/>{aD.qs.sort(function(a,b){return b.avg-a.avg}).map(function(q){return <ChBar key={q.id} label={q.tema} dist={q.dist} avg={q.avg} sens={sens}/>})}</Cd>}
    {view==="comites"&&<div>{cD.length>0?cD.map(function(com){return <Cd key={com.nombre} style={{marginBottom:16}}><h3 style={{fontFamily:T.font,fontSize:18,fontWeight:400,margin:"0 0 4px",color:T.teal}}>{com.nombre}</h3><p style={{fontSize:13,color:T.gray400,margin:"0 0 12px"}}>Promedio: {com.avg?com.avg.toFixed(1):"—"}</p><Lg items={[{c:T.ch0,l:"Sin info"},{c:T.ch1,l:"Tot.Desac."},{c:T.ch2,l:"Desac."},{c:T.ch3,l:"Acuerdo"},{c:T.ch4,l:"Tot.Acuerdo"}]}/>{com.qs.map(function(q){return <ChBar key={q.id} label={q.tema} dist={q.dist} avg={q.avg} sens={sens}/>})}</Cd>}):<Cd style={{textAlign:"center",padding:40,color:T.gray400}}><p>No hay comités configurados</p></Cd>}</div>}
    {view==="abiertas"&&<Cd><h3 style={{fontFamily:T.font,fontSize:20,fontWeight:400,margin:"0 0 16px",color:T.green}}>Respuestas Abiertas</h3>{oD.length>0?oD.map(function(r,i){return <div key={i} style={{padding:16,background:T.offWhite,borderRadius:10,marginBottom:8,borderLeft:"3px solid "+T.brand}}><div style={{fontSize:12,fontWeight:600,color:T.brand,marginBottom:6}}>{r.tema}</div><div style={{fontSize:14,lineHeight:1.6,color:T.gray700}}>{r.resp}</div><div style={{fontSize:12,color:T.gray400,marginTop:8}}>— {r.who}</div></div>}):<p style={{color:T.gray400,textAlign:"center"}}>Sin respuestas</p>}</Cd>}
  </div>);
}

/* ══════════ DATA PROCESSING ══════════ */
function procE(r,s){var ids=(s&&s.estadios)||[];var qs=ESTADIOS.filter(function(q){return ids.includes(q.id)}).map(function(q){var a=r.map(function(x){return x.answers&&x.answers.estadios?x.answers.estadios[q.id]:undefined}).filter(function(v){return v!=null});var n=a.filter(function(v){return v>0});var d=[0,0,0,0,0];a.forEach(function(v){if(v>=0&&v<=4)d[v]++});return{id:q.id,tema:q.tema,dist:d,avg:n.length?n.reduce(function(s,v){return s+v},0)/n.length:0}});var av=qs.filter(function(q){return q.avg>0}).map(function(q){return q.avg});return{qs:qs,n:r.length,avg:av.length?av.reduce(function(s,v){return s+v},0)/av.length:0}}
function procA(r,s,allAfirm){var ids=(s&&s.afirmaciones)||[];var qs=(allAfirm||AFIRMACIONES).filter(function(q){return ids.includes(q.id)}).map(function(q){var a=r.map(function(x){return x.answers&&x.answers.afirmaciones?x.answers.afirmaciones[q.id]:undefined}).filter(function(v){return v!=null});var n=a.filter(function(v){return v>0});var d=[0,0,0,0,0];a.forEach(function(v){if(v>=0&&v<=4)d[v]++});return{id:q.id,tema:q.tema,dist:d,avg:n.length?n.reduce(function(s,v){return s+v},0)/n.length:0}});var av=qs.filter(function(q){return q.avg>0}).map(function(q){return q.avg});return{qs:qs,n:r.length,avg:av.length?av.reduce(function(s,v){return s+v},0)/av.length:0}}
function procO(r,s){var ids=(s&&s.abiertas)||[];var o=[];r.forEach(function(x){var ab=x.answers&&x.answers.abiertas?x.answers.abiertas:{};Object.keys(ab).forEach(function(id){if(!ids.includes(id)||!ab[id])return;var q=ABIERTAS.find(function(p){return p.id===id})||ABIERTAS_COMITE.find(function(p){return p.id===id});if(q)o.push({tema:q.tema,sec:q.sec,resp:typeof ab[id]==="object"?JSON.stringify(ab[id]):ab[id],who:x.respondent?x.respondent.nombre:"Anónimo"})})});return o}
function procC(r,comites,allComiteAfirm){return comites.map(function(com){var qs=com.afirmaciones.map(function(afId){var af=allComiteAfirm.find(function(a){return a.id===afId});if(!af)return null;var a=r.map(function(x){return x.answers&&x.answers.comites&&x.answers.comites[com.id]?x.answers.comites[com.id][afId]:undefined}).filter(function(v){return v!=null});var n=a.filter(function(v){return v>0});var d=[0,0,0,0,0];a.forEach(function(v){if(v>=0&&v<=4)d[v]++});return{id:afId,tema:af.tema,dist:d,avg:n.length?n.reduce(function(s,v){return s+v},0)/n.length:0}}).filter(Boolean);var av=qs.filter(function(q){return q.avg>0}).map(function(q){return q.avg});return{nombre:com.nombre,id:com.id,qs:qs,avg:av.length?av.reduce(function(s,v){return s+v},0)/av.length:0}})}

/* ══════════════════════════════════════════════════════════════
   A7 INFORME — Editor pre-PDF + Generación PDF
   ══════════════════════════════════════════════════════════════ */
function A7Informe(p){
  var allAfirm=AFIRMACIONES.concat(p.customAfirm||[]);
  var allComiteAfirm=COMITE_AFIRMACIONES_STD.concat(p.customComiteAfirm||[]);

  function computeRanking(qId){
    var counts={};
    p.resps.forEach(function(r){var ab=r.answers&&r.answers.abiertas?r.answers.abiertas:{};var val=ab[qId];if(!val)return;var items=Array.isArray(val)?val:[];items.forEach(function(item){if(!item||item==="Otros")return;counts[item]=(counts[item]||0)+1})});
    return Object.keys(counts).map(function(k){return{tema:k,total:counts[k]}}).sort(function(a,b){return b.total-a.total});
  }
  function collectPreguntasCriticas(){
    var all=[];
    p.resps.forEach(function(r){var ab=r.answers&&r.answers.abiertas?r.answers.abiertas:{};var val=ab["4PC"];var who=r.respondent?r.respondent.nombre:"Anónimo";if(!val)return;if(val.t1&&val.t1.trim())all.push({texto:val.t1.trim(),autor:who});if(val.t2&&val.t2.trim())all.push({texto:val.t2.trim(),autor:who});if(val.t3&&val.t3.trim())all.push({texto:val.t3.trim(),autor:who})});
    return all;
  }

  var initRanking5=computeRanking("5PA");
  var initRanking6=computeRanking("6AC");
  var initPreguntas=collectPreguntasCriticas().map(function(q,i){return{id:i,texto:q.texto,autor:q.autor,familia:""}});

  var _umbral=useState(Math.max(1,Math.ceil(p.resps.length*0.5)));var umbral=_umbral[0];var setUmbral=_umbral[1];
  var _rank5=useState(initRanking5);var rank5=_rank5[0];var setRank5=_rank5[1];
  var _rank6=useState(initRanking6);var rank6=_rank6[0];var setRank6=_rank6[1];
  var _preguntas=useState(initPreguntas);var preguntas=_preguntas[0];var setPreguntas=_preguntas[1];
  var _familias=useState([""]);var familias=_familias[0];var setFamilias=_familias[1];
  var _editIdx=useState(null);var editIdx=_editIdx[0];var setEditIdx=_editIdx[1];
  var _editText=useState("");var editText=_editText[0];var setEditText=_editText[1];
  var _section=useState("preguntas");var section=_section[0];var setSection=_section[1];
  var _generating=useState(false);var generating=_generating[0];var setGenerating=_generating[1];

  function moveUp(list,setList,i){if(i===0)return;var n=list.slice();var tmp=n[i-1];n[i-1]=n[i];n[i]=tmp;setList(n)}
  function moveDown(list,setList,i){if(i===list.length-1)return;var n=list.slice();var tmp=n[i+1];n[i+1]=n[i];n[i]=tmp;setList(n)}
  function addFamilia(){setFamilias(familias.concat([""]))}
  function updateFamilia(i,val){var f=familias.slice();f[i]=val;setFamilias(f)}
  function removeFamilia(i){var f=familias.filter(function(_,idx){return idx!==i});var newPreg=preguntas.map(function(q){return q.familia===familias[i]?Object.assign({},q,{familia:""}):q});setFamilias(f);setPreguntas(newPreg)}
  function setPregFamilia(pregId,fam){setPreguntas(preguntas.map(function(q){return q.id===pregId?Object.assign({},q,{familia:fam}):q}))}
  function saveEdit(pregId){setPreguntas(preguntas.map(function(q){return q.id===pregId?Object.assign({},q,{texto:editText}):q}));setEditIdx(null);setEditText("")}
  function deletePreg(pregId){setPreguntas(preguntas.filter(function(q){return q.id!==pregId}))}

  function generatePDF(){
    setGenerating(true);
    if(!window.jspdf){
      var script=document.createElement("script");
      script.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload=function(){buildPDF()};
      script.onerror=function(){alert("Error cargando jsPDF. Verifica tu conexión.");setGenerating(false)};
      document.head.appendChild(script);
    } else {buildPDF()}
  }

  function buildPDF(){
    try{
      var jsPDF=window.jspdf.jsPDF;
      var doc=new jsPDF({orientation:"landscape",unit:"mm",format:"a4"});
      var W=297;var H=210;
      var brand=[120,35,220];var dark=[30,30,30];var gray=[100,100,100];var lgray=[200,200,200];
      var co=p.co||{};var N=p.resps.length;
      var CH_COLORS=["#D2D2D2","#787878","#D2D2D2","#C8A5F0","#7823DC"];
      function hexToRgb(hex){return[parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)]}
      function setFont(size,weight,color){doc.setFontSize(size);doc.setFont("helvetica",weight||"normal");doc.setTextColor(color?color[0]:dark[0],color?color[1]:dark[1],color?color[2]:dark[2])}
      function fillRect(x,y,w,h,color){doc.setFillColor(color[0],color[1],color[2]);doc.rect(x,y,w,h,"F")}
      function pageHeader(title,subtitle){fillRect(0,0,W,14,brand);setFont(8,"bold",[255,255,255]);doc.text("KEARNEY",10,9);setFont(7,"normal",[220,220,255]);doc.text(co.nombre||"",W-10,9,{align:"right"});setFont(11,"bold",brand);doc.text(title,10,24);if(subtitle){setFont(8,"normal",gray);doc.text(subtitle,10,30)}return subtitle?36:30}
      function pageFooter(num){setFont(7,"normal",lgray);doc.text("Fuente: Análisis Kearney — Evaluación de Junta Directiva",10,H-5);doc.text(String(num),W-10,H-5,{align:"right"});setFont(7,"bold",lgray);doc.text("KEARNEY",W/2,H-5,{align:"center"})}

      /* PORTADA */
      fillRect(0,0,W/2,H,[255,255,255]);fillRect(W/2,0,W/2,H,[248,247,252]);
      doc.setFillColor(230,218,252);doc.triangle(W/2+20,20,W-20,20,W/2+20,H-20,"F");
      doc.setFillColor(200,165,240);doc.triangle(W/2+40,40,W-20,40,W/2+40,H/2,"F");
      setFont(26,"bold",brand);doc.text("Análisis de resultados",14,46);doc.text("del levantamiento de",14,60);doc.text("perspectivas",14,74);
      setFont(14,"bold",dark);doc.text(co.nombre||"Empresa",14,92);setFont(11,"normal",gray);doc.text(co.anio||String(new Date().getFullYear()),14,102);
      setFont(20,"bold",dark);doc.text("KEARNEY",14,H-12);

      var pageNum=2;

      /* SLIDE 2: TABLA DE CONTENIDO */
      (function(){
        doc.addPage();
        fillRect(0,0,W,14,brand);
        setFont(8,"bold",[255,255,255]);doc.text("KEARNEY",10,9);
        setFont(7,"normal",[220,220,255]);doc.text(co.nombre||"",W-10,9,{align:"right"});
        setFont(13,"bold",brand);doc.text("Análisis de resultados del levantamiento de perspectivas",10,26);
        setFont(9,"normal",gray);doc.text(co.nombre||"",10,34);

        var sections=[];
        var eD2=procE(p.resps,p.sel);
        var aD2=procA(p.resps,p.sel,allAfirm);
        var cD2=procC(p.resps,p.comites||[],allComiteAfirm);
        if(eD2.qs.length) sections.push({titulo:"Estadios de Excelencia",sub:"Calificación promedio — "+eD2.qs.length+" dimensiones evaluadas",color:[120,35,220]});
        if(aD2.qs.length) sections.push({titulo:"Resultados Afirmaciones",sub:"Escala de acuerdo — "+aD2.qs.length+" afirmaciones",color:[198,151,59]});
        cD2.filter(function(c){return c.qs&&c.qs.length}).forEach(function(c){sections.push({titulo:"Comité: "+c.nombre,sub:"Promedio: "+(c.avg?c.avg.toFixed(1):"—")+" ("+c.qs.length+" dimensiones)",color:[8,145,178]})});
        var has3P=p.resps.some(function(r){return r.answers&&r.answers.abiertas&&r.answers.abiertas["3P"]&&r.answers.abiertas["3P"].trim()});
        if(has3P) sections.push({titulo:"Perfil nuevo miembro de Junta",sub:"Respuestas abiertas — características identificadas",color:[27,158,94]});
        var has4PC=p.resps.some(function(r){return r.answers&&r.answers.abiertas&&r.answers.abiertas["4PC"]});
        if(has4PC) sections.push({titulo:"Preguntas críticas",sub:"Cada participante formuló 3 preguntas clave",color:[120,35,220]});
        if(rank6.length) sections.push({titulo:"Plan de acción estratégico (6AC)",sub:"Temas prioritarios para los próximos 3 años",color:[120,35,220]});
        if(rank5.length) sections.push({titulo:"Áreas de formación (5PA)",sub:"Conocimientos priorizados por los Directores",color:[198,151,59]});

        var cols=2;var colW=(W-28)/cols;var yTOC=44;var rowH=18;
        sections.forEach(function(s,i){
          var col=i%cols;var row=Math.floor(i/cols);
          var cx=10+col*(colW+8);var cy=yTOC+row*(rowH+6);
          fillRect(cx,cy,colW,rowH,[s.color[0],s.color[1],s.color[2]]);
          doc.setFillColor(255,255,255);doc.setDrawColor(255,255,255);
          var alpha=0.12;doc.setFillColor(Math.round(s.color[0]+(255-s.color[0])*0.85),Math.round(s.color[1]+(255-s.color[1])*0.85),Math.round(s.color[2]+(255-s.color[2])*0.85));
          doc.rect(cx,cy,colW,rowH,"F");
          doc.setDrawColor(s.color[0],s.color[1],s.color[2]);doc.setLineWidth(0.5);doc.rect(cx,cy,colW,rowH,"S");
          fillRect(cx,cy,3,rowH,[s.color[0],s.color[1],s.color[2]]);
          setFont(8,"bold",[s.color[0],s.color[1],s.color[2]]);doc.text(s.titulo,cx+6,cy+6.5,{maxWidth:colW-10});
          setFont(7,"normal",gray);doc.text(s.sub,cx+6,cy+13,{maxWidth:colW-10});
        });

        var totN=N;var promE=procE(p.resps,p.sel).avg;var promA=procA(p.resps,p.sel,allAfirm).avg;
        var statsY=H-30;
        fillRect(0,statsY-2,W,H-statsY+2,[248,247,252]);
        doc.setDrawColor(230,220,250);doc.setLineWidth(0.3);doc.line(0,statsY-2,W,statsY-2);
        var stats=[{l:"Participantes",v:String(totN)},{l:"Promedio Estadios",v:promE?promE.toFixed(1):"—"},{l:"Promedio Afirmaciones",v:promA?promA.toFixed(1):"—"},{l:"Comités evaluados",v:String(cD2.filter(function(c){return c.qs&&c.qs.length}).length)}];
        var sw=W/stats.length;
        stats.forEach(function(s,i){
          setFont(16,"bold",brand);doc.text(s.v,sw*i+sw/2,statsY+10,{align:"center"});
          setFont(7,"normal",gray);doc.text(s.l,sw*i+sw/2,statsY+16,{align:"center"});
        });
        pageFooter(pageNum);pageNum++;
      })();

      /* ESTADIOS */
      var eD=procE(p.resps,p.sel);
      if(eD.qs.length>0){
        doc.addPage();var yE=pageHeader("Estadios de Excelencia","Calificación promedio (N= "+N+")");
        var sortedE=eD.qs.slice().sort(function(a,b){return b.avg-a.avg});
        var barH=7;var barGap=3;var labelW=82;var barAreaX=labelW+10;var barAreaW=W-barAreaX-28;
        var legX=barAreaX;var legY=yE-5;
        [["Sin info","#D2D2D2"],["E1","#787878"],["E2","#D2D2D2"],["E3","#C8A5F0"],["E4","#7823DC"]].forEach(function(l,i){fillRect(legX+i*30,legY,8,4,hexToRgb(l[1]));setFont(6,"normal",gray);doc.text(l[0],legX+i*30+10,legY+3.5)});
        yE+=2;
        sortedE.forEach(function(q,qi){if(yE>H-18)return;var rowY=yE+qi*(barH+barGap);setFont(7,"normal",dark);var label=q.tema.length>40?q.tema.substring(0,38)+"...":q.tema;doc.text(label,labelW,rowY+barH-1.5,{align:"right"});var xPos=barAreaX;q.dist.forEach(function(count,idx){if(count===0)return;var segW=(count/N)*barAreaW;fillRect(xPos,rowY,segW,barH,hexToRgb(CH_COLORS[idx]));if(segW>5){setFont(6,"bold",idx===4?[255,255,255]:[50,50,50]);doc.text(String(count),xPos+segW/2,rowY+barH-1.5,{align:"center"})}xPos+=segW});setFont(8,"bold",brand);doc.text(q.avg>0?q.avg.toFixed(1):"—",barAreaX+barAreaW+3,rowY+barH-1.5)});
        pageFooter(pageNum);pageNum++;
      }

      /* AFIRMACIONES */
      var aD=procA(p.resps,p.sel,allAfirm);
      if(aD.qs.length>0){
        doc.addPage();var yA=pageHeader("Resultados Afirmaciones","Calificación promedio (N= "+N+")");
        var legXA=10;var legYA=yA-5;
        [["Sin info","#D2D2D2"],["Tot.Desac.","#787878"],["En Desac.","#D2D2D2"],["De Acuerdo","#C8A5F0"],["Tot.Acuerdo","#7823DC"]].forEach(function(l,i){fillRect(legXA+i*38,legYA,8,4,hexToRgb(l[1]));setFont(6,"normal",gray);doc.text(l[0],legXA+i*38+10,legYA+3.5)});
        yA+=2;var sortedA=aD.qs.slice().sort(function(a,b){return b.avg-a.avg});
        var aBarH=7;var aGap=4;var aLabelW=100;var aBarX=aLabelW+10;var aBarW=W-aBarX-28;
        sortedA.forEach(function(q,qi){if(yA>H-18)return;var rowY=yA+qi*(aBarH+aGap);setFont(6.5,"normal",dark);var label=q.tema.length>48?q.tema.substring(0,46)+"...":q.tema;doc.text(label,aLabelW,rowY+aBarH-1.5,{align:"right"});var xPos=aBarX;q.dist.forEach(function(count,idx){if(count===0)return;var segW=(count/N)*aBarW;fillRect(xPos,rowY,segW,aBarH,hexToRgb(CH_COLORS[idx]));if(segW>5){setFont(5.5,"bold",idx===4?[255,255,255]:[50,50,50]);doc.text(String(count),xPos+segW/2,rowY+aBarH-1.5,{align:"center"})}xPos+=segW});setFont(8,"bold",brand);doc.text(q.avg>0?q.avg.toFixed(1):"—",aBarX+aBarW+3,rowY+aBarH-1.5)});
        pageFooter(pageNum);pageNum++;
      }

      /* COMITÉS */
      var cD=procC(p.resps,p.comites||[],allComiteAfirm);
      cD.forEach(function(com){
        if(!com.qs||!com.qs.length)return;
        doc.addPage();var yC=pageHeader("Resultados Comité: "+com.nombre,"Promedio: "+(com.avg?com.avg.toFixed(1):"—")+"  (N= "+N+")");
        var legXC=10;var legYC=yC-5;
        [["Sin info","#D2D2D2"],["Tot.Desac.","#787878"],["En Desac.","#D2D2D2"],["De Acuerdo","#C8A5F0"],["Tot.Acuerdo","#7823DC"]].forEach(function(l,i){fillRect(legXC+i*38,legYC,8,4,hexToRgb(l[1]));setFont(6,"normal",gray);doc.text(l[0],legXC+i*38+10,legYC+3.5)});
        yC+=2;var cBarH=8;var cGap=4;var cLabelW=100;var cBarX=cLabelW+10;var cBarW=W-cBarX-28;
        com.qs.forEach(function(q,qi){if(yC>H-18)return;var rowY=yC+qi*(cBarH+cGap);setFont(7,"normal",dark);var label=q.tema.length>46?q.tema.substring(0,44)+"...":q.tema;doc.text(label,cLabelW,rowY+cBarH-2,{align:"right"});var xPos=cBarX;q.dist.forEach(function(count,idx){if(count===0)return;var segW=(count/N)*cBarW;fillRect(xPos,rowY,segW,cBarH,hexToRgb(CH_COLORS[idx]));if(segW>5){setFont(6,"bold",idx===4?[255,255,255]:[50,50,50]);doc.text(String(count),xPos+segW/2,rowY+cBarH-2,{align:"center"})}xPos+=segW});setFont(8,"bold",brand);doc.text(q.avg>0?q.avg.toFixed(1):"—",cBarX+cBarW+3,rowY+cBarH-2)});
        pageFooter(pageNum);pageNum++;
      });

      /* PLAN DE ACCIÓN 6AC */
      if(rank6.length>0){
        doc.addPage();var y6=pageHeader("Plan de acción para priorizar en los próximos 3 años","Resultados obtenidos – cada participante escogió 3 temas estratégicos  (N= "+N+")");
        var maxCount6=rank6[0]?rank6[0].total:1;var barH6=7;var gap6=3;var labelW6=120;var barX6=labelW6+8;var barW6=W-barX6-50;
        var umbralPx=(umbral/Math.max(maxCount6,1))*barW6;
        rank6.forEach(function(item,i){if(y6>H-18)return;var rowY=y6+i*(barH6+gap6);var isH=item.total>=umbral;var barLen=(item.total/Math.max(maxCount6,1))*barW6;setFont(7,isH?"bold":"normal",isH?dark:gray);var label=item.tema.length>56?item.tema.substring(0,54)+"...":item.tema;doc.text(label,labelW6,rowY+barH6-2,{align:"right"});fillRect(barX6,rowY,barLen,barH6,isH?brand:[200,200,200]);setFont(7,"bold",isH?[255,255,255]:[100,100,100]);if(barLen>8)doc.text(String(item.total),barX6+barLen-4,rowY+barH6-2,{align:"right"});else{setFont(7,"bold",dark);doc.text(String(item.total),barX6+barLen+3,rowY+barH6-2)}});
        doc.setDrawColor(200,35,62);doc.setLineWidth(0.5);doc.setLineDashPattern([2,2],0);doc.line(barX6+umbralPx,y6-4,barX6+umbralPx,y6+rank6.length*(barH6+gap6));doc.setLineDashPattern([],0);setFont(6,"bold",[200,35,62]);doc.text("Umbral: "+umbral+" de "+N,barX6+umbralPx+2,y6-1);
        pageFooter(pageNum);pageNum++;
      }

      /* PLAN DE FORMACIÓN 5PA */
      if(rank5.length>0){
        doc.addPage();var y5=pageHeader("Áreas de formación para Directores","Resultados obtenidos – cada participante escogió 3 áreas de formación  (N= "+N+")");
        var maxCount5=rank5[0]?rank5[0].total:1;var barH5=7;var gap5=3;var labelW5=120;var barX5=labelW5+8;var barW5=W-barX5-50;
        var umbralPx5=(umbral/Math.max(maxCount5,1))*barW5;
        rank5.forEach(function(item,i){if(y5>H-18)return;var rowY=y5+i*(barH5+gap5);var isH=item.total>=umbral;var barLen=(item.total/Math.max(maxCount5,1))*barW5;setFont(7,isH?"bold":"normal",isH?dark:gray);var label=item.tema.length>56?item.tema.substring(0,54)+"...":item.tema;doc.text(label,labelW5,rowY+barH5-2,{align:"right"});fillRect(barX5,rowY,barLen,barH5,isH?brand:[200,200,200]);setFont(7,"bold",isH?[255,255,255]:[100,100,100]);if(barLen>8)doc.text(String(item.total),barX5+barLen-4,rowY+barH5-2,{align:"right"});else{setFont(7,"bold",dark);doc.text(String(item.total),barX5+barLen+3,rowY+barH5-2)}});
        doc.setDrawColor(200,35,62);doc.setLineWidth(0.5);doc.setLineDashPattern([2,2],0);doc.line(barX5+umbralPx5,y5-4,barX5+umbralPx5,y5+rank5.length*(barH5+gap5));doc.setLineDashPattern([],0);setFont(6,"bold",[200,35,62]);doc.text("Umbral: "+umbral+" de "+N,barX5+umbralPx5+2,y5-1);
        pageFooter(pageNum);pageNum++;
      }

      /* PERFIL NUEVO MIEMBRO (3P) */
      (function(){
        var raw3P=[];
        p.resps.forEach(function(r){
          var val=r.answers&&r.answers.abiertas?r.answers.abiertas["3P"]:null;
          if(val&&typeof val==="string"&&val.trim()) raw3P.push({texto:val.trim(),autor:r.respondent?r.respondent.nombre:"Anónimo"});
        });
        if(!raw3P.length)return;
        doc.addPage();
        var yP3=pageHeader("Perfil, experiencia y/o capacidades de un nuevo miembro de Junta","Resultados obtenidos – Características identificadas  (N= "+N+")");
        var cols=2;var colW=(W-28)/cols;var marginL=10;
        raw3P.forEach(function(item,i){
          var col=i%cols;var curY;
          if(col===0){
            if(i===0){curY=yP3}
            else{curY=yP3+(Math.floor(i/cols))*28;}
          } else {
            curY=yP3+(Math.floor(i/cols))*28;
          }
          if(curY>H-20)return;
          var cx=marginL+col*(colW+8);
          fillRect(cx,curY,colW,24,[248,247,252]);
          doc.setDrawColor(200,200,200);doc.setLineWidth(0.2);doc.rect(cx,curY,colW,24,"S");
          fillRect(cx,curY,2,24,[120,35,220]);
          var lines=doc.splitTextToSize(item.texto,colW-12);
          setFont(7.5,"normal",dark);
          doc.text(lines.slice(0,3),cx+5,curY+6);
          setFont(7,"normal",gray);
          doc.text("— "+item.autor,cx+5,curY+20);
        });
        pageFooter(pageNum);pageNum++;
      })();

      /* PREGUNTAS CRÍTICAS */
      var famNames=familias.filter(function(f){return f&&f.trim()});
      var sinFamilia=preguntas.filter(function(q){return!q.familia||!q.familia.trim()});
      var groups=[];
      famNames.forEach(function(f){var qs=preguntas.filter(function(q){return q.familia===f});if(qs.length)groups.push({nombre:f,preguntas:qs})});
      if(sinFamilia.length)groups.push({nombre:null,preguntas:sinFamilia});
      if(preguntas.length>0){
        var PREGS_PER_PAGE=2;var pageGroups=[];var cur=[];
        groups.forEach(function(g){cur.push(g);if(cur.length>=PREGS_PER_PAGE){pageGroups.push(cur);cur=[]}});
        if(cur.length)pageGroups.push(cur);
        pageGroups.forEach(function(pg){
          doc.addPage();var yP=pageHeader("Preguntas críticas o clave para abordar en la Junta Directiva","Resultados obtenidos – cada participante planteó 3 preguntas  (N= "+N+")");
          var colW=(W-24)/pg.length;
          pg.forEach(function(grp,gi){
            var colX=10+gi*colW;
            if(grp.nombre){
              fillRect(colX,yP,colW-4,8,[240,230,255]);setFont(8,"bold",brand);doc.text(grp.nombre,colX+4,yP+5.5,{maxWidth:colW-10});var yPI=yP+11;
              grp.preguntas.forEach(function(q,qi){if(yPI>H-14)return;var lines=doc.splitTextToSize((qi+1)+". "+q.texto,colW-8);setFont(7.5,"normal",dark);doc.text(lines,colX+4,yPI);yPI+=lines.length*4+3;doc.setDrawColor(220,210,250);doc.setLineWidth(0.2);doc.line(colX+4,yPI-1,colX+colW-6,yPI-1);yPI+=1});
            } else {
              var yPI2=yP+2;grp.preguntas.forEach(function(q,qi){if(yPI2>H-14)return;var lines=doc.splitTextToSize((qi+1)+". "+q.texto,colW-8);setFont(7.5,"normal",dark);doc.text(lines,colX+2,yPI2);yPI2+=lines.length*4+4});
            }
          });
          pageFooter(pageNum);pageNum++;
        });
      }

      /* CIERRE */
      doc.addPage();fillRect(0,0,W/2,H,[255,255,255]);fillRect(W/2,0,W/2,H,[248,247,252]);
      doc.setFillColor(230,218,252);doc.triangle(W/2+20,20,W-20,20,W/2+20,H-20,"F");doc.setFillColor(200,165,240);doc.triangle(W/2+40,40,W-20,40,W/2+40,H/2,"F");
      setFont(22,"bold",brand);doc.text("Thank you",14,28);
      var equipo=co.equipo?co.equipo.split(",").map(function(s){return s.trim()}).filter(Boolean):[];
      var yTeam=46;
      equipo.forEach(function(nombre,i){var col=i%2;var row=Math.floor(i/2);var tx=14+col*100;var ty=yTeam+row*28;setFont(9,"bold",dark);doc.text(nombre,tx,ty);setFont(8,"normal",gray);doc.text("Equipo Kearney",tx,ty+6)});
      setFont(8,"normal",gray);doc.text("Kearney is a leading global management consulting firm.",14,H-28,{maxWidth:W/2-20});doc.text("www.kearney.com",14,H-18);setFont(18,"bold",dark);doc.text("KEARNEY",14,H-10);

      var filename="Informe_JD_"+(co.nombre||"Evaluacion").replace(/[^a-zA-Z0-9]/g,"_")+"_"+(co.anio||"")+".pdf";
      doc.save(filename);setGenerating(false);
    }catch(err){console.error("PDF error:",err);alert("Error generando PDF: "+err.message);setGenerating(false)}
  }

  var sections=[{k:"preguntas",l:"Preguntas Críticas"},{k:"plan",l:"Plan de Acción / Formación"}];
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20}}>
      <div><h1 style={{fontFamily:T.font,fontSize:26,fontWeight:400,margin:"0 0 4px"}}>Editor de Informe</h1><p style={{color:T.gray500,fontSize:14,margin:0}}>Configure el contenido antes de generar el PDF</p></div>
      <button onClick={generatePDF} disabled={generating||p.resps.length===0} style={{padding:"12px 28px",borderRadius:8,border:"none",background:generating||p.resps.length===0?T.gray200:T.brand,color:generating||p.resps.length===0?T.gray400:"#fff",cursor:generating||p.resps.length===0?"not-allowed":"pointer",fontSize:14,fontWeight:600,fontFamily:T.fontBody,display:"flex",alignItems:"center",gap:8}}>
        {generating?"Generando...":"📄 Generar PDF"}
      </button>
    </div>
    {p.resps.length===0&&<Cd style={{textAlign:"center",padding:40,color:T.gray400,marginBottom:20}}><p>Aún no hay respuestas. El informe se habilitará cuando haya datos.</p></Cd>}
    <Cd style={{marginBottom:16,borderLeft:"4px solid "+T.amber}}>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:T.gray500,marginBottom:4}}>UMBRAL DE RELEVANCIA</div><div style={{fontSize:13,color:T.gray700}}>Solo los temas que superen este número de votos se destacan en el PDF.</div></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}><input type="number" min={1} max={p.resps.length||30} value={umbral} onChange={function(e){setUmbral(Number(e.target.value))}} style={{width:60,padding:"8px",borderRadius:6,border:"1px solid "+T.gray200,fontSize:16,fontWeight:700,textAlign:"center",fontFamily:T.fontBody,color:T.brand,outline:"none"}}/><span style={{fontSize:13,color:T.gray500}}>de {p.resps.length} respondentes</span></div>
      </div>
    </Cd>
    <div style={{display:"flex",gap:1,background:T.gray200,borderRadius:10,padding:2,marginBottom:20}}>{sections.map(function(s){return <button key={s.k} onClick={function(){setSection(s.k)}} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:section===s.k?T.white:"transparent",color:section===s.k?T.brand:T.gray500,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:T.fontBody,boxShadow:section===s.k?T.shadow:"none"}}>{s.l}</button>})}</div>

    {section==="preguntas"&&<div>
      <Cd style={{marginBottom:16,background:"rgba(120,35,220,0.03)",borderLeft:"4px solid "+T.brand}}>
        <div style={{fontSize:12,fontWeight:600,color:T.brand,marginBottom:4}}>Familias de preguntas</div>
        <p style={{fontSize:12,color:T.gray500,margin:"0 0 10px",lineHeight:1.5}}>Cree grupos temáticos y asigne cada pregunta a una familia. En el PDF aparecerán organizadas por familia.</p>
        {familias.map(function(f,fi){return <div key={fi} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
          <input value={f} onChange={function(e){updateFamilia(fi,e.target.value)}} placeholder={"Familia "+(fi+1)+": ej. Estrategia corporativa"} style={{flex:1,padding:"8px 12px",borderRadius:6,border:"1px solid "+T.gray200,fontSize:13,outline:"none",fontFamily:T.fontBody}} onFocus={function(e){e.target.style.borderColor=T.brand}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/>
          <button onClick={function(){removeFamilia(fi)}} style={{background:"none",border:"none",color:T.red,cursor:"pointer",fontSize:16,fontWeight:700}}>×</button>
        </div>})}
        <button onClick={addFamilia} style={{padding:"7px 16px",borderRadius:6,border:"1px dashed "+T.brand,background:"transparent",color:T.brand,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:T.fontBody}}>+ Agregar familia</button>
      </Cd>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontSize:14,fontWeight:600}}>{preguntas.length} preguntas críticas recopiladas</div>
        <div style={{fontSize:12,color:T.gray500}}>{preguntas.filter(function(q){return q.familia}).length} asignadas a familia</div>
      </div>
      {preguntas.length===0&&<Cd style={{textAlign:"center",padding:32,color:T.gray400}}><p>No hay preguntas críticas respondidas aún (4PC).</p></Cd>}
      {preguntas.map(function(q){var isEditing=editIdx===q.id;
        return <Cd key={q.id} style={{marginBottom:8,padding:14}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              {isEditing?<textarea value={editText} onChange={function(e){setEditText(e.target.value)}} rows={3} style={{width:"100%",padding:"8px",borderRadius:6,border:"1px solid "+T.brand,fontSize:13,fontFamily:T.fontBody,lineHeight:1.5,resize:"vertical",outline:"none",boxSizing:"border-box"}}/>:<p style={{fontSize:13,color:T.gray900,margin:"0 0 6px",lineHeight:1.6}}>{q.texto}</p>}
              <div style={{fontSize:11,color:T.gray400}}>— {q.autor}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
              {isEditing?<button onClick={function(){saveEdit(q.id)}} style={{padding:"5px 12px",borderRadius:5,border:"none",background:T.green,color:"#fff",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:T.fontBody}}>Guardar</button>:<button onClick={function(){setEditIdx(q.id);setEditText(q.texto)}} style={{padding:"5px 12px",borderRadius:5,border:"1px solid "+T.gray200,background:T.white,color:T.gray700,cursor:"pointer",fontSize:11,fontFamily:T.fontBody}}>Editar</button>}
              <button onClick={function(){deletePreg(q.id)}} style={{padding:"5px 12px",borderRadius:5,border:"1px solid "+T.red,background:"rgba(201,48,62,0.05)",color:T.red,cursor:"pointer",fontSize:11,fontFamily:T.fontBody}}>Eliminar</button>
            </div>
          </div>
          <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:11,color:T.gray500,fontWeight:600}}>FAMILIA:</span>
            <select value={q.familia||""} onChange={function(e){setPregFamilia(q.id,e.target.value)}} style={{padding:"4px 8px",borderRadius:5,border:"1px solid "+T.gray200,fontSize:12,fontFamily:T.fontBody,color:T.gray700,outline:"none",background:T.white}}>
              <option value="">Sin familia</option>
              {familias.filter(function(f){return f&&f.trim()}).map(function(f,fi){return <option key={fi} value={f}>{f}</option>})}
            </select>
            {q.familia&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:"rgba(120,35,220,0.1)",color:T.brand,fontWeight:600}}>{q.familia}</span>}
          </div>
        </Cd>;
      })}
    </div>}

    {section==="plan"&&<div>
      <div style={{marginBottom:28}}>
        <h3 style={{fontFamily:T.font,fontSize:18,fontWeight:400,margin:"0 0 12px",color:T.brand}}>Plan de acción estratégico (6AC)</h3>
        {rank6.length===0&&<Cd style={{textAlign:"center",padding:24,color:T.gray400}}><p>Sin respuestas de Plan de Acción aún.</p></Cd>}
        {rank6.map(function(item,i){var isH=item.total>=umbral;
          return <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:8,background:isH?"rgba(120,35,220,0.05)":T.offWhite,border:"1px solid "+(isH?T.brand:T.gray200),marginBottom:6}}>
            <div style={{display:"flex",flexDirection:"column",gap:2,flexShrink:0}}>
              <button onClick={function(){moveUp(rank6,setRank6,i)}} disabled={i===0} style={{background:"none",border:"none",cursor:i===0?"default":"pointer",color:i===0?T.gray300:T.gray600,fontSize:14,lineHeight:1,padding:"1px 4px"}}>▲</button>
              <button onClick={function(){moveDown(rank6,setRank6,i)}} disabled={i===rank6.length-1} style={{background:"none",border:"none",cursor:i===rank6.length-1?"default":"pointer",color:i===rank6.length-1?T.gray300:T.gray600,fontSize:14,lineHeight:1,padding:"1px 4px"}}>▼</button>
            </div>
            <div style={{width:28,height:28,borderRadius:"50%",background:isH?T.brand:T.gray300,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:"#fff",flexShrink:0}}>{item.total}</div>
            <div style={{flex:1,fontSize:13,fontWeight:isH?600:400,color:isH?T.gray900:T.gray500}}>{item.tema}</div>
            {isH&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:"rgba(120,35,220,0.12)",color:T.brand,fontWeight:700}}>DESTACADO</span>}
          </div>;
        })}
      </div>
      <div>
        <h3 style={{fontFamily:T.font,fontSize:18,fontWeight:400,margin:"0 0 12px",color:T.gold}}>Áreas de formación (5PA)</h3>
        {rank5.length===0&&<Cd style={{textAlign:"center",padding:24,color:T.gray400}}><p>Sin respuestas de Áreas de Formación aún.</p></Cd>}
        {rank5.map(function(item,i){var isH=item.total>=umbral;
          return <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:8,background:isH?"rgba(198,151,59,0.06)":T.offWhite,border:"1px solid "+(isH?T.gold:T.gray200),marginBottom:6}}>
            <div style={{display:"flex",flexDirection:"column",gap:2,flexShrink:0}}>
              <button onClick={function(){moveUp(rank5,setRank5,i)}} disabled={i===0} style={{background:"none",border:"none",cursor:i===0?"default":"pointer",color:i===0?T.gray300:T.gray600,fontSize:14,lineHeight:1,padding:"1px 4px"}}>▲</button>
              <button onClick={function(){moveDown(rank5,setRank5,i)}} disabled={i===rank5.length-1} style={{background:"none",border:"none",cursor:i===rank5.length-1?"default":"pointer",color:i===rank5.length-1?T.gray300:T.gray600,fontSize:14,lineHeight:1,padding:"1px 4px"}}>▼</button>
            </div>
            <div style={{width:28,height:28,borderRadius:"50%",background:isH?T.gold:T.gray300,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:"#fff",flexShrink:0}}>{item.total}</div>
            <div style={{flex:1,fontSize:13,fontWeight:isH?600:400,color:isH?T.gray900:T.gray500}}>{item.tema}</div>
            {isH&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:"rgba(198,151,59,0.15)",color:T.gold,fontWeight:700}}>DESTACADO</span>}
          </div>;
        })}
      </div>
    </div>}
  </div>);
}

/* ══════════════════════════════════════════════════════════════
   EVALUATION PANEL (Respondent)
   ══════════════════════════════════════════════════════════════ */
function EvalPanel(p){
  var isPreview=p&&p.preview;var previewEvalId=p&&p.previewId;
  var _cd=useState("");var code=_cd[0];var setCode=_cd[1];
  var _ev=useState(null);var evalData=_ev[0];var setEvalData=_ev[1];
  var _ph=useState("code");var phase=_ph[0];var setPhase=_ph[1];
  var _pr=useState({nombre:"",cargo:"",rol:"",correo:""});var person=_pr[0];var setPerson=_pr[1];
  var _an=useState({estadios:{},afirmaciones:{},comites:{},abiertas:{},complements:{}});var ans=_an[0];var setAns=_an[1];
  var _si=useState(0);var si=_si[0];var setSi=_si[1];
  var _qi=useState(0);var qi=_qi[0];var setQi=_qi[1];
  var _sub=useState(false);var sub=_sub[0];var setSub=_sub[1];
  var _valErr=useState(null);var valErr=_valErr[0];var setValErr=_valErr[1];
  var _ot=useState("");var otherText=_ot[0];var setOtherText=_ot[1];
  var _ssi=useState(false);var showSecIntro=_ssi[0];var setShowSecIntro=_ssi[1];
  var topRef=useRef(null);
  useEffect(function(){
    if(isPreview&&previewEvalId){loadEval(previewEvalId)}
  },[]);

  function loadEval(overrideCode){
    var searchCode=(overrideCode||code).trim().toLowerCase();
    
    supabase.from("evaluations").select("*").eq("id",searchCode).then(function(res){
      if(res.data&&res.data.length>0){
        var d=res.data[0];
        var co=d.co||{};
        if(!isPreview&&(co.fechaInicio||co.fechaFin)){
          var now=new Date();
          if(co.fechaInicio&&now<new Date(co.fechaInicio)){setEvalData(d);setPhase("unavailable");return}
          if(co.fechaFin&&now>new Date(co.fechaFin)){setEvalData(d);setPhase("closed");return}
        }
        setEvalData(d);
        var comiteAns={};if(d.comites){d.comites.forEach(function(c){comiteAns[c.id]={}})}
        setAns({estadios:{},afirmaciones:{},comites:comiteAns,abiertas:{},complements:{}});
        setPhase("welcome");
      } else {alert("Código no encontrado")}
    });
  }

  function validate(){
    if(!evalData||!evalData.mandatory)return null;
    var m=evalData.mandatory;var missing=[];
    Object.keys(m).forEach(function(qId){
      if(!m[qId])return;
      if(ans.estadios[qId]!==undefined)return;
      if(ans.afirmaciones[qId]!==undefined)return;
      var abVal=ans.abiertas[qId];
      if(abVal){var q=ABIERTAS.find(function(a){return a.id===qId})||ABIERTAS_COMITE.find(function(a){return a.id===qId});if(q&&q.tipo==="triple_text"){if(abVal.t1&&abVal.t2&&abVal.t3)return}else if(q&&q.tipo==="choose3"){if(Array.isArray(abVal)&&abVal.length>=3)return}else{if(typeof abVal==="string"&&abVal.trim())return}}
      var found=false;Object.keys(ans.comites||{}).forEach(function(cId){if(ans.comites[cId]&&ans.comites[cId][qId]!==undefined)found=true});if(found)return;
      var label=qId;var eq=ESTADIOS.find(function(x){return x.id===qId});if(eq)label=eq.tema;var aq=AFIRMACIONES.find(function(x){return x.id===qId});if(aq)label=aq.tema;var oq=ABIERTAS.find(function(x){return x.id===qId});if(oq)label=oq.tema;var cq=ABIERTAS_COMITE.find(function(x){return x.id===qId});if(cq)label=cq.tema;var allCA=COMITE_AFIRMACIONES_STD.concat(evalData.custom_comite_afirmaciones||[]);var ca=allCA.find(function(x){return x.id===qId});if(ca)label=ca.tema;missing.push(label);
    });
    return missing.length>0?missing:null;
  }

  function submit(){
    if(isPreview){alert("Modo vista previa — las respuestas no se guardan.");return}
    var miss=validate();if(miss){setValErr(miss);return}setSub(true);
    supabase.from("responses").insert({eval_id:evalData.id,respondent:person,answers:ans}).then(function(res){
      if(!res.error){setPhase("done")}else{alert("Error al enviar");setSub(false)}
    });
  }

  var secs=[];
  var evalTerms=evalData&&evalData.terminologia?evalData.terminologia:TERM_DEFAULT;
  if(evalData){
    var allAfirm=AFIRMACIONES.concat(evalData.custom_afirmaciones||[]);
    var allComiteAfirm=COMITE_AFIRMACIONES_STD.concat(evalData.custom_comite_afirmaciones||[]);
    if(evalData.sel.estadios&&evalData.sel.estadios.length) secs.push({key:"estadios",label:"Estadios de Excelencia",color:T.brand,questions:ESTADIOS.filter(function(q){return evalData.sel.estadios.includes(q.id)})});
    if(evalData.sel.afirmaciones&&evalData.sel.afirmaciones.length) secs.push({key:"afirmaciones",label:"Afirmaciones",color:T.gold,questions:allAfirm.filter(function(q){return evalData.sel.afirmaciones.includes(q.id)})});
    if(evalData.comites){evalData.comites.forEach(function(com){var qs=com.afirmaciones.map(function(afId){return allComiteAfirm.find(function(a){return a.id===afId})}).filter(Boolean);if(qs.length)secs.push({key:"comite_"+com.id,comiteId:com.id,label:com.nombre,color:T.teal,questions:qs,isComite:true})})}
    if(evalData.selComiteAbiertas&&evalData.selComiteAbiertas.length>0){var comAbQ=ABIERTAS_COMITE.filter(function(q){return evalData.selComiteAbiertas.includes(q.id)});if(comAbQ.length)secs.push({key:"comite_abiertas",label:"Preguntas sobre Comités",color:T.teal,questions:comAbQ,isComiteOpen:true})}
    if(evalData.sel.abiertas&&evalData.sel.abiertas.length){secs.push({key:"abiertas",label:"Preguntas Abiertas",color:T.green,questions:ABIERTAS.filter(function(q){return evalData.sel.abiertas.includes(q.id)})})}
  }

  return(<div style={{minHeight:"100vh",background:T.offWhite,fontFamily:T.fontBody,color:T.gray900}}>
    <header style={{background:isPreview?T.amber:T.brand,padding:"0 24px",position:"sticky",top:0,zIndex:100}}>
      <div ref={topRef} style={{maxWidth:700,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:52}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><KearneyLogo size={90} color={T.white}/><div style={{width:1,height:20,background:"rgba(255,255,255,0.3)"}}/><div style={{fontSize:13,color:"rgba(255,255,255,0.8)"}}>Evaluación JD</div></div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {evalData&&<div style={{fontSize:12,color:"rgba(255,255,255,0.7)"}}>{evalData.co.nombre}</div>}
          {evalData&&evalData.co.contactos&&evalData.co.contactos.filter(function(c){return c.nombre}).length>0&&<div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{width:1,height:16,background:"rgba(255,255,255,0.3)"}}/>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.55)"}}>Contacto:</span>
            {evalData.co.contactos.filter(function(c){return c.nombre}).map(function(c,i){return <a key={i} href={"mailto:"+c.correo} title={(c.telefono||c.correo||"")} style={{fontSize:11,color:"rgba(255,255,255,0.85)",textDecoration:"none",fontWeight:600}}>{c.nombre}{i===0&&evalData.co.contactos.filter(function(x){return x.nombre}).length>1?" · ":""}</a>})}
          </div>}
        </div>
      </div>
    </header>
    <main style={{maxWidth:700,margin:"0 auto",padding:"28px 20px 60px"}}>
      {isPreview&&<div style={{background:"rgba(212,134,10,0.1)",border:"1px solid rgba(212,134,10,0.4)",borderRadius:8,padding:"10px 16px",marginBottom:16,fontSize:13,color:"#D4860A",fontWeight:500,textAlign:"center"}}>👁 Modo vista previa — Las respuestas no se guardarán</div>}

      {phase==="unavailable"&&evalData&&<div style={{maxWidth:480,margin:"60px auto",textAlign:"center"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:T.amber,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
        <h1 style={{fontFamily:T.font,fontSize:24,fontWeight:400,margin:"0 0 12px"}}>Encuesta no disponible aún</h1>
        <Cd><p style={{fontSize:14,color:T.gray500,lineHeight:1.8,margin:0}}>La encuesta <strong>{evalData.co.nombre}</strong> aún no está abierta.<br/>Estará disponible a partir del <strong>{evalData.co.fechaInicio?new Date(evalData.co.fechaInicio).toLocaleString("es-CO",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}):""}</strong>.</p></Cd>
      </div>}

      {phase==="closed"&&evalData&&<div style={{maxWidth:480,margin:"60px auto",textAlign:"center"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:T.gray400,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
        <h1 style={{fontFamily:T.font,fontSize:24,fontWeight:400,margin:"0 0 12px"}}>Encuesta cerrada</h1>
        <Cd><p style={{fontSize:14,color:T.gray500,lineHeight:1.8,margin:0}}>El período de respuesta para <strong>{evalData.co.nombre}</strong> ha concluido.<br/>Fecha de cierre: <strong>{evalData.co.fechaFin?new Date(evalData.co.fechaFin).toLocaleString("es-CO",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}):""}</strong>.</p></Cd>
      </div>}

      {phase==="welcome"&&evalData&&(function(){
        var co2=evalData.co||{};
        var instr2=co2.instrucciones||INSTR_DEFAULT;
        var organo2=(evalData.terminologia&&evalData.terminologia.organo)||(co2.terminologia&&co2.terminologia.organo)||"Junta Directiva";
        var txt=(instr2.general||INSTR_DEFAULT.general)
          .replace(/Junta Directiva/g,organo2)
          .replace("{empresa}",co2.nombre||"la empresa")
          .replace("{fechaInicio}",co2.fechaInicio?new Date(co2.fechaInicio).toLocaleString("es-CO",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}):"por definir")
          .replace("{fechaFin}",co2.fechaFin?new Date(co2.fechaFin).toLocaleString("es-CO",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}):"por definir")
          .replace("{durMin}",co2.durMin||"30")
          .replace("{durMax}",co2.durMax||"45");
        var ctcs=(co2.contactos||[]).filter(function(c){return c.nombre});
        return <div style={{maxWidth:640,margin:"40px auto"}}>
          <Cd style={{marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,paddingBottom:16,borderBottom:"1px solid "+T.gray100}}>
              <div style={{width:48,height:48,borderRadius:12,background:T.brandGhost2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.brand} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
              <div><div style={{fontSize:18,fontWeight:600,fontFamily:T.font}}>{co2.nombre}</div><div style={{fontSize:13,color:T.gray400,marginTop:2}}>{co2.anio?co2.anio+" · ":""}{organo2}</div></div>
            </div>
            <div style={{fontSize:14,color:T.gray700,lineHeight:1.9,whiteSpace:"pre-line"}}>{txt}</div>
            {ctcs.length>0&&<div style={{marginTop:20,padding:"14px 16px",background:T.offWhite,borderRadius:8,borderLeft:"3px solid "+T.teal}}>
              <div style={{fontSize:11,fontWeight:600,color:T.teal,marginBottom:8,letterSpacing:0.8}}>CONTACTO ANTE INCONVENIENTES</div>
              {ctcs.map(function(c,i){return <div key={i} style={{fontSize:13,color:T.gray700,marginBottom:4}}><strong>{c.nombre}</strong>{c.correo?" · "+c.correo:""}{c.telefono?" · "+c.telefono:""}</div>})}
            </div>}
          </Cd>
          <button onClick={function(){setPhase("person")}} style={{width:"100%",padding:"14px",borderRadius:8,border:"none",background:isPreview?T.amber:T.brand,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:T.fontBody}}>{isPreview?"👁 Vista previa — Comenzar simulación":"Comenzar evaluación →"}</button>
        </div>;
      })()}


      {phase==="code"&&<div style={{maxWidth:420,margin:"60px auto",textAlign:"center"}}><div style={{width:56,height:56,borderRadius:14,background:T.brand,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:20}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><h1 style={{fontFamily:T.font,fontSize:26,fontWeight:400,margin:"0 0 6px"}}>Código de Acceso</h1><p style={{color:T.gray500,fontSize:14,margin:"0 0 24px"}}>Ingrese el código proporcionado por el administrador</p><Cd><input value={code} onChange={function(e){setCode(e.target.value)}} onKeyDown={function(e){if(e.key==="Enter")loadEval()}} placeholder="Ej: EVXXX123" style={{width:"100%",padding:"16px",borderRadius:8,border:"1px solid "+T.gray200,fontSize:20,textAlign:"center",fontFamily:"monospace",letterSpacing:4,outline:"none",fontWeight:700,color:T.brand,boxSizing:"border-box"}} onFocus={function(e){e.target.style.borderColor=T.brand}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/><button onClick={loadEval} disabled={!code.trim()} style={{width:"100%",padding:"14px",borderRadius:8,border:"none",background:code.trim()?T.brand:T.gray200,color:code.trim()?"#fff":T.gray400,fontSize:15,fontWeight:600,cursor:code.trim()?"pointer":"not-allowed",marginTop:12,fontFamily:T.fontBody}}>Acceder</button></Cd></div>}

      {phase==="person"&&<div style={{maxWidth:480,margin:"40px auto"}}><h1 style={{fontFamily:T.font,fontSize:26,fontWeight:400,margin:"0 0 6px",textAlign:"center"}}>Identificación</h1><p style={{color:T.gray500,fontSize:14,margin:"0 0 24px",textAlign:"center"}}>Complete sus datos para iniciar la evaluación</p><Cd>{[{k:"nombre",l:"NOMBRE COMPLETO",p:"Juan Pérez",req:true},{k:"cargo",l:"CARGO",p:"Director Independiente",req:true},{k:"rol",l:"ROL",p:"Miembro de Junta"},{k:"correo",l:"CORREO ELECTRÓNICO",p:"correo@empresa.com",req:true}].map(function(f){return <div key={f.k} style={{marginBottom:16}}><label style={{fontSize:11,fontWeight:600,color:T.gray500,display:"block",marginBottom:6,letterSpacing:0.8}}>{f.l}{f.req?" *":""}</label><input value={person[f.k]} onChange={function(e){setPerson(Object.assign({},person,{[f.k]:e.target.value}))}} placeholder={f.p} style={{width:"100%",padding:"12px 16px",borderRadius:8,border:"1px solid "+T.gray200,fontSize:14,outline:"none",fontFamily:T.fontBody,boxSizing:"border-box"}} onFocus={function(e){e.target.style.borderColor=T.brand}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/></div>})}<button onClick={function(){setSi(0);setQi(0);setPhase("survey")}} disabled={!person.nombre||!person.cargo||!person.correo} style={{width:"100%",padding:"14px",borderRadius:8,border:"none",background:person.nombre&&person.cargo&&person.correo?T.brand:T.gray200,color:person.nombre&&person.cargo&&person.correo?"#fff":T.gray400,fontSize:15,fontWeight:600,cursor:person.nombre&&person.cargo&&person.correo?"pointer":"not-allowed",fontFamily:T.fontBody}}>Iniciar Evaluación</button></Cd></div>}

      {phase==="survey"&&secs.length>0&&(function(){
        var sec=secs[si];var q=sec.questions[qi];var tot=sec.questions.length;
        var isMand=evalData.mandatory&&evalData.mandatory[q.id];
        function sa(t,qId,v){if(sec.isComite){var u=Object.assign({},ans);var comAns=Object.assign({},u.comites);comAns[sec.comiteId]=Object.assign({},comAns[sec.comiteId]||{},{[qId]:v});u.comites=comAns;setAns(u)}else{var u2=Object.assign({},ans);u2[t]=Object.assign({},u2[t],{[qId]:v});setAns(u2)}}
        function setComplement(qId,v){var u=Object.assign({},ans);u.complements=Object.assign({},u.complements,{[qId]:v});setAns(u)}
        function nx(){
          if(qi<tot-1){setQi(qi+1)}
          else if(si<secs.length-1){setSi(si+1);setQi(0);setShowSecIntro(true);if(topRef.current)topRef.current.scrollIntoView({behavior:"smooth"})}
          else{if(topRef.current)topRef.current.scrollIntoView({behavior:"smooth"});setPhase("review")}
        }
        function pv(){if(qi>0)setQi(qi-1);else if(si>0){setSi(si-1);setQi(secs[si-1].questions.length-1)}}
        var isF=si===0&&qi===0;var isL=si===secs.length-1&&qi===tot-1;
        var curVal;
        if(sec.isComite){curVal=ans.comites&&ans.comites[sec.comiteId]?ans.comites[sec.comiteId][q.id]:undefined}
        else if(sec.key==="estadios"){curVal=ans.estadios[q.id]}
        else if(sec.key==="afirmaciones"){curVal=ans.afirmaciones[q.id]}
        else{curVal=ans.abiertas[q.id]}

        return(<div>
          {showSecIntro&&(function(){
            var co3=evalData.co||{};
            var instr3=co3.instrucciones||INSTR_DEFAULT;
            var sk=sec.key==="estadios"?"estadios":sec.key==="afirmaciones"?"afirmaciones":sec.isComite?"comites":null;
            var itxt=sk?instr3[sk]||INSTR_DEFAULT[sk]||"":"";
            if(!itxt){setTimeout(function(){setShowSecIntro(false)},0);return null}
            return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
              <div style={{background:T.white,borderRadius:16,padding:32,maxWidth:540,width:"100%",boxShadow:T.shadowLg,maxHeight:"85vh",overflowY:"auto"}}>
                <div style={{fontSize:11,fontWeight:700,color:sec.color,marginBottom:6,letterSpacing:1}}>{sec.label.toUpperCase()}</div>
                <div style={{fontSize:14,color:T.gray700,lineHeight:1.8,whiteSpace:"pre-line",marginBottom:24}}>{itxt}</div>
                <button onClick={function(){setShowSecIntro(false)}} style={{width:"100%",padding:"13px",borderRadius:8,border:"none",background:T.brand,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:T.fontBody}}>Comenzar sección →</button>
              </div>
            </div>;
          })()}
          <div style={{display:"flex",gap:4,marginBottom:16,overflowX:"auto",paddingBottom:4}}>{secs.map(function(s,i){return <div key={s.key} onClick={function(){setSi(i);setQi(0)}} style={{padding:"8px 14px",borderRadius:8,background:i===si?T.white:T.offWhite,border:"2px solid "+(i===si?s.color:T.gray200),cursor:"pointer",textAlign:"center",boxShadow:i===si?T.shadow:"none",flexShrink:0}}><div style={{fontSize:11,fontWeight:600,color:i===si?s.color:T.gray500,whiteSpace:"nowrap"}}>{s.label}</div></div>})}</div>
          <div style={{fontSize:13,color:T.gray400,marginBottom:10}}>Pregunta {qi+1} de {tot}{isMand?<span style={{color:T.red,fontWeight:600,marginLeft:8}}>* Obligatoria</span>:""}</div>
          <Cd style={{marginBottom:16,minHeight:280}}>
            <h2 style={{fontFamily:T.font,fontSize:20,fontWeight:400,margin:"0 0 20px",lineHeight:1.3}}>{applyTerms(q.tema||q.pregunta,evalTerms)}</h2>

            {sec.key==="estadios"&&<div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[
                  {v:1,l:"Estadio 1 — Etapa Inicial",c:T.e1,t:applyTerms(q.e1,evalTerms)},
                  {v:2,l:"Estadio 2 — Cumplimiento Local",c:T.e2,t:applyTerms(q.e2,evalTerms)},
                  {v:3,l:"Estadio 3 — Estándares Internacionales",c:T.e3,t:applyTerms(q.e3,evalTerms)},
                  {v:4,l:"Estadio 4 — Desempeño Superior",c:T.e4,t:applyTerms(q.e4,evalTerms)},
                  {v:0,l:"No tengo suficiente información",c:T.e0,t:null}
                ].map(function(o){
                  var on=curVal===o.v;
                  return <div key={o.v} onClick={function(){sa("estadios",q.id,o.v)}} style={{padding:"14px 16px",borderRadius:10,border:"2px solid "+(on?o.c:T.gray200),background:on?o.c+"0D":T.white,cursor:"pointer"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:20,height:20,borderRadius:"50%",border:"2px solid "+(on?o.c:T.gray300),background:on?o.c:T.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {on&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}
                      </div>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:on?o.c:T.gray900}}>{o.l}</div>
                        {o.t&&<div style={{fontSize:12,color:T.gray500,marginTop:3,lineHeight:1.5}}>{o.t}</div>}
                      </div>
                    </div>
                  </div>;
                })}
              </div>
              <ComplementBox value={ans.complements[q.id]} onChange={function(v){setComplement(q.id,v)}}/>
            </div>}

            {sec.key==="afirmaciones"&&<div><div style={{padding:"14px 18px",background:T.offWhite,borderRadius:8,borderLeft:"3px solid "+T.gold,marginBottom:12}}><p style={{fontSize:14,color:T.gray700,lineHeight:1.6,margin:0}}>{applyTerms(q.texto,evalTerms)}</p></div><LikertHorizontal value={curVal} onChange={function(v){sa("afirmaciones",q.id,v)}}/><ComplementBox value={ans.complements[q.id]} onChange={function(v){setComplement(q.id,v)}}/></div>}

            {sec.isComite&&<div><div style={{padding:"14px 18px",background:"rgba(8,145,178,0.04)",borderRadius:8,borderLeft:"3px solid "+T.teal,marginBottom:12}}><p style={{fontSize:14,color:T.gray700,lineHeight:1.6,margin:0}}>{applyTerms(q.texto,evalTerms)}</p></div><LikertHorizontal value={curVal} onChange={function(v){sa("comites",q.id,v)}}/><ComplementBox value={ans.complements[q.id]} onChange={function(v){setComplement(q.id,v)}}/></div>}

            {(sec.key==="abiertas"||sec.isComiteOpen)&&(function(){
              var qObj=sec.isComiteOpen?ABIERTAS_COMITE.find(function(x){return x.id===q.id}):ABIERTAS.find(function(x){return x.id===q.id});
              var tipo=qObj?qObj.tipo:"texto";
              var pregText=applyTerms(qObj?qObj.pregunta:q.tema,evalTerms);
              return(<div>
                <div style={{padding:"14px 18px",background:T.offWhite,borderRadius:8,borderLeft:"3px solid "+T.green,marginBottom:16}}><p style={{fontSize:14,color:T.gray700,lineHeight:1.6,margin:0}}>{pregText}</p></div>
                {tipo==="triple_text"&&<div>
                  {["t1","t2","t3"].map(function(tk,ti){return <div key={tk} style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:T.gray500,display:"block",marginBottom:6}}>Pregunta {ti+1}:</label><textarea value={(curVal&&curVal[tk])||""} onChange={function(e){var prev=typeof curVal==="object"&&curVal?curVal:{};var u=Object.assign({},ans);u.abiertas=Object.assign({},u.abiertas,{[q.id]:Object.assign({},prev,{[tk]:e.target.value})});setAns(u)}} placeholder="Escriba su pregunta..." rows={2} style={{width:"100%",padding:"12px",borderRadius:8,border:"1px solid "+T.gray200,fontSize:14,outline:"none",resize:"vertical",fontFamily:T.fontBody,lineHeight:1.5,boxSizing:"border-box"}} onFocus={function(e){e.target.style.borderColor=T.brand}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/></div>})}
                </div>}
                {tipo==="choose3"&&<div>
                  <div style={{fontSize:12,color:T.gray500,marginBottom:10}}>Seleccione exactamente 3 opciones{otherText&&" (incluyendo Otros si aplica)"}:</div>
                  {(evalData[q.id==="5PA"?"list5PA":"list6AC"]||[]).concat(["Otros"]).map(function(item){
                    var sel=Array.isArray(curVal)?curVal:[];var on=sel.includes(item);var canAdd=sel.length<3;
                    function handleChoose(){
                      if(on){var u=Object.assign({},ans);u.abiertas=Object.assign({},u.abiertas,{[q.id]:sel.filter(function(x){return x!==item})});setAns(u);if(item==="Otros")setOtherText("")}
                      else if(canAdd){var u2=Object.assign({},ans);var newSel=sel.concat([item]);u2.abiertas=Object.assign({},u2.abiertas,{[q.id]:newSel});setAns(u2)}
                    }
                    var chooseStyle={display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,border:"2px solid "+(on?T.brand:T.gray200),background:on?"rgba(120,35,220,0.05)":T.white,cursor:on||canAdd?"pointer":"not-allowed",marginBottom:6,opacity:on||canAdd?1:0.5};
                    return <div key={item} onClick={handleChoose} style={chooseStyle}>
                      <Ck on={on}/>
                      <span style={{fontSize:14,fontWeight:on?600:400}}>{item}</span>
                    </div>;
                  })}
                  {Array.isArray(curVal)&&curVal.includes("Otros")&&<textarea value={otherText} onChange={function(e){setOtherText(e.target.value)}} placeholder="Especifique..." rows={2} style={{width:"100%",padding:"10px",borderRadius:8,border:"1px solid "+T.brand,fontSize:13,outline:"none",marginTop:8,fontFamily:T.fontBody,boxSizing:"border-box"}}/>}
                  <div style={{fontSize:12,color:curVal&&curVal.length===3?T.green:T.amber,marginTop:8,fontWeight:600}}>{curVal?curVal.length:0}/3 seleccionadas</div>
                </div>}
                {tipo==="texto"&&<textarea value={curVal||""} onChange={function(e){var u=Object.assign({},ans);u.abiertas=Object.assign({},u.abiertas,{[q.id]:e.target.value});setAns(u)}} placeholder="Escriba su respuesta..." style={{width:"100%",minHeight:140,padding:"16px",borderRadius:8,border:"1px solid "+T.gray200,background:T.white,color:T.gray900,fontSize:15,outline:"none",resize:"vertical",fontFamily:T.fontBody,lineHeight:1.6,boxSizing:"border-box"}} onFocus={function(e){e.target.style.borderColor=T.brand}} onBlur={function(e){e.target.style.borderColor=T.gray200}}/>}
              </div>);
            })()}
          </Cd>
          <div style={{display:"flex",justifyContent:"space-between",gap:8}}><button onClick={pv} disabled={isF} style={{padding:"12px 24px",borderRadius:8,border:"1px solid "+T.gray200,background:T.white,color:isF?T.gray300:T.gray700,cursor:isF?"not-allowed":"pointer",fontSize:14,fontWeight:600,fontFamily:T.fontBody}}>Anterior</button><button onClick={nx} style={{padding:"12px 28px",borderRadius:8,border:"none",background:T.brand,color:"#fff",cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:T.fontBody}}>{isL?"Revisar Respuestas":"Siguiente"}</button></div>
        </div>);
      })()}

      {phase==="review"&&<div>
        <div style={{textAlign:"center",marginBottom:24}}><h1 style={{fontFamily:T.font,fontSize:26,fontWeight:400,margin:"0 0 6px"}}>Revise sus Respuestas</h1></div>
        <Cd style={{marginBottom:16,display:"flex",alignItems:"center",gap:14}}><div style={{width:44,height:44,borderRadius:"50%",background:T.brand,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:17,color:"#fff"}}>{person.nombre[0]}</div><div><div style={{fontSize:15,fontWeight:600}}>{person.nombre}</div><div style={{fontSize:13,color:T.gray400}}>{person.cargo} — {person.correo}</div></div></Cd>
        {secs.map(function(sec){return <div key={sec.key} style={{marginBottom:16}}><h3 style={{fontSize:14,fontWeight:600,color:sec.color,margin:"0 0 8px"}}>{sec.label}</h3><Cd style={{padding:0}}>{sec.questions.map(function(q,i){
          var val;if(sec.isComite){val=ans.comites&&ans.comites[sec.comiteId]?ans.comites[sec.comiteId][q.id]:undefined}else if(sec.key==="abiertas"||sec.isComiteOpen){val=ans.abiertas[q.id]}else if(sec.key==="estadios"){val=ans.estadios[q.id]}else{val=ans.afirmaciones[q.id]}
          var has=val!==undefined&&val!==null&&val!=="";if(typeof val==="object"&&val!==null){has=val.t1||val.t2||val.t3||(Array.isArray(val)&&val.length>0)}
          var gc=function(v){if(sec.key==="estadios")return v===0?T.e0:v===1?T.e1:v===2?T.e2:v===3?T.e3:T.e4;return v===0?T.gray400:v===1?T.lk1:v===2?T.lk2:v===3?T.lk3:T.lk4};
          var displayVal="";if(sec.key==="abiertas"||sec.isComiteOpen){if(typeof val==="string")displayVal=val;else if(typeof val==="object"&&val&&val.t1)displayVal="1) "+val.t1+(val.t2?"\n2) "+val.t2:"")+(val.t3?"\n3) "+val.t3:"");else if(Array.isArray(val))displayVal=val.join(", ")}
          return <div key={q.id||q.tema+i} style={{padding:"14px 20px",borderBottom:i<sec.questions.length-1?"1px solid "+T.gray100:"none"}}><div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{q.tema||q.pregunta}</div>{has?((sec.key==="abiertas"||sec.isComiteOpen)?<div style={{fontSize:13,color:T.gray500,fontStyle:"italic",whiteSpace:"pre-line"}}>{displayVal}</div>:<div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:6,background:gc(val)+"20"}}><div style={{width:8,height:8,borderRadius:"50%",background:gc(val)}}/><span style={{fontSize:12,fontWeight:600,color:gc(val)}}>{sec.key==="estadios"?(val===0?"Sin información":"Estadio "+val):(val===0?"Sin información":aLabels[val])}</span></div>):<span style={{fontSize:12,color:T.amber}}>Sin respuesta</span>}</div>;
        })}</Cd></div>})}
        {valErr&&<Cd style={{borderLeft:"4px solid "+T.red,marginBottom:16,background:"rgba(201,48,62,0.03)"}}><div style={{fontSize:13,fontWeight:600,color:T.red,marginBottom:8}}>Preguntas obligatorias sin responder:</div>{valErr.map(function(m,i){return <div key={i} style={{fontSize:12,color:T.gray700,padding:"4px 0"}}>{"•"} {m}</div>})}</Cd>}
        <div style={{display:"flex",gap:10,marginTop:24}}><button onClick={function(){setPhase("survey");setValErr(null)}} style={{flex:1,padding:"14px",borderRadius:8,border:"1px solid "+T.gray200,background:T.white,color:T.gray700,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:T.fontBody}}>Editar</button><button onClick={submit} disabled={sub} style={{flex:1,padding:"14px",borderRadius:8,border:"none",background:T.green,color:"#fff",fontSize:14,fontWeight:600,cursor:sub?"wait":"pointer",fontFamily:T.fontBody,opacity:sub?0.7:1}}>{sub?"Enviando...":"Enviar Evaluación"}</button></div>
      </div>}

      {phase==="done"&&<div style={{maxWidth:440,margin:"60px auto",textAlign:"center"}}><div style={{width:64,height:64,borderRadius:"50%",background:T.green,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg></div><h1 style={{fontFamily:T.font,fontSize:26,fontWeight:400,margin:"0 0 8px"}}>Evaluación Enviada</h1><p style={{color:T.gray500,fontSize:14,lineHeight:1.6}}>Gracias <strong>{person.nombre}</strong>, sus respuestas han sido registradas para <strong>{evalData.co.nombre}</strong>.</p><Cd style={{marginTop:24,textAlign:"left"}}><p style={{fontSize:13,color:T.gray500,margin:0}}>Confirmación enviada a <strong>{person.correo}</strong>.</p></Cd></div>}
    </main>
  </div>);
}
